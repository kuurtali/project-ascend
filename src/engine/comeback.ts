/**
 * GERİ DÖNÜŞ MODU — kaçırdıktan sonra uçurum değil rampa
 *
 * Alan araştırmasının en net bulgularından biri: oyunlaştırma
 * **başarısızlığı görünür kılmak** üzerine kurulduğunda kullanıcının
 * rahatsızlığını artırıyor, **toparlanmayı desteklemek** üzerine
 * kurulduğunda azaltıyor. Ve fitness uygulamalarında kullanıcıların
 * %80'i ilk üç ayda bırakıyor — genelde bir platodan ya da kaçırılan
 * antrenmanlardan sonra.
 *
 * Bizde seri zaten haftalık, yani günlük seriye göre çok daha affedici.
 * Ama kaçırdıktan SONRASI tanımsızdı: uygulama sadece 0 gösteriyordu.
 * Kullanıcı iki hafta ara verip döndüğünde eski hedeflerle karşılaşıyor,
 * tutturamıyor, ve "ben yapamıyorum" diye bırakıyordu.
 *
 * İki gerçek aynı anda doğru:
 *  1. Ara verdikten sonra gerçekten daha az yapabilirsin — bu bir
 *     his değil fizyoloji. Hedefi düşürmek dürüstlüktür, şefkat değil.
 *  2. O düşüşü kullanıcının kendi başarısızlığı gibi sunmak, bırakma
 *     sebebidir.
 *
 * Bu yüzden sistem hedefi kendisi düşürüyor ve bunu bir GERİ DÖNÜŞ
 * PLANI olarak sunuyor — "kaçırdın" değil, "geri döndün, ilk hafta
 * hafif."
 */

import type { PlayerState } from './types';

/** Bu kadar gün ara verilirse geri dönüş modu devreye girer */
export const COMEBACK_AFTER_DAYS = 10;

export type ComebackLevel = 'none' | 'light' | 'reset';

export interface Comeback {
  level: ComebackLevel;
  /** Son antrenmandan bu yana geçen gün */
  daysOff: number;
  /** Hedeflere uygulanacak çarpan (1 = değişiklik yok) */
  factor: number;
  /** Ekranda gösterilecek açıklama */
  message: string;
  /** Geri dönüş modu bitene kadar kaç seans kaldı */
  sessionsToNormal: number;
}

function isoDay(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/** Belirtilen tarihten sonra kaç ayrı günde antrenman yapılmış */
function sessionsSince(state: PlayerState, isoDate: string): number {
  return new Set(state.logs.filter((l) => l.date > isoDate).map((l) => l.date)).size;
}

/**
 * Geri dönüş durumu.
 *
 * Eşikler:
 *   10-24 gün  → hafif dönüş, hedefler %15 düşer, 3 seansta normale döner
 *   25+ gün    → sıfırlama, hedefler %30 düşer, 5 seansta normale döner
 *
 * Neden gün sayısı, hafta değil: iki hafta ara veren biriyle üç hafta
 * ara veren biri aynı yerde değil, ve hafta sınırları takvimle
 * hizalanmıyor.
 */
export function comebackOf(state: PlayerState, today = new Date()): Comeback {
  const none: Comeback = {
    level: 'none', daysOff: 0, factor: 1, message: '', sessionsToNormal: 0,
  };
  if (state.logs.length === 0) return none;

  const dates = [...new Set(state.logs.map((l) => l.date))].sort();

  // Aradaki en uzun boşluğu değil, SON boşluğu ararız: geçmişte bir kez
  // ara vermiş olmak bugünü etkilemez.
  const last = dates.at(-1)!;
  const daysOff = isoDay(today) - isoDay(new Date(last));

  // Halen ara vermiş durumda mı, yoksa dönüş yapmış mı
  if (daysOff >= COMEBACK_AFTER_DAYS) {
    const reset = daysOff >= 25;
    return {
      level: reset ? 'reset' : 'light',
      daysOff,
      factor: reset ? 0.7 : 0.85,
      sessionsToNormal: reset ? 5 : 3,
      message: reset
        ? `${daysOff} gündür ara verdin. Hedefler ciddi biçimde düşürüldü — `
          + 'ilk hafta kolay gelecek, öyle olmalı. Kaldığın yerden değil, '
          + 'bulunduğun yerden devam ediyoruz.'
        : `${daysOff} gündür ara verdin. Hedefler biraz düşürüldü. `
          + 'Birkaç seansta eski seviyene dönersin, acele etme.',
    };
  }

  // Dönüşten sonraki ilk seanslar: hâlâ hafif devam eder
  // Son büyük boşluğu geriye doğru ara. findLast hedef kütüphanede yok,
  // düz döngü hem taşınabilir hem okunaklı.
  let gapAt = -1;
  for (let i = dates.length - 1; i > 0; i--) {
    const gap = isoDay(new Date(dates[i]!)) - isoDay(new Date(dates[i - 1]!));
    if (gap >= COMEBACK_AFTER_DAYS) { gapAt = i; break; }
  }
  if (gapAt < 0) return none;

  const gapStart = dates[gapAt - 1]!;
  const gapDays = isoDay(new Date(dates[gapAt]!)) - isoDay(new Date(gapStart));
  const reset = gapDays >= 25;
  const need = reset ? 5 : 3;
  const done = sessionsSince(state, gapStart);

  if (done >= need) return none;

  return {
    level: reset ? 'reset' : 'light',
    daysOff: gapDays,
    factor: reset ? 0.7 : 0.85,
    sessionsToNormal: need - done,
    message: `Geri dönüş: ${need - done} seans daha hafif gidiyoruz. `
           + 'Sayılar düşük görünecek, sorun değil — vücut hatırlıyor.',
  };
}

/** Hedefe geri dönüş çarpanını uygula */
export function applyComeback(target: number, cb: Comeback): number {
  if (cb.level === 'none') return target;
  return Math.max(1, Math.round(target * cb.factor));
}
