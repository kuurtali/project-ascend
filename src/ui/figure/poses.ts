/**
 * POZ KÜTÜPHANESİ — açı tabanlı iskelet
 *
 * !!! BU DOSYA ÜRETİLİR. Elle düzenleme: tools/rig/poses.py
 *     python3 tools/rig/emit.py > src/ui/figure/poses.ts
 *
 * Önceki sürümün hatası: poz = eklem KONUMLARI idi. İki kare arasında
 * ara değer alınırken ön kol uzayıp kısalıyordu; göz bunu lastik gibi,
 * "sarhoş" olarak okuyor. Kurucunun tarifi buydu ve haklıydı.
 *
 * Doğrusu ileri kinematik: kök nokta + AÇILAR. Kemik boyu sabit,
 * değişmesi mümkün değil. Ayrıca açı interpolasyonu uzvu doğal YAY
 * üzerinde taşır — dirsek artık gövdenin içinden geçmiyor.
 *
 * Açı: derece, 0=sağ, 90=aşağı, 180=sol, 270=yukarı.
 * Kök = göğüs (kollar oradan çıkar). Zemin y=90, barfiks y=8.
 *
 * Temas noktaları (yerdeki el, bardaki el, yerdeki ayak) poz üretilirken
 * ters kinematikle çakılır; yoksa çömelmede ayak havada kalıyordu.
 */

export type Prop = 'ground' | 'bar' | 'lowbar' | 'parallettes' | 'wall'
  | 'rope' | 'rings';

/** Kemik boyları — tüm pozlarda aynı, asla değişmez. */
export const BONE = {
  head: 12, uarm: 14, farm: 14, spine: 26, thigh: 17, shin: 17,
  headR: 6.4,
} as const;

export interface Pose {
  /** Göğüs (kök) konumu */
  x: number; y: number;
  head: number; spine: number;
  armU: number; armL: number;
  legU: number; legL: number;
  /** Uzak taraf — verilmezse yakın tarafla aynı */
  armU2?: number; armL2?: number;
  legU2?: number; legL2?: number;
}

export interface PoseSet {
  /** Sıra: başlangıç → (ara) → bitiş. Geri dönüş otomatik. */
  frames: Pose[];
  props: Prop[];
  /** Bir tekrarın saniyesi */
  dur: number;
  /** Statik tutuş — nefes gibi hafif salınır */
  hold?: boolean;
}

const PUSHUP: PoseSet = {
  props: ['ground'], dur: 2.6,
  frames: [
    { x: 32, y: 76, head: 194, spine: 14, armU: 81.8, armL: 179.4, legU: 14, legL: 14 },
    { x: 32, y: 69, head: 197, spine: 21, armU: 89.5, armL: 150, legU: 21, legL: 21 },
    { x: 30, y: 60, head: 200, spine: 29, armU: 108.4, armL: 108.4, legU: 29, legL: 29 },
  ],
};

const EXPLOSIVE: PoseSet = {
  props: ['ground'], dur: 1.5,
  frames: [
    { x: 32, y: 76, head: 194, spine: 14, armU: 81.8, armL: 179.4, legU: 14, legL: 14 },
    { x: 28, y: 50, head: 200, spine: 27, armU: 112, armL: 108, legU: 27, legL: 27 },
  ],
};

const PIKE: PoseSet = {
  props: ['ground'], dur: 2.8,
  frames: [
    { x: 36, y: 68, head: 158, spine: 316, armU: 84.1, armL: 144.8, legU: 44, legL: 44 },
    { x: 36, y: 60, head: 158, spine: 316, armU: 108.4, armL: 108.4, legU: 44, legL: 44 },
    { x: 36, y: 52, head: 158, spine: 316, armU: 104.7, armL: 104.8, legU: 44, legL: 44 },
  ],
};

const HSPU: PoseSet = {
  props: ['ground', 'wall'], dur: 3,
  frames: [
    { x: 50, y: 76, head: 40, spine: 270, armU: 141.5, armL: 22.2, legU: 270, legL: 270 },
    { x: 50, y: 69, head: 50, spine: 270, armU: 125.7, armL: 43.4, legU: 270, legL: 270 },
    { x: 50, y: 62, head: 60, spine: 270, armU: 85.9, armL: 85.9, legU: 270, legL: 270 },
  ],
};

const HANDSTAND: PoseSet = {
  props: ['ground'], dur: 4, hold: true,
  frames: [
    { x: 50, y: 62, head: 60, spine: 270, armU: 85.9, armL: 85.9, legU: 270, legL: 270 },
    { x: 50, y: 63, head: 60, spine: 270, armU: 100.5, armL: 71, legU: 272, legL: 268 },
  ],
};

const PLANCHE: PoseSet = {
  props: ['ground'], dur: 4, hold: true,
  frames: [
    { x: 36, y: 56, head: 186, spine: 8, armU: 83.3, armL: 83.3, legU: 4, legL: 0 },
    { x: 36, y: 58, head: 186, spine: 8, armU: 82.9, armL: 82.9, legU: 4, legL: 0 },
  ],
};

