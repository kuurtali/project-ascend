/**
 * İLERLEME EKRANI — rütbe, seri, terfi, boss, unvanlar, ascension
 *
 * Oyun katmanının görünür yüzü. Motor tarafı src/engine/game.ts.
 *
 * Terfi: Main slot ALTIN kademeye ulaşınca eski Main aşağı iner, ağaçtaki
 * bir üst düğüm Main olur. Takvimle değil mastery ile. (D-046 S-1)
 * Boss yılda bir yenilir, terfi ayda bir olur — asıl ödül anı bu.
 */

import { useMemo } from 'react';
import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { MASTERY_TIERS } from '../engine/types';
import { balanceScore, indexMovements, isOpen, levelOf, proximity } from '../engine/mastery';
import { pathTo } from '../engine/planner';
import { promotionsOf, weeksToDeload, weekNumber } from '../engine/session';
import { ascensionOf, bossStates, rankOf, streakOf, titlesOf } from '../engine/game';
import { WEEK } from '../program';
import { Avatar } from './Avatar';
import { Figure } from './figure/Figure';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

const TIER_COLOR: Record<string, string> = {
  bronze: '#cd7f32', silver: '#c4c9d4', gold: '#f5c542', master: '#a855f7',
};
const TIER_LABEL: Record<string, string> = {
  bronze: 'Bronz', silver: 'Gümüş', gold: 'Altın', master: 'Master',
};

const GOALS = [
  { id: 'hspu', label: 'Handstand Push-up' },
  { id: 'bar-muscle-up', label: 'Muscle-up' },
  { id: 'front-lever', label: 'Front Lever' },
  { id: 'l-sit', label: 'L-Sit' },
];

