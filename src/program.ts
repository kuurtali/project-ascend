/**
 * HAFTALIK PROGRAM ŞABLONU — salon + kalistenik, 1 yıl ufku
 *
 * v2 (2026-08-02). Değişen koşullar: 6 ay sınırı kalktı (en az 1 yıl),
 * haftada 3 gün spor salonu eklendi, evde barfiks ve dips var.
 *
 * YAPI — 3 sert / 2 hafif / 2 boş:
 *   Pzt·Çar·Cum   BECERİ (15-20 dk, TAZE) → sonra salon
 *   Sal·Cmt       HAFİF ev günü (25-30 dk, başarısızlığa gitmez)
 *   Per·Paz       tamamen dinlenme
 *
 * NEDEN BECERİ ÖNCE: pike şınav, negatif barfiks ve skapular iş motor
 * öğrenmedir. Yorgunken yapılırsa yanlış kalıp öğrenilir. Bench'ten sonra
 * pike şınav yapmak omuz zaten bittiği için hem işe yaramaz hem risklidir.
 *
 * NEDEN AYNI GÜN (ayrı gün değil): 3 salon + 3 kalistenik = 6 antrenman
 * günü demekti; hiçbir gün dirsek, bilek ve omuz tamamen boşta kalmıyordu.
 * Kas 48 saatte toparlanır, tendon daha yavaş — sakatlık oradan gelir.
 * Yükü toplayınca 3 sert gün + 4 boş gün oluyor, bir yıl taşınabilir.
 *
 * NEDEN YİNE DE 2 HAFİF GÜN: beceri sıklık ister. Haftada 3 kez pike
 * şınav ile 5 kez arasında öğrenme farkı var. Hafif günler hacim değil
 * SIKLIK için — RIR yüksek, başarısızlık yok.
 *
 * İTME HACMİ ÇAKIŞMASI: salonda bench ve omuz press var. Bu yüzden
 * kalistenik tarafındaki itme işi hacim değil BECERİ olarak kuruldu:
 * az set, düşük tekrar, yüksek kalite. Şınav artık ana hacim kaynağı
 * değil — o iş salona geçti.
 *
 * BACAK: salon karşılıyor. Ağaçtaki bacak dalı öncelik olmaktan çıktı,
 * kalistenik tarafı üst gövde becerisine odaklanıyor. Menüde duruyor.
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
  /** Bu günün ardından salon var mı — ekranda hatırlatılır */
  gym?: 'A' | 'B' | 'C';
}

// ───────────────────────────────────────────────── ORTAK BLOKLAR

const WRIST: ProgramExercise = {
  movementId: 'wrist-mobility', label: 'Bilek hazırlığı', role: 'technique',
  sets: 1, startTarget: 120, rir: 0, unit: 'saniye',
  why: 'Handstand yolunun ön koşulu. Bileğinde kist var, bu atlanmaz.',
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
    index: 1, name: 'Pazartesi', kind: 'heavy', gym: 'A', isTestDay: true,
    focusNote: 'Beceri önce, taze kafayla. Sonra salon — tam vücut A. '
             + 'Ölçüm günü: pike şınavda bir seti sonuna kadar götürebilirsin.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      {
        movementId: 'pike-pushup', label: 'Pike şınav', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar',
        why: 'HSPU yolunun ilk gerçek adımı. Salondan ÖNCE, omuz taze iken.',
      },
      {
        movementId: 'negative-pullup', label: 'Negatif barfiks', role: 'main',
        sets: 3, startTarget: 5, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'australian-row', altLabel: 'Masa kenarı row',
        why: '2 barfiks çekiyorsun; negatif tekrar sayısını en hızlı büyüten yol.',
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
        why: 'Rahat setler. Dün bench yaptın, burada yorulmak istemiyoruz.',
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
    index: 3, name: 'Çarşamba', kind: 'heavy', gym: 'B',
    focusNote: 'Beceri önce. Sonra salon — tam vücut B.',
    ropeMinutes: 5,
    exercises: [
      WRIST,
      {
        movementId: 'parallel-bar-dip', label: 'Dips', role: 'main',
        sets: 3, startTarget: 6, rir: 2, unit: 'tekrar', needsBar: true,
        altMovementId: 'bench-dip', altLabel: 'Bench dip (sandalye)',
        why: 'Evdeki aletle. Muscle-up’ın itme yarısı buradan geçiyor.',
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
    focusNote: 'Tam dinlenme. Canın isterse yürüyüş veya hafif koşu — antrenman değil.',
    ropeMinutes: 0, exercises: [],
  },
  {
    index: 5, name: 'Cuma', kind: 'heavy', gym: 'C',
    focusNote: 'Beceri önce. Sonra salon — tam vücut C. Haftanın son sert günü.',
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
    focusNote: 'Tam dinlenme. Bu gün antrenman yok — bir yıl sürdürmenin bedeli bu.',
    ropeMinutes: 0, exercises: [],
  },
];

/**
 * Salon şablonu — uygulama bunu kaydetmiyor, sadece hatırlatıyor.
 * Ağırlık ilerlemesi salonda kâğıtla/uygulamayla takip edilir; bu sistemin
 * işi beceri ağacı. İlk ay tam vücut, sonra üst/alt bölünmesine geçilecek.
 */
export const GYM_PLAN: Record<'A' | 'B' | 'C', { title: string; items: string[] }> = {
  A: {
    title: 'Tam vücut A',
    items: [
      'Squat — 3×6-8',
      'Bench press — 3×6-8',
      'Barfiks veya lat pulldown — 3×6-10',
      'Romen deadlift — 3×8',
      'Yan plank / karın — 2 set',
    ],
  },
  B: {
    title: 'Tam vücut B',
    items: [
      'Deadlift — 3×5',
      'Omuz press — 3×6-8',
      'Kürek (row) — 3×8-10',
      'Bacak press veya lunge — 3×10',
      'Face pull — 3×15  (omuz sağlığı, atlama)',
    ],
  },
  C: {
    title: 'Tam vücut C',
    items: [
      'Front squat veya goblet squat — 3×8',
      'Eğimli bench — 3×8',
      'Tek kol dumbbell row — 3×10',
      'Biceps + triceps — 2’şer set',
      'Face pull — 3×15',
    ],
  },
};

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
