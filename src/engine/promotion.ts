/**
 * TERFİ KAPISI — kim ilerlediğine karar veriyor
 *
 * Önceki hâlde sistem kendi karar veriyordu: bir hareket altın kademeye
 * ulaşınca slot sessizce bir üst düğüme kayıyordu. İki sorunu vardı.
 *
 * **Kapı çok ucuzdu.** Altın eşiği tek bir sayı: pike şınavda 12. On iki
 * tekrarı 14 gün içinde iki kez yapan biri bir üst harekete geçiyordu.
 * Ama bir hareketi "yapabilmek" ile o hareketin dokusunu ve motor
 * kalıbını oturtmuş olmak aynı şey değil. Tendon ve bağ dokusu kastan
 * yavaş uyum sağlar; kas 12'yi çıkarabildiğinde eklem hâlâ geride olur.
 * Erken geçiş kalistenikte sakatlığın en yaygın sebebi.
 *
 * **Karar kullanıcının değildi.** Kişi kendi hazır olduğunu hisseder;
 * sistem bunu bilemez. Ekranda bir sabah yeni bir hareket belirmesi
 * ilerleme gibi değil, kontrolü kaybetmek gibi geliyor.
 *
 * Yeni kapıda üç koşul var ve üçü de gerekli:
 *
 *   1. **Doğrulanmış altın kademe** — 14 gün içinde iki ayrı seansta.
 *      Şanslı tek gün kapıyı açmaz.
 *   2. **Hacim eşiği** — o hareketten toplamda yeterince yapılmış olmak.
 *      Kalite tek başına yetmiyor; tekrar sayısı dokunun gerçekten
 *      maruz kaldığını gösteriyor.
 *   3. **Kullanıcının onayı** — sistem önerir, kişi karar verir.
 *
 * Kullanıcının ağaçtaki yeri artık bir çıkarım değil, kayıtlı bir
 * gerçek: `state.trackAt`. Sistem oraya kendiliğinden dokunmaz. (D-064)
 */

import type {
  Movement, MovementDatabase, PlayerState, SetLog,
} from './types';
import { MASTERY_TIERS } from './types';
import { isTrainable, verifiedTierOf } from './mastery';
import { pathTo } from './planner';

/**
 * Hacim eşiği kaç seanslık çalışmaya denk gelsin.
 *
 * Sekiz seans, haftada iki kez çalışılan bir hareket için ~4 hafta
 * demek. Bu süre keyfi değil: tendon uyumu üzerine yapılan çalışmalar
 * ölçülebilir değişimin haftalar mertebesinde olduğunu, kas kuvvetinin
 * ise günler-haftalar içinde arttığını gösteriyor. Yani kas hazır
 * olduktan sonra bağ dokusunun yakalaması için ek zaman gerekiyor —
 * hacim eşiği tam olarak o zamanı satın alıyor.
 */
export const VOLUME_SESSIONS = 8;

/**
 * Bir hareketin hacim kapısı.
 *
 * altın hedef × altın set sayısı × 8 seans
 *
 * Pike şınav için: 12 × 3 × 8 = **288 tekrar.**
 * Duvar handstand için: 60sn × 1 × 8 = **480 saniye.**
 *
 * Eşik hareketin kendi zorluğundan türüyor, sabit bir sayı değil —
 * zor hareketlerde daha az tekrar gerekir ve formül bunu kendiliğinden
 * yapar, çünkü zor hareketin altın hedefi zaten düşüktür.
 */
export function volumeGate(mv: Movement): number {
  return mv.mastery.gold.target * mv.mastery.gold.sets * VOLUME_SESSIONS;
}

/**
 * O harekette toplanan hacim.
 *
 * Kalibrasyon kaydı sayılmaz: o tek setlik bir maksimum ölçümü, biriken
 * çalışma değil. Sayılsaydı hiç çalışılmamış bir hareket kapıya bedava
 * yaklaşırdı.
 */
export function volumeDone(state: PlayerState, movementId: string): number {
  return state.logs
    .filter((l: SetLog) => l.movementId === movementId && l.kind !== 'calibration')
    .reduce((n, l) => n + l.values.reduce((a, b) => a + b, 0), 0);
}

/** Doğrulanmış altın kademeye ulaşıldı mı */
export function goldVerified(
  mv: Movement, state: PlayerState, today = new Date(),
): boolean {
  const logs = state.logs.filter((l) => l.movementId === mv.id);
  const { tier } = verifiedTierOf(mv, logs, today);
  if (!tier) return false;
  return MASTERY_TIERS.indexOf(tier) >= MASTERY_TIERS.indexOf('gold');
}

/** Kullanıcının bu dalda bulunduğu hareket. Kayıt yoksa şablonunki. */
export function currentOf(
  state: PlayerState, track: string, fallbackId: string,
): string {
  return state.trackAt?.[track] ?? fallbackId;
}

/** Yoldaki bir sonraki çalışılabilir düğüm */
export function nextOnTrack(
  db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  track: string,
  currentId: string,
): Movement | null {
  const path = pathTo(db, idx, track);
  const at = path.findIndex((m) => m.id === currentId);
  if (at < 0) return null;
  for (const mv of path.slice(at + 1)) {
    if (isTrainable(state, mv)) return mv;
  }
  return null;
}

export interface PromotionOffer {
  /** Hedef düğüm id'si — dalın adı */
  track: string;
  from: Movement;
  to: Movement;
  done: number;
  gate: number;
  goldOk: boolean;
  /** Üç koşul da tamam mı */
  ready: boolean;
}

/** Bir dal için terfi durumu. Sıradaki düğüm yoksa null. */
export function offerFor(
  db: MovementDatabase,
  idx: Map<string, Movement>,
  state: PlayerState,
  track: string,
  fallbackId: string,
  today = new Date(),
): PromotionOffer | null {
  const currentId = currentOf(state, track, fallbackId);
  const from = idx.get(currentId);
  if (!from) return null;

  const to = nextOnTrack(db, idx, state, track, currentId);
  if (!to) return null;

  const done = volumeDone(state, currentId);
  const gate = volumeGate(from);
  const goldOk = goldVerified(from, state, today);

  return { track, from, to, done, gate, goldOk, ready: goldOk && done >= gate };
}

/** Kullanıcı "geçelim" dedi — dalın konumunu ilerlet. */
export function acceptPromotion(
  state: PlayerState, track: string, toId: string,
): PlayerState {
  return { ...state, trackAt: { ...(state.trackAt ?? {}), [track]: toId } };
}

/**
 * Kullanıcı kendi yerini elle de ayarlayabilir — geri almak dâhil.
 * "Erken geçmişim" diyebilmek, geçememekten daha önemli.
 */
export const setTrack = acceptPromotion;
