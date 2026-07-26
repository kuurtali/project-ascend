/**
 * Mastery, kilit ve yakınlık hesapları.
 *
 * Kurallar (SECOND_BRAIN 18.3, 09):
 *  - Ön koşullar AND mantığı, hepsi gerekli
 *  - Kilit açmak için BRONZ yeterli; altın/master XP ve prestij için
 *  - Eşikler RIR 2'de tanımlı (D-049)
 *  - Kademe doğrulaması: 14 gün içinde 2 ayrı seans (D-015)
 */

import {
  MASTERY_TIERS,
  type MasteryTier,
  type Movement,
  type MovementDatabase,
  type PlayerState,
  type ProximityInfo,
  type SetLog,
} from './types';

export function indexMovements(db: MovementDatabase): Map<string, Movement> {
  return new Map(db.movements.map((m) => [m.id, m]));
}

/** Bir değerin hangi kademeye denk geldiği. Ulaşılmadıysa null. */
export function tierForValue(mv: Movement, value: number): MasteryTier | null {
  let result: MasteryTier | null = null;
  for (const tier of MASTERY_TIERS) {
    if (value >= mv.mastery[tier].target) result = tier;
  }
  return result;
}

/** Oyuncunun bir harekette ulaştığı kademe. */
export function tierOf(state: PlayerState, mv: Movement): MasteryTier | null {
  const st = state.mastery[mv.id];
  if (!st) return null;
  return st.tier;
}

export function hasBronze(state: PlayerState, id: string): boolean {
  return state.mastery[id]?.tier != null;
}

/** Açık mı — tüm ön koşullar en az bronz. */
export function isOpen(state: PlayerState, mv: Movement): boolean {
  return mv.prerequisites.every((p) => hasBronze(state, p));
}

/** Ekipman yeterli mi. Liste OR mantığı: biri varsa yeterli. */
export function equipmentOk(state: PlayerState, mv: Movement): boolean {
  if (mv.equipment.length === 0) return true;
  return mv.equipment.some((e) => state.equipment.includes(e));
}

/** Kısıt yüzünden plana girmemesi gereken hareket mi. */
export function isExcluded(state: PlayerState, id: string): boolean {
  return state.constraints.some((c) => c.excludedMovements.includes(id));
}

/** Planlanabilir mi: açık + ekipman var + kısıtla dışlanmamış. */
export function isTrainable(state: PlayerState, mv: Movement): boolean {
  return isOpen(state, mv) && equipmentOk(state, mv) && !isExcluded(state, mv.id);
}

const DAY_MS = 86_400_000;

/**
 * Kademe doğrulaması. Hedef değere son 14 gün içinde İKİ AYRI seansta
 * ulaşılmış olmalı. Tek seferlik iyi gün mastery sayılmaz. (D-015)
 */
export function verifyTier(
  mv: Movement,
  logs: SetLog[],
  tier: MasteryTier,
  today: Date,
): { verified: boolean; sessions: string[] } {
  const target = mv.mastery[tier].target;
  const cutoff = today.getTime() - 14 * DAY_MS;

  const sessions = new Set<string>();
  for (const log of logs) {
    if (log.movementId !== mv.id) continue;
    if (new Date(log.date).getTime() < cutoff) continue;
    // En az bir set hedefi tuttuysa o seans sayılır
    if (log.values.some((v) => v >= target)) sessions.add(log.date);
  }
  const list = [...sessions].sort();
  return { verified: list.length >= 2, sessions: list };
}

/**
 * Bir hareketin en yüksek DOĞRULANMIŞ kademesi.
 * Doğrulanmamış ama ulaşılmış kademe "beklemede" sayılır.
 */
export function verifiedTierOf(
  mv: Movement,
  logs: SetLog[],
  today: Date,
): { tier: MasteryTier | null; pending: MasteryTier | null } {
  let verified: MasteryTier | null = null;
  let pending: MasteryTier | null = null;

  for (const tier of MASTERY_TIERS) {
    const r = verifyTier(mv, logs, tier, today);
    if (r.verified) verified = tier;
    else if (r.sessions.length === 1) pending = tier;
  }
  return { tier: verified, pending };
}

/**
 * Sonraki kademeye kalan mesafe.
 * Günlük motivasyon motoru bu — ağaç haftalık yönelim aracı. (D-049)
 */
export function proximity(state: PlayerState, mv: Movement): ProximityInfo {
  const st = state.mastery[mv.id];
  const best = st?.best ?? 0;
  const current = st?.tier ?? null;

  const idx = current ? MASTERY_TIERS.indexOf(current) : -1;
  const next = idx + 1 < MASTERY_TIERS.length ? MASTERY_TIERS[idx + 1] : undefined;

  if (!next) {
    return {
      movementId: mv.id, currentTier: current, nextTier: null,
      best, nextTarget: null, remaining: null,
    };
  }
  const nextTarget = mv.mastery[next].target;
  return {
    movementId: mv.id,
    currentTier: current,
    nextTier: next,
    best,
    nextTarget,
    remaining: Math.max(0, nextTarget - best),
  };
}

/** Seviye eğrisi: kümülatif XP'den seviye. */
export function levelOf(db: MovementDatabase, xp: number): number {
  let level = 1;
  for (const step of db.levelCurve) {
    if (xp >= step.xpRequired) level = step.level;
  }
  return level;
}

/**
 * Denge puanı. Kazanılan XP'nin kategori dağılımı, o kategorinin
 * MEVCUT XP payıyla karşılaştırılır — düz 1/N ideali yanlıştı,
 * çünkü Pull'da 43 Explosive'de 8 hareket var. (D-016)
 */
export function balanceScore(
  db: MovementDatabase,
  state: PlayerState,
): number | null {
  const earned = new Map<string, number>();
  const avail = new Map<string, number>();
  let eTot = 0;
  let aTot = 0;

  for (const mv of db.movements) {
    if (mv.category === 'recovery') continue;
    const tier = state.mastery[mv.id]?.tier ?? null;
    const reached = tier ? MASTERY_TIERS.indexOf(tier) : -1;

    MASTERY_TIERS.forEach((t, i) => {
      const xp = mv.mastery[t].xp;
      avail.set(mv.category, (avail.get(mv.category) ?? 0) + xp);
      aTot += xp;
      if (i <= reached) {
        earned.set(mv.category, (earned.get(mv.category) ?? 0) + xp);
        eTot += xp;
      }
    });
  }
  if (eTot === 0) return null;

  let dev = 0;
  for (const cat of avail.keys()) {
    dev += Math.abs((earned.get(cat) ?? 0) / eTot - (avail.get(cat) ?? 0) / aTot);
  }
  return Math.max(0, Math.round(100 * (1 - dev / 2)));
}
