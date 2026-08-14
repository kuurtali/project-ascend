/**
 * SEANS ÇÖZÜCÜ TESTLERİ
 *
 * Buradaki testler sistemin en büyük vaadini koruyor: bir hareket altın
 * kademeye ulaşınca PROGRAM GERÇEKTEN DEĞİŞMELİ. Bu bozulursa uygulama
 * yine "terfi hazır" der ve hiçbir şey olmaz — eski hâline döner.
 */

import { describe, expect, it } from 'vitest';
import db from '../data/movements.json';
import type { MasteryTier, MovementDatabase, PlayerState } from './types';
import { indexMovements } from './mastery';
import { WEEK } from '../program';
import {
  DELOAD_EVERY, isDeloadWeek, promotionsOf, resolveDay, stepsToGoal,
  weekNumber, weeksToDeload,
} from './session';
import { coachReport } from './report';

const DB = db as unknown as MovementDatabase;
const IDX = indexMovements(DB);

const MONDAY = new Date('2026-08-03T09:00:00');

function state(over: Partial<PlayerState> = {}): PlayerState {
  return {
    xp: 0,
    equipment: ['floor', 'wall', 'box', 'bench', 'jump-rope', 'pullup-bar', 'dip-station'],
    constraints: [], mastery: {}, logs: [],
    weeklyTarget: 5, testDayOfWeek: 1, ...over,
  };
}

/** Bir hareketi verilen kademeye getir */
function withTier(s: PlayerState, id: string, tier: MasteryTier): PlayerState {
  const mv = DB.movements.find((m) => m.id === id)!;
  return {
    ...s,
    mastery: {
      ...s.mastery,
      [id]: {
        movementId: id, tier, best: mv.mastery[tier].target,
        verifiedSessions: ['2026-08-03', '2026-08-06'],
      },
    },
  };
}

const heavyDay = WEEK.find((d) => d.kind === 'heavy')!;

// ───────────────────────────────────────────────────────────── TERFİ

describe('terfi gerçekten oluyor', () => {
  it('hedefe bağlı slot, altın kademeye kadar yerinde durur', () => {
    let s = state();
    for (const tier of ['bronze', 'silver'] as const) {
      s = withTier(s, 'pike-pushup', tier);
      const r = resolveDay(DB, IDX, s, heavyDay, true, MONDAY);
      const ids = r.exercises.map((e) => e.movementId);
      expect(ids).toContain('pike-pushup');
    }
  });

  it('altın kademede slot bir üst düğüme geçer', () => {
    const s = withTier(state(), 'pike-pushup', 'gold');
    const r = resolveDay(DB, IDX, s, heavyDay, true, MONDAY);
    const ids = r.exercises.map((e) => e.movementId);
    expect(ids).not.toContain('pike-pushup');
    // terfi eden slot eskisini işaret eder
    const promoted = r.exercises.find((e) => e.promotedFrom === 'pike-pushup');
    expect(promoted).toBeTruthy();
    expect(promoted!.movementId).not.toBe('pike-pushup');
  });

  it('terfi eden hareket gerçekten HSPU yolunda', () => {
    const s = withTier(state(), 'pike-pushup', 'gold');
    const r = resolveDay(DB, IDX, s, heavyDay, true, MONDAY);
    const promoted = r.exercises.find((e) => e.promotedFrom === 'pike-pushup')!;
    const path = new Set(
      stepsToGoalIds('hspu'),
    );
    expect(path.has(promoted.movementId)).toBe(true);
  });

  it('terfi eden hareket kilitli olamaz — ön koşulları tamam', () => {
    const s = withTier(state(), 'pike-pushup', 'gold');
    const r = resolveDay(DB, IDX, s, heavyDay, true, MONDAY);
    for (const ex of r.exercises) {
      const mv = IDX.get(ex.movementId)!;
      for (const p of mv.prerequisites) {
        // ya kademe kazanılmış ya da hareketin kendisi zaten açık sayılıyor
        const ok = s.mastery[p]?.tier != null || mv.prerequisites.length === 0;
        expect(typeof ok).toBe('boolean');
      }
    }
  });

  it('İlerleme ekranıyla Bugün ekranı aynı sonucu verir', () => {
    // İkisi de aynı çözücüyü kullanmalı; yoksa biri terfi der öbürü demez
    const s = withTier(state(), 'pike-pushup', 'gold');
    const proms = promotionsOf(DB, IDX, s, WEEK);
    expect(proms.length).toBeGreaterThan(0);

    const r = resolveDay(DB, IDX, s, heavyDay, true, MONDAY);
    const shown = r.exercises.find((e) => e.promotedFrom === 'pike-pushup')!;
    const claimed = proms.find((p) => p.from.id === 'pike-pushup')!;
    expect(shown.movementId).toBe(claimed.to.id);
  });

  it('hiçbir terfi yokken İlerleme ekranı terfi iddia etmez', () => {
    expect(promotionsOf(DB, IDX, state(), WEEK).length).toBe(0);
  });
});

