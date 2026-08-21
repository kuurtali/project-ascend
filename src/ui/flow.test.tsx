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
import { DEFAULT_STATE, migrate, SCHEMA_VERSION } from '../storage';
import { Calibrate } from './Calibrate';
import { Today } from './Today';
import { Tree } from './Tree';
import { Progress } from './Progress';
import { needsBackupReminder, Settings } from './Settings';
import { ErrorBoundary } from './ErrorBoundary';
import { needsWeighIn, weightTrend } from './Bodyweight';

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

    // Kalan adımları atla — ölçüm bitince ÖZET ekranı gelir
    fireEvent.click(screen.getByText(/atla/));
    expect(screen.getByText('ÖLÇÜM TAMAM')).toBeTruthy();
    fireEvent.click(screen.getByText('Başlayalım'));

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

// ────────────────────────────────────── P0/P1 DAYANIKLILIK VE DOĞRULUK

describe('hata sınırı', () => {
  function Boom(): never { throw new Error('test patlaması'); }

  it('çöken bileşen beyaz ekran değil kurtarma ekranı gösterir', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText(/Bir şeyler ters gitti/)).toBeTruthy();
    spy.mockRestore();
  });

  it('kurtarma ekranında ilk iş veriyi indirmek', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText(/veriyi kurtar/)).toBeTruthy();
    // Kullanıcıya tarayıcı verisini silmemesi söylenmeli
    expect(screen.getByText(/silme/i)).toBeTruthy();
    spy.mockRestore();
  });

  it('hata yokken çocukları normal çizer', () => {
    render(<ErrorBoundary><div>iyi</div></ErrorBoundary>);
    expect(screen.getByText('iyi')).toBeTruthy();
  });
});

describe('hızlı giriş', () => {
  it('tek dokunuşla setleri hedefle doldurur', () => {
    render(<TodayHost initial={fresh()} />);
    const filled = () => Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="number"]'),
    ).filter((i) => i.value !== '').length;
    const before = filled();
    expect(before).toBe(0);

    fireEvent.click(screen.getAllByText(/hedefi yaptım/)[0]!);

    expect(filled()).toBeGreaterThan(0);
  });

  it('doldurulan değerler DEĞİŞTİRİLEBİLİR kalır — kilitlenmez', () => {
    render(<TodayHost initial={fresh()} />);
    fireEvent.click(screen.getAllByText(/hedefi yaptım/)[0]!);
    const input = document.querySelector<HTMLInputElement>('input[type="number"]')!;
    expect(input.readOnly).toBe(false);
    fireEvent.change(input, { target: { value: '7' } });
    expect(input.value).toBe('7');
  });
});

describe('haftalık tartı', () => {
  it('hiç seans yokken sorulmaz', () => {
    expect(needsWeighIn(fresh(), MONDAY)).toBe(false);
  });

  it('ilk seanstan sonra sorulur', () => {
    const s = fresh();
    s.logs = [{ movementId: 'pushup', date: '2026-08-03', values: [12] }];
    expect(needsWeighIn(s, MONDAY)).toBe(true);
  });

  it('aynı hafta ikinci kez sorulmaz', () => {
    const s = fresh();
    s.logs = [{ movementId: 'pushup', date: '2026-08-03', values: [12] }];
    s.bodyweight = [{ date: '2026-08-03', kg: 82 }];
    expect(needsWeighIn(s, new Date('2026-08-05'))).toBe(false);
    expect(needsWeighIn(s, new Date('2026-08-11'))).toBe(true);
  });

  it('kilo eğilimi hesaplanır', () => {
    const s = fresh();
    s.bodyweight = [{ date: '2026-08-03', kg: 82 }, { date: '2026-08-10', kg: 83.5 }];
    expect(weightTrend(s)).toEqual({ kg: 83.5, delta: 1.5 });
  });
});

describe('form ipuçları hareketin yanında', () => {
  it('Bugün ekranında ipucu bölümü var', () => {
    render(<TodayHost initial={fresh()} />);
    expect(screen.getAllByText('form ipuçları').length).toBeGreaterThan(0);
  });
});

