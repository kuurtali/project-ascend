/**
 * AVATAR — sen, şu an yaptığın hareketi yaparken
 *
 * Kurucunun cümlesi: "kendimi handstand push-up yaparken düşünmek bile
 * motive ediyor." Bu ekran o cümlenin karşılığı.
 *
 * Önde: şu anki ana hareketini yapan figür, kademe renginde.
 * Arkada: hedefin (HSPU, muscle-up, front lever…) hayaleti — kesikli,
 * soluk, hareketsiz. Henüz orada değilsin ama duruyor.
 *
 * Siluetin çizgi kalınlığı güç eksenine bağlı: ilerledikçe figür
 * belirginleşiyor. Küçük bir detay ama tekrar tekrar bakılan yer burası.
 */

import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { indexMovements, isOpen } from '../engine/mastery';
import { ascensionOf } from '../engine/game';
import { Figure } from './figure/Figure';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

const TIER_COLOR: Record<string, string> = {
  bronze: '#cd7f32', silver: '#c4c9d4', gold: '#f5c542', master: '#a855f7',
};

/** Hedef adayları, uzaktan yakına. İlkine ulaşılmışsa sonrakine bakılır. */
const DREAMS = ['one-arm-hspu', 'front-lever', 'hspu', 'bar-muscle-up', 'pull-up'];

export function Avatar({ state, currentId }: {
  state: PlayerState;
  /** Şu an çalışılan ana hareket */
  currentId: string;
}) {
  const cur = IDX.get(currentId);
  const tier = state.mastery[currentId]?.tier ?? null;
  const color = tier ? TIER_COLOR[tier]! : '#e6e8ee';

  // Hedef: henüz ulaşılmamış en iddialı düğüm
  const dreamId = DREAMS.find((id) => !state.mastery[id]?.tier) ?? DREAMS.at(-1)!;
  const dream = IDX.get(dreamId);

  const asc = ascensionOf(DB, state);
  const strength = asc.axes.find((a) => a.key === 'strength')?.value ?? 0;

  // Hedefe kaç düğüm kaldı
  let remaining = 0;
  if (dream) {
    const seen = new Set<string>();
    const stack = [dream.id];
    while (stack.length) {
      const id = stack.pop()!;
      if (seen.has(id)) continue;
      seen.add(id);
      if (!state.mastery[id]?.tier) remaining++;
      for (const p of IDX.get(id)?.prerequisites ?? []) stack.push(p);
    }
  }

  if (!cur) return null;

  return (
    <div style={{
      position: 'relative', height: 216, borderRadius: 14, overflow: 'hidden',
      background: 'radial-gradient(120% 90% at 50% 100%, #1a1832 0%, #0d1016 62%)',
      border: '1px solid var(--line)',
    }}>
      {/* zemin ışığı */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 12, width: 220, height: 26,
        transform: 'translateX(-50%)', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color}33, transparent 70%)`,
      }} />

      {/* hedefin hayaleti — arkada, büyük */}
      {dream && (
        <div style={{
          position: 'absolute', right: 6, top: 10, opacity: 0.9,
          display: 'grid', placeItems: 'center',
        }}>
          <Figure movementId={dream.id} family={dream.family}
                  size={150} color="#7F77DD" ghost />
        </div>
      )}

      {/* sen — önde */}
      <div style={{
        position: 'absolute', left: 14, bottom: 18,
        filter: `drop-shadow(0 0 ${6 + strength / 6}px ${color}66)`,
      }}>
        <Figure movementId={cur.id} family={cur.family} size={132} color={color} />
      </div>

      {/* etiketler */}
      <div style={{ position: 'absolute', left: 14, top: 12 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.14em', color: '#5b6376' }}>
          ŞU AN
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 500, color }}>{cur.name}</div>
      </div>

      {dream && (
        <div style={{ position: 'absolute', right: 14, bottom: 12, textAlign: 'right' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '.14em', color: '#5b6376' }}>
            HEDEF
          </div>
          <div style={{ fontSize: 13.5, color: '#a89ff5' }}>{dream.name}</div>
          <div style={{ fontSize: 11, color: '#5b6376' }}>
            {remaining} düğüm kaldı
            {isOpen(state, dream) && ' · açık'}
          </div>
        </div>
      )}
    </div>
  );
}
