/**
 * Motor katmanı birim testleri.
 *
 * "Çalışıyor" demenin şartı testin geçmesidir. (SECOND_BRAIN M-8)
 * Bu testler koçun kararlarının koda doğru geçtiğini doğrular.
 */

import { describe, expect, it } from 'vitest';
import db from '../data/movements.json';
import type { MovementDatabase, PlayerState, SetLog } from './types';
import { MENU, WEEK } from '../program';
import {
  balanceScore, equipmentOk, indexMovements, isOpen, isTrainable,
  levelOf, proximity, tierForValue, verifiedTierOf,
} from './mastery';
import { adapt, nextTarget } from './adaptation';
import {
  SLOT_TEMPLATES, findMain, orderForSession, pathTo, planTree, shouldPromote,
} from './planner';

const DB = db as unknown as MovementDatabase;
const IDX = indexMovements(DB);

function emptyState(over: Partial<PlayerState> = {}): PlayerState {
  return {
    xp: 0,
    equipment: ['floor', 'wall', 'box', 'jump-rope'],
    constraints: [],
    mastery: {},
    logs: [],
    weeklyTarget: 4,
    testDayOfWeek: 0,
    ...over,
  };
}

function withMastery(ids: Record<string, 'bronze' | 'silver' | 'gold' | 'master'>): PlayerState {
  const s = emptyState();
  for (const [id, tier] of Object.entries(ids)) {
    const mv = IDX.get(id)!;
    s.mastery[id] = {
      movementId: id, tier, verifiedSessions: [], best: mv.mastery[tier].target,
    };
  }
  return s;
}

// ───────────────────────────────────────────────────────── VERİ

describe('veri', () => {
  it('yüklendi ve makul boyutta', () => {
    expect(DB.movements.length).toBeGreaterThan(150);
  });

  it('ön koşul referansları kırık değil', () => {
    for (const mv of DB.movements) {
      for (const p of mv.prerequisites) expect(IDX.has(p)).toBe(true);
    }
  });

  it('her hareketin mastery eşikleri artan', () => {
    for (const mv of DB.movements) {
      const t = ['bronze', 'silver', 'gold', 'master'].map(
        (k) => mv.mastery[k as 'bronze'].target,
      );
      expect([...t].sort((a, b) => a - b)).toEqual(t);
    }
  });
});

// ───────────────────────────────────────────────────────── KİLİT

describe('kilit mantığı', () => {
  it('kök node başta açık', () => {
    expect(isOpen(emptyState(), IDX.get('wall-pushup')!)).toBe(true);
  });

  it('ön koşullar AND — biri yetmez', () => {
    const s = withMastery({ 'incline-pushup': 'bronze' });
    expect(isOpen(s, IDX.get('pushup')!)).toBe(false);
  });

  it('iki ön koşul da bronz olunca açılır', () => {
    const s = withMastery({ 'incline-pushup': 'bronze', 'knee-pushup': 'bronze' });
    expect(isOpen(s, IDX.get('pushup')!)).toBe(true);
  });

  it('bronz kilidi açar, altın gerekmez', () => {
    const s = withMastery({ 'incline-pushup': 'bronze', 'knee-pushup': 'bronze' });
    expect(isOpen(s, IDX.get('pushup')!)).toBe(true);
  });

  it('ekipman OR mantığı', () => {
    const rings = DB.movements.find((m) => m.equipment.includes('rings'))!;
    expect(equipmentOk(emptyState(), rings)).toBe(false);
    expect(equipmentOk(emptyState({ equipment: ['rings'] }), rings)).toBe(true);
  });

  it('kısıt hareketi plandan çıkarır', () => {
    const s = emptyState({
      constraints: [{
        area: 'hand', side: 'right', type: 'hardware',
        excludedMovements: ['knuckle-pushup'], clearedByProfessional: true,
      }],
    });
    expect(isTrainable(s, IDX.get('knuckle-pushup')!)).toBe(false);
  });
});

