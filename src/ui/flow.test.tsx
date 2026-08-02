/**
 * UÇTAN UCA AKIŞ TESTİ — kullanıcının gerçekten yapacağı yol
 *
 * Neden var: motor testleri (52 tane) fonksiyonları doğruluyordu ama
 * ekranların bir araya gelmiş hâlini kimse görmemişti. tsc temiz ve
 * testler yeşilken uygulama ilk açılışta çökebilirdi. İlk antrenman
 * gününde bunun olması kabul edilemez.
 *
 * Burada gerçek React bileşenleri jsdom içinde çalışır: kalibrasyon
 * doldurulur, seans girilir, kutlama tetiklenir, diğer ekranlar açılır.
 * Görselliği doğrulamaz — çökmediğini ve akışın işlediğini doğrular.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import dbJson from '../data/movements.json';
import type { MovementDatabase, PlayerState } from '../engine/types';
import { DEFAULT_STATE } from '../storage';
import { Calibrate } from './Calibrate';
import { Today } from './Today';
import { Tree } from './Tree';
import { Progress } from './Progress';
import { Settings } from './Settings';

const DB = dbJson as unknown as MovementDatabase;

/** Ağustos 2026, Pazartesi — antrenman günü olsun */
const MONDAY = new Date('2026-08-03T09:00:00');

function fresh(): PlayerState {
  return structuredClone(DEFAULT_STATE);
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(MONDAY);
});

// Vitest globals kapalı olduğu için otomatik temizlik yok; olmadan
// bir önceki testin DOM'u kalıyor ve sorgular "birden fazla eşleşme"
// diye patlıyor.
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// ─────────────────────────────────────────────── KALİBRASYON

describe('kalibrasyon', () => {
  it('açılır ve ilk ölçüm noktasını gösterir', () => {
    render(<Calibrate state={fresh()} onDone={() => {}} />);
    expect(screen.getByText(/BAŞLANGIÇ ÖLÇÜMÜ/)).toBeTruthy();
    expect(screen.getByText('Standard Push-up')).toBeTruthy();
  });

  it('girilen sayılar mastery tohumlar — uygulama boş açılmaz', () => {
    let out: PlayerState | null = null;
    render(<Calibrate state={fresh()} onDone={(s) => { out = s; }} />);

    // Kurucunun gerçek başlangıcı: 30 şınav
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Sonraki'));

    // Kalan adımları atla
    fireEvent.click(screen.getByText(/atla/));

    expect(out).not.toBeNull();
    const s = out as unknown as PlayerState;
    expect(s.calibrated).toBe(true);
    expect(s.mastery['pushup']?.best).toBe(30);
    expect(s.mastery['pushup']?.tier).toBe('master');   // 25+ = master
    expect(s.xp).toBeGreaterThan(0);
  });

  it('atlanırsa veri yazmaz ama bir daha sormaz', () => {
    let out: PlayerState | null = null;
    render(<Calibrate state={fresh()} onDone={(s) => { out = s; }} />);
    fireEvent.click(screen.getByText(/atla/));
    const s = out as unknown as PlayerState;
    expect(s.calibrated).toBe(true);
    expect(Object.keys(s.mastery).length).toBe(0);
  });
});

// ─────────────────────────────────────────────── SEANS

/** Today'i state'i tutan bir kabukla sar — gerçek kullanım böyle */
function TodayHost({ initial }: { initial: PlayerState }) {
  const [state, setState] = useState(initial);
  return <Today state={state} onState={setState} />;
}

