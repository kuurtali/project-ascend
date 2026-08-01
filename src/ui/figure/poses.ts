/**
 * POZ KÜTÜPHANESİ — hareketlerin insan hâli
 *
 * Uygulamanın en büyük eksiği buydu: 197 hareket vardı ama ekranda
 * BEDEN yoktu. Beden hakkında sayılar vardı. Kurucunun cümlesi:
 * "kendimi handstand push-up yaparken düşünmek bile motive ediyor."
 * O düşünceyi ekrana koymak bu dosyanın işi.
 *
 * 197 çizim yapılmadı — 22 poz yapıldı ve hareket AİLELERİNE bağlandı.
 * Yeni hareket eklendiğinde ailesi zaten bir poza denk gelir; çizim
 * borcu birikmez. (Anayasa: Expand Forever)
 *
 * Koordinatlar 0..100 kutusunda, y aşağı. Zemin y=90, barfiks y=10.
 * Uzuv uzunlukları frameler arasında ±%20 oynayabilir — 80 pikselde
 * görünmez ve kısalma (foreshortening) gibi okunur. Amaç anatomi
 * simülasyonu değil, tanınabilir siluet.
 */

export type P = [number, number];

export type Prop = 'ground' | 'bar' | 'lowbar' | 'parallettes' | 'wall' | 'rope' | 'rings';

export interface Pose {
  head: P;
  neck: P;
  hip: P;
  elbow: P;
  hand: P;
  knee: P;
  foot: P;
  /** Asimetrik hareketler (pistol, archer) için ikinci uzuvlar */
  elbow2?: P;
  hand2?: P;
  knee2?: P;
  foot2?: P;
}

export interface PoseSet {
  /** a = başlangıç/alt, b = bitiş/üst. Statik tutuşta ikisi çok yakın. */
  a: Pose;
  b: Pose;
  props: Prop[];
  /** Saniye — yavaş tutuşlar uzun, patlayıcı hareketler kısa */
  dur: number;
  /** Statik tutuş: nefes gibi hafif salınır, tekrar yapmaz */
  hold?: boolean;
}

// ───────────────────────────────────────────────────────── POZLAR

const PUSHUP: PoseSet = {
  props: ['ground'], dur: 2.6,
  b: { head: [18, 54], neck: [28, 60], hip: [56, 70], elbow: [27, 75],
       hand: [26, 90], knee: [74, 78], foot: [92, 88] },
  a: { head: [20, 69], neck: [30, 74], hip: [58, 78], elbow: [45, 83],
       hand: [26, 90], knee: [76, 84], foot: [94, 88] },
};

/** Patlayıcı: üstte eller yerden kesiliyor */
const EXPLOSIVE: PoseSet = {
  props: ['ground'], dur: 1.5,
  b: { head: [16, 44], neck: [26, 50], hip: [54, 62], elbow: [24, 62],
       hand: [22, 76], knee: [72, 72], foot: [90, 84] },
  a: { head: [20, 69], neck: [30, 74], hip: [58, 78], elbow: [45, 83],
       hand: [26, 90], knee: [76, 84], foot: [94, 88] },
};

const PULLUP: PoseSet = {
  props: ['bar'], dur: 3.0,
  a: { head: [56, 36], neck: [48, 40], hip: [47, 66], elbow: [47, 25],
       hand: [46, 10], knee: [47, 82], foot: [57, 92] },
  b: { head: [57, 22], neck: [48, 26], hip: [47, 52], elbow: [34, 18],
       hand: [46, 10], knee: [47, 68], foot: [57, 78] },
};

const HANG: PoseSet = {
  props: ['bar'], dur: 4.0, hold: true,
  a: { head: [56, 36], neck: [48, 40], hip: [47, 66], elbow: [47, 25],
       hand: [46, 10], knee: [47, 84], foot: [48, 96] },
  b: { head: [56, 38], neck: [48, 42], hip: [47, 68], elbow: [47, 26],
       hand: [46, 10], knee: [47, 86], foot: [48, 97] },
};

const DIP: PoseSet = {
  props: ['parallettes'], dur: 2.8,
  b: { head: [56, 18], neck: [48, 24], hip: [48, 52], elbow: [43, 38],
       hand: [38, 52], knee: [58, 68], foot: [48, 78] },
  a: { head: [56, 36], neck: [48, 42], hip: [48, 68], elbow: [31, 51],
       hand: [38, 52], knee: [58, 82], foot: [48, 90] },
};

