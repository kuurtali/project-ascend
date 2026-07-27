/**
 * İLERLEME EKRANI + TERFİ ANI
 *
 * Terfi: Main slot ALTIN kademeye ulaşınca eski Main aşağı iner, ağaçtaki
 * bir üst düğüm Main olur. Takvimle değil mastery ile. (D-046, S-1)
 *
 * Bu, oyunun en iyi ödül anı — boss'tan daha güçlü, çünkü boss yılda bir
 * yenilir, terfi ayda bir olur. (SECOND_BRAIN 18.12)
 */

import { useMemo } from 'react';
import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState, SlotRole } from '../engine/types';
import { MASTERY_TIERS } from '../engine/types';
import { balanceScore, indexMovements, isOpen, levelOf, proximity } from '../engine/mastery';
import { pathTo, shouldPromote } from '../engine/planner';
import { WEEK } from '../program';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

const TIER_COLOR: Record<string, string> = {
  bronze: '#cd7f32', silver: '#c4c9d4', gold: '#f5c542', master: '#a855f7',
};
const TIER_LABEL: Record<string, string> = {
  bronze: 'Bronz', silver: 'Gümüş', gold: 'Altın', master: 'Master',
};

/** Kullanıcının uzun vadeli hedefleri — terfi zinciri bunlara bakar. */
const GOALS: { id: string; label: string }[] = [
  { id: 'hspu', label: 'Handstand Push-up' },
  { id: 'bar-muscle-up', label: 'Muscle-up' },
  { id: 'front-lever', label: 'Front Lever' },
  { id: 'l-sit', label: 'L-Sit' },
];

