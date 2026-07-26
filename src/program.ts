/**
 * HAFTALIK PROGRAM ŞABLONU
 *
 * Kullanıcının kendi tasarladığı yapı (SECOND_BRAIN 18.12 slot mantığıyla
 * uyumlu): her seans itme + çekme + dip + core + ip.
 *
 * Sıklık her gün (5/7), YOĞUNLUK dönüyor:
 *   ağır gün  → gerçek dips setleri + gerçek çekiş setleri
 *   hafif gün → bench dip / az tekrar + askı & skapular
 *
 * Sebep: şınav her gün sorun değil (göreli yük düşük). Dips ve barfiks
 * her gün maksimuma yakın demek — dirsek ve omuz önü orada gider.
 *
 * Hedef tekrarlar BURADA SABİT DEĞİL. Bunlar yalnızca başlangıç
 * değerleri; sonraki hedefler `engine/adaptation.ts` tarafından
 * kayıtlardan hesaplanır. (D-050)
 */

import type { SlotRole } from './engine/types';

export type DayKind = 'heavy' | 'light' | 'rest';

export interface ProgramExercise {
  /** movements.json içindeki id */
  movementId: string;
  /** Ekranda görünecek kısa ad (Türkçe) */
  label: string;
  role: SlotRole;
  sets: number;
  /** Hafta 1 başlangıç hedefi. Sonrası uyarlamadan gelir. */
  startTarget: number;
  /** Kaç tekrar rezerv bırakılacak */
  rir: number;
  /** Ölçü birimi ekranda gösterilir */
  unit: 'tekrar' | 'saniye' | 'dakika';
  /** Bar gerektiriyor mu — bar yoksa alternatifi kullanılır */
  needsBar?: boolean;
  altMovementId?: string;
  altLabel?: string;
}

export interface ProgramDay {
  index: number;            // 1..7
  name: string;
  kind: DayKind;
  focusNote: string;
  exercises: ProgramExercise[];
  ropeMinutes: number;
  /** Ölçüm günü: bir harekette RIR 0'a çıkılabilir (D-049) */
  isTestDay?: boolean;
}

const WRIST: ProgramExercise = {
  movementId: 'wrist-mobility', label: 'Bilek hazırlığı', role: 'technique',
  sets: 1, startTarget: 120, rir: 0, unit: 'saniye',
};

const HOLLOW: ProgramExercise = {
  movementId: 'hollow-hold', label: 'Hollow hold', role: 'main',
  sets: 3, startTarget: 30, rir: 2, unit: 'saniye',
};

const PUSHUP: ProgramExercise = {
  movementId: 'pushup', label: 'Şınav', role: 'secondary',
  sets: 3, startTarget: 12, rir: 2, unit: 'tekrar',
};

/** Ağır gün çekiş bloğu: gerçek setler */
const PULL_HEAVY: ProgramExercise[] = [
  {
    movementId: 'negative-pullup', label: 'Negatif barfiks', role: 'main',
    sets: 3, startTarget: 5, rir: 2, unit: 'tekrar', needsBar: true,
    altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
  },
  {
    movementId: 'scapular-pullup', label: 'Skapular çekiş', role: 'technique',
    sets: 3, startTarget: 8, rir: 2, unit: 'tekrar', needsBar: true,
    altMovementId: 'scapular-pushup', altLabel: 'Scapular şınav',
  },
];

/** Hafif gün çekiş bloğu: askı ağırlıklı, tendon dostu */
const PULL_LIGHT: ProgramExercise[] = [
  {
    movementId: 'passive-hang', label: 'Ölü askı', role: 'finisher',
    sets: 3, startTarget: 25, rir: 0, unit: 'saniye', needsBar: true,
    altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
  },
  {
    movementId: 'scapular-pullup', label: 'Skapular çekiş', role: 'technique',
    sets: 3, startTarget: 8, rir: 2, unit: 'tekrar', needsBar: true,
    altMovementId: 'scapular-pushup', altLabel: 'Scapular şınav',
  },
];

const DIP_HEAVY: ProgramExercise = {
  movementId: 'parallel-bar-dip', label: 'Paralel bar dip', role: 'main',
  sets: 3, startTarget: 6, rir: 2, unit: 'tekrar', needsBar: true,
  altMovementId: 'bench-dip', altLabel: 'Bench dip (sandalye)',
};

const DIP_LIGHT: ProgramExercise = {
  movementId: 'bench-dip', label: 'Bench dip (sandalye)', role: 'finisher',
  sets: 3, startTarget: 10, rir: 2, unit: 'tekrar',
};