const PIKE: PoseSet = {
  props: ['ground'], dur: 2.8,
  b: { head: [26, 46], neck: [34, 52], hip: [62, 34], elbow: [30, 66],
       hand: [26, 88], knee: [74, 60], foot: [82, 88] },
  a: { head: [22, 74], neck: [34, 70], hip: [62, 36], elbow: [40, 78],
       hand: [26, 88], knee: [74, 62], foot: [82, 88] },
};

const HSPU: PoseSet = {
  props: ['ground', 'wall'], dur: 3.0,
  b: { head: [58, 64], neck: [50, 58], hip: [50, 32], elbow: [50, 74],
       hand: [50, 90], knee: [50, 16], foot: [50, 4] },
  a: { head: [60, 86], neck: [50, 78], hip: [50, 52], elbow: [34, 80],
       hand: [50, 90], knee: [50, 34], foot: [50, 16] },
};

const HANDSTAND: PoseSet = {
  props: ['ground'], dur: 4.0, hold: true,
  a: { head: [58, 64], neck: [50, 58], hip: [50, 32], elbow: [50, 74],
       hand: [50, 90], knee: [50, 16], foot: [50, 4] },
  b: { head: [57, 66], neck: [49, 60], hip: [51, 34], elbow: [49, 75],
       hand: [50, 90], knee: [51, 18], foot: [52, 6] },
};

const PLANCHE: PoseSet = {
  props: ['ground'], dur: 4.0, hold: true,
  a: { head: [26, 50], neck: [36, 54], hip: [64, 58], elbow: [40, 70],
       hand: [42, 86], knee: [80, 56], foot: [95, 52] },
  b: { head: [26, 52], neck: [36, 56], hip: [64, 60], elbow: [40, 71],
       hand: [42, 86], knee: [80, 57], foot: [95, 53] },
};

const FRONT_LEVER: PoseSet = {
  props: ['bar'], dur: 4.0, hold: true,
  a: { head: [18, 42], neck: [28, 44], hip: [56, 47], elbow: [28, 27],
       hand: [28, 10], knee: [75, 48], foot: [94, 49] },
  b: { head: [18, 44], neck: [28, 46], hip: [56, 49], elbow: [28, 28],
       hand: [28, 10], knee: [75, 50], foot: [94, 51] },
};

const BACK_LEVER: PoseSet = {
  props: ['bar'], dur: 4.0, hold: true,
  a: { head: [18, 54], neck: [28, 50], hip: [56, 47], elbow: [28, 30],
       hand: [28, 10], knee: [75, 46], foot: [94, 45] },
  b: { head: [18, 56], neck: [28, 52], hip: [56, 49], elbow: [28, 31],
       hand: [28, 10], knee: [75, 48], foot: [94, 47] },
};

const LSIT: PoseSet = {
  props: ['parallettes'], dur: 4.0, hold: true,
  a: { head: [42, 30], neck: [44, 42], hip: [50, 62], elbow: [44, 56],
       hand: [40, 70], knee: [70, 60], foot: [90, 58] },
  b: { head: [42, 32], neck: [44, 44], hip: [50, 64], elbow: [44, 57],
       hand: [40, 70], knee: [70, 62], foot: [90, 60] },
};

const LEG_RAISE: PoseSet = {
  props: ['bar'], dur: 3.0,
  a: { head: [56, 36], neck: [48, 40], hip: [47, 66], elbow: [47, 25],
       hand: [46, 10], knee: [47, 82], foot: [48, 96] },
  b: { head: [56, 36], neck: [48, 40], hip: [47, 64], elbow: [47, 25],
       hand: [46, 10], knee: [66, 54], foot: [84, 48] },
};

const PLANK: PoseSet = {
  props: ['ground'], dur: 4.0, hold: true,
  a: { head: [18, 62], neck: [28, 66], hip: [58, 72], elbow: [30, 88],
       hand: [46, 90], knee: [76, 80], foot: [94, 88] },
  b: { head: [18, 64], neck: [28, 68], hip: [58, 74], elbow: [30, 89],
       hand: [46, 90], knee: [76, 82], foot: [94, 89] },
};

const HOLLOW: PoseSet = {
  props: ['ground'], dur: 4.0, hold: true,
  a: { head: [32, 60], neck: [42, 66], hip: [64, 76], elbow: [30, 54],
       hand: [16, 48], knee: [80, 64], foot: [94, 54] },
  b: { head: [32, 62], neck: [42, 68], hip: [64, 78], elbow: [30, 56],
       hand: [16, 50], knee: [80, 66], foot: [94, 56] },
};

