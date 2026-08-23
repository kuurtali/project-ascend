/**
 * AĞAÇ EKRANI — 197 düğümün tamamı, ve artık çalışılabilir yüzey
 *
 * Soldan sağa = ağaç derinliği, yukarıdan aşağı = kategori bandı.
 * Dokunmatikte tek parmak sürükle = gez, iki parmak = yakınlaş.
 *
 * !!! ROL DEĞİŞTİ (D-066). Ağaç uzun süre salt okunur bir haritaydı:
 * bakıyordun, kapatıyordun, iş Bugün ekranında oluyordu. Ama sistemin
 * ana mantığı ağaç — "şu hareketten şu kadar yaptım, sıradakine
 * geçebilir miyim" sorusu burada sorulup burada cevaplanmalı.
 *
 * Artık her düğümden doğrudan tekrar girilebiliyor ve her düğüm o
 * hareketten ne kadar biriktiğini gösteriyor. Program şablonu tek
 * giriş yolu olmaktan çıktı; ağaçtan çalışmak da bir yol.
 */

import { useMemo, useRef, useState } from 'react';
import dbJson from '../data/movements.json';
import layoutJson from '../data/layout.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { MASTERY_TIERS } from '../engine/types';
import { equipmentOk, indexMovements, isExcluded, isOpen, proximity } from '../engine/mastery';
import { bossStates } from '../engine/game';
import { volumeBlockers, volumeGate } from '../engine/promotion';
import { recordSession } from '../storage';
import { Figure } from './figure/Figure';

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

