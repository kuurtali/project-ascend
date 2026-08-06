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

export const DEFAULT_STATE: PlayerState = {
  xp: 0,
  // Evde barfiks demiri + dips aleti var; salonda ikisi de mevcut. (D-057)
  equipment: ['floor', 'wall', 'box', 'bench', 'jump-rope',
              'pullup-bar', 'dip-station'],
  constraints: [
    {
      area: 'hand', side: 'right', type: 'hardware',
      // Metakarp implantı: yük doğrudan metakarp başlarına biniyor
      excludedMovements: ['knuckle-pushup', 'fingertip-pushup', 'finger-pushup'],
      clearedByProfessional: true,
    },
    {
      area: 'wrist', side: 'left', type: 'chronic',
      excludedMovements: [],
      clearedByProfessional: false,
    },
  ],
  mastery: {},
  logs: [],
  weeklyTarget: 5,
  testDayOfWeek: 1,   // Pazartesi
};

export function load(): PlayerState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<PlayerState>;
    return { ...structuredClone(DEFAULT_STATE), ...parsed };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
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
  return JSON.stringify({ v: 1, exportedAt: new Date().toISOString(), state }, null, 1);
}

export function importJson(text: string): PlayerState | null {
  try {
    const o = JSON.parse(text) as { state?: PlayerState };
    if (!o.state) return null;
    return { ...structuredClone(DEFAULT_STATE), ...o.state };
  } catch {
    return null;
  }
}