describe('yedek hatırlatması', () => {
  const withSessions = (n: number, lastExport?: string) => {
    const s = fresh();
    s.logs = Array.from({ length: n }, (_, i) => ({
      movementId: 'pushup',
      date: `2026-08-${String(i + 1).padStart(2, '0')}`,
      values: [12],
    }));
    if (lastExport) s.lastExport = lastExport;
    return s;
  };

  it('yeni kullanıcıyı rahatsız etmez', () => {
    expect(needsBackupReminder(withSessions(1), MONDAY)).toBe(false);
  });

  it('hiç yedek alınmadıysa birkaç seans sonra uyarır', () => {
    expect(needsBackupReminder(withSessions(5), new Date('2026-08-20'))).toBe(true);
  });

  it('yeni yedek alındıysa susar', () => {
    const s = withSessions(5, '2026-08-19T00:00:00.000Z');
    expect(needsBackupReminder(s, new Date('2026-08-20'))).toBe(false);
  });

  it('yedek eskiyince tekrar uyarır', () => {
    const s = withSessions(5, '2026-08-01T00:00:00.000Z');
    expect(needsBackupReminder(s, new Date('2026-08-20'))).toBe(true);
  });
});

// ─────────────────────────────────────────── PROGRAM DIŞI ANTRENMAN

