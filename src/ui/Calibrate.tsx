/**
 * KALİBRASYON — ilk açılışta "şu an ne yapabiliyorsun?"
 *
 * Neden var: uygulama ilk açıldığında her sayı sıfırdı. Rütbe Beginner I,
 * seri 0, 22 boss'un hepsi tam canlı, 0/8 unvan. Boş bir kayıt dosyası
 * oyun değildir. Kullanıcı zaten 30 şınav çekebiliyorken sistemin ona
 * duvar şınavı önermesi de yanlış — hem yanlış hem moral bozucu.
 *
 * Burada girilen sayılar mastery'yi tohumlar: ağacın büyük kısmı açılır,
 * rütbe gerçek yerine oturur, planlayıcı doğru yerden başlar.
 *
 * ÖNEMLİ: tahmin değil, gerçek sayı istenir. Şişirilen sayı ilk seansta
 * kendini gösterir ve uyarlama kuralı zaten aşağı çeker — ama boşuna
 * bir hafta kaybedilir. Ekranda bu açıkça yazıyor.
 */

import { useEffect, useRef, useState } from 'react';
import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { indexMovements } from '../engine/mastery';
import { recordSession } from '../storage';
import { Figure } from './figure/Figure';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

/**
 * Ölçüm noktaları.
 *
 * İki iş birden yapıyorlar ve ikisi de gerekli:
 *   1. Ağacın kollarını açmak (şınav, squat, plank, barfiks, ip)
 *   2. **Programın gerçekten verdiği hareketlerin hedefini belirlemek**
 *
 * İkincisi uzun süre eksikti: ölçüm şınav/squat/plank soruyordu ama
 * program pike şınav, masa row ve duvar handstand veriyordu. Ortak
 * hareket yalnızca hollow hold'du — yani kullanıcı 30 da yazsa 3 de
 * yazsa Bugün ekranındaki hedefler değişmiyordu. "Kalibrasyon bir işe
 * yaramıyor" izlenimi buradan geliyordu ve haklıydı. (D-064)
 */
const PROBES: { id: string; hint: string; needsBar?: boolean }[] = [
  { id: 'pushup', hint: 'Tek sette, düzgün formda kaç tane?' },
  { id: 'pike-pushup', hint: 'Kalça havada, baş yere doğru — kaç tane? Bilmiyorsan boş bırak.' },
  { id: 'bodyweight-squat', hint: 'Tek sette kaç tane?' },
  { id: 'plank', hint: 'Kaç saniye tutabiliyorsun?' },
  { id: 'hollow-hold', hint: 'Bel yerden kalkmadan kaç saniye?' },
  { id: 'australian-row', hint: 'Masa/alçak bar altında yatay çekiş, kaç tane?' },
  { id: 'pull-up', hint: 'Tam barfiks, kaç tane?', needsBar: true },
  { id: 'passive-hang', hint: 'Bardan kaç saniye asılı kalabiliyorsun?', needsBar: true },
  { id: 'bench-dip', hint: 'Sandalye/sehpa kenarında kaç tane?' },
  { id: 'wall-handstand', hint: 'Duvara karşı baş aşağı, kaç saniye? Denemediysen boş bırak.' },
  { id: 'jump-rope-basic', hint: 'Takılmadan kaç atlayış?' },
];

