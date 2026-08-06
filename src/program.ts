/**
 * HAFTALIK PROGRAM ŞABLONU
 *
 * v2 — bu şablon, kullanıcının BAŞKA antrenmanlar da yaptığı varsayımıyla
 * kuruldu (ağırlık, spor dalı, koşu — hangisi olursa). Kalistenik tek
 * başına bir hayat programı değil; başka yükün yanında çalışabilmesi
 * gerekiyor. Tasarımın tamamı bu kısıttan çıkıyor.
 *
 * YAPI — 3 sert / 2 hafif / 2 boş:
 *   1·3·5   BECERİ günü (15-20 dk, taze). Aynı gün başka antrenman
 *           yapılacaksa kalistenik ÖNCE gelir.
 *   2·6     HAFİF gün (25-30 dk, başarısızlığa gitmez)
 *   4·7     tamamen dinlenme
 *
 * NEDEN BECERİ ÖNCE: pike şınav, negatif barfiks ve skapular iş motor
 * öğrenmedir. Yorgunken yapılırsa yanlış kalıp öğrenilir. Ağır bir itme
 * seansından sonra pike şınav hem işe yaramaz hem risklidir.
 *
 * NEDEN YÜK AYNI GÜNE TOPLANIR: kalistenik ve diğer antrenman ayrı
 * günlere dağıtılırsa haftada 6 antrenman günü olur ve dirsek, bilek,
 * omuz hiçbir gün tamamen boşta kalmaz. Kas 48 saatte toparlanır, tendon
 * ve bağ dokusu daha yavaş — sakatlık oradan gelir. Yükü toplayınca
 * 3 sert + 4 boş gün oluyor; yıllarca taşınabilen tek düzen bu.
 *
 * NEDEN YİNE DE 2 HAFİF GÜN: beceri SIKLIK ister. Haftada 3 kez pike
 * şınav ile 5 kez arasında öğrenme farkı var. Hafif günler hacim değil
 * temas için — RIR yüksek, başarısızlık yok.
 *
 * İTME HACMİ ÇAKIŞMASI: kullanıcı ağırlık da çalışıyorsa bench ve omuz
 * press aynı dokuyu vuruyor. Bu yüzden buradaki itme işi hacim değil
 * BECERİ olarak kuruldu: az set, düşük tekrar, yüksek kalite.
 *
 * BACAK: burada minimum. Ağırlık antrenmanı bacağı kalistenikten çok
 * daha iyi karşılıyor; ağacın bacak kolu öncelik değil, menüde duruyor.
 * Ağırlık çalışmayan biri menüden squat ekleyebilir.
 *
 * Hedef tekrarlar BURADA SABİT DEĞİL — sadece başlangıç değerleri.
 * Sonraki hedefler `engine/adaptation.ts` tarafından kayıttan hesaplanır.
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
  /** Neden bu hareket burada — ekranda gösterilir */
  why?: string;
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

// ───────────────────────────────────────────────── ORTAK BLOKLAR

const WRIST: ProgramExercise = {
  movementId: 'wrist-mobility', label: 'Bilek hazırlığı', role: 'technique',
  sets: 1, startTarget: 120, rir: 0, unit: 'saniye',
  why: 'Handstand yolunun ön koşulu. Bilekte sorun geçmişi varsa atlanmaz.',
};

const SCAP_PULL: ProgramExercise = {
  movementId: 'scapular-pullup', label: 'Skapular çekiş', role: 'technique',
  sets: 3, startTarget: 8, rir: 3, unit: 'tekrar', needsBar: true,
  altMovementId: 'scapular-pushup', altLabel: 'Skapular şınav',
  why: 'Barfiksin gerçek ön koşulu. Kürek kemiğini kontrol edemeden çekiş öğrenilmez.',
};

const HANG: ProgramExercise = {
  movementId: 'passive-hang', label: 'Ölü askı', role: 'finisher',
  sets: 3, startTarget: 25, rir: 0, unit: 'saniye', needsBar: true,
  altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
  why: 'Kavrama ve omuz sağlığı. Bedava kazanç, yorucu değil.',
};

const HOLLOW: ProgramExercise = {
  movementId: 'hollow-hold', label: 'Hollow hold', role: 'main',
  sets: 3, startTarget: 30, rir: 2, unit: 'saniye',
  why: 'Front lever ve handstand aynı gövde gerginliğini ister.',
};

// ───────────────────────────────────────────────── HAFTA

