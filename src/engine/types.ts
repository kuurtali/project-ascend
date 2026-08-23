/**
 * Project Ascend — motor katmanı tipleri
 *
 * Bu katman UI bilmez, DOM bilmez, React bilmez.
 * Girdi: (movements, playerState) · Çıktı: yeni durum veya plan.
 * Sebep: oyun kuralları test edilebilir olmalı ve arayüz yeniden
 * yazımından sağ çıkmalı. (SECOND_BRAIN D-013)
 */

// ─────────────────────────────────────────────── İÇERİK (salt okunur)

export type Category =
  | 'push' | 'vertical_push' | 'explosive' | 'dips' | 'pull' | 'core'
  | 'legs' | 'balance' | 'mobility' | 'conditioning' | 'elite' | 'recovery';

export type MeasureType = 'reps' | 'reps_side' | 'hold' | 'count' | 'dist';

export type MasteryTier = 'bronze' | 'silver' | 'gold' | 'master';

export const MASTERY_TIERS: readonly MasteryTier[] = [
  'bronze', 'silver', 'gold', 'master',
] as const;

/** Slot rolleri. Hareket değil ROL sabittir; hareketler roller arasında
 *  dolaşır. Normal şınav hiç gitmez, terfi eder. (D-046) */
export type SlotRole = 'main' | 'secondary' | 'technique' | 'finisher';

export interface MasteryStep {
  /** Hedef değer — RIR 2'de tanımlıdır. "Altın 15" = "başarısızlığa 2
   *  kala 15", canını dişine takıp 15 değil. (D-049) */
  target: number;
  sets: number;
  xp: number;
}

export interface Movement {
  id: string;
  name: string;
  category: Category;
  tier: number;
  isBoss: boolean;
  isAccessory: boolean;
  measure: { type: MeasureType; unit: string; sets: number };
  equipment: string[];          // OR — biri yeterli
  prerequisites: string[];      // AND — hepsi gerekli
  unlocks: string[];            // türetilmiş
  mastery: Record<MasteryTier, MasteryStep>;
  xp: { base: number; total: number };
  muscles: string[];
  family: string;
  tips: string[];
  commonMistakes: string[];
  depth: number;
}

export interface MovementDatabase {
  schemaVersion: string;
  categories: Record<string, { label: string; color: string }>;
  equipment: Record<string, string>;
  masteryTiers: MasteryTier[];
  levelCurve: { level: number; xpRequired: number }[];
  movements: Movement[];
}

// ─────────────────────────────────────────────── KAYIT (okuma-yazma)

/** Tek bir setin kaydı. */
export interface SetLog {
  movementId: string;
  /** ISO tarih, YYYY-MM-DD */
  date: string;
  /** Set başına değerler, örn. [12, 12, 10] */
  values: number[];
  /** Kullanıcının hissi — uyarlama kuralı bunu kullanır */
  effort?: 'easy' | 'ok' | 'hard';
  note?: string;
  /**
   * Kaydın türü. `calibration` = başlangıç ölçümü, yani TEK SETLİK
   * maksimum (RIR 0). Normal seans kaydı değil ve uyarlama kuralına
   * normal seans gibi verilemez — "hedefi tuttun, +1" çıkarır ve
   * kullanıcı ertesi gün maksimumunun üstüne 3 set yapmaya
   * çalışır. (D-064)
   */
  kind?: 'calibration';
}

export interface MasteryState {
  movementId: string;
  tier: MasteryTier | null;
  /** Kademe doğrulaması: 14 gün içinde 2 ayrı seans (D-015) */
  verifiedSessions: string[];
  best: number;
}

/** Kullanıcı kısıtı. Sistem hareketi YASAKLAMAZ, işaretler —
 *  karar kullanıcınındır. Ama planner yüksek riskli olanı plana
 *  hiç koymaz. */
export interface UserConstraint {
  area: 'wrist' | 'hand' | 'shoulder' | 'elbow' | 'knee' | 'lowBack';
  side: 'left' | 'right' | 'both';
  type: 'hardware' | 'history' | 'chronic';
  /** Plana hiç girmeyecek hareket id'leri */
  excludedMovements: string[];
  clearedByProfessional: boolean;
}

/** Program dışı antrenman türü — hangi dokuya bindiği önemli */
export type OutsideKind =
  | 'legs' | 'push' | 'pull' | 'conditioning' | 'sport' | 'walk' | 'other';

/** 1 hafif · 2 orta · 3 ağır */
export type OutsideLoad = 1 | 2 | 3;

/**
 * Programın dışında yapılan bir antrenman. Kademelere ve XP'ye
 * girmez — bu bir ilerleme kaydı değil, BAĞLAM kaydıdır. (D-063)
 */