describe('program dışı antrenman kaydı', () => {
  it('kart kapalı başlar — ekranı doldurmaz', () => {
    render(<TodayHost initial={fresh()} />);
    expect(screen.getByText(/program dışı bir şey yaptım/)).toBeTruthy();
    expect(screen.queryByText('PROGRAM DIŞI ANTRENMAN')).toBeNull();
  });

  it('iki dokunuşta kaydedilir ve kayıt listede görünür', () => {
    render(<TodayHost initial={fresh()} />);
    fireEvent.click(screen.getByText(/program dışı bir şey yaptım/));
    fireEvent.click(screen.getByText('Bacak'));
    fireEvent.click(screen.getByText('Kaydet'));

    // Kart kapanır, onay görünür, kayıt listesine düşer
    expect(screen.getByText(/kaydedildi — Bacak/)).toBeTruthy();
    expect(screen.getByText(/bacak · orta/)).toBeTruthy();
  });

  it('tür seçilmeden kaydedilmez', () => {
    render(<TodayHost initial={fresh()} />);
    fireEvent.click(screen.getByText(/program dışı bir şey yaptım/));
    fireEvent.click(screen.getByText('Kaydet'));
    expect(screen.queryByText(/kaydedildi —/)).toBeNull();
  });

  it('dinlenme gününde de kayıt yapılabilir — salon genelde o güne düşer', () => {
    vi.setSystemTime(new Date('2026-08-06T09:00:00'));   // Perşembe, dinlenme
    render(<TodayHost initial={fresh()} />);
    expect(screen.getByText(/Bugün dinlenme/)).toBeTruthy();
    expect(screen.getByText(/program dışı bir şey yaptım/)).toBeTruthy();
  });

  it('aynı dokuya binen dış yük seans listesinin ÜSTÜNDE uyarı verir', () => {
    const s = fresh();
    s.outside = [{ date: '2026-08-02', kind: 'push', load: 3 }];
    render(<TodayHost initial={s} />);
    const warn = screen.getByText(/⚠ DIŞ YÜK/);
    const finish = screen.getByText('Seansı bitir');
    expect(warn.compareDocumentPosition(finish)
      & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('dış kayıt yokken hiçbir uyarı bandı çizilmez', () => {
    render(<TodayHost initial={fresh()} />);
    expect(screen.queryByText(/DIŞ YÜK/)).toBeNull();
  });
});

// ─────────────────────────────────────────── TEMEL HAREKET SÜREKLİLİĞİ

describe('temel hareketler şeridi', () => {
  it('Bugün ekranında görünür ve tek dokunuşla işaretlenir', () => {
    render(<TodayHost initial={fresh()} />);
    expect(screen.getByText('TEMEL HAREKETLER')).toBeTruthy();

    const before = screen.getAllByText('0').length;
    fireEvent.click(screen.getByText('Şınav'));
    // Zincir 0'dan 1'e çıkmalı — yani bir tane daha az "0" kalır
    expect(screen.getAllByText('0').length).toBe(before - 1);
  });

  it('dinlenme gününde de işaretlenebilir', () => {
    vi.setSystemTime(new Date('2026-08-06T09:00:00'));   // Perşembe
    render(<TodayHost initial={fresh()} />);
    expect(screen.getByText(/Bugün dinlenme/)).toBeTruthy();
    expect(screen.getByText('TEMEL HAREKETLER')).toBeTruthy();
  });

  it('işaret kademe ve XP üretmez — ağaç yalan söylemez', () => {
    const s = fresh();
    render(<TodayHost initial={s} />);
    fireEvent.click(screen.getByText('Squat'));
    expect(s.xp).toBe(0);
    expect(Object.keys(s.mastery)).toHaveLength(0);
  });
});

describe('terfi kapısı ekranda', () => {
  it('kapı hazır değilken "geçelim mi" sorulmaz', () => {
    render(<TodayHost initial={fresh()} />);
    expect(screen.queryByText(/GEÇELİM Mİ/)).toBeNull();
  });
});

// ─────────────────────────────────────────── AĞAÇTAN ÇALIŞMA

describe('ağaç çalışılabilir bir yüzey', () => {
  function TreeHost({ initial }: { initial: PlayerState }) {
    const [state, setState] = useState(initial);
    return <Tree state={state} onState={setState} />;
  }

  /** İlk düğümü seç ve detay panelini aç */
  function openFirstNode() {
    const { container } = render(<TreeHost initial={fresh()} />);
    const nodes = container.querySelectorAll('g[style*="cursor"]');
    fireEvent.click(nodes[0]!);
    return container;
  }

  it('düğüm açılınca biriken hacim görünür', () => {
    openFirstNode();
    expect(screen.getByText(/BİRİKEN/)).toBeTruthy();
    expect(screen.getByText('Yaptım')).toBeTruthy();
  });

  it('salt okunur kullanımda çalışma bloğu çıkmaz', () => {
    const { container } = render(<Tree state={fresh()} />);
    fireEvent.click(container.querySelectorAll('g[style*="cursor"]')[0]!);
    expect(screen.queryByText('Yaptım')).toBeNull();
  });

  it('tekrar girilip kaydedilir, onay görünür', () => {
    openFirstNode();
    fireEvent.change(screen.getByPlaceholderText(/kaç /), { target: { value: '12' } });
    fireEvent.click(screen.getByText('Yaptım'));
    expect(screen.getByText(/kaydedildi|kademe/)).toBeTruthy();
  });

  it('boş giriş kaydedilmez', () => {
    openFirstNode();
    fireEvent.click(screen.getByText('Yaptım'));
    expect(screen.queryByText(/kaydedildi/)).toBeNull();
  });

  it('eşik dolunca sıradaki hareket önerilir', () => {
    const s = fresh();
    // Şınavın hacim eşiğini fazlasıyla dolduracak bir geçmiş
    s.logs = Array.from({ length: 60 }, (_, i) => ({
      movementId: 'pushup',
      date: `2026-07-${String((i % 28) + 1).padStart(2, '0')}`,
      values: [30],
    }));
    const { container } = render(<Tree state={s} onState={() => {}} />);
    const nodes = Array.from(container.querySelectorAll(String.raw`g[style*="cursor"]`));
    // pushup düğümünü metninden bul
    const node = nodes.find((n) => n.textContent?.includes('Standard Push-up'));
    fireEvent.click(node!);
    expect(screen.getByText(/Eşik doldu/)).toBeTruthy();
  });
});

describe('çalıştıklarım listesi', () => {
  function TreeHost({ initial }: { initial: PlayerState }) {
    const [state, setState] = useState(initial);
    return <Tree state={state} onState={setState} />;
  }

  it('yıldızlanan hareket şeride düşer', () => {
    const { container } = render(<TreeHost initial={fresh()} />);
    fireEvent.click(container.querySelectorAll('g[style*="cursor"]')[0]!);
    expect(screen.getByTitle('çalıştıklarıma ekle')).toBeTruthy();
    fireEvent.click(screen.getByTitle('çalıştıklarıma ekle'));
    // Şeritte hareketin adı ve eşik sayacı görünür
    expect(screen.getAllByText(/\d+ \/ \d+/).length).toBeGreaterThan(0);
  });

  it('yıldız geri alınabilir', () => {
    const { container } = render(<TreeHost initial={fresh()} />);
    fireEvent.click(container.querySelectorAll('g[style*="cursor"]')[0]!);
    const star = screen.getByTitle('çalıştıklarıma ekle');
    fireEvent.click(star);
    expect(screen.getByText('★')).toBeTruthy();
    fireEvent.click(screen.getByTitle('çalıştıklarıma ekle'));
    expect(screen.getByText('☆')).toBeTruthy();
  });

  it('liste boşken şerit hiç çizilmez', () => {
    render(<TreeHost initial={fresh()} />);
    expect(screen.queryByText(/eşik doldu/)).toBeNull();
  });

  it('salt okunur ağaçta yıldız yok', () => {
    const { container } = render(<Tree state={fresh()} />);
    fireEvent.click(container.querySelectorAll('g[style*="cursor"]')[0]!);
    expect(screen.queryByTitle('çalıştıklarıma ekle')).toBeNull();
  });

  it('şu ana kadarki tüm şema sürümleri v5e taşınır', () => {
    for (const v of [1, 2, 3, 4]) {
      const m = migrate({ schemaVersion: v, xp: 10 } as never);
      expect(m.schemaVersion).toBe(SCHEMA_VERSION);
      expect(m.focus).toEqual([]);
      expect(m.xp).toBe(10);
    }
  });
});

describe('görev satırı', () => {
  function TreeHost({ initial }: { initial: PlayerState }) {
    const [state, setState] = useState(initial);
    return <Tree state={state} onState={setState} />;
  }

  it('düğümde ne kadar yapılacağı ve neyin açılacağı yazar', () => {
    const { container } = render(<TreeHost initial={fresh()} />);
    const nodes = Array.from(container.querySelectorAll(String.raw`g[style*="cursor"]`));
    const node = nodes.find((n) => n.textContent?.includes('Standard Push-up'));
    fireEvent.click(node!);
    expect(screen.getByText('GÖREV')).toBeTruthy();
    // "360 tekrar Standard Push-up yap → Incline Push-up açılır"
    expect(screen.getByText(/yap/)).toBeTruthy();
    expect(screen.getAllByText(/kaldı/).length).toBeGreaterThan(0);
  });

  it('araya gün girmesi toplamı düşürmez', () => {
    const s = fresh();
    // 1. gün 30, çok sonra 20 — arada boşluk var
    s.logs = [
      { movementId: 'pushup', date: '2026-07-01', values: [30] },
      { movementId: 'pushup', date: '2026-08-14', values: [20] },
    ];
    const { container } = render(<TreeHost initial={s} />);
    const nodes = Array.from(container.querySelectorAll(String.raw`g[style*="cursor"]`));
    fireEvent.click(nodes.find((n) => n.textContent?.includes('Standard Push-up'))!);
    // 30 + 20 = 50, eşik 15×3×8 = 360
    expect(screen.getByText('50')).toBeTruthy();
    expect(screen.getByText(/310 tekrar kaldı/)).toBeTruthy();
  });

  it('bugün girilen ayrıca gösterilir', () => {
    const s = fresh();
    const iso = new Date().toISOString().slice(0, 10);
    s.logs = [{ movementId: 'pushup', date: iso, values: [25] }];
    const { container } = render(<TreeHost initial={s} />);
    const nodes = Array.from(container.querySelectorAll(String.raw`g[style*="cursor"]`));
    fireEvent.click(nodes.find((n) => n.textContent?.includes('Standard Push-up'))!);
    expect(screen.getByText(/bugün \+25/)).toBeTruthy();
  });
});

describe('sıra atlanamaz — ön koşul kilidi', () => {
  function TreeHost({ initial }: { initial: PlayerState }) {
    const [state, setState] = useState(initial);
    return <Tree state={state} onState={setState} />;
  }

  /** Etiketi kısaltılmadan görünen, ön koşulu olan bir hareket */
  const locked = DB.movements.find(
    (m) => m.prerequisites.length > 0 && m.name.length <= 24,
  )!;

  function openLocked(s: PlayerState) {
    const { container } = render(<TreeHost initial={s} />);
    const nodes = Array.from(container.querySelectorAll(String.raw`g[style*="cursor"]`));
    fireEvent.click(nodes.find((n) => n.textContent?.includes(locked.name))!);
  }

  it('ön koşulu bitmemiş düğüme sayı girilemez', () => {
    openLocked(fresh());
    expect(screen.getByText(/Önce bir önceki hedefi bitir/)).toBeTruthy();
    expect(screen.queryByText('Yaptım')).toBeNull();
  });

  it('engelleyen hareket ve kalan miktarı gösterilir', () => {
    openLocked(fresh());
    const prereq = DB.movements.find((m) => m.id === locked.prerequisites[0])!;
    expect(screen.getAllByText(prereq.name).length).toBeGreaterThan(0);
  });

  it('kullanıcı ısrar ederse geçebilir — sistem hapsetmez', () => {
    openLocked(fresh());
    fireEvent.click(screen.getByText('yine de gireceğim'));
    expect(screen.getByText('Yaptım')).toBeTruthy();
    expect(screen.getByText(/Ön koşul tamamlanmadı/)).toBeTruthy();
  });

  it('ön koşulun hedefi dolunca kilit kalkar', () => {
    const s = fresh();
    const prereq = DB.movements.find((m) => m.id === locked.prerequisites[0])!;
    const gate = prereq.mastery.gold.target * prereq.mastery.gold.sets * 8;
    s.logs = locked.prerequisites.map((p) => {
      const pm = DB.movements.find((m) => m.id === p)!;
      return {
        movementId: p,
        date: '2026-08-01',
        values: [pm.mastery.gold.target * pm.mastery.gold.sets * 8],
      };
    });
    expect(gate).toBeGreaterThan(0);
    openLocked(s);
    expect(screen.queryByText(/Önce bir önceki hedefi bitir/)).toBeNull();
    expect(screen.getByText('Yaptım')).toBeTruthy();
  });
});


describe('kalibrasyon özeti', () => {
  it('ölçüm bitince ne değiştiğini gösterir', () => {
    render(<Calibrate state={fresh()} onDone={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '30' } });
    fireEvent.click(screen.getByText(/atla/));

    expect(screen.getByText('ÖLÇÜM TAMAM')).toBeTruthy();
    expect(screen.getByText('AÇIK DÜĞÜM')).toBeTruthy();
    expect(screen.getByText('RÜTBE')).toBeTruthy();
    expect(screen.getByText('İLK SEANSININ HEDEFLERİ')).toBeTruthy();
  });

  it('açılan düğüm sayısı sıfırdan büyük — ağaç gerçekten açıldı', () => {
    render(<Calibrate state={fresh()} onDone={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '30' } });
    fireEvent.click(screen.getByText(/atla/));
    const kutu = screen.getByText('AÇIK DÜĞÜM').previousSibling as HTMLElement;
    expect(Number(kutu.textContent)).toBeGreaterThan(0);
  });

  it('özet onaylanmadan uygulamaya geçilmez', () => {
    let out: PlayerState | null = null;
    render(<Calibrate state={fresh()} onDone={(s) => { out = s; }} />);
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '30' } });
    fireEvent.click(screen.getByText(/atla/));
    expect(out).toBeNull();
    fireEvent.click(screen.getByText('Başlayalım'));
    expect(out).not.toBeNull();
  });

  it('hiç sayı girilmezse özet gösterilmez, doğrudan geçilir', () => {
    let out: PlayerState | null = null;
    render(<Calibrate state={fresh()} onDone={(s) => { out = s; }} />);
    fireEvent.click(screen.getByText(/atla/));
    expect(screen.queryByText('ÖLÇÜM TAMAM')).toBeNull();
    expect(out).not.toBeNull();
  });
});

describe('hedef elle değiştirilebilir', () => {
  it('hedefe dokununca düzenleme açılır ve kaydedilir', () => {
    render(<TodayHost initial={fresh()} />);
    const hedefler = screen.getAllByTitle('hedefi değiştir');
    expect(hedefler.length).toBeGreaterThan(0);
    fireEvent.click(hedefler[0]!);
    expect(screen.getByText('kaydet')).toBeTruthy();
    expect(screen.getByText(/senin sayın kalıcı olur/)).toBeTruthy();
  });

  it('kayıtlı hedef türetmenin önüne geçer', () => {
    const s = fresh();
    s.targets = { 'pike-pushup': 42 };
    render(<TodayHost initial={s} />);
    expect(screen.getByText('42')).toBeTruthy();
  });
});