export const WEEK: ProgramDay[] = [
  {
    index: 1, name: 'Pazartesi', kind: 'heavy', isTestDay: true,
    focusNote: 'Beceri önce, taze kafayla. Ölçüm günü: pike şınavda bir seti '
             + 'sonuna kadar götürebilirsin. Bugün ayrıca ağırlık çalışacaksan '
             + 'buradan sonra.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      {
        movementId: 'pike-pushup', label: 'Pike şınav', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar',
        why: 'HSPU yolunun ilk gerçek adımı. Omuz taze iken yapılır.',
      },
      {
        movementId: 'negative-pullup', label: 'Negatif barfiks', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
        why: 'Az sayıda barfiks çekebilen biri için tekrarı en hızlı büyüten yol.',
      },
      SCAP_PULL,
      HOLLOW,
    ],
  },
  {
    index: 2, name: 'Salı', kind: 'light',
    focusNote: 'Hafif ev günü. Hiçbir sette zorlanma — burada amaç sıklık, hacim değil.',
    ropeMinutes: 8,
    exercises: [
      WRIST,
      {
        movementId: 'pushup', label: 'Şınav', role: 'secondary',
        sets: 3, startTarget: 15, rir: 4, unit: 'tekrar',
        why: 'Rahat setler. Dün sert gündü, burada yorulmak istemiyoruz.',
      },
      HANG,
      SCAP_PULL,
      {
        movementId: 'dead-bug', label: 'Dead bug', role: 'finisher',
        sets: 3, startTarget: 12, rir: 3, unit: 'tekrar',
        why: 'Bel korumalı gövde işi. Hollow’un hafif kardeşi.',
      },
    ],
  },
  {
    index: 3, name: 'Çarşamba', kind: 'heavy',
    focusNote: 'Beceri günü. Ağır iş burada, taze kafayla.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      {
        movementId: 'parallel-bar-dip', label: 'Dips', role: 'main',
        sets: 3, startTarget: 6, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'bench-dip', altLabel: 'Bench dip (sandalye)',
        why: 'Muscle-up’ın itme yarısı buradan geçiyor.',
      },
      {
        movementId: 'negative-pullup', label: 'Negatif barfiks', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
        why: 'Haftada 3 kez çekiş — barfiks sıklıkla gelir, ağırlıkla değil.',
      },
      SCAP_PULL,
      {
        movementId: 'tuck-l-sit', label: 'Tuck L-sit', role: 'main',
        sets: 3, startTarget: 15, rir: 2, unit: 'saniye',
        why: 'L-sit’e giden yol. Kalça fleksörü ve gövde birlikte.',
      },
    ],
  },
  {
    index: 4, name: 'Perşembe', kind: 'rest',
    focusNote: 'Tam dinlenme. Yürüyüş veya hafif koşu olur — antrenman değil.',
    ropeMinutes: 0, exercises: [],
  },
  {
    index: 5, name: 'Cuma', kind: 'heavy',
    focusNote: 'Haftanın son sert günü. Beceri önce.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      {
        movementId: 'pike-pushup', label: 'Pike şınav', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar',
        why: 'Haftanın ikinci HSPU dozu. Pazartesiden az, teknik odaklı.',
      },
      {
        movementId: 'negative-pullup', label: 'Negatif barfiks', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
      },
      SCAP_PULL,
      HOLLOW,
    ],
  },
  {
    index: 6, name: 'Cumartesi', kind: 'light',
    focusNote: 'Hafif ev günü. İp uzun, güç işi kısa.',
    ropeMinutes: 12,
    exercises: [
      WRIST,
      {
        movementId: 'decline-pushup', label: 'Ayak yukarı şınav', role: 'technique',
        sets: 3, startTarget: 8, rir: 4, unit: 'tekrar',
        why: 'Omuzu dikeye yaklaştırır — HSPU açısına alıştırır. Zorlanmadan.',
      },
      HANG,
      {
        movementId: 'hanging-knee-raise', label: 'Asılı diz çekme', role: 'secondary',
        sets: 3, startTarget: 8, rir: 3, unit: 'tekrar', needsBar: true,
        altMovementId: 'reverse-crunch', altLabel: 'Reverse crunch',
        why: 'Kavrama + gövde bir arada. Front lever’a giden yolda.',
      },
    ],
  },
  {
    index: 7, name: 'Pazar', kind: 'rest',
    focusNote: 'Tam dinlenme. Yıllarca sürdürmenin bedeli bu gün.',
    ropeMinutes: 0, exercises: [],
  },
];

/** Menü — canı çekerse ekleyeceği hareketler */
export const MENU: ProgramExercise[] = [
  { movementId: 'mike-tyson-pushup', label: 'Mike Tyson şınav', role: 'technique',
    sets: 3, startTarget: 6, rir: 2, unit: 'tekrar' },
  { movementId: 'scapular-pushup', label: 'Skapular şınav', role: 'technique',
    sets: 3, startTarget: 10, rir: 2, unit: 'tekrar' },
  { movementId: 'uneven-pushup', label: 'Uneven şınav', role: 'main',
    sets: 3, startTarget: 6, rir: 2, unit: 'tekrar' },
  { movementId: 'diamond-pushup', label: 'Elmas şınav', role: 'secondary',
    sets: 3, startTarget: 8, rir: 2, unit: 'tekrar' },
  { movementId: 'bodyweight-squat', label: 'Squat', role: 'secondary',
    sets: 3, startTarget: 15, rir: 2, unit: 'tekrar' },
  { movementId: 'side-plank', label: 'Side plank', role: 'finisher',
    sets: 2, startTarget: 25, rir: 0, unit: 'saniye' },
  { movementId: 'wall-walk', label: 'Duvar yürüyüşü', role: 'technique',
    sets: 3, startTarget: 3, rir: 2, unit: 'tekrar' },
];

export function dayFor(date: Date): ProgramDay {
  // Pazartesi = 1 ... Pazar = 7
  const js = date.getDay();            // 0=Pazar
  const idx = js === 0 ? 7 : js;
  return WEEK[idx - 1]!;
}

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
