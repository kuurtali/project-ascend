/**
 * PROGRAM DIŞI YÜK — sistemin körlüğünü kapatan parça
 *
 * README'nin en baştan beri iddia ettiği bir şey var: bu sistem
 * "başka antrenmanla bir arada yaşamak üzere tasarlandı". Haftalık
 * şablon 3 sert / 2 hafif / 2 boş, çünkü kullanıcının salona da
 * gittiği, koştuğu, maç yaptığı varsayılıyor.
 *
 * Ama uygulamanın bunu ÖĞRENECEK hiçbir yolu yoktu. Varsayım
 * belgelerdeydi, veride değil.
 *
 * Bunun bedeli sessiz bir ölçüm hatası — kilo takibiyle tamamen aynı
 * sınıftan. Dün 150 squat yapmış biri bugün planktan 10 saniye az
 * tutar; uyarlama kuralı bunu "gerileme" diye okur ve hedefi kalıcı
 * olarak düşürür. Kullanıcı hiçbir şey yanlış yapmamıştır, sistem
 * yanlış okumuştur. Ve bu hata görünmez: ekranda sadece daha küçük
 * bir sayı belirir.
 *
 * Üç şey yapıyoruz, hepsi kayıttan sonra:
 *   1. Aynı dokuya binen çakışmayı seans ÖNCESİ söylemek
 *   2. Yorgun bir günün ölçüsünü kalıcı hedef düşüşüne çevirmemek
 *      (uyarlama kuralı bu dosyayı okur)
 *   3. Sıçrama sıklığını saymak — tendon kastan yavaş toparlar
 *
 * Yapmadığımız şey: dış antrenmanı seriye, XP'ye veya kademelere
 * saymak. Uygulama beceri ağacını takip ediyor; oraya squat girerse
 * kademeler yanlış oynar. Dış yük BAĞLAM'dır, ilerleme değil. (D-063)
 */

import type {
  Category, OutsideKind, OutsideLoad, OutsideLog, PlayerState,
} from './types';

export type { OutsideKind, OutsideLoad, OutsideLog };

/**
 * Tür tablosu.
 *
 * `conflicts`: bu tür, ağaçtaki hangi kategorilerle AYNI DOKUYU
 * paylaşıyor. Çakışma uyarısı buradan çıkar — "dün bench yaptın,
 * bugün pike şınav var" diyebilmek için tür ile kategori arasında
 * bir köprü gerekiyor.
 *
 * `systemic`: türün genel yorgunluğa katkısı. Bacak günü üst gövde
 * hareketini doğrudan engellemez ama merkezi yorgunluk gerçektir;
 * yürüyüş ise neredeyse hiçbir şeye mal olmaz.
 */
export const OUTSIDE_KINDS: Record<OutsideKind, {
  label: string;
  hint: string;
  systemic: number;
  conflicts: Category[];
}> = {
  legs: {
    label: 'Bacak', hint: 'squat, zıplama, lunge, bacak günü',
    systemic: 1, conflicts: ['legs', 'explosive'],
  },
  push: {
    label: 'Üst itiş', hint: 'bench, omuz press, dips, şınav',
    systemic: 0.7, conflicts: ['push', 'vertical_push', 'dips'],
  },
  pull: {
    label: 'Üst çekiş', hint: 'barfiks, row, lat çekiş',
    systemic: 0.7, conflicts: ['pull'],
  },
  conditioning: {
    label: 'Kondisyon', hint: 'koşu, bisiklet, ip, HIIT',
    systemic: 0.8, conflicts: ['conditioning'],
  },
  sport: {
    label: 'Spor', hint: 'maç, oyun, tırmanış',
    systemic: 0.8, conflicts: [],
  },
  walk: {
    label: 'Yürüyüş', hint: 'adım, yürüyüş — toparlanmaya yardım eder',
    systemic: 0.2, conflicts: [],
  },
  other: {
    label: 'Diğer', hint: 'bahçe işi, taşıma, ne olduysa',
    systemic: 0.6, conflicts: [],
  },
};

export const LOAD_LABEL: Record<OutsideLoad, string> = {
  1: 'hafif', 2: 'orta', 3: 'ağır',
};

/** Uyarlama kuralını tetikleyen eşik. Sade tutuldu: sadece "ağır".
 *  Orta şiddetli bir seans ekranda uyarı çıkarır ama hedefe
 *  dokunmaz — basit kural akıllı kuraldan güvenilirdir. */
export const HEAVY: OutsideLoad = 3;

/** Ağır yükün uyarlama kuralını etkilediği pencere (gün) */
export const FATIGUE_WINDOW_DAYS = 2;

/** Son 7 günde bu kadar sıçrama seansı olursa uyarı verilir */
export const PLYO_WARN_PER_WEEK = 3;

function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000,
  );
}