export function Progress({ state }: { state: PlayerState }) {
  const level = levelOf(DB, state.xp);
  const balance = balanceScore(DB, state);
  const rank = rankOf(DB, state);
  const streak = streakOf(state);
  const bosses = useMemo(() => bossStates(DB, state), [state]);
  const titles = useMemo(() => titlesOf(DB, state), [state]);
  const asc = useMemo(() => ascensionOf(DB, state), [state]);

  // Terfi artık gerçekten oluyor: Bugün ekranı da aynı çözücüyü
  // kullanıyor, yani burada gördüğün değişiklik yarın programında. (D-060)
  const promotions = useMemo(
    () => promotionsOf(DB, IDX, state, WEEK), [state],
  );
  const weekNo = weekNumber(state);
  const toDeload = weeksToDeload(state);

  const closest = useMemo(() =>
    DB.movements
      .filter((m) => state.mastery[m.id]?.tier != null || isOpen(state, m))
      .map((m) => proximity(state, m))
      .filter((p) => p.remaining != null && p.remaining > 0 && p.best > 0)
      .sort((a, b) => (a.remaining ?? 0) - (b.remaining ?? 0))
      .slice(0, 5), [state]);

  const goals = useMemo(() => GOALS.map((g) => {
    const path = pathTo(DB, IDX, g.id);
    return { ...g, done: path.filter((m) => state.mastery[m.id]?.tier).length, total: path.length };
  }), [state]);

  const nextBosses = bosses.filter((b) => !b.defeated).slice(0, 4);
  const earned = titles.filter((t) => t.earned);
  const nextTitles = titles.filter((t) => !t.earned)
    .sort((a, b) => b.progress - a.progress).slice(0, 3);

  // Ana hareket: haftalık şablondaki main slot
  const mainId = useMemo(() => {
    for (const d of WEEK) {
      const m = d.exercises.find((e) => e.role === 'main');
      if (m) return m.movementId;
    }
    return 'pushup';
  }, []);

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '12px 14px 40px' }}>

      <Avatar state={state} currentId={mainId} />

      {/* RÜTBE */}
      <div style={{
        ...card, background: 'linear-gradient(135deg,#151426,#11141b)',
        borderColor: '#3a3563',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, display: 'grid',
            placeItems: 'center', fontWeight: 700, fontSize: 20, color: '#0b0d12',
            background: 'linear-gradient(135deg,#f5c542,#a855f7)',
            boxShadow: '0 0 24px #a855f733',
          }}>{level}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{rank.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--dim)' }}>
              Seviye {level} · {state.xp.toLocaleString('tr')} XP
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 22, fontWeight: 600,
              color: streak.weeks > 0 ? '#f5c542' : 'var(--dim2)',
            }}>{streak.weeks}</div>
            <div style={{ fontSize: 9.5, color: 'var(--dim2)' }}>HAFTA SERİ</div>
          </div>
        </div>

        {/* bu haftaki seans noktaları */}
        <div style={{ display: 'flex', gap: 5, marginTop: 12, alignItems: 'center' }}>
          {Array.from({ length: streak.target }).map((_, k) => (
            <div key={k} style={{
              flex: 1, height: 6, borderRadius: 99,
              background: k < streak.thisWeek ? '#639922' : '#20252f',
            }} />
          ))}
          <span style={{ fontSize: 11, color: 'var(--dim)', marginLeft: 4 }}>
            {streak.thisWeek}/{streak.target}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--dim2)', marginTop: 5 }}>
          Seri haftalık sayılır — dinlenme günü seriyi kırmaz.
        </div>
      </div>

      {/* TERFİ */}
      {promotions.map((p) => (
        <div key={p.from.id} style={{
          ...card, marginTop: 10, borderColor: '#7F77DD', background: '#1a1533',
        }}>
          <div style={{ ...label, color: '#a89ff5' }}>⬆ TERFİ OLDU</div>
          <div style={{ fontSize: 16, fontWeight: 500, margin: '6px 0 6px' }}>
            {p.from.name} altın kademede
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--dim)', lineHeight: 1.55 }}>
            Ana hareket <b style={{ color: '#e6e8ee' }}>{p.to.name}</b> oldu —
            bir sonraki seansta programında bunu göreceksin.
            {' '}{p.from.name} silinmiyor, rolü değişiyor.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
            <span style={{ ...roleBox, color: '#8b93a5' }}>{p.from.name}</span>
            <span style={{ color: '#5b6376' }}>↓</span>
            <span style={{ ...roleBox, color: '#a89ff5', borderColor: '#7F77DD' }}>
              {p.to.name}
            </span>
          </div>
        </div>
      ))}

      {weekNo > 0 && (
        <div style={{ ...card, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ ...label, flex: 1 }}>PROGRAM HAFTASI</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{weekNo}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 4 }}>
            {toDeload === 0
              ? 'Bu hafta deload — set sayıları yarıda, ölçüm yok.'
              : `Deload'a ${toDeload} hafta kaldı.`}
          </div>
        </div>
      )}

      {/* YAKINLIK */}
      {closest.length > 0 && (
        <div style={{ ...card, marginTop: 10 }}>
          <div style={label}>SONRAKİ KADEMEYE EN YAKIN</div>
          {closest.map((p) => (
            <div key={p.movementId} style={rowStyle}>
              <span style={{ flex: 1 }}>{IDX.get(p.movementId)?.name}</span>
              <span style={{ fontSize: 12, color: 'var(--dim)' }}>
                {p.best}/{p.nextTarget}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: TIER_COLOR[p.nextTier ?? 'bronze'],
              }}>{p.remaining} kaldı</span>
            </div>
          ))}
        </div>
      )}

      {/* BOSS HP */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>
          BOSS · {bosses.filter((b) => b.defeated).length}/{bosses.length} yenildi
        </div>
        {nextBosses.map((b) => (
          <div key={b.movement.id} style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', fontSize: 13.5, alignItems: 'center', gap: 7 }}>
              <Figure movementId={b.movement.id} family={b.movement.family}
                      size={30} color="#e24b4a" animate={false} />
              <span style={{ flex: 1 }}>★ {b.movement.name}</span>
              <span style={{ fontSize: 11, color: 'var(--dim2)', marginRight: 6 }}>
                {b.prereqDone}/{b.prereqTotal} ön koşul
              </span>
              <span style={{ fontSize: 12, color: b.hp > 60 ? '#e24b4a' : '#f5c542' }}>
                {b.hp} HP
              </span>
            </div>
            <div style={{
              height: 7, background: '#20252f', borderRadius: 99, marginTop: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${b.hp}%`,
                background: b.hp > 60
                  ? 'linear-gradient(90deg,#791f1f,#e24b4a)'
                  : 'linear-gradient(90deg,#854f0b,#f5c542)',
                transition: 'width .6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ASCENSION SCORE */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ ...label, flex: 1 }}>ASCENSION SCORE</div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>{asc.total}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--dim2)', marginBottom: 8 }}>
          XP birikir, bu düşebilir. Şu anki halini gösterir.
        </div>
        {asc.axes.map((a) => (
          <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--dim)', width: 66 }}>{a.label}</span>
            <div style={{ flex: 1, height: 6, background: '#20252f', borderRadius: 99 }}>
              <div style={{
                height: '100%', width: `${a.value}%`, borderRadius: 99,
                background: 'linear-gradient(90deg,#1D9E75,#5DCAA5)',
              }} />
            </div>
            <span style={{ fontSize: 11.5, width: 26, textAlign: 'right' }}>{a.value}</span>
          </div>
        ))}
      </div>

      {/* UNVANLAR */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>UNVANLAR · {earned.length}/{titles.length}</div>
        {earned.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {earned.map((t) => (
              <span key={t.id} style={{
                fontSize: 11.5, padding: '4px 10px', borderRadius: 99,
                border: '1px solid #f5c542', color: '#f5c542', background: '#2a220c',
              }}>{t.label}</span>
            ))}
          </div>
        )}
        <div style={{ marginTop: earned.length ? 12 : 8 }}>
          {nextTitles.map((t) => (
            <div key={t.id} style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', fontSize: 12.5 }}>
                <span style={{ flex: 1, color: 'var(--dim)' }}>{t.label}</span>
                <span style={{ fontSize: 11, color: 'var(--dim2)' }}>
                  {Math.round(t.progress * 100)}%
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--dim2)' }}>{t.description}</div>
              <div style={{ height: 4, background: '#20252f', borderRadius: 99, marginTop: 3 }}>
                <div style={{
                  height: '100%', width: `${t.progress * 100}%`,
                  borderRadius: 99, background: '#5F5E5A',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HEDEFLER */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>HEDEFLERE MESAFE</div>
        {goals.map((g) => {
          const pct = Math.round(100 * g.done / g.total);
          return (
            <div key={g.id} style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', fontSize: 13.5 }}>
                <span style={{ flex: 1 }}>{g.label}</span>
                <span style={{ color: 'var(--dim)', fontSize: 12 }}>
                  {g.done}/{g.total} adım
                </span>
              </div>
              <div style={{ height: 6, background: '#20252f', borderRadius: 99, marginTop: 4 }}>
                <div style={{
                  height: '100%', width: `${pct}%`, borderRadius: 99,
                  background: 'linear-gradient(90deg,#f5c542,#a855f7)',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* KADEME DAĞILIMI + DENGE */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>KADEME DAĞILIMI</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {MASTERY_TIERS.map((t) => {
            const n = DB.movements.filter((m) => state.mastery[m.id]?.tier === t).length;
            return (
              <div key={t} style={{
                flex: 1, textAlign: 'center', padding: '8px 4px',
                background: '#0e1117', borderRadius: 8,
                border: `1px solid ${n > 0 ? TIER_COLOR[t] + '44' : 'transparent'}`,
              }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: TIER_COLOR[t] }}>{n}</div>
                <div style={{ fontSize: 10, color: 'var(--dim2)' }}>{TIER_LABEL[t]}</div>
              </div>
            );
          })}
        </div>
        {balance !== null && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--dim)' }}>
            Denge puanı <b style={{ color: balance > 70 ? '#86efac' : '#fbbf24' }}>{balance}</b>
            {balance <= 70 && ' — bir kategoride yığılma var'}
          </div>
        )}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: 'var(--panel)', border: '1px solid var(--line)',
  borderRadius: 12, padding: '12px 14px',
};
const label: React.CSSProperties = {
  fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase',
  color: 'var(--dim2)',
};
const roleBox: React.CSSProperties = {
  border: '1px solid var(--line)', borderRadius: 8, padding: '4px 9px',
  fontSize: 12.5,
};
const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '7px 0', borderBottom: '1px solid var(--line)', fontSize: 13.5,
};
