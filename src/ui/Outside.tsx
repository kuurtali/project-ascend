/**
 * PROGRAM DIŞI ANTRENMAN — kayıt kartı ve uyarı bandı
 *
 * Uygulama başından beri "başka antrenmanla bir arada yaşamak üzere"
 * tasarlandı ama bunu öğrenecek bir yeri yoktu. Bu kart o boşluk.
 *
 * Sürtünme tasarımı: varsayılan şiddet "orta". Yani en yaygın durum
 * iki dokunuş — türü seç, kaydet. Alan araştırmasının en net bulgusu
 * elle girişin terk etme sebeplerinin başında gelmesi; bir bağlam
 * kaydı için üç ekran doldurtmak kimseye ikinci kez yaptırılamaz.
 *
 * Not alanı isteğe bağlı ama koç raporuna aynen gider — "150 squat,
 * 300 zıplama" cümlesi sayıdan daha çok şey anlatıyor.
 */

import { useState } from 'react';
import type {
  Category, OutsideKind, OutsideLoad, PlayerState,
} from '../engine/types';
import {
  addOutside, LOAD_LABEL, loadAdvice, OUTSIDE_KINDS, outsideIn,
} from '../engine/outside';

const KINDS = Object.keys(OUTSIDE_KINDS) as OutsideKind[];

/** Sıçrama sorusu sadece anlamlı olduğu türlerde çıkar */
const PLYO_KINDS: OutsideKind[] = ['legs', 'conditioning', 'sport'];