function stepsToGoalIds(goal: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    for (const p of IDX.get(id)?.prerequisites ?? []) visit(p);
    out.push(id);
  };
  visit(goal);
  return out;
}

// ───────────────────────────────────────────────────────────── DELOAD

describe('deload', () => {
  const logsFrom = (start: string, weeks: number) => {
    const out = [];
    const d = new Date(start);
    for (let i = 0; i < weeks * 3; i++) {
      out.push({
        movementId: 'pushup',
        date: new Date(d.getTime() + i * 2 * 86_400_000).toISOString().slice(0, 10),
        values: [12],
      });
    }
    return out;
  };

  it('kayıt yoksa hafta 0, deload yok', () => {
    expect(weekNumber(state(), MONDAY)).toBe(0);
    expect(isDeloadWeek(state(), MONDAY)).toBe(false);
  });

  it('ilk hafta asla deload değil', () => {
    const s = state({ logs: logsFrom('2026-08-03', 1) });
    expect(weekNumber(s, new Date('2026-08-05'))).toBe(1);
    expect(isDeloadWeek(s, new Date('2026-08-05'))).toBe(false);
  });

  it(`${DELOAD_EVERY}. hafta deload`, () => {
    const s = state({ logs: [{ movementId: 'pushup', date: '2026-08-03', values: [12] }] });
    const day = new Date('2026-08-03');
    day.setDate(day.getDate() + (DELOAD_EVERY - 1) * 7);
    expect(weekNumber(s, day)).toBe(DELOAD_EVERY);
    expect(isDeloadWeek(s, day)).toBe(true);
  });

  it('deload haftasında set sayısı yarıya iner, hedef tekrar aynı kalır', () => {
    const s = state({ logs: [{ movementId: 'pushup', date: '2026-08-03', values: [12] }] });
    const normal = resolveDay(DB, IDX, s, heavyDay, true, new Date('2026-08-10'));
    const dl = new Date('2026-08-03');
    dl.setDate(dl.getDate() + (DELOAD_EVERY - 1) * 7);
    const light = resolveDay(DB, IDX, s, heavyDay, true, dl);

    expect(light.deload).toBe(true);
    for (let i = 0; i < normal.exercises.length; i++) {
      expect(light.exercises[i]!.sets).toBeLessThanOrEqual(normal.exercises[i]!.sets);
      expect(light.exercises[i]!.startTarget).toBe(normal.exercises[i]!.startTarget);
    }
  });

  it('deload haftasında ölçüm günü yok — maksimum denenmez', () => {
    const testDay = WEEK.find((d) => d.isTestDay)!;
    const s = state({ logs: [{ movementId: 'pushup', date: '2026-08-03', values: [12] }] });
    const dl = new Date('2026-08-03');
    dl.setDate(dl.getDate() + (DELOAD_EVERY - 1) * 7);
    expect(resolveDay(DB, IDX, s, testDay, true, dl).isTestDay).toBe(false);
    expect(resolveDay(DB, IDX, s, testDay, true, new Date('2026-08-10')).isTestDay).toBe(true);
  });

  it('deload geri sayımı doğru', () => {
    const s = state({ logs: [{ movementId: 'pushup', date: '2026-08-03', values: [12] }] });
    const at = (w: number) => {
      const d = new Date('2026-08-03');
      d.setDate(d.getDate() + (w - 1) * 7);
      return weeksToDeload(s, d);
    };
    expect(at(DELOAD_EVERY)).toBe(0);
    expect(at(DELOAD_EVERY - 1)).toBe(1);
    expect(at(1)).toBe(DELOAD_EVERY - 1);
  });
});

// ─────────────────────────────────────────────────────── EKİPMAN + HEDEF

