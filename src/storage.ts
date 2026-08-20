/**
 * KAYIT KATMANI
 *
 * Yerel-öncelikli: sunucu yok, hesap yok. (D-012)
 * Kullanıcının verisi kullanıcınındır — her zaman tek tuşla dışa
 * aktarılabilir. (Anayasa M-6)
 *
 * v1'de localStorage yeterli. IndexedDB'ye geçiş gerektiğinde bu
 * dosyanın arayüzü aynı kalır, içi değişir — UI etkilenmez.
 */

import { MASTERY_TIERS, type MasteryTier, type MovementDatabase,
         type PlayerState, type SetLog } from './engine/types';
import { tierForValue } from './engine/mastery';

const KEY = 'ascend.state.v1';

/**
 * Güncel şema sürümü. Şema değiştiğinde BURAYI ARTIR ve `migrate`
 * içine bir adım ekle.
 *
 * Neden gerekli: veri localStorage'da duruyor ve bir yıl boyunca
 * birikecek. Bir alan eklendiğinde ya da anlamı değiştiğinde eski
 * kayıt sessizce bozulur — kullanıcı bunu ancak sayıları yanlış
 * gördüğünde fark eder, o da genelde çok geçtir. Sürüm alanı,
 * "ne zaman ne yapılacağını" belirsizlikten çıkarır.
 */
export const SCHEMA_VERSION = 4;

export const DEFAULT_STATE: PlayerState = {
  xp: 0,
  // Yaygın ev kurulumu. Kullanıcı Ayarlar'dan değiştirir; ekipman
  // yoksa program otomatik olarak alternatiflere düşer.
  equipment: ['floor', 'wall', 'box', 'bench', 'jump-rope',
              'pullup-bar', 'dip-station'],
  // Varsayılan: kısıt yok. Kullanıcı kendi durumunu Ayarlar'dan girer —
  // sağlık verisi varsayılan duruma gömülmez. (D-014, D-044)
  //
  // Kısıt şeması örneği:
  //   { area: 'hand', side: 'right', type: 'hardware',
  //     excludedMovements: ['knuckle-pushup', 'fingertip-pushup'],
  //     clearedByProfessional: true }
  // Elde implant/plaka varsa avuç içi yerine yumruk veya parmak ucu
  // yükü doğrudan metakarp başlarına biner; o hareketler listeden çıkar
  // ve ağaçta "kısıt: listede değil" olarak işaretlenir.
  constraints: [],
  mastery: {},
  logs: [],
  weeklyTarget: 5,
  testDayOfWeek: 1,   // Pazartesi
};

/**
 * Eski kayıtları güncel şemaya taşır.
 *
 * Kural: her adım KENDİ İÇİNDE güvenli olmalı ve veri SİLMEMELİ.
 * Şüpheye düşülen yerde eski değer korunur — eksik alan eklemek
 * ucuz, kaybolan kaydı geri getirmek imkânsız.
 */
export function migrate(raw: Partial<PlayerState>): PlayerState {
  const from = raw.schemaVersion ?? 1;
  let s: Partial<PlayerState> = { ...raw };

  // v1 → v2: sürüm alanı, yedek tarihi ve kilo geçmişi eklendi.
  // Eski kayıtlarda bunlar yok; boş başlatılır, hiçbir şey silinmez.
  if (from < 2) {
    s = { ...s, bodyweight: s.bodyweight ?? [], lastExport: s.lastExport };
  }

  // v2 → v3: program dışı antrenman kaydı eklendi. Geçmişe dönük
  // doldurulamaz — kullanıcı geçen ayki salon günlerini hatırlamıyor
  // ve tahmin etmek veriyi kirletir. Boş başlar, bugünden dolar.
  if (from < 3) {
    s = { ...s, outside: s.outside ?? [] };
  }

  // v3 → v4: ağaçtaki konum artık çıkarım değil kayıt. Boş bırakılır;
  // boşken şablonun kendi hareketi geçerli olur, yani eski kullanıcı
  // hiçbir şey kaybetmez ve ilk terfi önerisinde konumu oluşur.
  if (from < 4) {
    s = { ...s, trackAt: s.trackAt ?? {}, habitLog: s.habitLog ?? [] };
  }

  return {
    ...structuredClone(DEFAULT_STATE),
    ...s,
    schemaVersion: SCHEMA_VERSION,
  };
}

