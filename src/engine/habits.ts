/**
 * SÜREKLİLİK KATMANI — sayının değil, gitmenin takibi
 *
 * Ağaç "ne kadar güçlüsün" sorusunu ölçüyor. Ama bir yıl boyunca
 * sonucu belirleyen soru o değil: **kaç gün ortaya çıktın.**
 *
 * Bu ikisi farklı ölçüler ve farklı arayüz istiyorlar. Beceri işi
 * sayı ister — kaç tekrar, hangi kademe, ne kadar kaldı. Temel
 * hareketler ise sadece **yapıldı / yapılmadı** ister. "Bugün şınav
 * çektim" için üç set kutusu doldurmak, yapılmama sebebidir.
 *
 * Alan araştırmasının en tekrar eden bulgusu da bu yönde: terk etme
 * sebeplerinin başında zaman alan elle giriş geliyor. Bir alışkanlığı
 * ölçmek istiyorsan ölçümü alışkanlıktan ucuz tutacaksın.
 *
 * Kasten yapılmayanlar:
 *
 * - **Günlük seri yok.** Aralık kullanıcının: "2 günde bir" diyorsan
 *   ikinci gün geciktirme değil, planın kendisi. Günlük seri dinlenme
 *   gününü cezalandırır ve aşırı antrenmanı ödüllendirir.
 * - **Kademeye ve XP'ye girmez.** İşaretlemek tekrar sayısı üretmez;
 *   ağaç yalan söylemesin. Tekrar girmek isteyen seansa girer.
 * - **Kırılan zincir sıfırlanmaz.** Görünen şey "kaç gündür
 *   sürdürüyorsun"; kaçırınca sayaç düşer ama geçmiş silinmez.
 *   (D-064)
 */

import type { HabitDef, PlayerState } from './types';

/**
 * Varsayılan temel hareketler.
 *
 * Seçim ölçütü: ekipmansız ya da her yerde bulunabilir, öğrenme
 * eğrisi yok, ve bırakıldığında ilk kaybedilen şeyler. Salon da
 * burada çünkü sürekliliği en kırılgan olan o — 30 dakikalık yol
 * her hafta yeniden karar vermeyi gerektiriyor.
 */
export const DEFAULT_HABITS: HabitDef[] = [
  { id: 'h-pushup', label: 'Şınav', everyDays: 2 },
  { id: 'h-dips', label: 'Dips', everyDays: 2 },
  { id: 'h-squat', label: 'Squat', everyDays: 2 },
  { id: 'h-gym', label: 'Salon', everyDays: 3 },
];

export function habitsOf(state: PlayerState): HabitDef[] {
  return state.habits ?? DEFAULT_HABITS;
}

function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dayNo(iso: string): number {
  return Math.floor(new Date(`${iso}T00:00:00Z`).getTime() / 86_400_000);
}

/** O alışkanlığın işaretlendiği günler, eskiden yeniye */
export function datesOf(state: PlayerState, habitId: string): string[] {
  return [...new Set(
    (state.habitLog ?? []).filter((h) => h.habitId === habitId).map((h) => h.date),
  )].sort();
}

/** Son işaretlemeden bu yana kaç gün. Hiç yoksa Infinity. */
export function daysSince(
  state: PlayerState, habitId: string, today = new Date(),
): number {
  const last = datesOf(state, habitId).at(-1);
  if (!last) return Infinity;
  return Math.max(0, dayNo(isoOf(today)) - dayNo(last));
}

export function doneToday(
  state: PlayerState, habitId: string, today = new Date(),
): boolean {
  return datesOf(state, habitId).includes(isoOf(today));
}

/** Aralık dolmuş mu — bugün yapılması bekleniyor mu */
export function isDue(
  state: PlayerState, habit: HabitDef, today = new Date(),
): boolean {
  if (doneToday(state, habit.id, today)) return false;
  return daysSince(state, habit.id, today) >= habit.everyDays;
}

/** Aralık aşıldı mı — gecikmiş sayılır */
export function isLate(
  state: PlayerState, habit: HabitDef, today = new Date(),
): boolean {
  const d = daysSince(state, habit.id, today);
  return Number.isFinite(d) && d > habit.everyDays;
}

/**
 * Kaç gündür kesintisiz sürdürülüyor.
 *
 * "Kesintisiz" = ardışık iki işaretleme arasında aralıktan fazla
 * boşluk yok. Sayı GÜN cinsinden, işaretleme sayısı cinsinden değil:
 * "14 gündür sürdürüyorsun" cümlesi "7 kez yaptın"dan daha çok şey
 * anlatıyor ve farklı aralıklı alışkanlıklar arasında karşılaştırılabilir.
 */
export function chainDays(
  state: PlayerState, habit: HabitDef, today = new Date(),
): number {
  const dates = datesOf(state, habit.id);
  if (dates.length === 0) return 0;

  // Zincir bugüne kadar canlı mı: son işaretlemeden bu yana aralık
  // aşılmadıysa evet. Aşıldıysa zincir kopmuştur, 0.
  if (daysSince(state, habit.id, today) > habit.everyDays) return 0;

  let start = dayNo(dates[dates.length - 1]!);
  for (let i = dates.length - 1; i > 0; i--) {
    const gap = dayNo(dates[i]!) - dayNo(dates[i - 1]!);
    if (gap > habit.everyDays) break;
    start = dayNo(dates[i - 1]!);
  }
  return dayNo(isoOf(today)) - start + 1;
}

/** Son n günün işaretleri — nokta şeridi için, eskiden yeniye */
export function recentMarks(
  state: PlayerState, habitId: string, days = 14, today = new Date(),
): { date: string; done: boolean }[] {
  const set = new Set(datesOf(state, habitId));
  const out: { date: string; done: boolean }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = isoOf(d);
    out.push({ date: iso, done: set.has(iso) });
  }
  return out;
}

/** İşareti koy ya da kaldır — yanlış dokunuş geri alınabilmeli */
export function toggleHabit(
  state: PlayerState, habitId: string, today = new Date(),
): PlayerState {
  const iso = isoOf(today);
  const log = state.habitLog ?? [];
  const has = log.some((h) => h.habitId === habitId && h.date === iso);
  return {
    ...state,
    habitLog: has
      ? log.filter((h) => !(h.habitId === habitId && h.date === iso))
      : [...log, { habitId, date: iso }],
  };
}
