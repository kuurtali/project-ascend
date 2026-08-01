/**
 * KUTLAMA — kademe atlama anı
 *
 * Kullanıcının tarif ettiği motivasyon mekanizması burada kapanıyor:
 * "kademeleri gördükçe 2 tane daha yapayım diyorum." Yakınlık göstergesi
 * onu oraya götürüyor, bu ekran vardığını hissettiriyor.
 *
 * Titreşim dahil — telefonda kullanılacak, dokunsal geri bildirim
 * ekrandan güçlü. (D-051)
 */

import { useEffect, useState } from 'react';
import type { MasteryTier } from '../engine/types';

const TIER_COLOR: Record<MasteryTier, string> = {
  bronze: '#cd7f32', silver: '#c4c9d4', gold: '#f5c542', master: '#a855f7',
};
const TIER_LABEL: Record<MasteryTier, string> = {
  bronze: 'BRONZ', silver: 'GÜMÜŞ', gold: 'ALTIN', master: 'MASTER',
};
/** Titreşim deseni: kademe yükseldikçe daha belirgin */
const TIER_BUZZ: Record<MasteryTier, number[]> = {
  bronze: [40],
  silver: [40, 60, 40],
  gold: [60, 60, 60, 60, 120],
  master: [80, 50, 80, 50, 200],
};

export interface CelebrationItem {
  movementName: string;
  tier: MasteryTier;
  xp: number;
}

export function Celebrate({ items, levelUp, onDone }: {
  items: CelebrationItem[];
  levelUp: number | null;
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const cur = items[i];

  useEffect(() => {
    if (!cur) return;
    try { navigator.vibrate?.(TIER_BUZZ[cur.tier]); } catch { /* desteklemiyorsa geç */ }
  }, [i, cur]);

  if (!cur) return null;
  const color = TIER_COLOR[cur.tier];
  const last = i === items.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(6,8,12,.94)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center',
    }}
      onClick={() => (last ? onDone() : setI(i + 1))}>

      <style>{`
        @keyframes ring { from { transform: scale(.5); opacity: 0 }
                          60% { opacity: 1 } to { transform: scale(1); opacity: 1 } }
        @keyframes pulse { from { transform: scale(1); opacity: .55 }
                           to { transform: scale(2.1); opacity: 0 } }
        @keyframes rise { from { transform: translateY(14px); opacity: 0 }
                          to { transform: translateY(0); opacity: 1 } }
        @keyframes spark { from { transform: translateY(0) scale(1); opacity: 1 }
                           to { transform: translateY(-70px) scale(0); opacity: 0 } }
      `}</style>

      {/* madalya */}
      <div style={{ position: 'relative', width: 150, height: 150, marginBottom: 8 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2px solid ${color}`, animation: 'pulse 1.6s ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 12, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${color}44, transparent 62%)`,
          border: `3px solid ${color}`,
          display: 'grid', placeItems: 'center',
          animation: 'ring .55s cubic-bezier(.2,1.4,.4,1) both',
          boxShadow: `0 0 44px ${color}55, inset 0 0 26px ${color}22`,
        }}>
          <div style={{ fontSize: 44, color, fontWeight: 300, lineHeight: 1 }}>
            {'★'.repeat(cur.tier === 'master' ? 4 : cur.tier === 'gold' ? 3 : cur.tier === 'silver' ? 2 : 1)}
          </div>
        </div>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <span key={k} style={{
            position: 'absolute', left: `${18 + k * 13}%`, bottom: 24,
            width: 4, height: 4, borderRadius: '50%', background: color,
            animation: `spark ${1 + (k % 3) * .35}s ease-out ${k * .1}s infinite`,
          }} />
        ))}
      </div>

      <div style={{
        fontSize: 12, letterSpacing: '.22em', color,
        animation: 'rise .5s .15s both',
      }}>{TIER_LABEL[cur.tier]}</div>

      <div style={{
        fontSize: 25, fontWeight: 500, margin: '6px 0 4px',
        animation: 'rise .5s .25s both',
      }}>{cur.movementName}</div>

      <div style={{
        fontSize: 15, color: '#f5c542', animation: 'rise .5s .35s both',
      }}>+{cur.xp} XP</div>

      {levelUp && last && (
        <div style={{
          marginTop: 20, padding: '10px 18px', borderRadius: 12,
          border: '1px solid #f5c542', background: '#2a220c',
          animation: 'rise .5s .5s both',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: '#f5c542' }}>
            SEVİYE ATLADIN
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{levelUp}</div>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 34, fontSize: 12.5, color: '#5b6376',
        animation: 'rise .5s .8s both',
      }}>
        {items.length > 1 && `${i + 1} / ${items.length} · `}
        {last ? 'kapatmak için dokun' : 'devam için dokun'}
      </div>
    </div>
  );
}
