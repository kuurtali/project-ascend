/**
 * BUGÜN EKRANI — mobil öncelikli
 *
 * Kullanım: antrenman sırasında, seti bitirdikçe telefondan giriş.
 * Tek elle mid-set kullanım değil — set arası toplu giriş. (D-051)
 *
 * Ekranın tek işi: bugün ne yapılacak, kaç tane, ve girilen sayıya göre
 * sonraki hedef ne olacak. Ağaç haftalık yönelim aracı; günlük motoru
 * yakınlık göstergesi. (D-049)
 */

import { useMemo, useState } from 'react';
import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { indexMovements, levelOf, proximity } from '../engine/mastery';
import { buildInput, nextTarget } from '../engine/adaptation';
import { dayFor, MENU, type ProgramExercise } from '../program';
import { resolveDay, weeksToDeload, type ResolvedExercise } from '../engine/session';
import { hasBar, recordSession, save } from '../storage';
import { rankOf, streakOf } from '../engine/game';
import { Celebrate, type CelebrationItem } from './Celebrate';
import { Figure } from './figure/Figure';
import { HoldTimer, RestTimer } from './Timer';
import { WeighIn } from './Bodyweight';
import { needsBackupReminder } from './Settings';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

const TIER_LABEL: Record<string, string> = {
  bronze: 'Bronz', silver: 'Gümüş', gold: 'Altın', master: 'Master',
};
const TIER_COLOR: Record<string, string> = {
  bronze: '#cd7f32', silver: '#c4c9d4', gold: '#f5c542', master: '#a855f7',
};

interface Props {
  state: PlayerState;
  onState: (s: PlayerState) => void;
}

type Entry = { values: (number | '')[]; effort?: 'easy' | 'ok' | 'hard' };

