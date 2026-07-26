/**
 * PROGRESSION PLANNER + SKILL SLOT
 *
 * "Ağaç nereye gideceğini söylüyor. Planner yarın tam olarak ne
 *  yapacağını söylüyor."  (SECOND_BRAIN 18.19)
 *
 * Kritik: bu DETERMINISTIK. Graf var, mastery durumu var, slot şablonu
 * kural. Yani planner hesaplanabilir bir fonksiyon — üretken model
 * değil. LLM gerektirmiyor. (D-022, D-047)
 *
 * Slot rolleri hareket değil NİTELİK belirtir (D-046):
 *   main       yoğunluk / beceri ilerlemesi   3-8 tekrar
 *   secondary  hacim / hipertrofi             8-15
 *   technique  motor öğrenme, taze yapılır    3-6
 *   finisher   kapasite                       15+
 */

import {
  MASTERY_TIERS,
  type Category,
  type Movement,
  type MovementDatabase,
  type PlayerState,
  type SlotAssignment,
  type SlotRole,
  type TreePlan,
} from './types';
import { isTrainable, tierOf } from './mastery';

/** Ağaç başına slot şablonu. 4 slot her ağaç için doğru değil:
 *  Balance'ta hacim yok, Mobility'de rotasyon yok. (D-046, S-2) */
export const SLOT_TEMPLATES: Partial<Record<Category, SlotRole[]>> = {
  push:          ['technique', 'main', 'secondary', 'finisher'],
  vertical_push: ['technique', 'main', 'secondary'],
  pull:          ['technique', 'main', 'secondary', 'finisher'],
  dips:          ['main', 'secondary'],
  legs:          ['main', 'secondary', 'finisher'],
  core:          ['main', 'secondary'],
  balance:       ['technique', 'technique'],
  explosive:     ['main'],
  conditioning:  ['main', 'finisher'],
  mobility:      ['technique'],
  elite:         ['technique', 'main'],
};

/** Rol başına tekrar aralığı ve RIR. */
const ROLE_PRESCRIPTION: Record<SlotRole, { sets: number; rir: number; repFactor: number }> = {
  technique: { sets: 3, rir: 3, repFactor: 0.5 },
  main:      { sets: 3, rir: 2, repFactor: 1.0 },
  secondary: { sets: 3, rir: 2, repFactor: 1.3 },
  finisher:  { sets: 2, rir: 1, repFactor: 1.8 },
};

/**
 * Bir hedefe giden ata zinciri (topolojik sırada, kökten hedefe).
 * Skill GPS'in motor karşılığı.
 */
export function pathTo(
  db: MovementDatabase,
  index: Map<string, Movement>,
  targetId: string,
): Movement[] {
  const seen = new Set<string>();
  const order: string[] = [];

  const visit = (id: string): void => {
    if (seen.has(id)) return;
    seen.add(id);
    const mv = index.get(id);
    if (!mv) return;
    for (const p of mv.prerequisites) visit(p);
    order.push(id);
  };
  visit(targetId);

  return order.map((id) => index.get(id)).filter((m): m is Movement => !!m);
}

/**
 * MAIN adayı: hedefe giden yolda, çalışılabilir olan ilk "bronz değil"
 * hareket. Ön koşulları eksikse zincir onları öne alır — yani sıra
 * kendiliğinden düzelir.
 */
export function findMain(
  state: PlayerState,
  path: Movement[],
): Movement | null {
  for (const mv of path) {
    if (tierOf(state, mv) != null) continue;      // zaten bronz+
    if (!isTrainable(state, mv)) continue;        // kilitli / ekipman / kısıt
    return mv;
  }
  return null;
}

/** SECONDARY: aynı kategoride bronz+ ama altın değil, en yüksek tier. */
function findSecondary(
  state: PlayerState,
  db: MovementDatabase,
  category: Category,
  exclude: Set<string>,
): Movement | null {
  const pool = db.movements
    .filter((m) => m.category === category)
    .filter((m) => !exclude.has(m.id))
    .filter((m) => isTrainable(state, m))
    .filter((m) => {
      const t = tierOf(state, m);
      return t != null && MASTERY_TIERS.indexOf(t) < MASTERY_TIERS.indexOf('gold');
    })
    .sort((a, b) => b.tier - a.tier);
  return pool[0] ?? null;
}

/** TECHNIQUE: beceri niteliği taşıyan, düşük tekrarlı iş.
 *  Şimdilik ölçüt: hold tipi veya balance kategorisi veya düşük tier
 *  düz-kol işi. `sessionBlock` alanı eklenince oraya bağlanacak. */
