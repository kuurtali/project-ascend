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
 * Yeni kapıda iki koşul var:
 *
 *   1. **Hacim eşiği** — o hareketten toplamda yeterince yapılmış olmak.
 *      Tek bir iyi gün değil, biriken tekrar. Dokunun gerçekten maruz
 *      kaldığını gösteren şey bu.
 *   2. **Kullanıcının onayı** — sistem önerir, kişi karar verir.
 *
 * Kademe şartı bilerek kaldırıldı (2026-08-20). "Doğrulanmış altın
 * kademe" doğru bir ölçüydü ama anlaşılmıyordu: kullanıcı ekranda
 * neden geçemediğini göremiyordu ve kapı keyfi hissettiriyordu.
 * Anlaşılmayan bir koruma, korumuyor. Tek sayı kaldı: **kaç tekrar.**
 *
 * Kademe bilgisi kaybolmadı — `goldOk` hâlâ hesaplanıyor ve ekranda
 * bilgi olarak duruyor, sadece kapıyı kilitlemiyor.
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

export interface Blocker {
  id: string;
  name: string;
  done: number;
  gate: number;
}

/**
 * Bir düğüm çalışmaya açık mı — yani ÖN KOŞULLARININ hacim eşiği dolmuş mu.
 *
 * Bu, sistemin en temel sağlık kuralı. Onsuz kullanıcı ağaçta istediği
 * düğüme dokunup "tek elle şınav, 400 tekrar" yazabiliyordu. Sayı
 * kaydedilirdi, kademe verilirdi, ve sistem o kişinin tek elle şınav
 * yapabildiğine inanırdı — hiçbiri doğru olmadan.
 *
 * Kilidi açan şey kademe değil **hacim**: bir önceki hareketin hedefini
 * bitirmeden sonrakine geçilmez. Kalistenikte sakatlığın kaynağı da tam
 * olarak bu sıranın atlanması. (D-067)
 *
 * Dönen liste boşsa düğüm açık; doluysa önce onların bitmesi gerekiyor.
 * Sadece DOĞRUDAN ön koşullar bakılır — tüm ata zinciri değil. Zaten
 * onlar da kendi ön koşullarıyla kilitli, ve kullanıcıya gösterilecek
 * şey "sıradaki iş", tüm ağaç değil.
 */
export function volumeBlockers(
  idx: Map<string, Movement>,
  state: PlayerState,
  mv: Movement,
): Blocker[] {
  const out: Blocker[] = [];
  for (const p of mv.prerequisites) {
    const pm = idx.get(p);
    if (!pm) continue;
    const done = volumeDone(state, p);
    const gate = volumeGate(pm);
    if (done < gate) out.push({ id: p, name: pm.name, done, gate });
  }
  // En yakın bitene göre sırala — "az kaldı" olan önce görünsün
  return out.sort((a, b) => (b.done / b.gate) - (a.done / a.gate));
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
  /** Bilgi amaçlı — kapıyı KİLİTLEMEZ, sadece ekranda gösterilir */
  goldOk: boolean;
  /** Hacim eşiği doldu mu. Kalan tek koşul kullanıcının onayı. */
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

  return { track, from, to, done, gate, goldOk, ready: done >= gate };
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