describe('seans akışı', () => {
  it('antrenman günü egzersizleri ve figürleri gösterir', () => {
    const { container } = render(<TodayHost initial={fresh()} />);
    expect(screen.getByText('Seansı bitir')).toBeTruthy();
    // Her egzersiz kartında bir figür olmalı
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(2);
  });

  it('set girilir, seans kaydedilir, sonraki hedef gösterilir', () => {
    render(<TodayHost initial={fresh()} />);

    const inputs = document.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBeGreaterThan(0);
    fireEvent.change(inputs[0]!, { target: { value: '12' } });

    fireEvent.click(screen.getByText('Seansı bitir'));

    // Kademe atladıysa önce kutlama gelir; kapatınca özet görünür
    const tap = screen.queryByText(/dokun/);
    if (tap) fireEvent.click(tap.parentElement!);

    expect(screen.getByText('Seans kaydedildi')).toBeTruthy();
    expect(screen.getByText('SONRAKİ SEANS HEDEFLERİ')).toBeTruthy();
  });

  it('boş seans kaydedilmez', () => {
    render(<TodayHost initial={fresh()} />);
    fireEvent.click(screen.getByText('Seansı bitir'));
    expect(screen.queryByText('Seans kaydedildi')).toBeNull();
  });

  it('kademe atlayınca kutlama açılır', () => {
    render(<TodayHost initial={fresh()} />);
    const inputs = document.querySelectorAll('input[type="number"]');
    // Bronz eşiğini rahat geçecek bir sayı
    fireEvent.change(inputs[0]!, { target: { value: '40' } });
    fireEvent.click(screen.getByText('Seansı bitir'));
    expect(screen.getByText(/dokun/)).toBeTruthy();
  });

  it('dinlenme sayacı çalışır ve geri sayar', () => {
    render(<TodayHost initial={fresh()} />);
    fireEvent.click(screen.getByText('90sn'));
    expect(screen.getByText(/dinlen/)).toBeTruthy();
    // Sayaç setInterval içinde state günceller; act olmadan React
    // güncellemeyi bu döngüde işlemez.
    act(() => { vi.advanceTimersByTime(91_000); });
    expect(screen.getByText('hazırsın')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────── DİĞER EKRANLAR

describe('ekranlar boş durumda da açılır', () => {
  const states: [string, () => PlayerState][] = [
    ['sıfırdan', fresh],
    ['veriyle', () => {
      const s = fresh();
      s.mastery['pushup'] = {
        movementId: 'pushup', tier: 'master', verifiedSessions: ['2026-08-03'], best: 30,
      };
      s.logs = [{ movementId: 'pushup', date: '2026-08-03', values: [30] }];
      s.xp = 500;
      return s;
    }],
  ];

  for (const [label, mk] of states) {
    it(`Ağaç — ${label}`, () => {
      const { container } = render(<Tree state={mk()} />);
      expect(container.querySelectorAll('svg g').length).toBeGreaterThan(50);
    });

    it(`İlerleme — ${label}`, () => {
      render(<Progress state={mk()} />);
      expect(screen.getByText(/HAFTA SERİ/)).toBeTruthy();
      expect(screen.getByText(/ASCENSION SCORE/)).toBeTruthy();
      expect(screen.getByText(/BOSS/)).toBeTruthy();
    });

    it(`Ayarlar — ${label}`, () => {
      render(<Settings state={mk()} onState={() => {}} />);
      expect(document.body.textContent!.length).toBeGreaterThan(50);
    });
  }
});

describe('ağaçta düğüme dokunulur', () => {
  it('detay paneli açılır ve hareket bilgisi gelir', () => {
    const { container } = render(<Tree state={fresh()} />);
    const nodes = container.querySelectorAll('g[style*="cursor"]');
    expect(nodes.length).toBeGreaterThan(0);
    fireEvent.click(nodes[0]!);
    expect(screen.getByText('kapat')).toBeTruthy();
    expect(screen.getByText(/Ön koşullar/)).toBeTruthy();
  });
});

describe('avatar', () => {
  it('şu anki hareketi ve hedefi birlikte gösterir', () => {
    render(<Progress state={fresh()} />);
    expect(screen.getByText('ŞU AN')).toBeTruthy();
    expect(screen.getByText('HEDEF')).toBeTruthy();
    expect(screen.getByText(/düğüm kaldı/)).toBeTruthy();
  });
});

describe('veri bütünlüğü', () => {
  it('her hareketin bir pozu var (ailesi üzerinden)', async () => {
    const { poseFor } = await import('./figure/poses');
    for (const m of DB.movements) {
      const ps = poseFor(m.id, m.family);
      expect(ps.frames.length).toBeGreaterThan(0);
      const f = ps.frames[0]!;
      expect(Number.isFinite(f.x) && Number.isFinite(f.y)).toBe(true);
    }
  });

  it('tutuş hareketlerinde kronometre için hedef sayı var', () => {
    const holds = DB.movements.filter((m) => m.measure.type === 'hold');
    expect(holds.length).toBeGreaterThan(0);
    for (const m of holds) {
      expect(m.mastery.bronze.target).toBeGreaterThan(0);
    }
  });
});
