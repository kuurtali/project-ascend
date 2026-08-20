/**
 * SEANS ÇÖZÜCÜ — şablon + ağaç durumu → bugün gerçekten ne yapılacak
 *
 * Bu dosya, sistemin en büyük açık vaadini kapatıyor. Terfi şimdiye kadar
 * yalnızca İlerleme ekranında duyuruluyordu; Bugün ekranı sabit şablonu
 * okuduğu için altın kademeye çıkınca hiçbir şey değişmiyordu.
 *
 * ÇÖZÜM — şablon ŞEKLİ tarif eder, hareketi motor seçer:
 *   Haftalık şablon "bu gün hangi nitelik çalışılır"ı söyler (elle
 *   tasarlanmıştır ve testlerle korunur). Slotun İÇİNDEKİ hareketi ise
 *   ağaç durumu belirler. Pike şınav altına çıkınca slot kendiliğinden
 *   yoldaki bir sonraki düğüme geçer.
 *
 * Neden şablonu tamamen planlayıcıya bırakmadık: `planTree` kategori
 * başına slot üretiyor ama haftanın şekli (hangi gün ne, ne kadar,
 * hangi sırayla) elle tasarlanmış bir karar ve iyi çalışıyor. İkisini
 * birleştirmek, üretilmiş bir haftadan daha iyi sonuç veriyor.
 *
 * DELOAD burada uygulanıyor: her 6. hafta set sayısı yarıya iner ve
 * ölçüm günü kalkar. Bir yıllık programda planlı hafif hafta şart —
 * yorgunluk sessizce birikir ve bir gün tekrarların düşmesi olarak
 * değil, dirseğin ağrıması olarak ortaya çıkar.
 */

import type {
  Movement, MovementDatabase, PlayerState, SlotRole,
} from './types';
import { isTrainable, tierOf } from './mastery';
import { pathTo } from './planner';
import { applyComeback, comebackOf, type Comeback } from './comeback';
import { offerFor, type PromotionOffer } from './promotion';
import type { ProgramDay, ProgramExercise } from '../program';

/** Kaç haftada bir hafif hafta */
export const DELOAD_EVERY = 6;

export interface ResolvedExercise extends ProgramExercise {
  /** Şablondaki hareket terfi ettiyse eskisi burada */
  promotedFrom?: string;
  /** Bar olmadığı için alternatife düştüyse */
  substituted?: boolean;
}

export interface ResolvedDay {
  day: ProgramDay;
  exercises: ResolvedExercise[];
  /** Bu hafta deload mu */
  deload: boolean;
  /** Antrenmana başlayalı kaçıncı hafta (1'den başlar, kayıt yoksa 0) */
  weekNo: number;
  /** Deload haftasında ölçüm yapılmaz */
  isTestDay: boolean;
  /** Ara verip dönüldüyse hafifletme bilgisi */
  comeback: Comeback;
}

// ─────────────────────────────────────────────────────────── HAFTA SAYACI

