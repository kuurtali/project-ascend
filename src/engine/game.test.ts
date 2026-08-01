/**
 * Oyun sistemleri testleri.
 *
 * Özellikle anayasa kısıtını doğrular: seri HAFTALIK, günlük değil.
 * Dinlenme günü seriyi kırmamalı. (M-3)
 */

import { describe, expect, it } from 'vitest';
import db from '../data/movements.json';
import type { MovementDatabase, PlayerState, SetLog } from './types';
import { ascensionOf, bossStates, rankOf, streakOf, titlesOf } from './game';

const DB = db as unknown as MovementDatabase;

function state(over: Partial<PlayerState> = {}): PlayerState {
  return {
    xp: 0, equipment: ['floor', 'wall', 'box', 'pullup-bar', 'dip-station'],
    constraints: [], mastery: {}, logs: [],
    weeklyTarget: 5, testDayOfWeek: 1, ...over,
  };
}

function logsOn(dates: string[]): SetLog[] {
  return dates.map((d) => ({ movementId: 'pushup', date: d, values: [12] }));
}

function withTiers(ids: Record<string, 'bronze' | 'silver' | 'gold' | 'master'>) {
  const s = state();
  for (const [id, tier] of Object.entries(ids)) {
    const mv = DB.movements.find((m) => m.id === id)!;
    s.mastery[id] = { movementId: id, tier, verifiedSessions: [], best: mv.mastery[tier].target };
  }
  return s;
}

describe('rütbe', () => {
  it('kayıt yoksa Beginner I', () => {
    expect(rankOf(DB, state()).label).toBe('Beginner I');
  });

  it('medyan kullanır — tek yüksek düğüm rütbeyi şişirmez', () => {
    // 5 düşük tier + 1 çok yüksek tier
    const low = withTiers({
      'wall-pushup': 'bronze', 'incline-pushup': 'bronze',
      'knee-pushup': 'bronze', 'plank': 'bronze', 'dead-bug': 'bronze',
    });
    const lowRank = rankOf(DB, low);

    const withOneElite = { ...low, mastery: { ...low.mastery } };
    const fl = DB.movements.find((m) => m.id === 'front-lever')!;
    withOneElite.mastery['front-lever'] = {
      movementId: 'front-lever', tier: 'bronze', verifiedSessions: [],
      best: fl.mastery.bronze.target,
    };
    // Tek elit düğüm aşamayı sıçratmamalı
    expect(rankOf(DB, withOneElite).stage).toBe(lowRank.stage);
  });

  it('genel seviye yükseldikçe rütbe yükselir', () => {
    const high = withTiers({
      'pull-up': 'bronze', 'chin-up': 'bronze', 'diamond-pushup': 'bronze',
      'pike-pushup': 'bronze', 'parallel-bar-dip': 'bronze',
    });
    const low = withTiers({ 'wall-pushup': 'bronze', 'plank': 'bronze' });
    const order = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Elite', 'Legendary'];
    expect(order.indexOf(rankOf(DB, high).stage))
      .toBeGreaterThan(order.indexOf(rankOf(DB, low).stage));
  });
});

describe('seri — HAFTALIK, günlük değil (M-3)', () => {
  it('hafta içinde dinlenme günü seriyi KIRMAZ', () => {
    // Pzt, Sal, Per, Cum, Cmt — Çar ve Paz dinlenme
    const s = state({
      weeklyTarget: 5,
      logs: logsOn(['2026-08-03', '2026-08-04', '2026-08-06', '2026-08-07', '2026-08-08']),
    });
    expect(streakOf(s, new Date('2026-08-09')).onTrack).toBe(true);
    expect(streakOf(s, new Date('2026-08-09')).weeks).toBeGreaterThanOrEqual(1);
  });

  it('hedefin altında kalan hafta seriyi keser', () => {
    const s = state({
      weeklyTarget: 5,
      logs: logsOn([
        '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', // 5 gün
        '2026-08-10', '2026-08-11',                                           // 2 gün
      ]),
    });
    // 20 Ağustos: içinde bulunulan hafta 17-23. Bir önceki hafta (10-16)
    // hedefin altında kaldı -> zincir orada kırılır.
    expect(streakOf(s, new Date('2026-08-20')).weeks).toBe(0);
  });

  it('içinde bulunulan hafta henüz bitmediği için seriyi kırmaz', () => {
    const s = state({
      weeklyTarget: 5,
      logs: logsOn(['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07']),
    });
    // Sonraki haftanın salısı — bu hafta 0 seans ama seri korunmalı
    expect(streakOf(s, new Date('2026-08-11')).weeks).toBe(1);
  });

  it('bu haftaki seans sayısını gösterir', () => {
    const s = state({ logs: logsOn(['2026-08-03', '2026-08-04']) });
    expect(streakOf(s, new Date('2026-08-05')).thisWeek).toBe(2);
  });
});

