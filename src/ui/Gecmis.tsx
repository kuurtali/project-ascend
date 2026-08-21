/**
 * GEÇMİŞ KARTLARI — İlerleme ekranındaki "gelişiyor muyum" bölümü
 *
 * Kullanıcının sorusu şuydu: *"gelişiyor mu anlamadım."* Uygulama ona
 * kaç tekrar kaldığını söylüyordu ama nereden geldiğini söylemiyordu.
 *
 * Her hareket için iki grafik:
 *   KAPASİTE   haftalık en iyi tek set — dalgalanır, eğimi önemli
 *   EMEK       biriken hacim — asla düşmez, kapının da göstergesi
 *
 * Kötü bir hafta geçirenin bakması gereken ikincisi. Bunu ekranda da
 * yazıyoruz, çünkü grafiğin kendisi bunu söylemiyor.
 */

import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { indexMovements } from '../engine/mastery';
import {
  birikenHacim, haftalikEnIyi, izlenenHareketler, ozet,
} from '../engine/history';
import { volumeGate } from '../engine/promotion';
import { Sparkline } from './Chart';

const DB = dbJson as unknown as MovementDatabase;
const IDX = indexMovements(DB);

export function Gecmis({ state }: { state: PlayerState }) {
  const izlenen = izlenenHareketler(state);
  if (izlenen.length === 0) return null;

  return (
    <div style={{ ...card, marginTop: 10 }}>
      <div style={label}>GELİŞİM</div>
      <div style={{
        fontSize: 11.5, color: 'var(--dim2)', margin: '4px 0 10px', lineHeight: 1.5,
      }}>
        Solda tek sette çıkarabildiğin sayı, sağda biriken toplam. İlki
        dalgalanır — hastalık, yorgunluk, ölçüm gürültüsü. İkincisi asla
        düşmez. Kötü bir hafta geçirdiysen sağdakine bak.
      </div>

      {izlenen.map((id) => {
        const mv = IDX.get(id);
        if (!mv) return null;
        const kapasite = haftalikEnIyi(state, id);
        const emek = birikenHacim(state, id);
        const o = ozet(kapasite);
        const toplam = emek.length ? emek[emek.length - 1]!.deger : 0;
        const kapi = volumeGate(mv);

        return (
          <div key={id} style={{
            paddingTop: 10, marginTop: 10, borderTop: '1px solid var(--line)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', gap: 8,
            }}>
              <span style={{ fontSize: 13.5 }}>{mv.name}</span>
              {o && (
                <span style={{
                  fontSize: 12,
                  color: o.fark > 0 ? '#5DCAA5' : o.fark < 0 ? '#fbbf24' : 'var(--dim)',
                }}>
                  {o.hafta} haftada {o.ilk} → <b>{o.son}</b>
                  {o.fark > 0 && ` (+${o.fark})`}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={mini}>KAPASİTE · {mv.measure.unit}</div>
                <Sparkline noktalar={kapasite} renk="#f5c542" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={mini}>
                  EMEK · {toplam} / {kapi}
                </div>
                <Sparkline noktalar={emek} renk="#22d3ee" alan />
              </div>
            </div>
          </div>
        );
      })}
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
const mini: React.CSSProperties = {
  fontSize: 9.5, letterSpacing: '.06em', color: 'var(--dim2)', marginBottom: 2,
};