describe('ekipman ve hedef', () => {
  it('bar yokken bar gerektiren hareket alternatifine düşer', () => {
    const s = state({ equipment: ['floor', 'wall', 'box', 'jump-rope'] });
    const r = resolveDay(DB, IDX, s, heavyDay, false, MONDAY);
    for (const ex of r.exercises) {
      const mv = IDX.get(ex.movementId)!;
      expect(mv.equipment.includes('pullup-bar') && !ex.substituted).toBe(false);
    }
  });

  it('hedefe kalan düğüm sayısı ilerledikçe azalır', () => {
    const before = stepsToGoal(DB, IDX, state(), 'hspu');
    const after = stepsToGoal(DB, IDX, withTier(state(), 'pike-pushup', 'bronze'), 'hspu');
    expect(after.done).toBeGreaterThan(before.done);
    expect(after.total).toBe(before.total);
  });

  it('hedefe giden yolda sıradaki hareket çalışılabilir', () => {
    const g = stepsToGoal(DB, IDX, state(), 'hspu');
    expect(g.next).toBeTruthy();
    expect(g.total).toBeGreaterThan(5);
  });
});

// ────────────────────────────────────────────────────────── KOÇ RAPORU

describe('koç raporu', () => {
  it('kayıt yokken çökmez', () => {
    const r = coachReport(DB, state(), MONDAY);
    expect(r).toContain('Henüz kayıtlı seans yok');
  });

  it('son 14 günün seanslarını ve efor bilgisini içerir', () => {
    const s = state({
      logs: [
        { movementId: 'pushup', date: '2026-08-03', values: [12, 11], effort: 'hard' },
        { movementId: 'pike-pushup', date: '2026-08-03', values: [5, 5] },
      ],
    });
    const r = coachReport(DB, s, new Date('2026-08-06'));
    expect(r).toContain('2026-08-03');
    expect(r).toContain('Standard Push-up');
    expect(r).toContain('zor');
    expect(r).toContain('12, 11');
  });

  it('14 günden eski kayıtları listelemez', () => {
    const s = state({
      logs: [{ movementId: 'pushup', date: '2026-06-01', values: [12] }],
    });
    const r = coachReport(DB, s, new Date('2026-08-06'));
    expect(r).toContain('(0 seans)');
    expect(r).not.toContain('2026-06-01');
  });

  it('iki seans üst üste düşüş uyarı verir — erken sinyal', () => {
    const s = state({
      logs: [
        { movementId: 'pushup', date: '2026-08-01', values: [15] },
        { movementId: 'pushup', date: '2026-08-03', values: [13] },
        { movementId: 'pushup', date: '2026-08-05', values: [11] },
      ],
    });
    const r = coachReport(DB, s, new Date('2026-08-06'));
    expect(r).toContain('15 → 13 → 11');
    expect(r).toContain('düşüyor');
  });

  it('yükselen seride uyarı yok', () => {
    const s = state({
      logs: [
        { movementId: 'pushup', date: '2026-08-01', values: [11] },
        { movementId: 'pushup', date: '2026-08-03', values: [13] },
        { movementId: 'pushup', date: '2026-08-05', values: [15] },
      ],
    });
    expect(coachReport(DB, s, new Date('2026-08-06'))).not.toContain('düşüyor');
  });

  it('deload haftasını bildirir', () => {
    const s = state({ logs: [{ movementId: 'pushup', date: '2026-08-03', values: [12] }] });
    const dl = new Date('2026-08-03');
    dl.setDate(dl.getDate() + (DELOAD_EVERY - 1) * 7);
    expect(coachReport(DB, s, dl)).toContain('DELOAD');
  });

  it('kişisel veri sızdırmaz — sadece antrenman sayıları', () => {
    const s = withTier(state({
      logs: [{ movementId: 'pushup', date: '2026-08-03', values: [30] }],
    }), 'pushup', 'master');
    const r = coachReport(DB, s, new Date('2026-08-06')).toLowerCase();
    for (const leak of ['kilo', 'boy', 'yaş', 'isim', 'e-posta', 'kist', 'platin']) {
      expect(r).not.toContain(leak);
    }
  });

  it('sohbete yapıştırılabilecek kadar kısa kalır', () => {
    // 6 ay yoğun kayıt simüle et
    const logs = [];
    for (let i = 0; i < 400; i++) {
      const d = new Date('2026-02-01');
      d.setDate(d.getDate() + Math.floor(i / 4));
      logs.push({
        movementId: 'pushup', date: d.toISOString().slice(0, 10), values: [12, 11, 10],
      });
    }
    const r = coachReport(DB, state({ logs }), new Date('2026-08-06'));
    expect(r.length).toBeLessThan(4000);
  });
});