describe('boss HP', () => {
  it('dokunulmamış boss 100 HP', () => {
    const b = bossStates(DB, state()).find((x) => x.movement.id === 'hspu')!;
    expect(b.hp).toBe(100);
    expect(b.defeated).toBe(false);
  });

  it('ilerleme HP düşürür', () => {
    const s = state();
    const mv = DB.movements.find((m) => m.id === 'pistol-squat')!;
    s.mastery['pistol-squat'] = {
      movementId: 'pistol-squat', tier: null, verifiedSessions: [],
      best: Math.floor(mv.mastery.bronze.target / 2),
    };
    const b = bossStates(DB, s).find((x) => x.movement.id === 'pistol-squat')!;
    expect(b.hp).toBeLessThan(100);
    expect(b.hp).toBeGreaterThan(0);
  });

  it('bronz kademe = yenildi, HP 0', () => {
    const s = withTiers({ 'pistol-squat': 'bronze' });
    const b = bossStates(DB, s).find((x) => x.movement.id === 'pistol-squat')!;
    expect(b.defeated).toBe(true);
    expect(b.hp).toBe(0);
  });

  it('22 boss listelenir, en yakın önce', () => {
    const list = bossStates(DB, state());
    expect(list.length).toBe(22);
    expect(list[0]!.hp).toBeLessThanOrEqual(list.at(-1)!.hp);
  });
});

describe('unvanlar', () => {
  it('boş durumda hiçbiri kazanılmamış', () => {
    expect(titlesOf(DB, state()).every((t) => !t.earned)).toBe(true);
  });

  it('yarısı disiplin ödüllendiriyor, güç değil', () => {
    const ids = titlesOf(DB, state()).map((t) => t.id);
    expect(ids).toContain('istikrarli');
    expect(ids).toContain('sabirli');
    expect(ids).toContain('kayitci');
  });

  it('ilerleme oranı hesaplanır', () => {
    const s = state({
      weeklyTarget: 1,
      logs: logsOn(['2026-08-03', '2026-08-10']),
    });
    const t = titlesOf(DB, s, new Date('2026-08-12')).find((x) => x.id === 'istikrarli')!;
    expect(t.progress).toBeGreaterThan(0);
    expect(t.progress).toBeLessThanOrEqual(1);
  });
});

describe('ascension score', () => {
  it('boş durumda 0', () => {
    expect(ascensionOf(DB, state()).total).toBe(0);
  });

  it('altı eksen döner', () => {
    const a = ascensionOf(DB, state());
    expect(a.axes.length).toBe(6);
    expect(a.axes.map((x) => x.key)).toContain('consistency');
  });

  it('XP birikimlidir ama ascension DÜŞEBİLİR — istikrar ekseni sayesinde', () => {
    const active = state({
      weeklyTarget: 1,
      logs: logsOn(['2026-08-03', '2026-08-10', '2026-08-17']),
    });
    const lapsed = state({ weeklyTarget: 1, logs: logsOn(['2026-01-05']) });
    const when = new Date('2026-08-19');
    const aAct = ascensionOf(DB, active, when).axes.find((x) => x.key === 'consistency')!;
    const aLap = ascensionOf(DB, lapsed, when).axes.find((x) => x.key === 'consistency')!;
    expect(aAct.value).toBeGreaterThan(aLap.value);
  });
});
