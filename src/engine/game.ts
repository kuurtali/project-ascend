/**
 * OYUN SİSTEMLERİ — rütbe, seri, boss HP, unvanlar, Ascension Score
 *
 * SECOND_BRAIN bölüm 18'de tasarlanmış ama uygulamada eksik kalan
 * katman. Oyunlaştırma burada süs değil, kullanıcının kendi tarif ettiği
 * motivasyon mekanizması: "kademeleri gördükçe 2 tane daha yapayım
 * diyorum."
 *
 * Anayasa kısıtı (M-3): oyunlaştırma sağlığa zarar veremez.
 *  - Seri HAFTALIK, günlük değil — günlük seri dinlenmeyi cezalandırır
 *  - Deload seriyi kırmaz
 *  - Unvanların yarısı güç değil DİSİPLİN ödüllendirir
 */

import {
  MASTERY_TIERS,
  type MasteryTier,
  type Movement,
  type MovementDatabase,
  type PlayerState,
} from './types';

// ───────────────────────────────────────────────────────── RÜTBE

export const RANK_STAGES = [
  'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Elite', 'Legendary',
] as const;
export type RankStage = typeof RANK_STAGES[number];

export interface Rank {
  stage: RankStage;
  sub: 1 | 2 | 3;
  label: string;
  /** Bir sonraki alt kademeye ilerleme, 0..1 */
  progress: number;
}

/**
 * Rütbe, mastery'ye ulaşılan düğümlerin tier MEDYANINDAN hesaplanır.
 *
 * Ortalama değil: ortalama tek bir yüksek tier düğümle şişirilebilir.
 * Bir tane tuck front lever yapabilmek seni Advanced yapmaz. (D-040)
 */
export function rankOf(db: MovementDatabase, state: PlayerState): Rank {
  const tiers = db.movements
    .filter((m) => state.mastery[m.id]?.tier != null)
    .map((m) => m.tier)
    .sort((a, b) => a - b);

  if (tiers.length === 0) {
    return { stage: 'Beginner', sub: 1, label: 'Beginner I', progress: 0 };
  }

  const mid = Math.floor(tiers.length / 2);
  const median = tiers.length % 2
    ? tiers[mid]!
    : (tiers[mid - 1]! + tiers[mid]!) / 2;

  // tier 0-9 -> 6 aşama × 3 alt kademe = 18 basamak
  const step = Math.min(17, Math.max(0, Math.round(median * 2)));
  const stage = RANK_STAGES[Math.min(5, Math.floor(step / 3))]!;
  const sub = ((step % 3) + 1) as 1 | 2 | 3;

  const nextStep = Math.min(17, step + 1);
  const progress = nextStep === step ? 1 : (median * 2 - step + 1) / 1;

  return {
    stage, sub,
    label: `${stage} ${'I'.repeat(sub)}`,
    progress: Math.max(0, Math.min(1, progress)),
  };
}

// ───────────────────────────────────────────────────────── SERİ

export interface Streak {
  /** Kesintisiz haftalık hedefi tutulan hafta sayısı */
  weeks: number;
  /** Bu haftaki seans sayısı */
  thisWeek: number;
  target: number;
  /** Bu hafta hedef tuttu mu */
  onTrack: boolean;
}

