/**
 * PROGRAM DIŞI YÜK TESTLERİ
 *
 * Bu testler tek bir vaadi koruyor: **yorgun bir günün ölçüsü kalıcı
 * hedefe dönüşmemeli.** Bozulursa sistem sessizce yanlış okur —
 * ekranda sadece daha küçük bir sayı belirir, kimse sebebini anlamaz.
 */

import { describe, expect, it } from 'vitest';
import db from '../data/movements.json';
import type { MovementDatabase, OutsideLog, PlayerState } from './types';
import { adapt, buildInput, nextTarget } from './adaptation';
import {
  addOutside, heavyBefore, loadAdvice, OUTSIDE_KINDS, outsideIn,
  PLYO_WARN_PER_WEEK,
} from './outside';
import { coachReport } from './report';
import { migrate, SCHEMA_VERSION } from '../storage';

const DB = db as unknown as MovementDatabase;
const TODAY = new Date('2026-08-15T10:00:00');

function state(over: Partial<PlayerState> = {}): PlayerState {
  return {
    xp: 0,
    equipment: ['floor', 'wall', 'pullup-bar', 'dip-station'],
    constraints: [], mastery: {}, logs: [], outside: [],
    weeklyTarget: 5, testDayOfWeek: 1, ...over,
  };
}

const heavyLegs = (date: string, plyo = false): OutsideLog =>
  ({ date, kind: 'legs', load: 3, ...(plyo ? { plyo: true } : {}) });

// ─────────────────────────────────────────────────────── PENCERE

describe('ağır yük penceresi', () => {
  it('2 gün içindeki ağır yükü bulur', () => {
    const o = [heavyLegs('2026-08-13')];
    expect(heavyBefore(o, '2026-08-15')).toBeTruthy();
    expect(heavyBefore(o, '2026-08-13')).toBeTruthy();   // aynı gün de sayılır
  });

  it('pencere dışını saymaz', () => {
    expect(heavyBefore([heavyLegs('2026-08-11')], '2026-08-15')).toBeNull();
  });

  it('hafif ve orta yük tetiklemez — eşik bilerek yüksek', () => {
    const o: OutsideLog[] = [
      { date: '2026-08-14', kind: 'legs', load: 1 },
      { date: '2026-08-14', kind: 'conditioning', load: 2 },
    ];
    expect(heavyBefore(o, '2026-08-15')).toBeNull();
  });

  it('seanstan SONRAKİ yük o seansı etkilemez', () => {
    expect(heavyBefore([heavyLegs('2026-08-16')], '2026-08-15')).toBeNull();
  });

  it('kayıt yoksa null', () => {
    expect(heavyBefore(undefined, '2026-08-15')).toBeNull();
    expect(heavyBefore([], '2026-08-15')).toBeNull();
  });
});

// ──────────────────────────────────────────── UYARLAMA KURALI

describe('yorgunluk istisnası', () => {
  const missed = { targetReps: 12, achieved: [8, 7, 7] };   // 5 açık

  it('dış yük yokken hedef normal biçimde düşer', () => {
    const v = adapt(missed);
    expect(v.kind).toBe('reduce');
    expect(nextTarget(missed)).toBeLessThan(12);
  });

  it('dış yükün ardından hedef DÜŞMEZ, aynı kalır', () => {
    const v = adapt({ ...missed, fatigued: true });
    expect(v.kind).toBe('hold');
    expect(nextTarget({ ...missed, fatigued: true })).toBe(12);
  });

  it('bir kere affeder, iki kere affetmez', () => {
    // Önceki seansta da 3+ açık varsa bu artık tek bir kötü gün değil
    const twice = { ...missed, fatigued: true, previousTargets: [7, 8] };
    expect(adapt(twice).kind).toBe('reduce');
  });

  it('yorgunluk, hedefi TUTTURAN seansı etkilemez', () => {
    const hit = { targetReps: 12, achieved: [12, 12, 12], fatigued: true };
    expect(adapt(hit).kind).toBe('increase');
  });

  it('1-2 açıkta zaten düşmüyordu — davranış değişmedi', () => {
    const near = { targetReps: 12, achieved: [11, 11, 10] };
    expect(adapt(near).kind).toBe('hold');
    expect(adapt({ ...near, fatigued: true }).kind).toBe('hold');
  });

  it('buildInput yorgunluğu SEANSIN gününden okur, bugünden değil', () => {
    const logs = [{ movementId: 'pushup', date: '2026-08-10', values: [8] }];
    // Ağır yük seansla aynı hafta ama seanstan SONRA → etkilememeli
    const late = buildInput('pushup', logs, 12, [heavyLegs('2026-08-14')]);
    expect(late.fatigued).toBe(false);
    // Seanstan hemen önce → etkilemeli
    const near = buildInput('pushup', logs, 12, [heavyLegs('2026-08-09')]);
    expect(near.fatigued).toBe(true);
  });

  it('dış kayıt verilmezse eski davranış aynen sürer', () => {
    const logs = [{ movementId: 'pushup', date: '2026-08-10', values: [8] }];
    expect(buildInput('pushup', logs, 12).fatigued).toBe(false);
  });
});

// ─────────────────────────────────────────────────────── UYARILAR

