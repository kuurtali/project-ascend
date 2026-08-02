/**
 * KRONOMETRE — süreyle ölçülen hareketler ve set arası dinlenme
 *
 * Neden var: plank ve ölü askı SANİYE cinsinden ölçülüyor ama uygulamada
 * sayaç yoktu. Kullanıcının antrenman ortasında başka bir uygulama açması
 * gerekiyordu. Her seansta tekrarlanan bir sürtünme.
 *
 * İki mod:
 *  - hold   : yukarı sayar, durdurunca süre doğrudan set alanına yazılır
 *  - rest   : geriye sayar, bitince titreşim
 *
 * Sekme arkaya alınınca setInterval yavaşlar/durur (tarayıcı kısıtı).
 * Bu yüzden geçen süre BAŞLANGIÇ ZAMAN DAMGASINDAN hesaplanır, sayaç
 * artırarak değil. Telefon kilitlenip açılsa bile süre doğru kalır.
 */

import { useEffect, useRef, useState } from 'react';

function buzz(pattern: number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* desteklemiyorsa geç */ }
}

function mmss(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────── TUTUŞ SAYACI

export function HoldTimer({ target, onDone }: {
  /** Hedef saniye — geçince renk değişir */
  target: number;
  /** Durdurunca ölçülen süreyi geri verir */
  onDone: (seconds: number) => void;
}) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const hit = useRef(false);

  useEffect(() => {
    if (startedAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [startedAt]);

  const elapsed = startedAt == null ? 0 : (now - startedAt) / 1000;

  // Hedefe varınca bir kez titret — ekrana bakmadan anlaşılsın
  useEffect(() => {
    if (startedAt != null && !hit.current && elapsed >= target) {
      hit.current = true;
      buzz([60, 40, 60]);
    }
  }, [elapsed, target, startedAt]);

  const reached = elapsed >= target;

  function toggle() {
    if (startedAt == null) {
      hit.current = false;
      setStartedAt(Date.now());
      setNow(Date.now());
      buzz([25]);
    } else {
      onDone(Math.round(elapsed));
      setStartedAt(null);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
      <button onClick={toggle} style={{
        flex: 1, height: 46, borderRadius: 10, cursor: 'pointer',
        border: `1px solid ${startedAt != null ? (reached ? '#639922' : '#f5c542') : 'var(--line)'}`,
        background: startedAt != null ? (reached ? '#16240f' : '#2a220c') : 'transparent',
        color: startedAt != null ? (reached ? '#86efac' : '#f5c542') : 'var(--dim)',
        fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
      }}>
        {startedAt == null
          ? `⏱ başlat · hedef ${target} sn`
          : `${mmss(elapsed)}  ·  bitir`}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────── DİNLENME SAYACI

const REST_OPTIONS = [60, 90, 120, 180];

export function RestTimer() {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [len, setLen] = useState(90);
  const [now, setNow] = useState(Date.now());
  const rang = useRef(false);

  useEffect(() => {
    if (endAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [endAt]);

  const left = endAt == null ? 0 : (endAt - now) / 1000;

  useEffect(() => {
    if (endAt != null && !rang.current && left <= 0) {
      rang.current = true;
      buzz([120, 80, 120, 80, 240]);
    }
  }, [left, endAt]);

  if (endAt != null) {
    const done = left <= 0;
    const pct = done ? 0 : (left / len) * 100;
    return (
      <div style={{ ...bar, borderColor: done ? '#639922' : '#3a3563' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${pct}%`,
          background: '#3a356344', transition: 'width .3s linear',
        }} />
        <span style={{
          position: 'relative', fontSize: 15, fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: done ? '#86efac' : '#e6e8ee',
        }}>
          {done ? 'hazırsın' : `dinlen  ${mmss(left)}`}
        </span>
        <button onClick={() => { setEndAt(null); rang.current = false; }}
          style={{ ...ghostBtn, position: 'relative' }}>
          {done ? 'kapat' : 'geç'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <span style={{ fontSize: 11.5, color: 'var(--dim2)', marginRight: 2 }}>
        dinlenme
      </span>
      {REST_OPTIONS.map((s) => (
        <button key={s} onClick={() => {
          setLen(s); rang.current = false;
          setNow(Date.now()); setEndAt(Date.now() + s * 1000);
          buzz([25]);
        }} style={{
          flex: 1, height: 34, borderRadius: 8, cursor: 'pointer',
          border: '1px solid var(--line)', background: 'transparent',
          color: 'var(--dim)', fontSize: 12.5,
        }}>
          {s < 120 ? `${s}sn` : `${s / 60}dk`}
        </button>
      ))}
    </div>
  );
}

const bar: React.CSSProperties = {
  position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
  height: 44, borderRadius: 10, padding: '0 12px', overflow: 'hidden',
  border: '1px solid var(--line)', background: '#0d1016',
};
const ghostBtn: React.CSSProperties = {
  marginLeft: 'auto', background: 'transparent', border: 'none',
  color: '#8b93a5', fontSize: 12.5, cursor: 'pointer', padding: '6px 4px',
};