const DIP: PoseSet = {
  props: ['parallettes'], dur: 2.8,
  frames: [
    { x: 44, y: 44, head: 296, spine: 96, armU: 195.9, armL: 57.8, legU: 74, legL: 32 },
    { x: 44, y: 35, head: 298, spine: 94, armU: 159.4, armL: 59.5, legU: 74, legL: 32 },
    { x: 44, y: 25, head: 300, spine: 92, armU: 111.5, armL: 93.6, legU: 74, legL: 32 },
  ],
};

const LSIT: PoseSet = {
  props: ['parallettes'], dur: 4, hold: true,
  frames: [
    { x: 44, y: 26, head: 280, spine: 94, armU: 120.6, armL: 85.4, legU: 6, legL: 0 },
    { x: 44, y: 28, head: 280, spine: 94, armU: 132, armL: 76.1, legU: 6, legL: 0 },
  ],
};

const PULLUP: PoseSet = {
  props: ['bar'], dur: 3,
  frames: [
    { x: 52, y: 38, head: 268, spine: 92, armU: 254.6, armL: 254.6, legU: 76, legL: 34 },
    { x: 52, y: 31, head: 268, spine: 92, armU: 216.7, armL: 283.3, legU: 76, legL: 34 },
    { x: 52, y: 23, head: 266, spine: 92, armU: 185.4, armL: 295.1, legU: 76, legL: 34 },
  ],
};

const HANG: PoseSet = {
  props: ['bar'], dur: 4, hold: true,
  frames: [
    { x: 52, y: 38, head: 268, spine: 92, armU: 254.6, armL: 254.6, legU: 88, legL: 88 },
    { x: 52, y: 40, head: 268, spine: 92, armU: 255.5, armL: 255.5, legU: 88, legL: 88 },
  ],
};

const LEG_RAISE: PoseSet = {
  props: ['bar'], dur: 3,
  frames: [
    { x: 52, y: 38, head: 268, spine: 92, armU: 254.6, armL: 254.6, legU: 88, legL: 88 },
    { x: 52, y: 38, head: 268, spine: 92, armU: 254.6, armL: 254.6, legU: 44, legL: 22 },
    { x: 52, y: 38, head: 268, spine: 92, armU: 254.6, armL: 254.6, legU: 6, legL: 0 },
  ],
};

const FRONT_LEVER: PoseSet = {
  props: ['bar'], dur: 4, hold: true,
  frames: [
    { x: 30, y: 44, head: 184, spine: 4, armU: 270, armL: 270, legU: 2, legL: 0 },
    { x: 30, y: 46, head: 184, spine: 4, armU: 270, armL: 270, legU: 2, legL: 0 },
  ],
};

const BACK_LEVER: PoseSet = {
  props: ['bar'], dur: 4, hold: true,
  frames: [
    { x: 30, y: 46, head: 172, spine: 356, armU: 270, armL: 270, legU: 358, legL: 0 },
    { x: 30, y: 48, head: 172, spine: 356, armU: 270, armL: 270, legU: 358, legL: 0 },
  ],
};

const MUSCLEUP: PoseSet = {
  props: ['bar'], dur: 2.2,
  frames: [
    { x: 52, y: 38, head: 268, spine: 92, armU: 254.6, armL: 254.6, legU: 76, legL: 34 },
    { x: 52, y: 27, head: 268, spine: 96, armU: 200.7, armL: 291.3, legU: 72, legL: 30 },
    { x: 50, y: 16, head: 272, spine: 100, armU: 300.2, armL: 158.6, legU: 68, legL: 26 },
  ],
};

const ROW: PoseSet = {
  props: ['lowbar'], dur: 2.8,
  frames: [
    { x: 40, y: 64, head: 192, spine: 16, armU: 186, armL: 304.5, legU: 12, legL: 10 },
    { x: 40, y: 57, head: 192, spine: 16, armU: 152.6, armL: 297.4, legU: 12, legL: 10 },
  ],
};

const SQUAT: PoseSet = {
  props: ['ground'], dur: 2.8,
  frames: [
    { x: 46, y: 50, head: 258, spine: 74, armU: 6, armL: 352, legU: 46.8, legL: 171.2 },
    { x: 48, y: 41, head: 264, spine: 84, armU: 30, armL: 10, legU: 47.3, legL: 141.2 },
    { x: 50, y: 30, head: 270, spine: 90, armU: 100, armL: 95, legU: 90, legL: 90 },
  ],
};

const PISTOL: PoseSet = {
  props: ['ground'], dur: 3.2,
  frames: [
    { x: 46, y: 50, head: 258, spine: 74, armU: 4, armL: 350, legU: 46.8, legL: 171.2, legU2: 332, legL2: 346 },
    { x: 48, y: 32, head: 268, spine: 88, armU: 12, armL: 356, legU: 72, legL: 111.2, legU2: 356, legL2: 348 },
  ],
};

