/**
 * TERFİ KAPISI — "geçelim mi?" ekranı
 *
 * Eskiden slot bir sabah kendiliğinden değişiyordu ve bu ilerleme
 * gibi değil, kontrolü kaybetmek gibi geliyordu. Artık sistem sorar.
 *
 * Kapı hazır değilken de görünür. Gizli bir eşik keyfi hissettirir;
 * "288 tekrarın 140'ı" cümlesi ise hem sebebi hem mesafeyi veriyor —
 * ve mesafe göstergesi günlük motivasyonun asıl kaynağı.
 */

import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { indexMovements } from '../engine/mastery';
import { WEEK } from '../program';
import { offersOf } from '../engine/session';
import { acceptPromotion, VOLUME_SESSIONS } from '../engine/promotion';
import { Figure } from './figure/Figure';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

export function Promote({ state, onState, today = new Date() }: {
  state: PlayerState;
  onState: (s: PlayerState) => void;
  today?: Date;
}) {
  const offers = offersOf(DB, IDX, state, WEEK, today);
  const ready = offers.filter((o) => o.ready);
  if (ready.length === 0) return null;

  return (
    <>
      {ready.map((o) => (
        <div key={o.track} style={{
          ...card, marginBottom: 10,
          borderColor: '#7F77DD', background: '#1a1533',
        }}>
          <div style={{ ...label, color: '#a89ff5' }}>⬆ GEÇELİM Mİ?</div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 6px',
          }}>
            <Fig id={o.from.id} family={o.from.family} dim />
            <span style={{ color: '#a89ff5', fontSize: 18 }}>→</span>
            <Fig id={o.to.id} family={o.to.family} />
            <div style={{ flex: 1, minWidth: 0, marginLeft: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{o.to.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--dim)' }}>
                {o.from.name} yerine
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12.5, color: '#c2c8d4', lineHeight: 1.55 }}>
            {o.from.name} altın kademede ve toplam <b>{o.done}</b> tekrar
            birikti ({o.gate} yeterliydi). Doku da hazır sayılır.
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button
              onClick={() => onState(acceptPromotion(state, o.track, o.to.id))}
              style={{
                flex: 1, height: 42, borderRadius: 9, border: 'none',
                background: '#7F77DD', color: '#0b0d12',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}
            >Geçelim</button>
            <button
              onClick={() => onState(acceptPromotion(state, o.track, o.from.id))}
              style={{ ...chip, padding: '0 14px', height: 42 }}
            >henüz değil</button>
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Hazır olmayan kapıların mesafesi. İlerleme ekranında durur —
 * seans ekranında yer kaplamasın, orada iş yapılıyor.
 */
export function PromotionProgress({ state, today = new Date() }: {
  state: PlayerState;
  today?: Date;
}) {
  const offers = offersOf(DB, IDX, state, WEEK, today).filter((o) => !o.ready);
  if (offers.length === 0) return null;

  return (
    <div style={{ ...card, marginTop: 10 }}>
      <div style={label}>BİR SONRAKİ HAREKETE</div>
      <div style={{
        fontSize: 11.5, color: 'var(--dim2)', margin: '4px 0 9px', lineHeight: 1.5,
      }}>
        Kapı iki koşullu: altın kademe <i>ve</i> {VOLUME_SESSIONS} seanslık
        birikmiş hacim. Kas kademeyi erken geçer, tendon geriden gelir —
        hacim o farkı kapatıyor.
      </div>

      {offers.map((o) => {
        const pct = Math.min(100, Math.round((o.done / o.gate) * 100));
        return (
          <div key={o.track} style={{ padding: '7px 0' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: 13,
            }}>
              <span>{o.from.name}</span>
              <span style={{ color: 'var(--dim)' }}>{o.done} / {o.gate}</span>
            </div>
            <div style={{
              height: 5, borderRadius: 99, background: '#20252f', marginTop: 5,
            }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: 99,
                background: o.goldOk ? '#1D9E75' : '#7F77DD',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--dim2)', marginTop: 4 }}>
              {o.goldOk
                ? `altın kademe tamam · ${Math.max(0, o.gate - o.done)} tekrar kaldı`
                : `hacim %${pct} · altın kademe henüz doğrulanmadı`}
              {' · sonraki: '}{o.to.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Fig({ id, family, dim }: { id: string; family: string; dim?: boolean }) {
  return (
    <div style={{
      width: 46, height: 46, borderRadius: 9, flexShrink: 0,
      background: '#0d1016', border: '1px solid var(--line)',
      display: 'grid', placeItems: 'center', opacity: dim ? 0.45 : 1,
    }}>
      <Figure movementId={id} family={family} size={42}
              color={dim ? '#8b93a5' : '#f5c542'} />
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
const chip: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--line)',
  borderRadius: 99, fontSize: 12, color: 'var(--dim)', cursor: 'pointer',
};
