/**
 * AĞAÇ EKRANI — 197 düğümün tamamı
 *
 * Ana görünüm. Soldan sağa = ağaç derinliği, yukarıdan aşağı = kategori
 * bandı. Dokunmatikte tek parmak sürükle = gez, iki parmak = yakınlaş.
 *
 * Ağaç haftalık yönelim aracıdır; günlük motor Bugün ekranındaki
 * yakınlık göstergesi. (SECOND_BRAIN D-049)
 */

import { useMemo, useRef, useState } from 'react';
import dbJson from '../data/movements.json';
import layoutJson from '../data/layout.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { MASTERY_TIERS } from '../engine/types';
import { equipmentOk, indexMovements, isExcluded, isOpen, proximity } from '../engine/mastery';
import { bossStates } from '../engine/game';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

interface Layout {
  canvas: { w: number; h: number };
  bands: Record<string, { y: number; h: number; rows: number }>;
  catOrder: string[];
  pos: Record<string, [number, number]>;
}
const L = layoutJson as unknown as Layout;

const TIER_COLOR: Record<string, string> = {
  bronze: '#cd7f32', silver: '#c4c9d4', gold: '#f5c542', master: '#a855f7',
};
const TIER_LABEL: Record<string, string> = {
  bronze: 'Bronz', silver: 'Gümüş', gold: 'Altın', master: 'Master',
};

type Filter = 'all' | 'open' | 'next' | 'boss';

