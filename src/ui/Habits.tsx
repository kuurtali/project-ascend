/**
 * TEMEL HAREKETLER — tek dokunuşluk süreklilik şeridi
 *
 * Buradaki tasarım kararı tek cümle: **sayı sorma.** Şınav çektiğini
 * işaretlemek, şınav çekmekten kolay olmak zorunda. Üç set kutusu
 * doldurtmak alışkanlığı öldürür.
 *
 * Gösterilen şey "kaç gündür sürdürüyorsun" — kaç kez yaptığın değil.
 * Gün cinsinden olması önemli: 2 günde bir yapılan şeyle 3 günde bir
 * yapılan şeyi aynı ölçüyle karşılaştırabiliyorsun, ve sayı hep
 * hayatındaki gerçek süreye karşılık geliyor.
 */

import type { PlayerState } from '../engine/types';
import {
  chainDays, doneToday, habitsOf, isDue, isLate, recentMarks, toggleHabit,
} from '../engine/habits';

export function Habits({ state, onState, today = new Date() }: {
  state: PlayerState;
  onState: (s: PlayerState) => void;
  today?: Date;
}) {
  const habits = habitsOf(state);

  return (
    <div style={{ ...card, marginBottom: 10 }}>
      <div style={label}>TEMEL HAREKETLER</div>

      {habits.map((h) => {
        const done = doneToday(state, h.id, today);
        const due = isDue(state, h, today);
        const late = isLate(state, h, today);
        const chain = chainDays(state, h, today);
        const marks = recentMarks(state, h.id, 14, today);

        return (
          <button
            key={h.id}
            onClick={() => onState(toggleHabit(state, h.id, today))}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '9px 0', borderBottom: '1px solid var(--line)',
              textAlign: 'left', color: 'inherit',
            }}
          >
            <span style={{
              flexShrink: 0, width: 24, height: 24, borderRadius: 99,
              display: 'grid', placeItems: 'center', fontSize: 13,
              border: `1.5px solid ${done ? '#1D9E75' : late ? '#7a6320' : 'var(--line)'}`,
              background: done ? '#1D9E75' : 'transparent',
              color: done ? '#0b0d12' : 'transparent',
            }}>✓</span>

            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                fontSize: 14, color: done ? '#e6e8ee' : 'var(--dim)',
              }}>{h.label}</span>
              <span style={{ fontSize: 10.5, color: 'var(--dim2)', marginLeft: 7 }}>
                {h.everyDays} günde bir
              </span>

              {/* Son 14 gün. Delik görmek, sayı okumaktan hızlı anlatıyor. */}
              <span style={{ display: 'flex', gap: 2.5, marginTop: 5 }}>
                {marks.map((m) => (
                  <span key={m.date} style={{
                    width: 6, height: 6, borderRadius: 99,
                    background: m.done ? '#1D9E75' : '#20252f',
                  }} />
                ))}
              </span>
            </span>

            <span style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{
                display: 'block', fontSize: 15, fontWeight: 600,
                color: chain > 0 ? '#f5c542' : 'var(--dim2)',
              }}>{chain}</span>
              <span style={{ fontSize: 8.5, color: 'var(--dim2)' }}>GÜN</span>
            </span>

            {due && !done && (
              <span style={{
                flexShrink: 0, fontSize: 9.5, padding: '2px 6px', borderRadius: 99,
                background: late ? '#2a220c' : '#1a1d24',
                color: late ? '#f5c542' : '#8b93a5',
              }}>{late ? 'gecikti' : 'bugün'}</span>
            )}
          </button>
        );
      })}

      <div style={{
        fontSize: 11, color: 'var(--dim2)', marginTop: 8, lineHeight: 1.5,
      }}>
        Sayı tutmuyor, gün tutuyor. Tekrar girmek istersen seansa gir —
        buradaki işaret kademelere ve XP'ye sayılmaz.
      </div>
    </div>
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
