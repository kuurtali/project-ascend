/**
 * UYARLAMA KURALI — sistemin kalbi.
 *
 * "12 dedim, 10 yaptın" durumunda ne olacağını burası belirler.
 * Statik program yazmıyoruz: her seans bir sonrakini belirler.
 * (SECOND_BRAIN 18.13)
 *
 * Bu dosya, koçun elle yaptığı kararın koda geçmiş hali. Koç
 * olmadan da çalışması gerekir — projenin bir aylık AI erişimine
 * bağımlı kalmaması için. (D-050)
 */

import type { AdaptationVerdict, SetLog } from './types';

export interface AdaptationInput {
  /** Bu seansın hedefi */
  targetReps: number;
  /** Gerçekleşen set değerleri, örn. [12, 12, 10] */
  achieved: number[];
  /** Kullanıcının hissi */
  effort?: 'easy' | 'ok' | 'hard';
  /** Aynı hareketteki önceki seansların hedefleri — plato tespiti için */
  previousTargets?: number[];
}

/** Kaç seans üst üste aynı hedefte kalındıysa eksen değiştirilir. */
export const PLATEAU_SESSIONS = 3;

/**
 * Karar tablosu:
 *
 *  hedefte + kolay        → +2
 *  hedefte + zor/normal   → +1
 *  1-2 altında            → aynı sayı  (kalibrasyon, başarısızlık değil)
 *  3+ altında             → %20 düş
 *  3 seans aynı sayıda    → sayıyı bırak, YOĞUNLUK eksenini değiştir
 */
export function adapt(input: AdaptationInput): AdaptationVerdict {
  const { targetReps, achieved, effort, previousTargets = [] } = input;

  if (achieved.length === 0) {
    return { kind: 'hold', message: 'Kayıt yok, hedef aynı kalıyor.' };
  }

  // Plato: son PLATEAU_SESSIONS seanstır aynı hedefte mi
  const recent = [...previousTargets.slice(-(PLATEAU_SESSIONS - 1)), targetReps];
  const stuck =
    recent.length >= PLATEAU_SESSIONS && recent.every((t) => t === targetReps);

  const min = Math.min(...achieved);
  const gap = targetReps - min;

  if (gap <= 0) {
    // Tüm setler hedefte veya üstünde
    if (effort === 'easy') {
      return {
        kind: 'increase',
        delta: 2,
        message: `Tüm setler hedefte ve kolay geldi → hedef ${targetReps + 2}.`,
      };
    }
    return {
      kind: 'increase',
      delta: 1,
      message: `Tüm setler hedefte → hedef ${targetReps + 1}.`,
    };
  }

  if (gap <= 2) {
    if (stuck) {
      return {
        kind: 'changeAxis',
        message:
          `${PLATEAU_SESSIONS} seans ${targetReps} hedefinde takıldın. ` +
          'Sayıyı bırakıyoruz: aynı hareketi 3-1-3 tempoda yap ' +
          `(${Math.max(3, Math.round(targetReps * 0.6))} tekrar). ` +
          'Aynı hareket ~%40 daha zor olur, plato kırılır.',
      };
    }
    return {
      kind: 'hold',
      message:
        `Hedefin ${gap} altında kaldın → hedef ${targetReps} olarak kalıyor. ` +
        'Bu başarısızlık değil, kalibrasyon.',
    };
  }

  const reduced = Math.max(1, Math.round(targetReps * 0.8));
  return {
    kind: 'reduce',
    delta: targetReps - reduced,
    message: `Hedefin ${gap} altında → hedef ${reduced}'e iniyor, temelden kuruyoruz.`,
  };
}

/** Bir sonraki seansın hedef tekrarı. */
export function nextTarget(input: AdaptationInput): number {
  const v = adapt(input);
  switch (v.kind) {
    case 'increase': return input.targetReps + v.delta;
    case 'reduce':   return input.targetReps - v.delta;
    case 'changeAxis': return Math.max(3, Math.round(input.targetReps * 0.6));
    case 'hold':     return input.targetReps;
  }
}

/**
 * Bir hareketin geçmiş kayıtlarından uyarlama girdisi üretir.
 * Böylece UI sadece "sonraki hedef ne" diye sorar.
 */
export function buildInput(
  movementId: string,
  logs: SetLog[],
  currentTarget: number,
): AdaptationInput {
  const own = logs
    .filter((l) => l.movementId === movementId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const last = own.at(-1);
  return {
    targetReps: currentTarget,
    achieved: last?.values ?? [],
    effort: last?.effort,
    // Hedef geçmişini kayıtlardan çıkaramıyoruz; en iyi yaklaşım
    // her seansın minimum setini hedef sayımı olarak kullanmak.
    previousTargets: own.slice(-PLATEAU_SESSIONS).map((l) => Math.min(...l.values)),
  };
}