// ───────────────────────────────────────────────────────── KADEME

describe('mastery kademeleri', () => {
  it('değerden kademe hesaplanır', () => {
    const mv = IDX.get('pushup')!;   // 5 / 10 / 15 / 25
    expect(tierForValue(mv, 4)).toBe(null);
    expect(tierForValue(mv, 5)).toBe('bronze');
    expect(tierForValue(mv, 12)).toBe('silver');
    expect(tierForValue(mv, 30)).toBe('master');
  });

  it('30 şınav master üstü — kullanıcının gerçek verisi', () => {
    expect(tierForValue(IDX.get('pushup')!, 30)).toBe('master');
  });

  it('kademe 14 günde 2 AYRI seansta doğrulanır', () => {
    const today = new Date('2026-08-15');
    const mv = IDX.get('pushup')!;
    const one: SetLog[] = [{ movementId: 'pushup', date: '2026-08-14', values: [12] }];
    expect(verifiedTierOf(mv, one, today).tier).toBe(null);
    expect(verifiedTierOf(mv, one, today).pending).toBe('silver');

    const two: SetLog[] = [...one,
      { movementId: 'pushup', date: '2026-08-10', values: [11] }];
    expect(verifiedTierOf(mv, two, today).tier).toBe('silver');
  });

  it('14 günden eski seans sayılmaz', () => {
    const today = new Date('2026-08-15');
    const old: SetLog[] = [
      { movementId: 'pushup', date: '2026-07-01', values: [12] },
      { movementId: 'pushup', date: '2026-07-02', values: [12] },
    ];
    expect(verifiedTierOf(IDX.get('pushup')!, old, today).tier).toBe(null);
  });
});

// ───────────────────────────────────────────────────────── YAKINLIK

describe('yakınlık göstergesi — günlük motivasyon motoru', () => {
  it('sonraki kademeye kalan mesafeyi verir', () => {
    const s = emptyState();
    s.mastery['pushup'] = {
      movementId: 'pushup', tier: 'bronze', verifiedSessions: [], best: 8,
    };
    const p = proximity(s, IDX.get('pushup')!);
    expect(p.nextTier).toBe('silver');
    expect(p.nextTarget).toBe(10);
    expect(p.remaining).toBe(2);       // "2 tane daha yap, gümüşe çık"
  });

  it('master olunca sonraki kademe yok', () => {
    const s = withMastery({ pushup: 'master' });
    expect(proximity(s, IDX.get('pushup')!).nextTier).toBe(null);
  });
});

// ───────────────────────────────────────────────────────── UYARLAMA

describe('uyarlama kuralı', () => {
  it('hedefte + kolay → +2', () => {
    const v = adapt({ targetReps: 12, achieved: [12, 12, 12], effort: 'easy' });
    expect(v.kind).toBe('increase');
    expect(nextTarget({ targetReps: 12, achieved: [12, 12, 12], effort: 'easy' })).toBe(14);
  });

  it('hedefte + zor → +1', () => {
    expect(nextTarget({ targetReps: 12, achieved: [12, 12, 12], effort: 'hard' })).toBe(13);
  });

  it('"12 dedim 10 yaptın" → aynı sayı, başarısızlık değil', () => {
    const v = adapt({ targetReps: 12, achieved: [12, 11, 10] });
    expect(v.kind).toBe('hold');
    expect(v.message).toContain('kalibrasyon');
    expect(nextTarget({ targetReps: 12, achieved: [12, 11, 10] })).toBe(12);
  });

  it('3+ altında → %20 düşer', () => {
    const v = adapt({ targetReps: 12, achieved: [8, 7, 6] });
    expect(v.kind).toBe('reduce');
    expect(nextTarget({ targetReps: 12, achieved: [8, 7, 6] })).toBe(10);
  });

  it('3 seans aynı hedefte takılınca eksen değişir', () => {
    const v = adapt({
      targetReps: 10, achieved: [10, 9, 9], previousTargets: [10, 10],
    });
    expect(v.kind).toBe('changeAxis');
    expect(v.message).toContain('3-1-3');
  });

  it('eksen değişince tempo için tekrar düşer', () => {
    expect(nextTarget({
      targetReps: 10, achieved: [10, 9, 9], previousTargets: [10, 10],
    })).toBe(6);
  });

  it('kayıt yoksa hedef sabit', () => {
    expect(adapt({ targetReps: 12, achieved: [] }).kind).toBe('hold');
  });
});