export interface OutsideLog {
  /** ISO tarih, YYYY-MM-DD */
  date: string;
  kind: OutsideKind;
  load: OutsideLoad;
  /** Sıçrama/plyometrik içerdi mi — tendon yükü ayrı sayılır */
  plyo?: boolean;
  note?: string;
}

/**
 * Temel hareket alışkanlığı. Sayı tutmaz, gün tutar. Ağaç "ne kadar
 * güçlüsün"ü ölçüyor; bu "kaç gün ortaya çıktın"ı. (D-064)
 */
export interface HabitDef {
  id: string;
  label: string;
  /** Kaç günde bir yapılması planlanıyor */
  everyDays: number;
}

/** Kullanıcının Bugün ekranında izleyeceği genel program şablonu. */
export type ProgramMode = 'skill-week' | 'home-eod';

export interface PlayerState {
  xp: number;
  equipment: string[];
  constraints: UserConstraint[];
  mastery: Record<string, MasteryState>;
  logs: SetLog[];
  /** Haftada kaç antrenman hedefliyor */
  weeklyTarget: number;
  /** Haftada bir gün RIR 0'a çıkılabilir (D-049) */
  testDayOfWeek: number; // 0=Pazar
  /** Başlangıç ölçümü yapıldı mı — ilk açılışta kalibrasyon ekranı */
  calibrated?: boolean;
  /**
   * Kayıt şeması sürümü. Göç yolunu bu belirler (storage.migrate).
   * Yoksa 1 varsayılır — sürüm alanından önceki kayıtlar.
   */
  schemaVersion?: number;
  /** Son dışa aktarma tarihi (ISO). Yedek hatırlatması bunu kullanır. */
  lastExport?: string;
  /** Haftalık vücut ağırlığı — göreli güç sporunda ölçümü etkiler */
  bodyweight?: { date: string; kg: number }[];
  /** Program dışı antrenmanlar — salon, aile seansı, maç, koşu */
  outside?: OutsideLog[];
  /**
   * Her dalda hangi hareketteyim. Anahtar hedef düğüm id'si
   * (`hspu`, `bar-muscle-up`...), değer o an çalışılan hareket.
   *
   * Bu bir ÇIKARIM DEĞİL, kullanıcının kararı. Sistem terfi önerir,
   * buraya yazan kullanıcıdır. Geri almak da serbest. (D-064)
   */
  trackAt?: Record<string, string>;
  /**
   * Hareket başına GEÇERLİ ÇALIŞMA HEDEFİ.
   *
   * Hedef eskiden her açılışta kayıtlardan yeniden türetiliyordu; yani
   * görünür ama dokunulamaz bir sayıydı. Artık açık bir durum: uyarlama
   * kuralı seans sonunda buraya yazıyor, kullanıcı da istediğinde
   * üstüne yazabiliyor. Kural iptal olmadı — önerinin statüsü değişti.
   * (D-067)
   */
  targets?: Record<string, number>;
  /** Temel hareket alışkanlıkları — tanım ve işaretler */
  habits?: HabitDef[];
  habitLog?: { date: string; habitId: string }[];
  /**
   * Şu an çalışılan hareketler. 197 düğümlük bir ağaçta asıl sorun
   * gezinmek değil, **her seferinde aynı beşini bulmak.** Bu liste
   * kullanıcının kendi kısayolu; sistem buraya bir şey eklemez. (D-066)
   */
  focus?: string[];
  /** Varsayılan beceri haftası veya seçilebilir 2-günde-bir ev rutini. */
  programMode?: ProgramMode;
  /** Ev rutini seçildiği gün; 2 günlük ritmin sabit başlangıç noktası. */
  homeRoutineStartedAt?: string;
}

// ─────────────────────────────────────────────── ÇIKTILAR

export interface SlotAssignment {
  role: SlotRole;
  movementId: string;
  /** Reçete: set × hedef */
  sets: number;
  targetReps: number;
  /** Kaç tekrar rezerv bırakılacak */
  rir: number;
  /** Neden bu hareket bu slotta — kullanıcıya gösterilir */
  reason: string;
}

export interface TreePlan {
  category: Category;
  slots: SlotAssignment[];
}

export interface ProximityInfo {
  movementId: string;
  currentTier: MasteryTier | null;
  nextTier: MasteryTier | null;
  best: number;
  nextTarget: number | null;
  /** Kalan mesafe. Günlük motivasyon motoru bu. (D-049) */
  remaining: number | null;
}

export type AdaptationVerdict =
  | { kind: 'increase'; delta: number; message: string }
  | { kind: 'hold'; message: string }
  | { kind: 'reduce'; delta: number; message: string }
  | { kind: 'changeAxis'; message: string };