const RUN: PoseSet = {
  props: ['ground'], dur: 0.8,
  frames: [
    { x: 48, y: 32, head: 268, spine: 88, armU: 150, armL: 215, legU: 62, legL: 105, legU2: 118, legL2: 60 },
    { x: 50, y: 32, head: 272, spine: 92, armU: 30, armL: 335, legU: 118, legL: 62, legU2: 62, legL2: 105 },
  ],
};

const JUMPROPE: PoseSet = {
  props: ['ground', 'rope'], dur: 0.9,
  frames: [
    { x: 50, y: 32, head: 270, spine: 90, armU: 140, armL: 20, legU: 70.3, legL: 109.7 },
    { x: 50, y: 26, head: 270, spine: 90, armU: 140, armL: 20, legU: 96, legL: 78 },
  ],
};

const PLANK: PoseSet = {
  props: ['ground'], dur: 4, hold: true,
  frames: [
    { x: 32, y: 64, head: 194, spine: 16, armU: 87.4, armL: 128.1, legU: 16, legL: 16 },
    { x: 32, y: 66, head: 194, spine: 16, armU: 79.6, armL: 138.8, legU: 16, legL: 16 },
  ],
};

const HOLLOW: PoseSet = {
  props: ['ground'], dur: 4, hold: true,
  frames: [
    { x: 40, y: 68, head: 200, spine: 20, armU: 196, armL: 192, legU: 340, legL: 330 },
    { x: 40, y: 70, head: 200, spine: 22, armU: 198, armL: 194, legU: 342, legL: 332 },
  ],
};

const BEAR: PoseSet = {
  props: ['ground'], dur: 2.4,
  frames: [
    { x: 34, y: 58, head: 190, spine: 16, armU: 110.5, armL: 110.6, legU: 62, legL: 116, legU2: 96, legL2: 54 },
    { x: 36, y: 58, head: 190, spine: 16, armU: 86.4, armL: 86.4, legU: 96, legL: 54, legU2: 62, legL2: 116 },
  ],
};

const MOBILITY: PoseSet = {
  props: ['ground'], dur: 3.4,
  frames: [
    { x: 50, y: 30, head: 270, spine: 90, armU: 255, armL: 250, legU: 90, legL: 90 },
    { x: 50, y: 30, head: 270, spine: 90, armU: 300, armL: 20, legU: 90, legL: 90 },
    { x: 50, y: 30, head: 270, spine: 90, armU: 80, armL: 110, legU: 90, legL: 90 },
  ],
};

const REST: PoseSet = {
  props: ['ground'], dur: 5, hold: true,
  frames: [
    { x: 36, y: 82, head: 186, spine: 4, armU: 10, armL: 350, legU: 2, legL: 0 },
    { x: 36, y: 83, head: 186, spine: 4, armU: 12, armL: 352, legU: 2, legL: 0 },
  ],
};

const STAND: PoseSet = {
  props: ['ground'], dur: 4, hold: true,
  frames: [
    { x: 50, y: 30, head: 270, spine: 90, armU: 100, armL: 95, legU: 90, legL: 90 },
    { x: 50, y: 31, head: 270, spine: 90, armU: 101, armL: 96, legU: 90, legL: 90 },
  ],
};

/** Aile → poz. Yeni hareket geldiğinde ailesi zaten bir poza düşer. */
const BY_FAMILY: Record<string, PoseSet> = {
  pushup: PUSHUP,
  explosive_push: EXPLOSIVE,
  oa_push: PUSHUP,
  vertical_push: PIKE,
  handstand: HANDSTAND,
  planche: PLANCHE,
  pullup: PULLUP,
  oa_pull: PULLUP,
  hang: HANG,
  grip: HANG,
  row: ROW,
  muscleup: MUSCLEUP,
  dip: DIP,
  front_lever: FRONT_LEVER,
  back_lever: BACK_LEVER,
  lsit: LSIT,
  leg_raise: LEG_RAISE,
  core_hold: PLANK,
  squat: SQUAT,
  single_leg: PISTOL,
  balance_arm: BEAR,
  jump_rope: JUMPROPE,
  run: RUN,
  mobility: MOBILITY,
  recovery: REST,
  rings_elite: PLANCHE,
};

/** Ailenin ortalaması yanlış kalan ikonik hareketler. */
const BY_ID: Record<string, PoseSet> = {
  'hspu': HSPU,
  'wall-hspu': HSPU,
  'freestanding-hspu': HSPU,
  'one-arm-hspu': HSPU,
  'hollow-hold': HOLLOW,
  'hollow-rock': HOLLOW,
  'dead-bug': HOLLOW,
  'plank': PLANK,
  'fingertip-pushup': PUSHUP,
  'knuckle-pushup': PUSHUP,
  'finger-pushup': PUSHUP,
  'bodyweight-squat': SQUAT,
  'sleep-hygiene': REST,
};

export function poseFor(movementId: string, family: string): PoseSet {
  return BY_ID[movementId] ?? BY_FAMILY[family] ?? STAND;
}

export { STAND };
