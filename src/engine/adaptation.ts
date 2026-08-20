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

import type { AdaptationVerdict, OutsideLog, SetLog } from './types';
import { heavyBefore } from './outside';

export interface AdaptationInput {
  /** Bu seansın hedefi */
  targetReps: number;
  /** Gerçekleşen set değerleri, örn. [12, 12, 10] */
  achieved: number[];
  /** Kullanıcının hissi */
  effort?: 'easy' | 'ok' | 'hard';
  /** Aynı hareketteki önceki seansların hedefleri — plato tespiti için */
  previousTargets?: number[];
  /**
   * O seans, program dışı ağır bir yükün hemen ardından mı yapıldı.
   * Doğruysa düşük sayı bir gerileme değil, yorgunluk ölçümüdür.
   */
  fatigued?: boolean;
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
 *
 * Tek istisna: 3+ altında kalınmış AMA seans program dışı ağır bir
 * yükün ardından yapılmışsa hedef düşmez, aynı kalır. Yorgun bir
 * günün ölçüsü kişinin seviyesi değildir; onu kalıcı hedefe çevirmek
 * kilo değişimini güç değişimi sanmakla aynı hata. (D-063)
 *
 * Bu istisna sonsuza kadar sürükleyemez: sürekli tutturulamayan bir
 * hedefte plato kuralı devreye girer ve ekseni değiştirir.
 */
export function adapt(input: AdaptationInput): AdaptationVerdict {
  const { targetReps, achieved, effort, previousTargets = [], fatigued } = input;

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

  // Yorgunluk istisnası — bir kere affeder, iki kere affetmez.
  //
  // `previousTargets` son seansların minimum setlerini taşıyor
  // (buildInput'a bak); sondaki bu seansın kendisi, sondan bir
  // önceki bir önceki seans. Orada da 3+ açık varsa bu artık tek
  // bir kötü gün değil, gerçek bir seviye farkı — dış yükü bahane
  // etmeyi bırakıp hedefi düşürüyoruz. Aksi hâlde sürekli
  // antrenman yapan biri asla ulaşamayacağı bir hedefe kilitlenirdi.
  const prior = previousTargets.at(-2);
  const missedBefore = prior != null && targetReps - prior >= 3;

  if (fatigued && !missedBefore) {
    return {
      kind: 'hold',
      message:
        `Hedefin ${gap} altında kaldın ama son 2 günde program dışı ağır ` +
        `bir seans var. Hedef ${targetReps} olarak kalıyor — yorgun bir ` +
        'günün ölçüsü senin seviyen değil.',
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
 * ÖLÇÜMDEN ÇALIŞMA HEDEFİ — kalibrasyon bir seans değildir
 *
 * Bu fonksiyon olmadan sistem şunu yapıyordu: kullanıcı başlangıç
 * ölçümünde 30 şınav giriyor, uyarlama kuralı bunu "hedefi tuttu"
 * diye okuyor ve ertesi günün hedefini **31** yapıyordu. Yani tek
 * sette çıkardığı maksimumun üstüne üç set. İmkânsız, ve ilk seansı
 * baştan başarısızlığa yazıyor.
 *
 * Karışan iki şey var: ölçüm **tek sette, RIR 0** yapılır; reçete ise
 * **birkaç sette, RIR 2-4**. İkincisi birincisinin epey altında olmak
 * zorunda.
 *
 * Çarpanlar RIR'a göre: rezerv ne kadar çoksa hedef o kadar aşağıda.
 * Aşağı yanılmak bir hafta kaybettirir; yukarı yanılmak tutturulamayan
 * bir seans, ardından %20 düşüş ve moral kaybı demek. O yüzden
 * bilinçli olarak muhafazakâr.
 */
export function targetFromMax(maxValue: number, rir: number): number {
  const f = rir >= 4 ? 0.5 : rir >= 3 ? 0.55 : rir >= 1 ? 0.65 : 0.7;
  return Math.max(1, Math.round(maxValue * f));
}

/**
 * Bir hareketin geçmiş kayıtlarından uyarlama girdisi üretir.
 * Böylece UI sadece "sonraki hedef ne" diye sorar.
 *
 * Kalibrasyon kayıtları geçmişe dâhil edilmez — çağıran taraf onları
 * `targetFromMax` ile ayrı değerlendirir.
 */
export function buildInput(
  movementId: string,
  logs: SetLog[],
  currentTarget: number,
  outside?: OutsideLog[],
): AdaptationInput {
  const own = logs
    .filter((l) => l.movementId === movementId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const last = own.at(-1);
  return {
    targetReps: currentTarget,
    achieved: last?.values ?? [],
    effort: last?.effort,
    // Bugün değil, O SEANSIN gününe bakılır: yorumlanan şey geçmiş
    // bir seansın sonucu, bugünkü his değil.
    fatigued: last ? heavyBefore(outside, last.date) != null : false,
    // Hedef geçmişini kayıtlardan çıkaramıyoruz; en iyi yaklaşım
    // her seansın minimum setini hedef sayımı olarak kullanmak.
    previousTargets: own.slice(-PLATEAU_SESSIONS).map((l) => Math.min(...l.values)),
  };
}
