/**
 * VÜCUT AĞIRLIĞI — sessiz ölçüm hatasını kapatan parça
 *
 * Kalistenik göreli güç sporu: kaldırdığın şey kendi ağırlığın. Salonda
 * 4 kg alırsan barfiks nesnel olarak zorlaşır ve uygulama bunu
 * "gerileme" diye okur, hedefi düşürür. Tersi de olur — kilo verince
 * tekrarlar artar ve sistem bunu güç artışı sanır.
 *
 * İkisi de yanlış sinyal ve ikisi de sessiz. Kayıt olmadan fark
 * edilmesi imkânsız.
 *
 * Tasarım kararı: **haftada bir kez sorulur, atlanabilir.** Her gün
 * sormak tartı takıntısını besler; hiç sormamak veriyi kör bırakır.
 * Haftalık ölçüm eğilimi görmeye yeter, günlük dalgalanma zaten gürültü.
 */

import { useState } from 'react';
import type { PlayerState } from '../engine/types';

/** Bu hafta kilo girilmiş mi */
export function needsWeighIn(state: PlayerState, today = new Date()): boolean {
  const list = state.bodyweight ?? [];
  if (list.length === 0) return state.logs.length > 0;   // ilk seanstan sonra sor
  const last = new Date(list[list.length - 1]!.date);
  const days = (today.getTime() - last.getTime()) / 86_400_000;
  return days >= 7;
}

/** Son kayıt ve bir önceki arasındaki fark */
export function weightTrend(state: PlayerState): { kg: number; delta: number } | null {
  const list = state.bodyweight ?? [];
  if (list.length === 0) return null;
  const cur = list[list.length - 1]!;
  const prev = list[list.length - 2];
  return { kg: cur.kg, delta: prev ? +(cur.kg - prev.kg).toFixed(1) : 0 };
}

export function WeighIn({ state, onState, today = new Date() }: {
  state: PlayerState;
  onState: (s: PlayerState) => void;
  today?: Date;
}) {
  const [v, setV] = useState('');
  const [done, setDone] = useState(false);

  if (done || !needsWeighIn(state, today)) return null;

  function submit() {
    const kg = Number(v.replace(',', '.'));
    if (!Number.isFinite(kg) || kg < 30 || kg > 250) return;
    onState({
      ...state,
      bodyweight: [
        ...(state.bodyweight ?? []),
        { date: today.toISOString().slice(0, 10), kg },
      ],
    });
    setDone(true);
  }

  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid #3a3563',
      borderRadius: 12, padding: '12px 14px', marginBottom: 10,
    }}>
      <div style={{
        fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase',
        color: '#a89ff5',
      }}>HAFTALIK TARTI</div>
      <div style={{ fontSize: 12.5, color: '#c2c8d4', margin: '5px 0 9px', lineHeight: 1.5 }}>
        Kalistenikte kendi ağırlığını kaldırıyorsun. Kilon değişirse
        tekrarların değişir — bilmezsem bunu güç değişimi sanarım.
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="number" inputMode="decimal" placeholder="kg"
          value={v} onChange={(e) => setV(e.target.value)}
          style={{
            flex: 1, height: 44, borderRadius: 9, textAlign: 'center',
            fontSize: 17, background: '#0d1016', color: 'var(--txt)',
            border: '1px solid var(--line)',
          }}
        />
        <button onClick={submit} style={{
          padding: '0 18px', height: 44, borderRadius: 9, border: 'none',
          background: '#7F77DD', color: '#0b0d12', fontWeight: 600,
          fontSize: 14, cursor: 'pointer',
        }}>Kaydet</button>
        <button onClick={() => setDone(true)} style={{
          padding: '0 12px', height: 44, borderRadius: 9, cursor: 'pointer',
          border: '1px solid var(--line)', background: 'transparent',
          color: '#5b6376', fontSize: 12.5,
        }}>sonra</button>
      </div>
    </div>
  );
}