describe('uyarılar', () => {
  it('kayıt yoksa hiçbir şey gösterilmez', () => {
    expect(loadAdvice(state(), ['push'], TODAY)).toEqual([]);
  });

  it('aynı dokuya binen dış yük uyarı verir', () => {
    const s = state({ outside: [{ date: '2026-08-14', kind: 'push', load: 2 }] });
    const w = loadAdvice(s, ['vertical_push'], TODAY);
    expect(w.some((x) => x.level === 'warn')).toBe(true);
  });

  it('çakışmayan doku uyarı vermez, sadece bağlam verir', () => {
    const s = state({ outside: [heavyLegs('2026-08-14')] });
    const w = loadAdvice(s, ['vertical_push'], TODAY);
    expect(w.every((x) => x.level === 'info')).toBe(true);
  });

  it('sıçrama sıklığı eşiği aşınca uyarır', () => {
    const dates = ['2026-08-14', '2026-08-12', '2026-08-10'];
    expect(dates.length).toBeGreaterThanOrEqual(PLYO_WARN_PER_WEEK);
    const s = state({ outside: dates.map((d) => heavyLegs(d, true)) });
    const w = loadAdvice(s, ['pull'], TODAY);
    expect(w.some((x) => x.text.includes('tendon'))).toBe(true);
  });

  it('tek sıçrama seansı uyarı vermez', () => {
    const s = state({ outside: [heavyLegs('2026-08-14', true)] });
    expect(loadAdvice(s, ['pull'], TODAY)
      .some((x) => x.text.includes('tendon'))).toBe(false);
  });

  it('mesajlar suçlayıcı değil', () => {
    const s = state({
      outside: [
        { date: '2026-08-14', kind: 'push', load: 3 },
        heavyLegs('2026-08-13', true), heavyLegs('2026-08-11', true),
        heavyLegs('2026-08-09', true),
      ],
    });
    const all = [
      ...loadAdvice(s, ['push', 'pull'], TODAY).map((w) => w.text),
      adapt({ targetReps: 12, achieved: [7], fatigued: true }).message,
    ].join(' ').toLowerCase();

    for (const bad of ['abart', 'fazla yap', 'hata ett', 'yanlış yapt',
      'tembel', 'başarısız', 'ihmal']) {
      expect(all).not.toContain(bad);
    }
  });

  it('en fazla birkaç satır — okunmayacak kadar uzamaz', () => {
    const s = state({
      outside: Array.from({ length: 7 }, (_, i) => heavyLegs(
        new Date(TODAY.getTime() - i * 86_400_000).toISOString().slice(0, 10),
        true,
      )),
    });
    expect(loadAdvice(s, ['legs', 'push'], TODAY).length).toBeLessThanOrEqual(3);
  });
});

// ─────────────────────────────────────────────────────── KAYIT

describe('kayıt ve göç', () => {
  it('ekleme mevcut kayıtları bozmaz', () => {
    const s = addOutside(state({ outside: [heavyLegs('2026-08-10')] }), {
      date: '2026-08-15', kind: 'walk', load: 1,
    });
    expect(s.outside).toHaveLength(2);
  });

  it('aynı gün birden fazla kayıt olabilir', () => {
    let s = state();
    s = addOutside(s, { date: '2026-08-15', kind: 'walk', load: 1 });
    s = addOutside(s, { date: '2026-08-15', kind: 'legs', load: 3 });
    expect(outsideIn(s, 7, TODAY)).toHaveLength(2);
  });

  it('v2 kaydı v3e taşınır, hiçbir şey silinmez', () => {
    const old = {
      schemaVersion: 2, xp: 400,
      logs: [{ movementId: 'pushup', date: '2026-08-01', values: [10] }],
      bodyweight: [{ date: '2026-08-01', kg: 70 }],
    } as unknown as Partial<PlayerState>;

    const m = migrate(old);
    expect(m.schemaVersion).toBe(SCHEMA_VERSION);
    expect(m.outside).toEqual([]);
    expect(m.xp).toBe(400);
    expect(m.logs).toHaveLength(1);
    expect(m.bodyweight).toHaveLength(1);
  });

  it('mevcut dış kayıtlar göçte korunur', () => {
    const m = migrate({ schemaVersion: 2, outside: [heavyLegs('2026-08-10')] } as
      unknown as Partial<PlayerState>);
    expect(m.outside).toHaveLength(1);
  });

  it('her tür için etiket ve ipucu var', () => {
    for (const k of Object.values(OUTSIDE_KINDS)) {
      expect(k.label.length).toBeGreaterThan(0);
      expect(k.hint.length).toBeGreaterThan(0);
      expect(k.systemic).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────────────── RAPOR

describe('koç raporu dış yükü aktarır', () => {
  const s = state({
    logs: [{ movementId: 'pushup', date: '2026-08-14', values: [9, 8], effort: 'hard' }],
    outside: [{
      date: '2026-08-13', kind: 'legs', load: 3, plyo: true,
      note: '150 squat, 300 zıplama',
    }],
  });

  it('dış seanslar raporda görünür', () => {
    const r = coachReport(DB, s, TODAY);
    expect(r).toContain('Program dışı');
    expect(r).toContain('150 squat');
  });

  it('yorgun günler işaretlenir — düşen sayı gerileme sanılmasın', () => {
    expect(coachReport(DB, s, TODAY)).toContain('dış yükün ardından');
  });

  it('dış kayıt yoksa bölüm hiç açılmaz', () => {
    const clean = state({ logs: s.logs });
    expect(coachReport(DB, clean, TODAY)).not.toContain('Program dışı');
  });

  it('rapor hâlâ yapıştırılabilir uzunlukta', () => {
    expect(coachReport(DB, s, TODAY).length).toBeLessThan(4000);
  });
});