export function Tree({ state, onState }: {
  state: PlayerState;
  onState?: (s: PlayerState) => void;
}) {
  // Ağaç tüm kayıt geçmişini tek seferde okuyan en ağır ekran. Load sınırı
  // zaten normalize eder; bu ikinci emniyet kemeri hot-update sırasında eski
  // state nesnesi bir render daha yaşarsa bütün uygulamanın düşmesini önler.
  const logs = Array.isArray(state.logs) ? state.logs : [];
  const mastery = state.mastery && typeof state.mastery === 'object'
    ? state.mastery : {};
  const equipment = Array.isArray(state.equipment) ? state.equipment : [];
  const constraints = Array.isArray(state.constraints)
    ? state.constraints.filter((c) => Array.isArray(c?.excludedMovements)) : [];
  const safeState = useMemo(() => ({
    ...state, logs, mastery, equipment, constraints,
  }), [state, logs, mastery, equipment, constraints]);
  const [sel, setSel] = useState<string | null>(null);
  const [gps, setGps] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [reps, setReps] = useState('');
  const [flash, setFlash] = useState<string | null>(null);
  /** Kilidi elle aşan düğüm. Id tutuluyor ki başka düğüme geçince sıfırlansın. */
  const [force, setForce] = useState<string | null>(null);

  /**
   * Hareket başına biriken hacim, tek geçişte.
   *
   * Düğüm başına hesaplamak 197 × kayıt sayısı demek olurdu ve her
   * kaydırmada yeniden koşardı. Kalibrasyon kaydı sayılmaz — o tek
   * setlik bir ölçüm, biriken çalışma değil.
   */
  const volumes = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of logs) {
      if (l.kind === 'calibration') continue;
      if (!Array.isArray(l.values)) continue;
      m.set(l.movementId,
        (m.get(l.movementId) ?? 0) + l.values.reduce((a, b) => a + b, 0));
    }
    return m;
  }, [logs]);

  /** Düğümden doğrudan kayıt — ağaçtan çalışmanın tek adımı */
  function logHere(id: string) {
    const n = Number(reps);
    if (!onState || !Number.isFinite(n) || n <= 0) return;
    const res = recordSession(DB, IDX as never, state, [{ movementId: id, values: [n] }]);
    onState(res.state);
    setReps('');
    setFlash(res.tierUps.length > 0
      ? `+${n} · ${TIER_LABEL[res.tierUps.at(-1)!.tier]} kademe!`
      : `+${n} kaydedildi`);
    try { navigator.vibrate?.(res.tierUps.length ? 40 : 15); } catch { /* geç */ }
    setTimeout(() => setFlash(null), 2600);
  }

  const focus = state.focus ?? [];

  /**
   * Açılış görünümü.
   *
   * Eskiden ağaç her seferinde 0.35 ölçekte, sol üstten açılıyordu —
   * telefonda 197 minik kutudan oluşan bir duvar. Oysa kullanıcının
   * ilgilendiği yer belli: çalıştığı hareketler. Varsa oraya odaklı
   * açılır, yoksa eski davranış sürer.
   */
  const [view, setView] = useState(() => {
    const first = (state.focus ?? [])[0];
    const p = first ? L.pos[first] : null;
    if (!p) return { x: 8, y: 8, k: 0.35 };
    const k = 0.8;
    return {
      k,
      x: (typeof window === 'undefined' ? 380 : window.innerWidth) / 2 - p[0] * k,
      y: (typeof window === 'undefined' ? 640 : window.innerHeight) / 2 - p[1] * k - 90,
    };
  });

  /** Bir düğümü ekranın ortasına getir ve seç */
  function jumpTo(id: string) {
    const p = L.pos[id];
    if (!p) return;
    const k = Math.max(view.k, 0.7);
    setView({
      k,
      x: window.innerWidth / 2 - p[0] * k,
      y: window.innerHeight / 2 - p[1] * k - 90,
    });
    setSel(id);
    setReps('');
  }

  function toggleFocus(id: string) {
    if (!onState) return;
    const cur = state.focus ?? [];
    onState({
      ...state,
      focus: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    });
  }
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
      if (filter === 'open') ok = isOpen(safeState, mv);
      else if (filter === 'boss') ok = mv.isBoss;
      else if (filter === 'next') {
        const missing = mv.prerequisites.filter((p) => !mastery[p]?.tier);
        ok = (isOpen(safeState, mv) && !mastery[mv.id]?.tier) || missing.length === 1;
      }
      if (ok && query) ok = mv.name.toLowerCase().includes(query);
      if (ok && ancestors) ok = ancestors.has(mv.id);
      if (ok) vis.add(mv.id);
    }
    return vis;
  }, [safeState, mastery, filter, q, ancestors]);

  // ── dokunma / fare
  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    const start = drag.current;
    if (!start || pinch.current) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    setView((v) => ({
      ...v,
      // React bu updater'i pointerup'tan sonra calistirabilir. Bu nedenle
      // sifirlanabilen ref'i degil, olay anindaki degismez kopyayi kullan.
      x: start.vx + dx,
      y: start.vy + dy,
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
  const selProx = selMv ? proximity(safeState, selMv) : null;

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

        {/* ÇALIŞTIKLARIM — 197 düğümde asıl sorun gezinmek değil,
            her seferinde aynı beşini bulmak. Dokun, oraya uçar. */}
        {focus.length > 0 && (
          <div style={{
            display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto',
            paddingBottom: 2,
          }}>
            {focus.map((id) => {
              const mv = IDX.get(id);
              if (!mv) return null;
              const vol = volumes.get(id) ?? 0;
              const gate = volumeGate(mv);
              const full = vol >= gate;
              return (
                <button key={id} onClick={() => jumpTo(id)} style={{
                  flexShrink: 0, background: '#12151c', cursor: 'pointer',
                  border: `1px solid ${full ? '#1D9E75' : 'var(--line)'}`,
                  borderRadius: 9, padding: '5px 9px', textAlign: 'left',
                  color: 'inherit', minWidth: 108,
                }}>
                  <div style={{
                    fontSize: 11.5, color: '#e6e8ee', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130,
                  }}>{mv.name}</div>
                  <div style={{
                    height: 3, background: '#20252f', borderRadius: 99, marginTop: 4,
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${Math.min(100, (vol / gate) * 100)}%`,
                      background: full ? '#1D9E75' : '#22d3ee',
                    }} />
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--dim2)', marginTop: 3 }}>
                    {full ? 'eşik doldu' : `${vol} / ${gate}`}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* tuval */}
      <div
        aria-label="hareket ağacı tuvali"
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
                const active = mastery[p]?.tier && isOpen(safeState, mv);
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
              const tier = mastery[mv.id]?.tier ?? null;
              const open = isOpen(safeState, mv);
              const usable = equipmentOk(safeState, mv) && !isExcluded(safeState, mv.id);
              const dim = !visible.has(mv.id);
              const stroke = tier ? TIER_COLOR[tier]!
                : open ? (DB.categories[mv.category]?.color ?? '#888') : '#242a36';
              const fill = tier
                ? ['#2a1d10', '#232732', '#33290c', '#2a1740'][MASTERY_TIERS.indexOf(tier)]!
                : open ? '#151a24' : '#13161d';
              const label = mv.name.length > 24 ? mv.name.slice(0, 23) + '…' : mv.name;
              const vol = volumes.get(mv.id) ?? 0;
              const gate = volumeGate(mv);
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
                  {/* Hacim çubuğu — çalışılmış her düğümde. Ağacın
                      "ne kadar yaptım" sorusunu uzaktan bakınca da
                      cevaplaması için; detay panelini açmak gerekmesin. */}
                  {vol > 0 && (
                    <>
                      <rect x={p[0] - 85} y={p[1] + 11} width={170} height={3}
                            rx={2} fill="#20252f" />
                      <rect x={p[0] - 85} y={p[1] + 11} height={3} rx={2}
                            width={170 * Math.min(1, vol / gate)}
                            fill={vol >= gate ? '#1D9E75' : '#22d3ee'} />
                    </>
                  )}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              flexShrink: 0, width: 92, height: 92, borderRadius: 10,
              background: '#0d1016', border: '1px solid var(--line)',
              display: 'grid', placeItems: 'center',
            }}>
              <Figure movementId={selMv.id} family={selMv.family} size={84}
                      color={mastery[selMv.id]?.tier
                        ? TIER_COLOR[mastery[selMv.id]!.tier!]
                        : selMv.isBoss ? '#e24b4a' : '#c2c8d4'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>
                {selMv.isBoss ? '★ ' : ''}{selMv.name}
              </h3>
              <div style={{ fontSize: 11.5, color: 'var(--dim2)', marginTop: 2 }}>
                {DB.categories[selMv.category]?.label} · Tier {selMv.tier}
              </div>
            </div>
            {onState && (
              <button onClick={() => toggleFocus(selMv.id)} title="çalıştıklarıma ekle"
                style={{
                  ...chip, padding: '6px 10px',
                  borderColor: focus.includes(selMv.id) ? '#f5c542' : 'var(--line)',
                  color: focus.includes(selMv.id) ? '#f5c542' : 'var(--dim)',
                }}>
                {focus.includes(selMv.id) ? '★' : '☆'}
              </button>
            )}
            <button onClick={() => setSel(null)} style={chip}>kapat</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
            <span style={{ ...pill, borderColor: DB.categories[selMv.category]?.color }}>
              {DB.categories[selMv.category]?.label}
            </span>
            <span style={pill}>Tier {selMv.tier}</span>
            <span style={pill}>{selMv.measure.sets > 1 ? `${selMv.measure.sets}×` : ''}{selMv.measure.unit}</span>
            {isExcluded(safeState, selMv.id) && (
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

          {/* ─────────────────────────── ÇALIŞ
              Ağacın asıl işi burada: "şu hareketten şu kadar yaptım."
              Kayıt buradan da girilebiliyor, program şablonundan da —
              ikisi de aynı kayda yazıyor, aynı kademeyi besliyor. */}
          {onState && (() => {
            const vol = volumes.get(selMv.id) ?? 0;
            const gate = volumeGate(selMv);
            const pct = Math.min(100, Math.round((vol / gate) * 100));
            const full = vol >= gate;
            const ready = selMv.unlocks.filter((u) => {
              const n = IDX.get(u);
              return n && equipmentOk(safeState, n) && !isExcluded(safeState, u);
            });

            const unit = selMv.measure.unit;
            const nextName = ready.length > 0 ? IDX.get(ready[0]!)?.name : null;
            const blockers = volumeBlockers(IDX, safeState, selMv);
            const forced = force === selMv.id;
            const iso = new Date().toISOString().slice(0, 10);
            const bugun = logs
              .filter((l) => l.movementId === selMv.id && l.date === iso
                          && l.kind !== 'calibration')
              .reduce((n, l) => n + l.values.reduce((a, b) => a + b, 0), 0);

            return (
              <div style={{
                border: `1px solid ${full ? '#1D9E75' : 'var(--line)'}`,
                background: full ? '#0d2019' : '#12151c',
                borderRadius: 10, padding: '9px 11px', margin: '4px 0 10px',
              }}>
                {/* GÖREV — kullanıcının açıkça istediği satır.
                    "Şu hareketten şu kadar yap, sonra şu açılır."
                    Hacim çubuğu mesafeyi gösteriyordu ama HEDEFİ
                    söylemiyordu; sayı ile anlam arasındaki bağı bu
                    cümle kuruyor. */}
                <div style={{
                  fontSize: 10, letterSpacing: '.09em', color: 'var(--dim2)',
                }}>GÖREV</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, margin: '3px 0 9px' }}>
                  <b style={{ color: full ? '#5DCAA5' : '#f5c542' }}>
                    {gate} {unit}
                  </b>{' '}
                  {selMv.name} yap
                  {nextName && (
                    <> → <b style={{ color: '#a89ff5' }}>{nextName}</b> açılır</>
                  )}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 11.5, color: 'var(--dim)',
                }}>
                  <span>
                    BİRİKEN {unit.toUpperCase()}
                    {bugun > 0 && (
                      <span style={{ color: '#5DCAA5' }}> · bugün +{bugun}</span>
                    )}
                  </span>
                  <span style={{ color: full ? '#5DCAA5' : '#22d3ee' }}>
                    <b>{vol}</b> / {gate}
                  </span>
                </div>
                <div style={{
                  height: 6, background: '#20252f', borderRadius: 99,
                  marginTop: 5, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 99,
                    background: full ? '#1D9E75' : '#22d3ee',
                    transition: 'width .5s ease',
                  }} />
                </div>

                {/* KİLİT — ön koşulun hedefi bitmeden buraya sayı girilmez.
                    Bu olmadan kullanıcı "tek elle şınav 400" yazabiliyordu
                    ve sistem buna inanıyordu. (D-067) */}
                {blockers.length > 0 && !forced ? (
                  <div style={{
                    marginTop: 9, padding: '9px 10px', borderRadius: 9,
                    background: '#1a1206', border: '1px solid #4a3d10',
                  }}>
                    <div style={{ fontSize: 12.5, color: '#f5c542', lineHeight: 1.5 }}>
                      🔒 Önce bir önceki hedefi bitir
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8,
                    }}>
                      {blockers.map((b) => (
                        <button key={b.id} onClick={() => jumpTo(b.id)} style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', gap: 8, width: '100%',
                          background: '#12151c', border: '1px solid var(--line)',
                          borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
                          color: 'inherit', textAlign: 'left', fontSize: 12.5,
                        }}>
                          <span style={{
                            flex: 1, minWidth: 0, overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{b.name}</span>
                          <span style={{ color: '#22d3ee', flexShrink: 0 }}>
                            {b.done} / {b.gate}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setForce(selMv.id)} style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: '#5b6376', fontSize: 11.5, marginTop: 8, padding: 0,
                    }}>
                      yine de gireceğim
                    </button>
                  </div>
                ) : (
                  <>
                    {blockers.length > 0 && (
                      <div style={{ fontSize: 11, color: '#f5c542', marginTop: 8 }}>
                        ⚠ Ön koşul tamamlanmadı — sayı yine de kaydedilecek.
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                      <input
                        type="number" inputMode="numeric" value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder={`kaç ${selMv.measure.unit}?`}
                        style={{
                          flex: 1, minWidth: 0, height: 42, borderRadius: 9,
                          textAlign: 'center', fontSize: 16, background: '#0d1016',
                          border: '1px solid var(--line)', color: 'var(--txt)',
                        }}
                      />
                      <button onClick={() => logHere(selMv.id)} style={{
                        padding: '0 18px', height: 42, borderRadius: 9, border: 'none',
                        background: reps ? '#f5c542' : '#232732',
                        color: reps ? '#0b0d12' : '#5b6376',
                        fontWeight: 600, fontSize: 14,
                        cursor: reps ? 'pointer' : 'default',
                      }}>Yaptım</button>
                    </div>
                  </>
                )}

                {flash && (
                  <div style={{ fontSize: 12, color: '#5DCAA5', marginTop: 7 }}>
                    ✓ {flash}
                  </div>
                )}

                {full ? (
                  <div style={{
                    fontSize: 12.5, color: '#c2c8d4', marginTop: 9, lineHeight: 1.55,
                  }}>
                    <b style={{ color: '#5DCAA5' }}>Eşik doldu.</b>{' '}
                    {ready.length > 0
                      ? 'Sıradakine geçebilirsin:'
                      : 'Bu bir yaprak düğüm — buradan devam eden yol yok.'}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 7 }}>
                      {ready.map((u) => (
                        <button key={u} onClick={() => { setSel(u); setReps(''); }}
                          style={{
                            ...chip, borderColor: '#1D9E75', color: '#5DCAA5',
                          }}>→ {IDX.get(u)?.name}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 11.5, color: 'var(--dim2)', marginTop: 8, lineHeight: 1.5 }}>
                    <b style={{ color: '#c2c8d4' }}>{gate - vol} {unit} kaldı.</b>{' '}
                    Her gün girdiğin üstüne eklenir; arada gün atlaman
                    önemli değil, toplam düşmez.
                  </div>
                )}
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
                    {mastery[p]?.tier ? '✓' : '○'} {IDX.get(p)?.name}
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
