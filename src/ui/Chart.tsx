/**
 * İLERLEME GRAFİĞİ
 *
 * Kütüphane yok, bilerek. Ağaç ekranı zaten elde yazılmış SVG; grafik
 * için 40 KB'lık bir bağımlılık eklemek, uygulamanın çevrimdışı açılma
 * süresini uzatmaktan başka işe yaramazdı.
 *
 * İki seri üst üste değil YAN YANA gösteriliyor: kapasite ve emek farklı
 * birimler ve farklı davranışlar. Aynı eksene bindirilseydi biri
 * öbürünü ezerdi ve okuma kaybolurdu.
 */

import type { Nokta } from '../engine/history';

const G = 190;   // genişlik
const Y = 54;    // yükseklik
const P = 4;     // kenar payı

function yol(noktalar: Nokta[], kapali: boolean): string {
  if (noktalar.length === 0) return '';
  const degerler = noktalar.map((n) => n.deger);
  const enAz = Math.min(...degerler, 0);
  const enCok = Math.max(...degerler, enAz + 1);
  const dx = noktalar.length > 1 ? (G - P * 2) / (noktalar.length - 1) : 0;

  const nokta = (n: Nokta, i: number) => {
    const x = P + i * dx;
    const oran = (n.deger - enAz) / (enCok - enAz);
    const y = Y - P - oran * (Y - P * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const cizgi = noktalar.map(nokta).map((p, i) => (i ? `L${p}` : `M${p}`)).join('');
  if (!kapali) return cizgi;
  return `${cizgi}L${(P + (noktalar.length - 1) * dx).toFixed(1)},${Y - P}L${P},${Y - P}Z`;
}

export function Sparkline({ noktalar, renk, alan }: {
  noktalar: Nokta[];
  renk: string;
  alan?: boolean;
}) {
  if (noktalar.length < 2) {
    return (
      <div style={{
        height: Y, display: 'grid', placeItems: 'center',
        fontSize: 11, color: 'var(--dim2)',
      }}>
        en az iki hafta gerekiyor
      </div>
    );
  }
  return (
    <svg width="100%" height={Y} viewBox={`0 0 ${G} ${Y}`} preserveAspectRatio="none">
      {alan && (
        <path d={yol(noktalar, true)} fill={renk} opacity={0.16} />
      )}
      <path d={yol(noktalar, false)} fill="none" stroke={renk}
            strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"
            vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