export function Calibrate({ state, onDone }: {
  state: PlayerState;
  onDone: (s: PlayerState) => void;
}) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [i, setI] = useState(0);

  const probes = PROBES.filter((p) => {
    const mv = IDX.get(p.id);
    if (!mv) return false;
    if (p.needsBar && !state.equipment.includes('pullup-bar')) return false;
    return true;
  });

  const cur = probes[i];
  const mv = cur ? IDX.get(cur.id) : null;

  /** İki kez çalışmasın — çift kayıt XP'yi ikiye katlardı */
  const sealed = useRef(false);

  function finish() {
    if (sealed.current) return;
    sealed.current = true;

    const entries = Object.entries(vals)
      .map(([movementId, v]) => ({ movementId, values: [Number(v)] }))
      .filter((e) => Number.isFinite(e.values[0]) && e.values[0]! > 0);

    if (entries.length === 0) { onDone({ ...state, calibrated: true }); return; }

    // 'calibration' işareti şart: bu tek setlik bir MAKSİMUM, tamamlanmış
    // bir seans değil. İşaretlenmezse uyarlama kuralı "hedefi tuttu, +1"
    // diyor ve ertesi günün hedefi maksimumun üstüne çıkıyor.
    const res = recordSession(DB, IDX as never, state, entries, new Date(), 'calibration');
    onDone({ ...res.state, calibrated: true });
  }

  // Ölçülecek hareket kalmadıysa çık. Render sırasında değil, EFFECT'te —
  // render içinde üst bileşenin state'ini güncellemek React'te hatadır.
  const empty = !mv || !cur;
  useEffect(() => { if (empty) finish(); });

  if (empty) return null;

  const v = vals[cur.id] ?? '';
  const last = i === probes.length - 1;

  return (
    <div style={{
      maxWidth: 440, margin: '0 auto', padding: '20px 18px 40px',
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ fontSize: 10.5, letterSpacing: '.14em', color: '#5b6376' }}>
        BAŞLANGIÇ ÖLÇÜMÜ · {i + 1}/{probes.length}
      </div>

      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {probes.map((_, k) => (
          <div key={k} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: k <= i ? '#f5c542' : '#20252f',
          }} />
        ))}
      </div>

      <div style={{ display: 'grid', placeItems: 'center', margin: '18px 0 4px' }}>
        <Figure movementId={mv.id} family={mv.family} size={168} color="#e6e8ee" />
      </div>

      <h2 style={{ fontSize: 23, fontWeight: 500, margin: '4px 0 2px' }}>{mv.name}</h2>
      <p style={{ color: 'var(--dim)', fontSize: 13.5, margin: '0 0 16px' }}>
        {cur.hint}
      </p>

      <input
        type="number" inputMode="numeric" autoFocus
        value={v} onChange={(e) => setVals({ ...vals, [cur.id]: e.target.value })}
        placeholder="0"
        style={{
          width: '100%', height: 66, borderRadius: 12, textAlign: 'center',
          fontSize: 30, fontWeight: 600, background: '#0d1016',
          border: '1px solid var(--line)', color: 'var(--txt)',
        }}
      />
      <div style={{
        textAlign: 'center', fontSize: 12, color: 'var(--dim2)', marginTop: 6,
      }}>
        {mv.measure.unit} · yapamıyorsan boş bırak
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        fontSize: 12, color: 'var(--dim2)', lineHeight: 1.6,
        borderLeft: '2px solid #2b323f', paddingLeft: 10, margin: '20px 0 14px',
      }}>
        Gerçek sayını yaz, iyi görünen sayıyı değil. Şişirirsen sistem ilk
        seansta zaten aşağı çeker — sadece bir hafta kaybedersin.
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {i > 0 && (
          <button onClick={() => setI(i - 1)} style={{ ...btn, flex: 0.5, background: 'transparent', border: '1px solid var(--line)', color: 'var(--dim)' }}>
            geri
          </button>
        )}
        <button onClick={() => (last ? finish() : setI(i + 1))} style={{ ...btn, flex: 1 }}>
          {last ? 'Bitir ve ağacı aç' : 'Sonraki'}
        </button>
      </div>

      <button onClick={finish} style={{
        background: 'transparent', border: 'none', color: '#5b6376',
        fontSize: 12.5, marginTop: 12, cursor: 'pointer',
      }}>
        atla — sıfırdan başlayayım
      </button>
    </div>
  );
}

const btn: React.CSSProperties = {
  height: 50, borderRadius: 12, border: 'none', cursor: 'pointer',
  background: '#f5c542', color: '#0b0d12', fontSize: 15, fontWeight: 600,
};