const SQUAT: PoseSet = {
  props: ['ground'], dur: 2.8,
  b: { head: [50, 20], neck: [50, 32], hip: [50, 58], elbow: [44, 46],
       hand: [40, 58], knee: [50, 74], foot: [50, 90] },
  a: { head: [34, 48], neck: [40, 58], hip: [42, 77], elbow: [52, 62],
       hand: [62, 58], knee: [66, 74], foot: [50, 90] },
};

const PISTOL: PoseSet = {
  props: ['ground'], dur: 3.2,
  b: { head: [46, 20], neck: [46, 32], hip: [46, 58], elbow: [56, 44],
       hand: [64, 52], knee: [46, 74], foot: [46, 90],
       knee2: [62, 60], foot2: [78, 58] },
  a: { head: [42, 46], neck: [42, 58], hip: [44, 76], elbow: [56, 58],
       hand: [70, 58], knee: [58, 80], foot: [46, 90],
       knee2: [66, 66], foot2: [86, 62] },
};

const BEAR: PoseSet = {
  props: ['ground'], dur: 2.4,
  a: { head: [20, 58], neck: [30, 62], hip: [62, 66], elbow: [28, 76],
       hand: [26, 90], knee: [70, 78], foot: [64, 90] },
  b: { head: [22, 56], neck: [32, 60], hip: [64, 66], elbow: [36, 74],
       hand: [42, 90], knee: [76, 76], foot: [86, 90] },
};

const ROW: PoseSet = {
  props: ['lowbar'], dur: 2.8,
  a: { head: [30, 62], neck: [38, 62], hip: [64, 74], elbow: [36, 60],
       hand: [36, 52], knee: [80, 82], foot: [94, 90] },
  b: { head: [30, 56], neck: [38, 56], hip: [64, 70], elbow: [50, 58],
       hand: [36, 52], knee: [80, 80], foot: [94, 90] },
};

const MUSCLEUP: PoseSet = {
  props: ['bar'], dur: 2.2,
  a: { head: [56, 34], neck: [48, 38], hip: [47, 64], elbow: [47, 24],
       hand: [46, 10], knee: [47, 80], foot: [57, 90] },
  b: { head: [58, 14], neck: [50, 20], hip: [50, 46], elbow: [33, 15],
       hand: [46, 10], knee: [58, 62], foot: [48, 74] },
};

const JUMPROPE: PoseSet = {
  props: ['ground', 'rope'], dur: 0.9,
  a: { head: [50, 22], neck: [50, 34], hip: [50, 58], elbow: [40, 46],
       hand: [36, 54], knee: [50, 74], foot: [50, 88] },
  b: { head: [50, 16], neck: [50, 28], hip: [50, 52], elbow: [40, 40],
       hand: [36, 48], knee: [52, 66], foot: [50, 76] },
};

const RUN: PoseSet = {
  props: ['ground'], dur: 0.8,
  a: { head: [48, 20], neck: [48, 32], hip: [50, 58], elbow: [36, 42],
       hand: [30, 52], knee: [38, 74], foot: [30, 88],
       knee2: [64, 70], foot2: [74, 84] },
  b: { head: [50, 20], neck: [50, 32], hip: [50, 58], elbow: [62, 42],
       hand: [68, 52], knee: [64, 72], foot: [76, 86],
       knee2: [40, 72], foot2: [32, 86] },
};

const MOBILITY: PoseSet = {
  props: ['ground'], dur: 3.4,
  a: { head: [50, 20], neck: [50, 32], hip: [50, 58], elbow: [38, 40],
       hand: [30, 28], knee: [50, 74], foot: [50, 90] },
  b: { head: [50, 20], neck: [50, 32], hip: [50, 58], elbow: [40, 48],
       hand: [34, 62], knee: [50, 74], foot: [50, 90] },
};

const REST: PoseSet = {
  props: ['ground'], dur: 5.0, hold: true,
  a: { head: [22, 78], neck: [34, 82], hip: [62, 84], elbow: [34, 74],
       hand: [46, 72], knee: [78, 82], foot: [94, 86] },
  b: { head: [22, 79], neck: [34, 83], hip: [62, 85], elbow: [34, 76],
       hand: [46, 74], knee: [78, 83], foot: [94, 87] },
};

const STAND: PoseSet = {
  props: ['ground'], dur: 4.0, hold: true,
  a: { head: [50, 20], neck: [50, 32], hip: [50, 58], elbow: [44, 46],
       hand: [42, 60], knee: [50, 74], foot: [50, 90] },
  b: { head: [50, 21], neck: [50, 33], hip: [50, 59], elbow: [44, 47],
       hand: [42, 61], knee: [50, 75], foot: [50, 90] },
};

// ─────────────────────────────────────────────── EŞLEME

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