function isoWeekKey(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+t - +yearStart) / 86_400_000 + 1) / 7);
  return `${t.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
}

/**
 * Seri HAFTALIK sayılır, günlük değil.
 *
 * Gerekçe: günlük seri dinlenme gününü cezalandırır ve aşırı antrenmanı
 * ödüllendirir. Bu kullanıcı sağlığına zarar veren bir oyunlaştırma
 * kalıbıdır ve bilinçli olarak reddedilmiştir. (Anayasa M-3)
 */
export function streakOf(state: PlayerState, today = new Date()): Streak {
  const byWeek = new Map<string, Set<string>>();
  for (const log of state.logs) {
    const k = isoWeekKey(new Date(log.date));
    if (!byWeek.has(k)) byWeek.set(k, new Set());
    byWeek.get(k)!.add(log.date);
  }

  const target = state.weeklyTarget;
  const thisKey = isoWeekKey(today);
  const thisWeek = byWeek.get(thisKey)?.size ?? 0;

  // Bu haftadan geriye doğru say. İçinde bulunulan hafta henüz
  // bitmediği için seriyi kırmaz.
  let weeks = 0;
  const cursor = new Date(today);
  let first = true;
  for (let i = 0; i < 260; i++) {
    const key = isoWeekKey(cursor);
    const count = byWeek.get(key)?.size ?? 0;
    if (count >= target) weeks++;
    else if (!first) break;
    first = false;
    cursor.setDate(cursor.getDate() - 7);
  }

  return { weeks, thisWeek, target, onTrack: thisWeek >= target };
}

// ───────────────────────────────────────────────────────── BOSS HP

export interface BossState {
  movement: Movement;
  /** 100 = dokunulmamış, 0 = yenildi */
  hp: number;
  best: number;
  target: number;
  defeated: boolean;
  /** Ön koşullardan kaçı tamam */
  prereqDone: number;
  prereqTotal: number;
}

/**
 * Boss HP = 100 × (1 − ilerleme). Mekanik olarak normal düğümle aynı;
 * sunum farklı. Tamamen psikolojik ama maliyeti sıfır. (18.4)
 */
export function bossStates(db: MovementDatabase, state: PlayerState): BossState[] {
  return db.movements
    .filter((m) => m.isBoss)
    .map((m) => {
      const best = state.mastery[m.id]?.best ?? 0;
      const target = m.mastery.bronze.target;
      const done = m.prerequisites.filter((p) => state.mastery[p]?.tier).length;
      return {
        movement: m,
        hp: Math.max(0, Math.round(100 * (1 - Math.min(1, best / target)))),
        best, target,
        defeated: state.mastery[m.id]?.tier != null,
        prereqDone: done,
        prereqTotal: m.prerequisites.length,
      };
    })
    .sort((a, b) => a.hp - b.hp || a.movement.tier - b.movement.tier);
}

// ───────────────────────────────────────────────────────── UNVANLAR

export interface Title {
  id: string;
  label: string;
  description: string;
  earned: boolean;
  /** 0..1 — kazanılmamışsa ne kadar yakın */
  progress: number;
}

/**
 * Unvanlar başarıya değil KARAKTERE verilir.
 * Yarısı bilerek disiplin ödüllendiriyor: sistem sadece "yasak" koymuyor,
 * doğru davranışı da ödüllendiriyor. (18.9, M-3'ün pozitif tarafı)
 */
export function titlesOf(
  db: MovementDatabase,
  state: PlayerState,
  today = new Date(),
): Title[] {
  const mastered = (tier: MasteryTier) =>
    db.movements.filter((m) => {
      const t = state.mastery[m.id]?.tier;
      return t && MASTERY_TIERS.indexOf(t) >= MASTERY_TIERS.indexOf(tier);
    });

  const streak = streakOf(state, today);
  const lowTierMaster = db.movements.filter(
    (m) => m.tier <= 1 && state.mastery[m.id]?.tier === 'master',
  ).length;
  const mobilityGold = db.movements.filter((m) => m.category === 'mobility');
  const mobilityDone = mobilityGold.filter((m) => {
    const t = state.mastery[m.id]?.tier;
    return t && MASTERY_TIERS.indexOf(t) >= MASTERY_TIERS.indexOf('gold');
  }).length;
  const sessions = new Set(state.logs.map((l) => l.date)).size;

  const mk = (
    id: string, label: string, description: string, cur: number, need: number,
  ): Title => ({
    id, label, description,
    earned: cur >= need,
    progress: Math.min(1, need === 0 ? 0 : cur / need),
  });

  return [
    mk('temelci', 'Temelci', '10 temel hareket master kademesinde',
       lowTierMaster, 10),
    mk('istikrarli', 'İstikrarlı', 'Haftalık hedefi 4 hafta üst üste tuttun',
       streak.weeks, 4),
    mk('sabirli', 'Sabırlı', '12 hafta üst üste hedefi tuttun — asıl iş bu',
       streak.weeks, 12),
    mk('mobilite', 'Mobilite Delisi', 'Tüm mobilite hareketleri altın kademede',
       mobilityDone, mobilityGold.length),
    mk('kayitci', 'Kayıtçı', '50 seans kaydedildi',
       sessions, 50),
    mk('bronzcu', 'Bronz Toplayıcı', '25 harekette en az bronz',
       mastered('bronze').length, 25),
    mk('altinci', 'Altın Avcısı', '10 harekette altın kademe',
       mastered('gold').length, 10),
    mk('askida', 'Askıda Kalan', 'Ölü askı ve aktif askı altın kademede',
       ['passive-hang', 'active-hang'].filter((id) => {
         const t = state.mastery[id]?.tier;
         return t && MASTERY_TIERS.indexOf(t) >= MASTERY_TIERS.indexOf('gold');
       }).length, 2),
  ];
}

// ───────────────────────────────────────────────────── ASCENSION SCORE

export interface Ascension {
  total: number;
  axes: { key: string; label: string; value: number }[];
}

const STRENGTH_CATS = ['push', 'vertical_push', 'pull', 'dips', 'legs'];

/**
 * XP birikimlidir, düşmez. Ascension Score DÜŞEBİLİR — 6 hafta antrenman
 * yapmazsan Consistency düşer. Yani mevcut durumu gösteren tek sayı. (18.8)
 */
export function ascensionOf(
  db: MovementDatabase,
  state: PlayerState,
  today = new Date(),
): Ascension {
  const ratio = (cats: string[]) => {
    const pool = db.movements.filter((m) => cats.includes(m.category));
    if (pool.length === 0) return 0;
    const score = pool.reduce((sum, m) => {
      const t = state.mastery[m.id]?.tier;
      return sum + (t ? (MASTERY_TIERS.indexOf(t) + 1) / 4 : 0);
    }, 0);
    return Math.round(100 * score / pool.length);
  };

  const streak = streakOf(state, today);
  const consistency = Math.min(100, Math.round(100 * streak.weeks / 12));

  const axes = [
    { key: 'strength', label: 'Güç', value: ratio(STRENGTH_CATS) },
    { key: 'mobility', label: 'Mobilite', value: ratio(['mobility']) },
    { key: 'balance', label: 'Denge', value: ratio(['balance']) },
    { key: 'control', label: 'Kontrol', value: ratio(['core', 'elite']) },
    { key: 'conditioning', label: 'Kondisyon', value: ratio(['conditioning']) },
    { key: 'consistency', label: 'İstikrar', value: consistency },
  ];

  return {
    total: Math.round(axes.reduce((s, a) => s + a.value, 0) / axes.length),
    axes,
  };
}