// ───────────────────────────────────────────────────────── PLANNER

describe('progression planner', () => {
  it('hedefe giden yol kökten hedefe sıralı', () => {
    const path = pathTo(DB, IDX, 'front-lever');
    expect(path.length).toBeGreaterThan(8);
    expect(path.at(-1)!.id).toBe('front-lever');
    // her hareket, ön koşullarından SONRA gelmeli
    const seen = new Set<string>();
    for (const mv of path) {
      for (const p of mv.prerequisites) {
        if (IDX.has(p)) expect(seen.has(p)).toBe(true);
      }
      seen.add(mv.id);
    }
  });

  it('Main, yolda çalışılabilir ilk bronz-olmayan hareket', () => {
    const s = withMastery({ 'wall-pushup': 'bronze' });
    const main = findMain(s, pathTo(DB, IDX, 'hspu'));
    expect(main).not.toBe(null);
    expect(['incline-pushup', 'knee-pushup']).toContain(main!.id);
  });

  it('kısıtlı hareket Main olarak seçilmez', () => {
    const s = withMastery({ 'wall-pushup': 'bronze' });
    s.constraints = [{
      area: 'hand', side: 'right', type: 'hardware',
      excludedMovements: ['incline-pushup', 'knee-pushup'],
      clearedByProfessional: true,
    }];
    const main = findMain(s, pathTo(DB, IDX, 'hspu'));
    expect(main?.id).not.toBe('incline-pushup');
    expect(main?.id).not.toBe('knee-pushup');
  });

  it('slot şablonu ağaca göre değişir — 4 slot evrensel değil', () => {
    expect(SLOT_TEMPLATES.push).toHaveLength(4);
    expect(SLOT_TEMPLATES.balance).toHaveLength(2);
    expect(SLOT_TEMPLATES.mobility).toHaveLength(1);
  });

  it('push planı üretilir ve slot rolleri benzersiz hareket alır', () => {
    const s = withMastery({
      'wall-pushup': 'master', 'incline-pushup': 'master',
      'knee-pushup': 'master', 'pushup': 'master', 'plank': 'gold',
    });
    const plan = planTree(DB, IDX, s, 'push', 'hspu');
    expect(plan.slots.length).toBeGreaterThan(1);
    const ids = plan.slots.map((x) => x.movementId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('seans sırası technique ile başlar, rol hiyerarşisi değil', () => {
    const slots = [
      { role: 'finisher' as const, movementId: 'a', sets: 2, targetReps: 20, rir: 1, reason: '' },
      { role: 'main' as const, movementId: 'b', sets: 3, targetReps: 6, rir: 2, reason: '' },
      { role: 'technique' as const, movementId: 'c', sets: 3, targetReps: 5, rir: 3, reason: '' },
    ];
    expect(orderForSession(slots).map((x) => x.role))
      .toEqual(['technique', 'main', 'finisher']);
  });

  it('terfi altın kademede olur, takvimle değil', () => {
    expect(shouldPromote(withMastery({ pushup: 'silver' }), 'pushup')).toBe(false);
    expect(shouldPromote(withMastery({ pushup: 'gold' }), 'pushup')).toBe(true);
  });

  it('main slotu rir 2, finisher daha yüksek tekrar', () => {
    const s = withMastery({
      'wall-pushup': 'master', 'incline-pushup': 'master',
      'knee-pushup': 'master', 'pushup': 'gold',
    });
    const plan = planTree(DB, IDX, s, 'push');
    const main = plan.slots.find((x) => x.role === 'main');
    const fin = plan.slots.find((x) => x.role === 'finisher');
    if (main) expect(main.rir).toBe(2);
    if (main && fin) expect(fin.targetReps).toBeGreaterThan(main.targetReps);
  });
});

// ───────────────────────────────────────────────────────── SEVİYE / DENGE

describe('seviye ve denge', () => {
  it('0 XP seviye 1', () => expect(levelOf(DB, 0)).toBe(1));
  it('100 XP seviye 2', () => expect(levelOf(DB, 100)).toBe(2));

  it('denge puanı boş durumda null', () => {
    expect(balanceScore(DB, emptyState())).toBe(null);
  });

  it('tek kategoride yığılma dengeyi düşürür', () => {
    const s = withMastery({ pushup: 'master', 'wide-pushup': 'master' });
    const b = balanceScore(DB, s)!;
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(60);
  });

  it('her şey bronz olunca denge yüksek', () => {
    const s = emptyState();
    for (const mv of DB.movements) {
      s.mastery[mv.id] = {
        movementId: mv.id, tier: 'bronze', verifiedSessions: [],
        best: mv.mastery.bronze.target,
      };
    }
    expect(balanceScore(DB, s)!).toBeGreaterThan(90);
  });
});

// ─────────────────────────────────────── PROGRAM YAPISI (v2: salon + kalistenik)

describe('haftalık program — salon düzeni', () => {
  it('3 sert · 2 hafif · 2 boş gün', () => {
    const kinds = WEEK.map((d) => d.kind);
    expect(kinds.filter((k) => k === 'heavy').length).toBe(3);
    expect(kinds.filter((k) => k === 'light').length).toBe(2);
    expect(kinds.filter((k) => k === 'rest').length).toBe(2);
  });

  it('salon sadece sert günlerde ve üçü de farklı şablon', () => {
    const gymDays = WEEK.filter((d) => d.gym);
    expect(gymDays.length).toBe(3);
    expect(gymDays.every((d) => d.kind === 'heavy')).toBe(true);
    expect(new Set(gymDays.map((d) => d.gym)).size).toBe(3);
  });

  it('sert günler Pzt/Çar/Cum — araya dinlenme giriyor', () => {
    expect(WEEK.filter((d) => d.kind === 'heavy').map((d) => d.index))
      .toEqual([1, 3, 5]);
  });

  it('iki sert gün asla arka arkaya gelmez', () => {
    for (let i = 0; i < WEEK.length - 1; i++) {
      const a = WEEK[i]!.kind, b = WEEK[i + 1]!.kind;
      expect(a === 'heavy' && b === 'heavy').toBe(false);
    }
  });

  it('hafif günlerde RIR yüksek — orada başarısızlığa gidilmez', () => {
    for (const d of WEEK.filter((x) => x.kind === 'light')) {
      for (const ex of d.exercises) {
        if (ex.unit === 'saniye' && ex.rir === 0) continue;  // askı/tutuş
        expect(ex.rir).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('ölçüm günü haftada bir tane (M-3: oyunlaştırma sağlığı bozmaz)', () => {
    expect(WEEK.filter((d) => d.isTestDay).length).toBe(1);
  });

  it('her egzersiz gerçek bir hareketi işaret eder', () => {
    const ids = new Set(DB.movements.map((m) => m.id));
    for (const d of WEEK) {
      for (const ex of d.exercises) {
        expect(ids.has(ex.movementId)).toBe(true);
        if (ex.altMovementId) expect(ids.has(ex.altMovementId)).toBe(true);
      }
    }
    for (const ex of MENU) expect(ids.has(ex.movementId)).toBe(true);
  });

  it('bar gerektiren her hareketin barsız alternatifi var', () => {
    for (const d of WEEK) {
      for (const ex of d.exercises) {
        if (ex.needsBar) expect(ex.altMovementId).toBeTruthy();
      }
    }
  });
});
