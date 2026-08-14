/**
 * KOÇ RAPORU — durumun sıkıştırılmış, okunabilir özeti
 *
 * Neden var: uygulama telefonda, koçluk konuşması bilgisayarda. Aradaki
 * boşluk şimdiye kadar "kaç çektiğini anlatmak"la kapanıyordu ve bu hem
 * eksik hem yanlış hatırlanan bir aktarım. Tam yedek JSON'u ise binlerce
 * satır — sohbete yapıştırılamaz.
 *
 * Çözüm: tek tuşla panoya kopyalanan, birkaç yüz karakterlik metin.
 * Dosya taşımak yok, senkron yok, ek araç yok. Kopyala, yapıştır.
 *
 * İçerik seçimi bilinçli — koçun karar vermek için gerçekten ihtiyacı
 * olan şeyler:
 *   - son iki haftanın seansları ve sayıları (eğilim buradan okunur)
 *   - eforun nasıl geldiği (uyarlama kuralının girdisi)
 *   - kademe değişimleri (ilerleme oldu mu)
 *   - hafta numarası ve deload durumu (yorgunluk bağlamı)
 *   - üst üste düşen hareketler (erken uyarı)
 *
 * Kişisel veri YOK: isim, ölçü, sağlık bilgisi buraya girmez. Sadece
 * antrenman sayıları. (D-014)
 */

import type { MovementDatabase, PlayerState } from './types';
import { indexMovements, levelOf } from './mastery';
import { rankOf, streakOf } from './game';
import { isDeloadWeek, weekNumber, weeksToDeload } from './session';

const EFFORT_TR: Record<string, string> = {
  easy: 'kolay', ok: 'normal', hard: 'zor',
};

/** Son N günün kayıtları, güne göre gruplanmış */
function recentByDate(state: PlayerState, days: number, today: Date) {
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - days);
  const iso = cutoff.toISOString().slice(0, 10);

  const byDate = new Map<string, typeof state.logs>();
  for (const l of state.logs) {
    if (l.date < iso) continue;
    if (!byDate.has(l.date)) byDate.set(l.date, []);
    byDate.get(l.date)!.push(l);
  }
  return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * Bir harekette son üç seansın gidişatı.
 * Düşüş erken uyarıdır: iki seans üst üste düşen tekrar, yorgunluk ya da
 * teknik bozulması demek. Koçun bunu görmesi lazım.
 */
function trendOf(state: PlayerState, movementId: string): string | null {
  const own = state.logs
    .filter((l) => l.movementId === movementId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-3)
    .map((l) => Math.max(...l.values));
  if (own.length < 2) return null;

  const falling = own.length >= 3 && own[2]! < own[1]! && own[1]! < own[0]!;
  return `${own.join(' → ')}${falling ? '  ⚠ iki seanstır düşüyor' : ''}`;
}

export function coachReport(
  db: MovementDatabase,
  state: PlayerState,
  today = new Date(),
): string {
  const idx = indexMovements(db);
  const name = (id: string) => idx.get(id)?.name ?? id;

  const rank = rankOf(db, state);
  const streak = streakOf(state, today);
  const week = weekNumber(state, today);
  const L: string[] = [];

  L.push('## ASCEND durum raporu');
  L.push(`Tarih: ${today.toISOString().slice(0, 10)}`);
  L.push('');

  if (state.logs.length === 0) {
    L.push('Henüz kayıtlı seans yok.');
    return L.join('\n');
  }

  L.push(`Program haftası: ${week}`
    + (isDeloadWeek(state, today)
      ? '  · BU HAFTA DELOAD'
      : `  · deload'a ${weeksToDeload(state, today)} hafta`));
  L.push(`Rütbe: ${rank.label}  ·  Seviye ${levelOf(db, state.xp)}  ·  ${state.xp} XP`);
  L.push(`Seri: ${streak.weeks} hafta  ·  bu hafta ${streak.thisWeek}/${streak.target} seans`);
  L.push('');

  // ── Son 14 gün
  const recent = recentByDate(state, 14, today);
  L.push(`### Son 14 gün (${recent.length} seans)`);
  if (recent.length === 0) {
    L.push('Bu aralıkta kayıt yok.');
  }
  for (const [date, logs] of recent) {
    L.push(`**${date}**`);
    for (const l of logs) {
      const eff = l.effort ? `  (${EFFORT_TR[l.effort]})` : '';
      const note = l.note ? `  — ${l.note}` : '';
      L.push(`- ${name(l.movementId)}: ${l.values.join(', ')}${eff}${note}`);
    }
  }
  L.push('');

  // ── Eğilimler: yalnız son 14 günde çalışılan hareketler
  const touched = [...new Set(recent.flatMap(([, ls]) => ls.map((l) => l.movementId)))];
  const trends = touched
    .map((id) => ({ id, t: trendOf(state, id) }))
    .filter((x): x is { id: string; t: string } => x.t != null);

  if (trends.length > 0) {
    L.push('### Son 3 seansın gidişatı');
    for (const { id, t } of trends) L.push(`- ${name(id)}: ${t}`);
    L.push('');
  }

  // ── Kademeler
  const tiers = Object.values(state.mastery).filter((m) => m.tier);
  if (tiers.length > 0) {
    L.push(`### Kademeler (${tiers.length} hareket)`);
    const byTier: Record<string, string[]> = {};
    for (const m of tiers) {
      (byTier[m.tier!] ??= []).push(`${name(m.movementId)} (${m.best})`);
    }
    for (const t of ['master', 'gold', 'silver', 'bronze']) {
      if (byTier[t]?.length) L.push(`- **${t}**: ${byTier[t]!.join(', ')}`);
    }
    L.push('');
  }

  L.push('---');
  L.push('Bu raporu koça yapıştır. Eklemek istediğin varsa altına yaz:');
  L.push('ağrı, uyku, canının istememesi, salonda olanlar — sayıya girmeyen her şey.');

  return L.join('\n');
}