export function OutsideCard({ state, onState, today = new Date() }: {
  state: PlayerState;
  onState: (s: PlayerState) => void;
  today?: Date;
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<OutsideKind | null>(null);
  const [load, setLoad] = useState<OutsideLoad>(2);
  const [plyo, setPlyo] = useState(false);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  const recent = outsideIn(state, 7, today);

  function submit() {
    if (!kind) return;
    onState(addOutside(state, {
      date: today.toISOString().slice(0, 10),
      kind,
      load,
      ...(plyo ? { plyo: true } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    }));
    setSaved(`${OUTSIDE_KINDS[kind].label} · ${LOAD_LABEL[load]}`);
    setKind(null); setLoad(2); setPlyo(false); setNote(''); setOpen(false);
    try { navigator.vibrate?.(20); } catch { /* geç */ }
  }

  return (
    <div style={{ ...card, marginTop: 8 }}>
      {!open && (
        <button onClick={() => { setOpen(true); setSaved(null); }} style={{
          ...chip, width: '100%', padding: '9px 0', borderStyle: 'dashed',
          color: saved ? '#5DCAA5' : 'var(--dim)',
        }}>
          {saved ? `✓ kaydedildi — ${saved}` : '+ program dışı bir şey yaptım'}
        </button>
      )}

      {open && (
        <>
          <div style={label}>PROGRAM DIŞI ANTRENMAN</div>
          <div style={{
            fontSize: 12, color: 'var(--dim)', margin: '5px 0 9px', lineHeight: 1.5,
          }}>
            Salon, aile seansı, maç, koşu — buraya yazarsan yarınki
            sayılar düştüğünde bunu gerileme sanmam.
          </div>

          <div style={row}>
            {KINDS.map((k) => (
              <button key={k} onClick={() => setKind(k)} title={OUTSIDE_KINDS[k].hint}
                style={{
                  ...chip,
                  borderColor: kind === k ? '#7F77DD' : 'var(--line)',
                  color: kind === k ? '#a89ff5' : 'var(--dim)',
                }}>
                {OUTSIDE_KINDS[k].label}
              </button>
            ))}
          </div>

          {kind && (
            <div style={{ fontSize: 11, color: 'var(--dim2)', marginTop: 6 }}>
              {OUTSIDE_KINDS[kind].hint}
            </div>
          )}

          <div style={{ ...row, marginTop: 9 }}>
            {([1, 2, 3] as OutsideLoad[]).map((l) => (
              <button key={l} onClick={() => setLoad(l)} style={{
                ...chip, flex: 1,
                borderColor: load === l ? '#f5c542' : 'var(--line)',
                color: load === l ? '#f5c542' : 'var(--dim)',
              }}>
                {LOAD_LABEL[l]}
              </button>
            ))}
          </div>

          {kind && PLYO_KINDS.includes(kind) && (
            <button onClick={() => setPlyo((p) => !p)} style={{
              ...chip, width: '100%', marginTop: 7, padding: '7px 0',
              borderColor: plyo ? '#fbbf24' : 'var(--line)',
              color: plyo ? '#fbbf24' : 'var(--dim2)',
            }}>
              {plyo ? '✓ ' : ''}sıçrama vardı (zıplama, sekme, atlama)
            </button>
          )}

          <input
            value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="not — isteğe bağlı"
            style={{
              width: '100%', boxSizing: 'border-box', marginTop: 8, height: 40,
              padding: '0 10px', fontSize: 13, borderRadius: 8,
              background: '#0d1016', color: 'var(--txt)',
              border: '1px solid var(--line)',
            }}
          />

          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button onClick={submit} disabled={!kind} style={{
              flex: 1, height: 42, borderRadius: 9, border: 'none',
              background: kind ? '#7F77DD' : '#232732',
              color: kind ? '#0b0d12' : '#5b6376',
              fontWeight: 600, fontSize: 14, cursor: kind ? 'pointer' : 'default',
            }}>Kaydet</button>
            <button onClick={() => setOpen(false)} style={{
              ...chip, padding: '0 14px', height: 42,
            }}>vazgeç</button>
          </div>
        </>
      )}

      {recent.length > 0 && (
        <div style={{ marginTop: 9, fontSize: 11.5, color: 'var(--dim2)' }}>
          {recent.slice(0, 4).map((o, i) => (
            <div key={i} style={{ padding: '2px 0' }}>
              {o.date.slice(5)} · {OUTSIDE_KINDS[o.kind].label.toLowerCase()} ·{' '}
              {LOAD_LABEL[o.load]}
              {o.plyo && ' · sıçrama'}
              {o.note && <span style={{ color: 'var(--dim)' }}> — {o.note}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Uyarı bandı. Boşsa hiçbir şey çizmez — söyleyecek şey yokken yer
 * kaplayan kutu, söyleyecek şey olduğunda da okunmamasına yol açar.
 */
export function LoadBanner({ state, categories, today = new Date() }: {
  state: PlayerState;
  categories: Category[];
  today?: Date;
}) {
  const warnings = loadAdvice(state, categories, today);
  if (warnings.length === 0) return null;

  return (
    <>
      {warnings.map((w, i) => (
        <div key={i} style={{
          ...card, marginBottom: 8,
          borderColor: w.level === 'warn' ? '#4a3d10' : '#2b323f',
          background: w.level === 'warn' ? '#2a220c' : 'var(--panel)',
        }}>
          <div style={{
            ...label, color: w.level === 'warn' ? '#f5c542' : 'var(--dim2)',
          }}>
            {w.level === 'warn' ? '⚠ DIŞ YÜK' : 'DIŞ YÜK'}
          </div>
          <div style={{
            fontSize: 12.5, color: '#c2c8d4', marginTop: 4, lineHeight: 1.55,
          }}>{w.text}</div>
        </div>
      ))}
    </>
  );
}

const card: React.CSSProperties = {
  background: 'var(--panel)', border: '1px solid var(--line)',
  borderRadius: 12, padding: '10px 12px',
};
const label: React.CSSProperties = {
  fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase',
  color: 'var(--dim2)',
};
const chip: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--line)',
  borderRadius: 99, padding: '6px 12px', fontSize: 12,
  color: 'var(--dim)', cursor: 'pointer',
};
const row: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', gap: 6,
};