/** Son `days` gün içindeki dış kayıtlar, yeniden eskiye */
export function outsideIn(
  state: PlayerState, days: number, today = new Date(),
): OutsideLog[] {
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - days);
  const from = isoOf(cutoff);
  return (state.outside ?? [])
    .filter((o) => o.date > from && o.date <= isoOf(today))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Verilen tarihteki seans, öncesindeki pencerede ağır bir dış yükün
 * ardından mı yapıldı.
 *
 * Neden "bugün" değil de "o seansın tarihi": uyarlama kuralı GEÇMİŞ
 * bir seansın sonucunu yorumluyor. Önemli olan o seansın hangi
 * koşulda yapıldığı, bugün nasıl hissettiğim değil.
 */
export function heavyBefore(
  outside: OutsideLog[] | undefined,
  isoDate: string,
  days = FATIGUE_WINDOW_DAYS,
): OutsideLog | null {
  if (!outside?.length) return null;
  const hits = outside.filter((o) => {
    const gap = daysBetween(o.date, isoDate);
    return gap >= 0 && gap <= days && o.load >= HEAVY;
  });
  if (hits.length === 0) return null;
  // En yakın olanı döndür — mesajda tarih geçiyor
  return hits.sort((a, b) => b.date.localeCompare(a.date))[0]!;
}

// ─────────────────────────────────────────────────────────── UYARILAR

export interface LoadWarning {
  /** `warn` bugünkü seansı değiştirmeli, `info` sadece bağlam */
  level: 'info' | 'warn';
  text: string;
}

/**
 * Bugünkü seans için uyarılar.
 *
 * Ton kuralı: bu mesajlar bilgi verir, azarlamaz. Alan araştırması
 * net — başarısızlığı görünür kılan oyunlaştırma rahatsızlığı
 * artırıyor, toparlanmayı destekleyen azaltıyor. "Fazla yaptın"
 * demiyoruz, "bu sayı bugün neden düşük olabilir" diyoruz.
 * Bir test bu dosyada suçlayıcı kelime bulunmadığını doğruluyor.
 */
export function loadAdvice(
  state: PlayerState,
  todaysCategories: Category[],
  today = new Date(),
): LoadWarning[] {
  const out: LoadWarning[] = [];
  const week = outsideIn(state, 7, today);
  if (week.length === 0) return out;

  const iso = isoOf(today);
  const yesterdayish = week.filter((o) => daysBetween(o.date, iso) <= 1);

  // 1 · Aynı doku — en değerli uyarı, çünkü bugünkü seansı değiştirir
  const cats = new Set(todaysCategories);
  for (const o of yesterdayish) {
    if (o.load < 2) continue;
    const clash = OUTSIDE_KINDS[o.kind].conflicts.filter((c) => cats.has(c));
    if (clash.length === 0) continue;
    out.push({
      level: 'warn',
      text: `${daysBetween(o.date, iso) === 0 ? 'Bugün' : 'Dün'} `
        + `${OUTSIDE_KINDS[o.kind].label.toLowerCase()} çalışmışsın. `
        + 'Bugünkü ana iş aynı dokuya biniyor: hedefi tutturamazsan '
        + 'bu gerileme değil, üst üste gelen yük. Sayıyı zorlama, '
        + 'formu koru.',
    });
    break;    // tek uyarı yeter; liste uzarsa kimse okumaz
  }

  // 2 · Genel yorgunluk — doku çakışmasa da ağır gün ağır gündür
  const heavyYesterday = yesterdayish.find((o) => o.load >= HEAVY);
  if (heavyYesterday && out.length === 0) {
    out.push({
      level: 'info',
      text: `${daysBetween(heavyYesterday.date, iso) === 0 ? 'Bugün' : 'Dün'} `
        + `ağır bir ${OUTSIDE_KINDS[heavyYesterday.kind].label.toLowerCase()} `
        + 'seansı var. Isınmayı uzat ve ilk seti ölçü seti say — '
        + 'beceri işi yorgunken yapıldığında yanlış kalıp öğretir.',
    });
  }

  // 3 · Sıçrama sıklığı — kas 48 saatte toparlar, tendon daha yavaş
  const plyo = week.filter((o) => o.plyo).length;
  if (plyo >= PLYO_WARN_PER_WEEK) {
    out.push({
      level: 'warn',
      text: `Son 7 günde ${plyo} sıçrama seansı var. Sıçrama kastan çok `
        + 'tendona biner ve tendon daha yavaş toparlanır — aralarında '
        + '48 saat kalması diz ve aşil için önemli.',
    });
  }

  // 4 · Haftalık toplam yük
  const total = week.reduce(
    (n, o) => n + o.load * OUTSIDE_KINDS[o.kind].systemic, 0,
  );
  if (total >= 10) {
    out.push({
      level: 'info',
      text: 'Bu hafta program dışı yük yüksek. Sertlik zaten orada; '
        + 'buradaki hafif günleri gerçekten hafif tut.',
    });
  }

  return out;
}

/** Yeni bir dış kayıt ekler. Aynı gün birden fazla olabilir. */
export function addOutside(state: PlayerState, entry: OutsideLog): PlayerState {
  return { ...state, outside: [...(state.outside ?? []), entry] };
}