export function Today({ state, onState }: Props) {
  const today = new Date();
  const day = dayFor(today);
  const bar = hasBar(state);

  // Şablon "hangi nitelik" der, motor "hangi hareket" der. Terfi ve
  // deload burada uygulanır. (D-060)
  const resolved = useMemo(
    () => resolveDay(DB, IDX, state, day, bar, today),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, day, bar],
  );
  const exercises = resolved.exercises;
  const toDeload = weeksToDeload(state, today);

  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [extras, setExtras] = useState<ResolvedExercise[]>([]);
  const [done, setDone] = useState<null | {
    gainedXp: number;
    tierUps: { movementId: string; tier: string }[];
    nexts: { label: string; from: number; to: number }[];
  }>(null);
  const [celebration, setCelebration] = useState<null | {
    items: CelebrationItem[]; levelUp: number | null;
  }>(null);

  const all: ResolvedExercise[] = [...exercises, ...extras];

  /** Hedef: kayıt varsa uyarlamadan, yoksa program başlangıcından. */
  function targetFor(ex: ProgramExercise): number {
    const logs = state.logs.filter((l) => l.movementId === ex.movementId);
    if (logs.length === 0) return ex.startTarget;
    return nextTarget(buildInput(ex.movementId, state.logs, lastTarget(ex)));
  }

  function lastTarget(ex: ProgramExercise): number {
    const own = state.logs
      .filter((l) => l.movementId === ex.movementId)
      .sort((a, b) => a.date.localeCompare(b.date));
    const last = own.at(-1);
    if (!last) return ex.startTarget;
    return Math.max(ex.startTarget, Math.max(...last.values));
  }

  function setValue(id: string, i: number, raw: string) {
    const n = raw === '' ? '' : Math.max(0, Number(raw));
    setEntries((prev) => {
      const cur = prev[id]?.values ?? [];
      const values = [...cur];
      while (values.length < 4) values.push('');
      values[i] = n as number | '';
      return { ...prev, [id]: { ...prev[id], values } };
    });
  }

  /** Tüm setleri hedefle doldur — sonra istenirse elle düzeltilir */
  function fillWithTarget(id: string, sets: number, target: number) {
    const values: (number | '')[] = Array.from({ length: 4 }, (_, i) =>
      i < sets ? target : '');
    setEntries((prev) => ({ ...prev, [id]: { ...prev[id], values } }));
    try { navigator.vibrate?.(20); } catch { /* geç */ }
  }

  function setEffort(id: string, effort: 'easy' | 'ok' | 'hard') {
    setEntries((prev) => ({ ...prev, [id]: { values: prev[id]?.values ?? [], effort } }));
  }

  function finish() {
    const payload = all
      .map((ex) => ({
        movementId: ex.movementId,
        values: (entries[ex.movementId]?.values ?? [])
          .filter((v): v is number => typeof v === 'number' && v > 0),
        effort: entries[ex.movementId]?.effort,
      }))
      .filter((e) => e.values.length > 0);

    if (payload.length === 0) return;

    const levelBefore = levelOf(DB, state.xp);
    const res = recordSession(DB, IDX as never, state, payload, today);
    onState(res.state);
    const levelAfter = levelOf(DB, res.state.xp);

    if (res.tierUps.length > 0) {
      setCelebration({
        items: res.tierUps.map((t) => ({
          movementId: t.movementId,
          movementFamily: IDX.get(t.movementId)?.family ?? 'pushup',
          movementName: IDX.get(t.movementId)?.name ?? t.movementId,
          tier: t.tier,
          xp: IDX.get(t.movementId)?.mastery[t.tier].xp ?? 0,
        })),
        levelUp: levelAfter > levelBefore ? levelAfter : null,
      });
    }

    const nexts = payload.map((p) => {
      const ex = all.find((x) => x.movementId === p.movementId)!;
      const from = targetFor(ex);
      const to = nextTarget({
        targetReps: from,
        achieved: p.values,
        effort: p.effort,
      });
      return { label: ex.label, from, to };
    });

    setDone({ gainedXp: res.gainedXp, tierUps: res.tierUps, nexts });
  }

  const level = levelOf(DB, state.xp);
  const rank = rankOf(DB, state);
  const streak = streakOf(state);

  // ─────────────────────────────────────────── dinlenme günü
  if (day.kind === 'rest') {
    return (
      <Shell level={level} day={day.name} kind={day.kind}
        rank={rank.label} streakWeeks={streak.weeks}>
        <p style={{ color: 'var(--dim)', lineHeight: 1.6 }}>
          Bugün dinlenme. {day.focusNote}
        </p>
        <p style={{ color: 'var(--dim2)', fontSize: 13, marginTop: 12 }}>
          Bir gün kaçarsa telafi etme, sıradaki güne geç. 5 gün tutmak
          7 gün sıkıştırmaktan değerlidir.
        </p>
      </Shell>
    );
  }

  // ─────────────────────────────────────────── kutlama
  if (celebration) {
    return (
      <Celebrate
        items={celebration.items}
        levelUp={celebration.levelUp}
        onDone={() => setCelebration(null)}
      />
    );
  }

  // ─────────────────────────────────────────── seans bitti
  if (done) {
    return (
      <Shell level={level} day={day.name} kind={day.kind}
        rank={rank.label} streakWeeks={streak.weeks}>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px' }}>
          Seans kaydedildi
        </h2>
        {done.gainedXp > 0 && (
          <div style={{ ...card, borderColor: '#f5c542', background: '#2a220c' }}>
            <b style={{ color: '#f5c542' }}>+{done.gainedXp} XP</b>
            {done.tierUps.map((t) => (
              <div key={t.movementId + t.tier} style={{ fontSize: 13, marginTop: 4 }}>
                <span style={{ color: TIER_COLOR[t.tier] }}>●</span>{' '}
                {IDX.get(t.movementId)?.name} → {TIER_LABEL[t.tier]}
              </div>
            ))}
          </div>
        )}
        <div style={{ ...card, marginTop: 10 }}>
          <div style={label}>SONRAKİ SEANS HEDEFLERİ</div>
          {done.nexts.map((n) => (
            <div key={n.label} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13.5, padding: '5px 0',
              borderBottom: '1px solid var(--line)',
            }}>
              <span>{n.label}</span>
              <span style={{ color: n.to > n.from ? '#86efac' : n.to < n.from ? '#fbbf24' : 'var(--dim)' }}>
                {n.from} → {n.to}
              </span>
            </div>
          ))}
        </div>
        <button style={primaryBtn} onClick={() => setDone(null)}>Geri dön</button>
      </Shell>
    );
  }

  // ─────────────────────────────────────────── seans ekranı
  return (
    <Shell level={level} day={day.name} kind={day.kind}
        rank={rank.label} streakWeeks={streak.weeks}>
      {needsBackupReminder(state, today) && (
        <div style={{
          ...card, borderColor: '#4a3d10', background: '#2a220c', marginBottom: 10,
        }}>
          <div style={{ ...label, color: '#f5c542' }}>⚠ YEDEK ZAMANI</div>
          <div style={{ fontSize: 12.5, color: '#e6e8ee', marginTop: 4, lineHeight: 1.55 }}>
            İki haftadır yedek almadın. Veri sadece bu cihazda —
            tarayıcı verisi silinirse kayıtların geri gelmez.
            Ayarlar → Yedeği indir.
          </div>
        </div>
      )}

      <WeighIn state={state} onState={(s) => { save(s); onState(s); }} today={today} />

      {resolved.comeback.level !== 'none' && (
        <div style={{
          ...card, borderColor: '#7F77DD', background: '#1a1533', marginBottom: 10,
        }}>
          <div style={{ ...label, color: '#a89ff5' }}>↩ GERİ DÖNÜŞ</div>
          <div style={{ fontSize: 12.5, color: '#c2c8d4', marginTop: 4, lineHeight: 1.55 }}>
            {resolved.comeback.message}
          </div>
        </div>
      )}

      {resolved.deload && (
        <div style={{
          ...card, borderColor: '#1D9E75', background: '#0d2019', marginBottom: 10,
        }}>
          <div style={{ ...label, color: '#5DCAA5' }}>
            ⟳ DELOAD HAFTASI · {resolved.weekNo}. hafta
          </div>
          <div style={{ fontSize: 12.5, color: '#c2c8d4', marginTop: 4, lineHeight: 1.5 }}>
            Set sayıları yarıya indi, hedef tekrarlar aynı. Ölçüm yok.
            Amaç dinlenmek değil, biriken yorgunluğu boşaltmak — gelecek
            hafta genelde sıçrama olur.
          </div>
        </div>
      )}

      <p style={{ color: 'var(--dim)', fontSize: 13, margin: '0 0 12px' }}>
        {day.focusNote}
        {!resolved.deload && toDeload <= 1 && resolved.weekNo > 0 && (
          <span style={{ color: '#5DCAA5' }}> · Gelecek hafta deload.</span>
        )}
      </p>
      {!bar && (
        <div style={{ ...card, borderColor: '#4a3d10', background: '#2a220c', fontSize: 12.5 }}>
          Bar henüz yok — çekiş hareketleri alternatifine düştü.
          Ayarlardan barfiksi ekleyince Pull ağacı açılır.
        </div>
      )}

      {all.map((ex) => {
        const mv = IDX.get(ex.movementId);
        const target = targetFor(ex);
        const prox = mv ? proximity(state, mv) : null;
        const vals = entries[ex.movementId]?.values ?? [];

        return (
          <div key={ex.movementId} style={{ ...card, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {mv && (
                <div style={{
                  flexShrink: 0, width: 74, height: 74, borderRadius: 10,
                  background: '#0d1016', border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center', overflow: 'hidden',
                }}>
                  <Figure movementId={mv.id} family={mv.family} size={66}
                          color={ex.role === 'main' ? '#f5c542' : '#c2c8d4'} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ ...roleTag, ...roleStyle(ex.role) }}>{roleName(ex.role)}</div>
                  {ex.role === 'main' && <div style={{ ...pill }}>ana iş</div>}
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 500, margin: '4px 0 2px' }}>
                  {ex.label}
                </div>
                {ex.promotedFrom && (
                  <div style={{
                    fontSize: 11, color: '#a89ff5', marginBottom: 2,
                  }}>
                    ⬆ terfi · {IDX.get(ex.promotedFrom)?.name} artık yardımcı
                  </div>
                )}
                <div style={{ fontSize: 12.5, color: 'var(--dim)' }}>
                  hedef {ex.sets} × {target} {ex.unit}
                  {ex.rir > 0 && ` · ${ex.rir} tekrar rezerv`}
                  {resolved.isTestDay && ex.role === 'main' && ' · bugün bir seti sonuna götürebilirsin'}
                </div>
                {ex.why && (
                  <div style={{
                    fontSize: 11.5, color: 'var(--dim2)', marginTop: 4,
                    borderLeft: '2px solid #2b323f', paddingLeft: 7, lineHeight: 1.45,
                  }}>{ex.why}</div>
                )}

                {/* Form ipuçları BURADA olmalı — veride vardı ama sadece
                    Ağaç ekranında görünüyordu. "Dirsek öne, dışa açma"
                    cümlesi hareketi yaparken lazım, ağaçta gezerken değil. */}
                {mv && (mv.tips.length > 0 || mv.commonMistakes.length > 0) && (
                  <details style={{ marginTop: 6 }}>
                    <summary style={{
                      fontSize: 11.5, color: '#7dd3fc', cursor: 'pointer',
                    }}>form ipuçları</summary>
                    <ul style={{
                      margin: '5px 0 0', paddingLeft: 15, fontSize: 11.5,
                      color: '#c2c8d4', lineHeight: 1.5,
                    }}>
                      {mv.tips.slice(0, 3).map((t, i) => <li key={`t${i}`}>{t}</li>)}
                      {mv.commonMistakes.slice(0, 2).map((t, i) => (
                        <li key={`m${i}`} style={{ color: '#fbbf24' }}>✕ {t}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>

            {prox?.remaining != null && prox.remaining > 0 && (
              <div style={{
                fontSize: 12, marginTop: 6, padding: '5px 8px', borderRadius: 6,
                background: '#1a1d24', color: TIER_COLOR[prox.nextTier ?? 'bronze'],
              }}>
                {TIER_LABEL[prox.nextTier ?? '']} {prox.nextTarget}'de ·
                sende {prox.best} · <b>{prox.remaining} kaldı</b>
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {Array.from({ length: ex.sets }).map((_, i) => (
                <input
                  key={i}
                  type="number"
                  inputMode="numeric"
                  placeholder={String(target)}
                  value={vals[i] === undefined ? '' : String(vals[i] ?? '')}
                  onChange={(e) => setValue(ex.movementId, i, e.target.value)}
                  style={numInput}
                />
              ))}
            </div>

            {/* Hızlı giriş. Terk etme sebeplerinin başında "zaman alan elle
                giriş" geliyor; seans başına 15 sayı yazmak fazla. Bu düğüm
                alanları hedefle DOLDURUR, kilitlemez — farklı çıktıysa
                üstüne yazarsın. Sürtünme düşer, veri doğruluğu kalır. */}
            <button
              onClick={() => fillWithTarget(ex.movementId, ex.sets, target)}
              style={{
                ...chip, width: '100%', marginTop: 6, padding: '9px 0',
                borderColor: '#1D9E75', color: '#5DCAA5',
              }}
            >
              ✓ hedefi yaptım — {ex.sets} × {target}
            </button>

            {/* Saniyeyle ölçülen hareketlerde kronometre: ölçülen süre
                doğrudan ilk boş sete yazılır, elle sayma yok. */}
            {mv?.measure.type === 'hold' && (
              <HoldTimer target={target} onDone={(sec) => {
                const idx = Math.max(0, [...Array(ex.sets)]
                  .findIndex((_, i) => vals[i] === undefined || vals[i] === ''));
                setValue(ex.movementId, idx, String(sec));
              }} />
            )}

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {(['easy', 'ok', 'hard'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setEffort(ex.movementId, k)}
                  style={{
                    ...chip,
                    borderColor: entries[ex.movementId]?.effort === k ? '#f5c542' : 'var(--line)',
                    color: entries[ex.movementId]?.effort === k ? '#f5c542' : 'var(--dim)',
                  }}
                >
                  {k === 'easy' ? 'kolaydı' : k === 'ok' ? 'normal' : 'zordu'}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ ...card, marginTop: 8, borderColor: '#1e3a26', background: '#0f2016' }}>
        <div style={{ ...label, color: '#86efac' }}>İP</div>
        <div style={{ fontSize: 15, marginTop: 2 }}>{day.ropeMinutes} dakika</div>
        <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 3 }}>
          {day.ropeMinutes >= 12
            ? 'Ağır gün. Son 2 dakika double under denemesi.'
            : 'Hafif. Koştuğun sabahların akşamı 3-4 dakikaya indir.'}
        </div>
      </div>

      {extras.length < MENU.length && (
        <details style={{ ...card, marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', fontSize: 13.5, color: 'var(--dim)' }}>
            Menü — canın çekerse ekle
          </summary>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {MENU.filter((m) => !extras.some((e) => e.movementId === m.movementId))
              .map((m) => (
                <button key={m.movementId} style={chip}
                  onClick={() => setExtras((p) => [...p, m])}>
                  + {m.label}
                </button>
              ))}
          </div>
        </details>
      )}

      <div style={{ ...card, marginTop: 10 }}>
        <RestTimer />
      </div>

      <button style={primaryBtn} onClick={finish}>Seansı bitir</button>
      <button
        style={{ ...chip, width: '100%', marginTop: 8, padding: 10 }}
        onClick={() => { save(state); alert('Kaydedildi'); }}
      >
        Yarıda bırak, kaydet
      </button>
    </Shell>
  );
}

// ───────────────────────────────────────────────── kabuk ve stiller

function Shell({ children, level, day, kind, rank, streakWeeks }: {
  children: React.ReactNode; level: number; day: string;
  kind: string; rank?: string; streakWeeks?: number;
}) {
  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '12px 14px 40px' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, display: 'grid',
          placeItems: 'center', fontWeight: 700, fontSize: 16, color: '#0b0d12',
          background: 'linear-gradient(135deg,#f5c542,#a855f7)',
          boxShadow: '0 0 18px #a855f733',
        }}>{level}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 500 }}>{day}</div>
          {/* XP bilerek arkaya alındı. Dışsal ödül (puan) öne çıkarsa
              içsel motivasyonu zayıflatıyor; yetenek göstergesi
              (rütbe, gün) öne alındı. XP Ayarlar ve İlerleme'de duruyor. */}
          <div style={{ fontSize: 11.5, color: 'var(--dim)' }}>
            {rank ? `${rank} · ` : ''}
            {kind === 'heavy' ? 'ağır gün' : kind === 'light' ? 'hafif gün' : 'dinlenme'}
          </div>
        </div>
        {streakWeeks !== undefined && streakWeeks > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#f5c542' }}>
              {streakWeeks}
            </div>
            <div style={{ fontSize: 9, color: 'var(--dim2)' }}>HAFTA</div>
          </div>
        )}
      </header>
      {children}
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
const roleTag: React.CSSProperties = {
  fontSize: 9.5, letterSpacing: '.08em', fontWeight: 500,
  textTransform: 'uppercase',
};
const pill: React.CSSProperties = {
  fontSize: 9, padding: '1px 6px', borderRadius: 99,
  background: '#232732', color: '#8b93a5',
};
const numInput: React.CSSProperties = {
  flex: 1, minWidth: 0, height: 46, textAlign: 'center', fontSize: 17,
  background: '#0d1016', border: '1px solid var(--line)', borderRadius: 8,
  color: 'var(--txt)',
};
const chip: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--line)',
  borderRadius: 99, padding: '6px 12px', fontSize: 12,
  color: 'var(--dim)', cursor: 'pointer',
};
const primaryBtn: React.CSSProperties = {
  width: '100%', marginTop: 14, padding: 14, borderRadius: 10,
  border: 'none', background: '#f5c542', color: '#0b0d12',
  fontSize: 15, fontWeight: 600, cursor: 'pointer',
};

function roleName(r: string) {
  return r === 'main' ? 'MAIN' : r === 'secondary' ? 'SECONDARY'
    : r === 'technique' ? 'TECHNIQUE' : 'FINISHER';
}
function roleStyle(r: string): React.CSSProperties {
  if (r === 'main') return { color: '#a89ff5' };
  if (r === 'technique') return { color: '#5dcaa5' };
  return { color: '#8b93a5' };
}