export function Tree({ state }: { state: PlayerState }) {
  const [sel, setSel] = useState<string | null>(null);
  const [gps, setGps] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const [view, setView] = useState({ x: 8, y: 8, k: 0.35 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const pinch = useRef<{ d: number; k: number } | null>(null);

  /** GPS: hedefe giden tüm atalar */
  const ancestors = useMemo(() => {
    if (!gps) return null;
    const set = new Set<string>();
    const stack = [gps];
    while (stack.length) {
      const id = stack.pop()!;
      for (const p of IDX.get(id)?.prerequisites ?? []) {
        if (!set.has(p)) { set.add(p); stack.push(p); }
      }
    }
    set.add(gps);
    return set;
  }, [gps]);

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    const vis = new Set<string>();
    for (const mv of DB.movements) {
      let ok = true;
      if (filter === 'open') ok = isOpen(state, mv);
      else if (filter === 'boss') ok = mv.isBoss;
      else if (filter === 'next') {
        const missing = mv.prerequisites.filter((p) => !state.mastery[p]?.tier);
        ok = (isOpen(state, mv) && !state.mastery[mv.id]?.tier) || missing.length === 1;
      }
      if (ok && query) ok = mv.name.toLowerCase().includes(query);
      if (ok && ancestors) ok = ancestors.has(mv.id);
      if (ok) vis.add(mv.id);
    }
    return vis;
  }, [state, filter, q, ancestors]);

  // ── dokunma / fare
  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || pinch.current) return;
    setView((v) => ({
      ...v,
      x: drag.current!.vx + (e.clientX - drag.current!.x),
      y: drag.current!.vy + (e.clientY - drag.current!.y),
    }));
  }
  function onPointerUp() { drag.current = null; }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0]!, e.touches[1]!];
      pinch.current = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), k: view.k };
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      const [a, b] = [e.touches[0]!, e.touches[1]!];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const k = Math.max(0.12, Math.min(2.2, pinch.current.k * (d / pinch.current.d)));
      setView((v) => ({ ...v, k }));
    }
  }
  function onTouchEnd() { pinch.current = null; }

  function onWheel(e: React.WheelEvent) {
    const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setView((v) => ({ ...v, k: Math.max(0.12, Math.min(2.2, v.k * f)) }));
  }

  function zoom(f: number) {
    setView((v) => ({ ...v, k: Math.max(0.12, Math.min(2.2, v.k * f)) }));
  }
  function fit() {
    const w = window.innerWidth - 16;
    const k = Math.min(w / L.canvas.w, (window.innerHeight - 200) / L.canvas.h) * 0.95;
    setView({ x: 8, y: 8, k });
  }

  const selMv = sel ? IDX.get(sel) : null;
  const selProx = selMv ? proximity(state, selMv) : null;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* araç çubuğu */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--line)' }}>
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Hareket ara…"
          style={{
            width: '100%', height: 38, borderRadius: 8, padding: '0 10px',
            background: '#0d1016', border: '1px solid var(--line)', color: 'var(--txt)',
          }}
        />
        <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto' }}>
          {([['all', 'tümü'], ['open', 'açık'], ['next', 'sırada'], ['boss', 'boss']] as const)
            .map(([k, lbl]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                ...chip,
                borderColor: filter === k ? '#f5c542' : 'var(--line)',
                color: filter === k ? '#f5c542' : 'var(--dim)',
              }}>{lbl}</button>
            ))}
          {gps && (
            <button onClick={() => setGps(null)} style={{ ...chip, borderColor: '#22d3ee', color: '#22d3ee' }}>
              yolu gizle
            </button>
          )}
        </div>
      </div>

      {/* tuval */}
      <div
        style={{ flex: 1, overflow: 'hidden', position: 'relative', touchAction: 'none' }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        <div style={{
          position: 'absolute', transformOrigin: '0 0',
          transform: `translate(${view.x}px,${view.y}px) scale(${view.k})`,
        }}>
          <svg width={L.canvas.w} height={L.canvas.h}>
            <defs>
              <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <style>{`
                @keyframes nodePulse { 0%,100% { opacity:.30 } 50% { opacity:.85 } }
                .aura { animation: nodePulse 2.4s ease-in-out infinite }
                @keyframes edgeFlow { to { stroke-dashoffset: -24 } }
                .flow { stroke-dasharray: 6 6; animation: edgeFlow 1.2s linear infinite }
              `}</style>
            </defs>
            {/* kategori bantları */}
            {L.catOrder.map((c) => {
              const b = L.bands[c];
              if (!b) return null;
              return (
                <g key={c}>
                  <rect x={0} y={b.y - 14} width={L.canvas.w} height={b.h + 22}
                        rx={10} fill="#ffffff05" />
                  <text x={10} y={b.y - 20} fontSize={11} fill="#5b6376"
                        letterSpacing="1.4">
                    {DB.categories[c]?.label?.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* kenarlar */}
            {DB.movements.map((mv) =>
              mv.prerequisites.map((p) => {
                const a = L.pos[p]; const b = L.pos[mv.id];
                if (!a || !b) return null;
                const dim = !visible.has(p) || !visible.has(mv.id);
                const onPath = ancestors?.has(p) && ancestors?.has(mv.id);
                const active = state.mastery[p]?.tier && isOpen(state, mv);
                return (
                  <path key={`${p}-${mv.id}`}
                    d={`M${a[0] + 85},${a[1]} C${(a[0] + b[0]) / 2},${a[1]} ${(a[0] + b[0]) / 2},${b[1]} ${b[0] - 85},${b[1]}`}
                    fill="none"
                    className={onPath ? 'flow' : undefined}
                    stroke={onPath ? '#22d3ee' : active ? '#f5c54288' : '#2b323f'}
                    strokeWidth={onPath ? 2.6 : active ? 2 : 1.4}
                    opacity={dim ? 0.12 : 1} />
                );
              }),
            )}

            {/* düğümler */}
            {DB.movements.map((mv) => {
              const p = L.pos[mv.id];
              if (!p) return null;
              const tier = state.mastery[mv.id]?.tier ?? null;
              const open = isOpen(state, mv);
              const usable = equipmentOk(state, mv) && !isExcluded(state, mv.id);
              const dim = !visible.has(mv.id);
              const stroke = tier ? TIER_COLOR[tier]!
                : open ? (DB.categories[mv.category]?.color ?? '#888') : '#242a36';
              const fill = tier
                ? ['#2a1d10', '#232732', '#33290c', '#2a1740'][MASTERY_TIERS.indexOf(tier)]!
                : open ? '#151a24' : '#13161d';
              const label = mv.name.length > 24 ? mv.name.slice(0, 23) + '…' : mv.name;
              // "sırada": açık, henüz kademe yok — hedeflenecek düğüm
              const upNext = open && !tier && usable;
              const aura = mv.isBoss
                ? (tier ? TIER_COLOR[tier]! : '#e24b4a')
                : tier ? TIER_COLOR[tier]! : upNext ? '#22d3ee' : null;
              return (
                <g key={mv.id} opacity={dim ? 0.14 : 1}
                   onClick={() => setSel(mv.id)} style={{ cursor: 'pointer' }}>
                  {/* hale — kazanılmış ve boss düğümler ışır */}
                  {aura && !dim && (
                    <rect x={p[0] - 88} y={p[1] - 18} width={176} height={36} rx={11}
                          fill="none" stroke={aura}
                          strokeWidth={mv.isBoss ? 3 : 2}
                          className={upNext || (mv.isBoss && !tier) ? 'aura' : undefined}
                          opacity={upNext || (mv.isBoss && !tier) ? undefined : 0.32}
                          filter="url(#glow)" />
                  )}
                  <rect x={p[0] - 85} y={p[1] - 15} width={170} height={30} rx={8}
                        fill={fill} stroke={sel === mv.id ? '#fff' : stroke}
                        strokeWidth={sel === mv.id ? 3 : mv.isBoss ? 2.5 : 1.5}
                        strokeDasharray={!usable && !tier ? '4 3' : undefined} />
                  {mv.isBoss && (
                    <text x={p[0] - 85} y={p[1] - 19} fontSize={13}
                          fill={tier ? TIER_COLOR[tier]! : '#e24b4a'}>♛</text>
                  )}
                  <text x={p[0] - 77} y={p[1] + 4} fontSize={11}
                        fill={open || tier ? '#e6e8ee' : '#4e5666'}>
                    {label}
                  </text>
                  <text x={p[0] + 79} y={p[1] + 4} fontSize={9}
                        fill={tier ? TIER_COLOR[tier]! : '#8b93a5'} textAnchor="end">
                    {tier ? '●'.repeat(MASTERY_TIERS.indexOf(tier) + 1) : `T${mv.tier}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* yakınlaştırma */}
        <div style={{ position: 'absolute', right: 10, bottom: 10, display: 'flex', gap: 6 }}>
          <button style={zoomBtn} onClick={() => zoom(1.25)}>+</button>
          <button style={zoomBtn} onClick={() => zoom(1 / 1.25)}>−</button>
          <button style={{ ...zoomBtn, width: 'auto', padding: '0 12px' }} onClick={fit}>sığdır</button>
        </div>
      </div>

      {/* detay sayfası */}
      {selMv && (
        <div style={{
          borderTop: '1px solid var(--line)', background: 'var(--panel)',
          padding: '12px 14px 18px', maxHeight: '48dvh', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>
              {selMv.isBoss ? '★ ' : ''}{selMv.name}
            </h3>
            <button onClick={() => setSel(null)}
              style={{ marginLeft: 'auto', ...chip }}>kapat</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
            <span style={{ ...pill, borderColor: DB.categories[selMv.category]?.color }}>
              {DB.categories[selMv.category]?.label}
            </span>
            <span style={pill}>Tier {selMv.tier}</span>
            <span style={pill}>{selMv.measure.sets > 1 ? `${selMv.measure.sets}×` : ''}{selMv.measure.unit}</span>
            {isExcluded(state, selMv.id) && (
              <span style={{ ...pill, borderColor: '#e24b4a', color: '#e24b4a' }}>kısıt: listede değil</span>
            )}
          </div>

          {selMv.isBoss && (() => {
            const b = bossStates(DB, state).find((x) => x.movement.id === selMv.id);
            if (!b) return null;
            return (
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', fontSize: 11.5, color: 'var(--dim)' }}>
                  <span style={{ flex: 1 }}>
                    BOSS · {b.prereqDone}/{b.prereqTotal} ön koşul tamam
                  </span>
                  <span style={{ color: b.defeated ? '#86efac' : '#e24b4a' }}>
                    {b.defeated ? 'YENİLDİ' : `${b.hp} HP`}
                  </span>
                </div>
                <div style={{
                  height: 8, background: '#20252f', borderRadius: 99, marginTop: 4,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${b.hp}%`,
                    background: 'linear-gradient(90deg,#791f1f,#e24b4a)',
                    transition: 'width .6s ease',
                  }} />
                </div>
              </div>
            );
          })()}

          {selProx?.remaining != null && selProx.remaining > 0 && (
            <div style={{
              fontSize: 13, padding: '7px 9px', borderRadius: 8, background: '#1a1d24',
              color: TIER_COLOR[selProx.nextTier ?? 'bronze'], marginBottom: 8,
            }}>
              {TIER_LABEL[selProx.nextTier ?? '']} {selProx.nextTarget}'de ·
              sende {selProx.best} · <b>{selProx.remaining} kaldı</b>
            </div>
          )}

          <div style={{ fontSize: 12.5, color: 'var(--dim)', marginBottom: 6 }}>
            {MASTERY_TIERS.map((t) => (
              <span key={t} style={{ marginRight: 10 }}>
                <span style={{ color: TIER_COLOR[t] }}>●</span> {selMv.mastery[t].target}
              </span>
            ))}
          </div>

          <Section title={`Ön koşullar (${selMv.prerequisites.length})`}>
            {selMv.prerequisites.length === 0
              ? <span style={{ color: 'var(--dim)' }}>Yok — başlangıç hareketi.</span>
              : selMv.prerequisites.map((p) => (
                  <a key={p} onClick={() => setSel(p)} style={link}>
                    {state.mastery[p]?.tier ? '✓' : '○'} {IDX.get(p)?.name}
                  </a>
                ))}
          </Section>

          <Section title={`Neyin kilidini açar (${selMv.unlocks.length})`}>
            {selMv.unlocks.length === 0
              ? <span style={{ color: 'var(--dim)' }}>
                  Yaprak{selMv.isBoss ? ' — boss' : selMv.isAccessory ? ' — aksesuar' : ''}.
                </span>
              : selMv.unlocks.map((u) => (
                  <a key={u} onClick={() => setSel(u)} style={link}>→ {IDX.get(u)?.name}</a>
                ))}
          </Section>

          <button style={{ ...chip, marginTop: 4 }}
            onClick={() => setGps(gps === selMv.id ? null : selMv.id)}>
            {gps === selMv.id ? 'yolu gizle' : 'bu hedefe giden yolu göster'}
          </button>

          <Section title="İpuçları">
            <ul style={{ margin: 0, paddingLeft: 16, color: '#c2c8d4', fontSize: 12.5 }}>
              {selMv.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>
          <Section title="Sık hatalar">
            <ul style={{ margin: 0, paddingLeft: 16, color: '#c2c8d4', fontSize: 12.5 }}>
              {selMv.commonMistakes.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase',
        color: '#5b6376', marginBottom: 4,
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13 }}>
        {children}
      </div>
    </div>
  );
}

const chip: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--line)', borderRadius: 99,
  padding: '6px 12px', fontSize: 12, color: 'var(--dim)', cursor: 'pointer',
  whiteSpace: 'nowrap',
};
const pill: React.CSSProperties = {
  border: '1px solid var(--line)', borderRadius: 99, padding: '2px 9px',
  fontSize: 10.5, color: 'var(--dim)',
};
const link: React.CSSProperties = { color: '#7dd3fc', cursor: 'pointer' };
const zoomBtn: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 10, border: '1px solid var(--line)',
  background: '#11141bdd', color: 'var(--txt)', fontSize: 16, cursor: 'pointer',
};