export function Progress({ state }: { state: PlayerState }) {
  const level = levelOf(DB, state.xp);
  const balance = balanceScore(DB, state);

  /** Programdaki Main slotlar — terfiye hazır olan var mı */
  const promotions = useMemo(() => {
    const mains = new Set<string>();
    for (const day of WEEK) {
      for (const ex of day.exercises) {
        if (ex.role === 'main') mains.add(ex.movementId);
      }
    }
    return [...mains]
      .filter((id) => shouldPromote(state, id))
      .map((id) => {
        const mv = IDX.get(id)!;
        // Bir üst düğüm: bu hareketin açtıklarından çalışılabilir en düşük tier
        const next = mv.unlocks
          .map((u) => IDX.get(u))
          .filter((m): m is NonNullable<typeof m> => !!m)
          .filter((m) => isOpen(state, m))
          .sort((a, b) => a.tier - b.tier)[0];
        return { from: mv, to: next ?? null };
      });
  }, [state]);

  const stats = useMemo(() => {
    const all = DB.movements;
    const withTier = all.filter((m) => state.mastery[m.id]?.tier);
    const open = all.filter((m) => isOpen(state, m));
    const bosses = all.filter((m) => m.isBoss);
    const bossDone = bosses.filter((m) => state.mastery[m.id]?.tier);
    const sessions = new Set(state.logs.map((l) => l.date)).size;
    return {
      total: all.length, withTier: withTier.length, open: open.length,
      boss: bosses.length, bossDone: bossDone.length, sessions,
    };
  }, [state]);

  /** Hedeflere kalan mesafe */
  const goals = useMemo(() =>
    GOALS.map((g) => {
      const path = pathTo(DB, IDX, g.id);
      const done = path.filter((m) => state.mastery[m.id]?.tier).length;
      return { ...g, done, total: path.length };
    }), [state]);

  /** Sonraki kademeye en yakın 5 hareket — motivasyon listesi */
  const closest = useMemo(() => {
    return DB.movements
      .filter((m) => state.mastery[m.id]?.tier != null || isOpen(state, m))
      .map((m) => proximity(state, m))
      .filter((p) => p.remaining != null && p.remaining > 0 && p.best > 0)
      .sort((a, b) => (a.remaining ?? 0) - (b.remaining ?? 0))
      .slice(0, 5);
  }, [state]);

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '12px 14px 40px' }}>

      {/* terfi — en üstte, çünkü en büyük olay */}
      {promotions.map((p) => (
        <div key={p.from.id} style={{
          ...card, borderColor: '#7F77DD', background: '#1a1533', marginBottom: 12,
        }}>
          <div style={{ ...label, color: '#a89ff5' }}>TERFİ HAZIR</div>
          <div style={{ fontSize: 16, fontWeight: 500, margin: '6px 0 2px' }}>
            {p.from.name} altın kademede
          </div>
          {p.to ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.5 }}>
                Ana hareket <b style={{ color: '#e6e8ee' }}>{p.to.name}</b> oluyor.
                {' '}{p.from.name} yardımcı statüsüne iniyor — silinmiyor, rolü değişiyor.
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
                fontSize: 12.5,
              }}>
                <span style={{ ...roleBox, color: '#8b93a5' }}>{p.from.name}</span>
                <span style={{ color: '#a89ff5' }}>→ secondary</span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12.5,
              }}>
                <span style={{ ...roleBox, color: '#a89ff5', borderColor: '#7F77DD' }}>
                  {p.to.name}
                </span>
                <span style={{ color: '#a89ff5' }}>→ main</span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--dim)' }}>
              Sıradaki düğüm henüz kilitli — ön koşulları tamamlayınca terfi açılır.
            </div>
          )}
        </div>
      ))}

      {/* seviye ve özet */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, display: 'grid',
            placeItems: 'center', fontWeight: 600, fontSize: 18, color: '#0b0d12',
            background: 'linear-gradient(135deg,#f5c542,#a855f7)',
          }}>{level}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Seviye {level}</div>
            <div style={{ fontSize: 12, color: 'var(--dim)' }}>
              {state.xp.toLocaleString('tr')} XP · {stats.sessions} seans
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Stat n={stats.withTier} d={stats.total} t="hareket" />
          <Stat n={stats.open} d={stats.total} t="açık" />
          <Stat n={stats.bossDone} d={stats.boss} t="boss" />
          <Stat n={balance ?? 0} d={100} t="denge" />
        </div>
      </div>

      {/* yakınlık — günlük motor */}
      {closest.length > 0 && (
        <div style={{ ...card, marginTop: 10 }}>
          <div style={label}>SONRAKİ KADEMEYE EN YAKIN</div>
          {closest.map((p) => (
            <div key={p.movementId} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 0', borderBottom: '1px solid var(--line)', fontSize: 13.5,
            }}>
              <span style={{ flex: 1 }}>{IDX.get(p.movementId)?.name}</span>
              <span style={{ fontSize: 12, color: 'var(--dim)' }}>
                {p.best}/{p.nextTarget}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: TIER_COLOR[p.nextTier ?? 'bronze'],
              }}>
                {p.remaining} kaldı
              </span>
            </div>
          ))}
        </div>
      )}

      {/* hedefler */}
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
              <div style={{
                height: 6, background: '#20252f', borderRadius: 99, marginTop: 4,
              }}>
                <div style={{
                  height: '100%', width: `${pct}%`, borderRadius: 99,
                  background: 'linear-gradient(90deg,#f5c542,#a855f7)',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* kademe dağılımı */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>KADEME DAĞILIMI</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {MASTERY_TIERS.map((t) => {
            const n = DB.movements.filter((m) => state.mastery[m.id]?.tier === t).length;
            return (
              <div key={t} style={{
                flex: 1, textAlign: 'center', padding: '8px 4px',
                background: '#0e1117', borderRadius: 8,
              }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: TIER_COLOR[t] }}>{n}</div>
                <div style={{ fontSize: 10, color: 'var(--dim2)' }}>{TIER_LABEL[t]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ n, d, t }: { n: number; d: number; t: string }) {
  return (
    <div style={{
      flex: 1, textAlign: 'center', padding: '8px 2px',
      background: '#0e1117', borderRadius: 8,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>
        {n}<span style={{ fontSize: 11, color: 'var(--dim2)' }}>/{d}</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--dim2)' }}>{t}</div>
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
};

export type { SlotRole };