function findTechnique(
  state: PlayerState,
  db: MovementDatabase,
  category: Category,
  exclude: Set<string>,
): Movement | null {
  const pool = db.movements
    .filter((m) => m.category === category || m.family === 'planche' || m.family === 'handstand')
    .filter((m) => !exclude.has(m.id))
    .filter((m) => isTrainable(state, m))
    .filter((m) => m.measure.type === 'hold' || m.family === 'planche' || m.family === 'handstand')
    .sort((a, b) => a.tier - b.tier);
  return pool[0] ?? null;
}

/** FINISHER: hakim olunan (altın+) en düşük tier hareket, yüksek tekrar.
 *  Maksimum denemesi DEĞİL — kapasite işi. (D-046, S-5) */
function findFinisher(
  state: PlayerState,
  db: MovementDatabase,
  category: Category,
  exclude: Set<string>,
): Movement | null {
  const pool = db.movements
    .filter((m) => m.category === category)
    .filter((m) => !exclude.has(m.id))
    .filter((m) => isTrainable(state, m))
    .filter((m) => {
      const t = tierOf(state, m);
      return t != null && MASTERY_TIERS.indexOf(t) >= MASTERY_TIERS.indexOf('silver');
    })
    .sort((a, b) => a.tier - b.tier);
  return pool[0] ?? null;
}

function prescribe(mv: Movement, role: SlotRole, state: PlayerState): SlotAssignment {
  const p = ROLE_PRESCRIPTION[role];
  const tier = tierOf(state, mv);
  const base = tier
    ? mv.mastery[tier].target
    : mv.mastery.bronze.target;

  const reasons: Record<SlotRole, string> = {
    main: 'Ağaçta sıradaki basamak. Yoğunluk buradan gelir.',
    secondary: 'Hacim. Genelde eski ana hareket — temeli kaybetmemek için.',
    technique: 'Motor öğrenme. Taze yapılır, yorulunca öğrenme olmaz.',
    finisher: 'Kapasite. Hakim olduğun hareket, yüksek tekrar.',
  };

  return {
    role,
    movementId: mv.id,
    sets: p.sets,
    targetReps: Math.max(1, Math.round(base * p.repFactor)),
    rir: p.rir,
    reason: reasons[role],
  };
}

/**
 * Bir kategori için slot atamasını üretir.
 * Hedef verilirse Main o hedefe giden yoldan seçilir.
 */
export function planTree(
  db: MovementDatabase,
  index: Map<string, Movement>,
  state: PlayerState,
  category: Category,
  goalId?: string,
): TreePlan {
  const template = SLOT_TEMPLATES[category] ?? ['main'];
  const used = new Set<string>();
  const slots: SlotAssignment[] = [];

  for (const role of template) {
    let mv: Movement | null = null;

    if (role === 'main') {
      if (goalId) {
        mv = findMain(state, pathTo(db, index, goalId).filter((m) => !used.has(m.id)));
      }
      mv ??= db.movements
        .filter((m) => m.category === category && !used.has(m.id))
        .filter((m) => isTrainable(state, m) && tierOf(state, m) == null)
        .sort((a, b) => a.tier - b.tier)[0] ?? null;
    } else if (role === 'secondary') {
      mv = findSecondary(state, db, category, used);
    } else if (role === 'technique') {
      mv = findTechnique(state, db, category, used);
    } else {
      mv = findFinisher(state, db, category, used);
    }

    if (mv) {
      used.add(mv.id);
      slots.push(prescribe(mv, role, state));
    }
  }
  return { category, slots };
}

/**
 * Terfi kontrolü: Main ALTIN kademeye ulaşınca terfi eder.
 * Takvimle değil mastery ile — kimi 3 haftada geçer, kimi 3 ayda. (D-046, S-1)
 */
export function shouldPromote(state: PlayerState, mainId: string): boolean {
  const t = state.mastery[mainId]?.tier;
  if (!t) return false;
  return MASTERY_TIERS.indexOf(t) >= MASTERY_TIERS.indexOf('gold');
}

/** Seans içi sıra rol hiyerarşisi DEĞİL — technique en başta. (D-046, S-4) */
export const SESSION_ORDER: readonly SlotRole[] = [
  'technique', 'main', 'secondary', 'finisher',
] as const;

export function orderForSession(slots: SlotAssignment[]): SlotAssignment[] {
  return [...slots].sort(
    (a, b) => SESSION_ORDER.indexOf(a.role) - SESSION_ORDER.indexOf(b.role),
  );
}