export function load(): PlayerState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...structuredClone(DEFAULT_STATE), schemaVersion: SCHEMA_VERSION };
    const parsed = JSON.parse(raw) as Partial<PlayerState>;
    const migrated = migrate(parsed);
    // Göç olduysa hemen yaz — bir sonraki açılışta tekrar göç etmesin
    if ((parsed.schemaVersion ?? 1) !== SCHEMA_VERSION) save(migrated);
    return migrated;
  } catch {
    return { ...structuredClone(DEFAULT_STATE), schemaVersion: SCHEMA_VERSION };
  }
}

/** Son yedekten bu yana kaç gün geçti. Hiç yedek yoksa Infinity. */
export function daysSinceExport(state: PlayerState, today = new Date()): number {
  if (!state.lastExport) return Infinity;
  const d = Math.floor(
    (today.getTime() - new Date(state.lastExport).getTime()) / 86_400_000,
  );
  return Math.max(0, d);
}

export function save(state: PlayerState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Kota dolu veya gizli mod — sessizce geç, oturum içi çalışmaya devam
  }
}

export function hasBar(state: PlayerState): boolean {
  return state.equipment.includes('pullup-bar');
}

/**
 * Bir seansı kaydeder ve mastery durumunu günceller.
 * XP mastery kademesi yükselince verilir, her sette değil. (Anayasa M-4)
 */
export function recordSession(
  db: MovementDatabase,
  index: Map<string, { id: string } & Record<string, unknown>>,
  state: PlayerState,
  entries: { movementId: string; values: number[]; effort?: 'easy' | 'ok' | 'hard' }[],
  date = new Date(),
  kind?: SetLog['kind'],
): { state: PlayerState; gainedXp: number; tierUps: { movementId: string; tier: MasteryTier }[] } {
  const iso = date.toISOString().slice(0, 10);
  const next: PlayerState = structuredClone(state);
  let gainedXp = 0;
  const tierUps: { movementId: string; tier: MasteryTier }[] = [];

  for (const e of entries) {
    const clean = e.values.filter((v) => Number.isFinite(v) && v > 0);
    if (clean.length === 0) continue;

    const log: SetLog = {
      movementId: e.movementId, date: iso, values: clean, effort: e.effort,
      ...(kind ? { kind } : {}),
    };
    next.logs.push(log);

    const mv = db.movements.find((m) => m.id === e.movementId);
    if (!mv) continue;

    const best = Math.max(...clean);
    const prev = next.mastery[e.movementId];
    const prevTier = prev?.tier ?? null;
    const prevBest = prev?.best ?? 0;
    const newBest = Math.max(prevBest, best);
    const newTier = tierForValue(mv, newBest);

    next.mastery[e.movementId] = {
      movementId: e.movementId,
      tier: newTier,
      verifiedSessions: [...(prev?.verifiedSessions ?? []), iso],
      best: newBest,
    };

    // Yeni kademeye ilk ulaşımda XP
    const from = prevTier ? MASTERY_TIERS.indexOf(prevTier) : -1;
    const to = newTier ? MASTERY_TIERS.indexOf(newTier) : -1;
    for (let i = from + 1; i <= to; i++) {
      const tier = MASTERY_TIERS[i]!;
      gainedXp += mv.mastery[tier].xp;
      tierUps.push({ movementId: e.movementId, tier });
    }
  }

  next.xp += gainedXp;
  save(next);
  return { state: next, gainedXp, tierUps };
}

/** Dışa aktarma — veri kilitleme yok. (M-6) */
export function exportJson(state: PlayerState): string {
  return JSON.stringify(
    { v: SCHEMA_VERSION, exportedAt: new Date().toISOString(), state },
    null, 1,
  );
}

/** Yedek alındığını işaretler — hatırlatma bunu okur */
export function markExported(state: PlayerState, today = new Date()): PlayerState {
  const next = { ...state, lastExport: today.toISOString() };
  save(next);
  return next;
}

export function importJson(text: string): PlayerState | null {
  try {
    const o = JSON.parse(text) as { state?: Partial<PlayerState> };
    if (!o.state) return null;
    // İçe aktarılan kayıt eski sürüm olabilir — aynı göç yolundan geçir
    return migrate(o.state);
  } catch {
    return null;
  }
}