function isoDay(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/**
 * İlk kayıttan bu yana kaçıncı hafta. Kayıt yoksa 0.
 *
 * Takvim haftası değil, KULLANICININ haftası: ilk antrenman hangi gün
 * yapıldıysa hafta oradan sayılır. Salı başlayan biri için 6. hafta
 * yine 6 hafta sonra gelir.
 */
export function weekNumber(state: PlayerState, today = new Date()): number {
  if (state.logs.length === 0) return 0;
  const first = state.logs
    .map((l) => l.date)
    .sort()[0]!;
  const days = isoDay(today) - isoDay(new Date(first));
  return Math.floor(days / 7) + 1;
}

/** Her DELOAD_EVERY haftada bir hafif hafta. İlk hafta asla deload olmaz. */
export function isDeloadWeek(state: PlayerState, today = new Date()): boolean {
  const w = weekNumber(state, today);
  return w > 1 && w % DELOAD_EVERY === 0;
}

/** Deload'a kaç hafta kaldı — 0 ise bu hafta deload */
export function weeksToDeload(state: PlayerState, today = new Date()): number {
  const w = weekNumber(state, today);
  if (w === 0) return DELOAD_EVERY;
  if (isDeloadWeek(state, today)) return 0;
  return DELOAD_EVERY - (w % DELOAD_EVERY);
}

// ─────────────────────────────────────────────────────── SLOT ÇÖZÜMLEME

/**
 * Bir slot hedefe bağlıysa (track), ağaçtaki sıradaki uygun düğümü seçer.
 *
 * findMain zaten "kademe kazanılmamış + çalışılabilir ilk düğüm"ü veriyor;
 * yani bir hareket altına çıkıp doğrulanınca kendiliğinden atlanıyor ve
 * slot bir üste kayıyor. Terfi tam olarak bu.
 */
function trackedMovement(
  _db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  ex: ProgramExercise,
): Movement | null {
  if (!ex.track) return null;

  // Artık ÇIKARIM YOK. Kullanıcının o daldaki yeri kayıtlı bir gerçek;
  // sistem oraya kendiliğinden dokunmaz, sadece önerir. (D-064)
  //
  // Eskiden burası "altın kademeye ulaşıldıysa bir üste kay" diyordu
  // ve slot bir sabah kendiliğinden değişiyordu. İki sorunu vardı:
  // kapı tek bir sayıya bakıyordu (dokunun uyumu için yetersiz), ve
  // karar kullanıcının değildi.
  const at = state.trackAt?.[ex.track];
  if (!at || at === ex.movementId) return null;
  return idx.get(at) ?? null;
}

/**
 * Bugünün gerçek egzersiz listesi.
 *
 * Sıra: hedef takibi → ekipman düşürme → deload ayarı.
 * Ekipman en sonda değil ortada, çünkü terfi edilen hareket de bar
 * gerektirebilir ve onun da alternatifi bulunmalı.
 */
export function resolveDay(
  db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  day: ProgramDay,
  hasBar: boolean,
  today = new Date(),
): ResolvedDay {
  const deload = isDeloadWeek(state, today);
  const comeback = comebackOf(state, today);

  const exercises = day.exercises.map((ex): ResolvedExercise => {
    let out: ResolvedExercise = { ...ex };

    // 1) Hedefe bağlı slot ilerledi mi
    const next = trackedMovement(db, idx, state, ex);
    if (next && next.id !== ex.movementId) {
      out = {
        ...out,
        movementId: next.id,
        label: next.name,
        startTarget: next.mastery.bronze.target,
        promotedFrom: ex.movementId,
        needsBar: next.equipment.includes('pullup-bar')
               || next.equipment.includes('dip-station'),
        altMovementId: ex.altMovementId,
        altLabel: ex.altLabel,
      };
    }

    // 2) Ekipman yoksa alternatife düş
    if (out.needsBar && !hasBar && out.altMovementId) {
      const alt = idx.get(out.altMovementId);
      out = {
        ...out,
        movementId: out.altMovementId,
        label: out.altLabel ?? alt?.name ?? out.label,
        needsBar: false,
        substituted: true,
      };
    }

    // 3) Deload: set sayısı yarıya iner, hedef tekrar AYNI kalır.
    //    Amaç dinlenmek değil yorgunluğu boşaltmak; tekrarı düşürmek
    //    hareketi de kolaylaştırır ve uyaranı tamamen keser.
    if (deload) {
      out = { ...out, sets: Math.max(1, Math.round(out.sets / 2)) };
    }

    // 4) Geri dönüş: burada tam TERSİ yapılır — set sayısı korunur,
    //    HEDEF düşer. Ara verdikten sonra sorun hacim değil, tek
    //    sette çıkarabildiğin sayı. Deload'da yorgunluk boşaltılır,
    //    geri dönüşte seviye yeniden bulunur; iki farklı problem.
    if (comeback.level !== 'none') {
      out = { ...out, startTarget: applyComeback(out.startTarget, comeback) };
    }

    return out;
  });

  return {
    day,
    exercises,
    deload,
    weekNo: weekNumber(state, today),
    // Deload haftasında ve geri dönüşte maksimum denenmez
    isTestDay: !!day.isTestDay && !deload && comeback.level === 'none',
    comeback,
  };
}

// ─────────────────────────────────────────────────────────── TERFİ ÖZETİ

export interface Promotion {
  from: Movement;
  to: Movement;
  role: SlotRole;
}

/**
 * Şablondaki hedefe bağlı slotlardan hangileri terfi etti.
 * İlerleme ekranı bunu gösteriyor; artık gerçekten olan bir şeyi.
 */
export function promotionsOf(
  db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  week: readonly ProgramDay[],
): Promotion[] {
  const seen = new Set<string>();
  const out: Promotion[] = [];

  for (const day of week) {
    for (const ex of day.exercises) {
      if (!ex.track || seen.has(ex.movementId)) continue;
      seen.add(ex.movementId);

      const from = idx.get(ex.movementId);
      const to = trackedMovement(db, idx, state, ex);
      if (from && to && to.id !== from.id) {
        out.push({ from, to, role: ex.role });
      }
    }
  }
  return out;
}

/**
 * Haftadaki hedefe bağlı slotların terfi durumu.
 *
 * Hazır olmayanlar da döner — "ne kadar kaldı" göstergesi motivasyonun
 * asıl kaynağı, ve kapıyı görünmez tutmak onu keyfi hissettirir.
 */
export function offersOf(
  db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  week: readonly ProgramDay[],
  today = new Date(),
): PromotionOffer[] {
  const seen = new Set<string>();
  const out: PromotionOffer[] = [];

  for (const day of week) {
    for (const ex of day.exercises) {
      if (!ex.track || seen.has(ex.track)) continue;
      seen.add(ex.track);
      const o = offerFor(db, idx, state, ex.track, ex.movementId, today);
      if (o) out.push(o);
    }
  }
  return out;
}

/** Bir slotun hedefine kaç düğüm kaldı — "yol haritası" göstergesi */
export function stepsToGoal(
  db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  goalId: string,
): { done: number; total: number; next: Movement | null } {
  const path = pathTo(db, idx, goalId);
  const done = path.filter((m) => tierOf(state, m) != null).length;
  return {
    done,
    total: path.length,
    next: path.find((m) => tierOf(state, m) == null && isTrainable(state, m)) ?? null,
  };
}