export const WEEK: ProgramDay[] = [
  {
    index: 1, name: 'Pazartesi', kind: 'heavy', isTestDay: true,
    focusNote: 'Ölçüm günü. Şınavda bir set sonuna kadar gidebilirsin.',
    ropeMinutes: 8,
    exercises: [
      WRIST,
      { movementId: 'pike-pushup', label: 'Pike şınav', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar' },
      PUSHUP,
      DIP_HEAVY,
      ...PULL_HEAVY,
      HOLLOW,
    ],
  },
  {
    index: 2, name: 'Salı', kind: 'light',
    focusNote: 'Hafif gün. Hacim işi, dinlenme değil.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      { movementId: 'wide-pushup', label: 'Geniş şınav', role: 'main',
        sets: 3, startTarget: 10, rir: 2, unit: 'tekrar' },
      PUSHUP,
      DIP_LIGHT,
      ...PULL_LIGHT,
      { movementId: 'hanging-knee-raise', label: 'Hanging knee raise', role: 'main',
        sets: 3, startTarget: 8, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'reverse-crunch', altLabel: 'Reverse crunch' },
    ],
  },
  {
    index: 3, name: 'Çarşamba', kind: 'rest',
    focusNote: 'Dinlenme. Telafi etme, yarına geç.',
    ropeMinutes: 0, exercises: [],
  },
  {
    index: 4, name: 'Perşembe', kind: 'heavy',
    focusNote: 'Ağır gün + ağır ip. Baldır yükü bugüne toplandı.',
    ropeMinutes: 12,
    exercises: [
      WRIST,
      { movementId: 'diamond-pushup', label: 'Elmas şınav', role: 'main',
        sets: 3, startTarget: 8, rir: 2, unit: 'tekrar' },
      PUSHUP,
      DIP_HEAVY,
      ...PULL_HEAVY,
      { movementId: 'tuck-l-sit', label: 'Tuck L-sit', role: 'main',
        sets: 3, startTarget: 15, rir: 2, unit: 'saniye' },
    ],
  },
  {
    index: 5, name: 'Cuma', kind: 'light',
    focusNote: 'Hafif gün.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      { movementId: 'incline-pushup', label: 'Sehpa şınav', role: 'finisher',
        sets: 3, startTarget: 15, rir: 2, unit: 'tekrar' },
      PUSHUP,
      DIP_LIGHT,
      ...PULL_LIGHT,
      HOLLOW,
    ],
  },
  {
    index: 6, name: 'Cumartesi', kind: 'light',
    focusNote: 'Hafif gün. Ayak yukarı = omuzu dikeye yaklaştırır.',
    ropeMinutes: 8,
    exercises: [
      WRIST,
      { movementId: 'decline-pushup', label: 'Ayak yukarı şınav', role: 'main',
        sets: 3, startTarget: 8, rir: 2, unit: 'tekrar' },
      PUSHUP,
      { movementId: 'bench-dip', label: 'Bench dip (sandalye)', role: 'finisher',
        sets: 2, startTarget: 8, rir: 2, unit: 'tekrar' },
      {
        movementId: 'passive-hang', label: 'Ölü askı', role: 'finisher',
        sets: 3, startTarget: 25, rir: 0, unit: 'saniye', needsBar: true,
        altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
      },
      { movementId: 'hanging-leg-raise', label: 'Hanging leg raise', role: 'main',
        sets: 3, startTarget: 6, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'v-up', altLabel: 'V-up' },
    ],
  },
  {
    index: 7, name: 'Pazar', kind: 'rest',
    focusNote: 'Dinlenme.',
    ropeMinutes: 0, exercises: [],
  },
];

/** MENÜ — reçete değil. Canı çekerse eklenir, program bozulmaz. */
export const MENU: ProgramExercise[] = [
  { movementId: 'mike-tyson-pushup', label: 'Mike Tyson şınav', role: 'technique',
    sets: 3, startTarget: 6, rir: 2, unit: 'tekrar' },
  { movementId: 'scapular-pushup', label: 'Scapular şınav', role: 'technique',
    sets: 3, startTarget: 10, rir: 2, unit: 'tekrar' },
  { movementId: 'uneven-pushup', label: 'Uneven şınav', role: 'main',
    sets: 3, startTarget: 6, rir: 2, unit: 'tekrar' },
  { movementId: 'bodyweight-squat', label: 'Squat', role: 'secondary',
    sets: 3, startTarget: 15, rir: 2, unit: 'tekrar' },
  { movementId: 'side-plank', label: 'Side plank', role: 'finisher',
    sets: 2, startTarget: 25, rir: 0, unit: 'saniye' },
];

export function dayFor(date: Date): ProgramDay {
  // Pazartesi = 1 ... Pazar = 7
  const js = date.getDay();            // 0=Pazar
  const idx = js === 0 ? 7 : js;
  return WEEK[idx - 1]!;
}

/** Bar yoksa alternatifine düşer. */
export function resolveExercise(
  ex: ProgramExercise,
  hasBar: boolean,
): ProgramExercise {
  if (!ex.needsBar || hasBar) return ex;
  if (!ex.altMovementId) return ex;
  return {
    ...ex,
    movementId: ex.altMovementId,
    label: ex.altLabel ?? ex.label,
    needsBar: false,
  };
}
