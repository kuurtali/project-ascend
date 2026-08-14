/**
 * AYARLAR — ekipman, yedekleme, kısıtlar
 *
 * Yedekleme burada birinci sınıf: sistem yerel-öncelikli (D-012), yani
 * cihaz kaybı = veri kaybı. Dışa aktarma MVP'de zorunlu özellik.
 * Ayrıca anayasa M-6: kullanıcının verisi kullanıcınındır, kilitleme yok.
 */

import { useRef, useState } from 'react';
import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { exportJson, importJson, save } from '../storage';
import { coachReport } from '../engine/report';

const DB = dbJson as unknown as MovementDatabase;

/** Kaç günde bir yedek hatırlatılsın */
const BACKUP_REMINDER_DAYS = 14;

export function Settings({ state, onState }: {
  state: PlayerState; onState: (s: PlayerState) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  const sessions = new Set(state.logs.map((l) => l.date)).size;
  const lastLog = [...state.logs].sort((a, b) => a.date.localeCompare(b.date)).at(-1);

  function toggleEquipment(id: string) {
    const has = state.equipment.includes(id);
    const equipment = has
      ? state.equipment.filter((e) => e !== id)
      : [...state.equipment, id];
    const next = { ...state, equipment };
    save(next); onState(next);
  }

  function doExport() {
    const blob = new Blob([exportJson(state)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ascend-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setMsg('Yedek indirildi. Bir yere kopyala — telefon kaybolursa veri de gider.');
  }

  /**
   * Koç raporunu panoya kopyalar. Telefonda uygulama, bilgisayarda
   * koçluk konuşması — aradaki boşluğu dosya taşımadan kapatan yol bu.
   * Panoya yazma izni yoksa metni ekranda gösterip elle seçtiririz.
   */
  async function copyReport() {
    const text = coachReport(DB, state);
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Rapor kopyalandı. Koça yapıştır.');
    } catch {
      setReport(text);
      setMsg('Panoya yazılamadı — aşağıdaki metni seçip kopyala.');
    }
  }

  function doImport(f: File) {
    const r = new FileReader();
    r.onload = () => {
      const st = importJson(String(r.result));
      if (!st) { setMsg('Dosya okunamadı.'); return; }
      save(st); onState(st);
      setMsg('Yedek yüklendi.');
    };
    r.readAsText(f);
  }

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '12px 14px 40px' }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, margin: '0 0 12px' }}>Ayarlar</h2>

      {/* koça rapor */}
      <div style={{ ...card, borderColor: '#3a3563', background: '#151426' }}>
        <div style={{ ...label, color: '#a89ff5' }}>KOÇA RAPOR</div>
        <p style={{
          fontSize: 12.5, color: '#c2c8d4', lineHeight: 1.55, margin: '6px 0 10px',
        }}>
          Son 14 günün seansları, eğilimler ve kademeler — kısa bir özet.
          Kopyala, koça yapıştır. Sayıya girmeyen şeyleri (ağrı, uyku,
          canının istememesi) altına kendin yaz.
        </p>
        <button onClick={copyReport} style={{
          ...btn, background: '#7F77DD', color: '#0b0d12', fontWeight: 600,
        }}>
          Raporu kopyala
        </button>
        {report && (
          <textarea
            readOnly value={report}
            onFocus={(e) => e.currentTarget.select()}
            style={{
              width: '100%', height: 160, marginTop: 8, borderRadius: 8,
              background: '#0d1016', border: '1px solid var(--line)',
              color: 'var(--txt)', fontSize: 11, padding: 8,
              fontFamily: 'ui-monospace, monospace',
            }}
          />
        )}
      </div>

      {/* yedek uyarısı */}
      <div style={{
        ...card,
        borderColor: '#4a3d10', background: '#2a220c',
      }}>
        <div style={{ ...label, color: '#f5c542' }}>YEDEK</div>
        <p style={{ fontSize: 12.5, color: '#e6e8ee', lineHeight: 1.55, margin: '6px 0 10px' }}>
          Veri sadece bu cihazda duruyor — sunucu yok, hesap yok. Telefon
          kaybolur veya tarayıcı verisi silinirse kayıtlar da gider.
          {sessions > 0 && ` Şu an ${sessions} seans kayıtlı.`}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...btn, background: '#f5c542', color: '#0b0d12', border: 'none' }}
            onClick={doExport}>Yedek indir</button>
          <button style={btn} onClick={() => fileRef.current?.click()}>Yedek yükle</button>
        </div>
        <input ref={fileRef} type="file" accept=".json" hidden
          onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
      </div>

      {/* ekipman */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>EKİPMANIM</div>
        <p style={{ fontSize: 12, color: 'var(--dim)', margin: '4px 0 8px' }}>
          Barfiksi eklediğinde Pull ağacının 17 düğümü açılır.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(DB.equipment).map(([id, name]) => {
            const on = state.equipment.includes(id);
            return (
              <button key={id} onClick={() => toggleEquipment(id)} style={{
                ...chip,
                borderColor: on ? '#639922' : 'var(--line)',
                color: on ? '#97C459' : 'var(--dim)',
                background: on ? '#0f2016' : 'transparent',
              }}>
                {on ? '✓ ' : ''}{name}
              </button>
            );
          })}
        </div>
      </div>

      {/* kısıtlar */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>KISITLAR</div>
        <p style={{ fontSize: 12, color: 'var(--dim)', margin: '4px 0 8px' }}>
          Kısıtla işaretli hareketler plana hiç girmez. Sistem yasaklamıyor,
          listeye almıyor — karar senin.
        </p>
        {state.constraints.map((c, i) => (
          <div key={i} style={{
            fontSize: 12.5, padding: '7px 0',
            borderBottom: '1px solid var(--line)',
          }}>
            <div style={{ color: '#e6e8ee' }}>
              {c.area} · {c.side} · {c.type}
              {c.clearedByProfessional
                ? <span style={{ color: '#86efac' }}> · profesyonel onaylı</span>
                : <span style={{ color: '#fbbf24' }}> · onay bekliyor</span>}
            </div>
            {c.excludedMovements.length > 0 && (
              <div style={{ color: 'var(--dim)', marginTop: 2 }}>
                listede değil: {c.excludedMovements.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* durum */}
      <div style={{ ...card, marginTop: 10 }}>
        <div style={label}>DURUM</div>
        <Row k="Seans" v={String(sessions)} />
        <Row k="Kayıt satırı" v={String(state.logs.length)} />
        <Row k="Son kayıt" v={lastLog?.date ?? '—'} />
        <Row k="XP" v={state.xp.toLocaleString('tr')} />
        <Row k="Haftalık hedef" v={`${state.weeklyTarget} gün`} />
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--dim2)', marginTop: 14, lineHeight: 1.6 }}>
        Telefonun ana ekranına eklemek için: tarayıcı menüsünden
        "Ana ekrana ekle". Sonra uygulama gibi açılır ve internetsiz de çalışır.
      </p>

      {msg && (
        <div style={{
          position: 'fixed', left: 14, right: 14, bottom: 74, padding: '10px 12px',
          background: '#f5c542', color: '#0b0d12', borderRadius: 10,
          fontSize: 13, fontWeight: 500,
        }} onClick={() => setMsg(null)}>{msg}</div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{
      display: 'flex', fontSize: 13, padding: '5px 0',
      borderBottom: '1px solid var(--line)',
    }}>
      <span style={{ flex: 1, color: 'var(--dim)' }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

export function needsBackupReminder(state: PlayerState): boolean {
  if (state.logs.length < 5) return false;
  const last = [...state.logs].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  if (!last) return false;
  const days = (Date.now() - new Date(last.date).getTime()) / 86_400_000;
  return days < BACKUP_REMINDER_DAYS && state.logs.length % 20 === 0;
}

const card: React.CSSProperties = {
  background: 'var(--panel)', border: '1px solid var(--line)',
  borderRadius: 12, padding: '12px 14px',
};
const label: React.CSSProperties = {
  fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase',
  color: 'var(--dim2)',
};
const chip: React.CSSProperties = {
  border: '1px solid var(--line)', borderRadius: 99, padding: '6px 12px',
  fontSize: 12, cursor: 'pointer', background: 'transparent',
};
const btn: React.CSSProperties = {
  flex: 1, padding: 10, borderRadius: 8, fontSize: 13,
  border: '1px solid var(--line)', background: 'transparent',
  color: 'var(--txt)', cursor: 'pointer',
};
