/**
 * GEÇMİŞ — "gelişiyor muyum" sorusunun cevabı
 *
 * Projenin var oluş sebeplerinden biri şuydu: *sekiz haftada şınavı
 * 12'den 16'ya çıkardı — gerçek bir kazanç — ama hiçbir yerde
 * yazılmadığı için hissedilmedi.*
 *
 * Uygulama uzun süre bunu yarım çözdü: "bir sonraki kademeye ne kadar
 * kaldı"yı gösteriyordu ama **seni oraya getiren eğriyi** göstermiyordu.
 * Kullanıcının kendi cümlesiyle: "gelişiyor mu anlamadım."
 *
 * Burada iki seri üretiliyor ve ikisi farklı şey ölçüyor:
 *
 *   haftalıkEnİyi   → KAPASİTE. Tek sette çıkarabildiğin sayı.
 *                     Dalgalanır; asıl mesele eğimi.
 *   birikenHacim    → EMEK. Toplanan tekrar. Asla düşmez, ve terfi
 *                     kapısının da göstergesi.
 *
 * Kapasite bazı haftalar geriler — hastalık, yorgunluk, ölçüm gürültüsü.
 * Hacim eğrisi ise hep yukarı gider. Kötü bir hafta geçiren birinin
 * bakması gereken grafik ikincisi. (D-067)
 */

import type { PlayerState, SetLog } from './types';

export interface Nokta {
  /** Hafta başlangıcı, ISO tarih */
  hafta: string;
  deger: number;
}

function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Tarihin içinde bulunduğu haftanın Pazartesi'si */
export function haftaBasi(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const gun = d.getUTCDay();              // 0 = Pazar
  const kaydir = gun === 0 ? 6 : gun - 1;
  d.setUTCDate(d.getUTCDate() - kaydir);
  return isoOf(d);
}

/** Kalibrasyon dışındaki gerçek kayıtlar, tarihe göre sıralı */
function gercekKayitlar(state: PlayerState, id: string): SetLog[] {
  return state.logs
    .filter((l) => l.movementId === id && l.kind !== 'calibration')
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Hafta hafta en iyi tek set.
 *
 * Neden haftalık: günlük seri gürültülü ve ekranda okunmuyor; aylık ise
 * ilerlemeyi görmek için fazla seyrek. Haftalık, kullanıcının zaten
 * haftalık olan program ritmiyle de aynı.
 */
export function haftalikEnIyi(state: PlayerState, id: string): Nokta[] {
  const enIyi = new Map<string, number>();
  for (const l of gercekKayitlar(state, id)) {
    const h = haftaBasi(l.date);
    enIyi.set(h, Math.max(enIyi.get(h) ?? 0, ...l.values));
  }
  return [...enIyi.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([hafta, deger]) => ({ hafta, deger }));
}

/** Hafta sonuna kadar biriken toplam hacim (birikimli, asla düşmez) */
export function birikenHacim(state: PlayerState, id: string): Nokta[] {
  const haftalik = new Map<string, number>();
  for (const l of gercekKayitlar(state, id)) {
    const h = haftaBasi(l.date);
    const toplam = l.values.reduce((a, b) => a + b, 0);
    haftalik.set(h, (haftalik.get(h) ?? 0) + toplam);
  }
  let kum = 0;
  return [...haftalik.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([hafta, deger]) => {
      kum += deger;
      return { hafta, deger: kum };
    });
}

export interface Ozet {
  ilk: number;
  son: number;
  fark: number;
  yuzde: number;
  hafta: number;
}

/**
 * "8 haftada 12'den 16'ya" cümlesini kuran özet.
 * İki noktadan az veri varsa null — tek nokta ilerleme değildir.
 */
export function ozet(noktalar: Nokta[]): Ozet | null {
  if (noktalar.length < 2) return null;
  const ilk = noktalar[0]!.deger;
  const son = noktalar[noktalar.length - 1]!.deger;
  return {
    ilk,
    son,
    fark: son - ilk,
    yuzde: ilk > 0 ? Math.round(((son - ilk) / ilk) * 100) : 0,
    hafta: noktalar.length,
  };
}

/**
 * Grafiği gösterilecek hareketler.
 *
 * Öncelik kullanıcının kendi seçimi (çalıştıklarım listesi); o boşsa en
 * çok kaydı olanlar. Amaç ekranı doldurmak değil, kişinin baktığında
 * kendini gördüğü 3-4 çizgi.
 */
export function izlenenHareketler(state: PlayerState, adet = 4): string[] {
  const secili = (state.focus ?? []).filter(
    (id) => gercekKayitlar(state, id).length > 0,
  );
  if (secili.length > 0) return secili.slice(0, adet);

  const sayim = new Map<string, number>();
  for (const l of state.logs) {
    if (l.kind === 'calibration') continue;
    sayim.set(l.movementId, (sayim.get(l.movementId) ?? 0) + 1);
  }
  return [...sayim.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, adet)
    .map(([id]) => id);
}
