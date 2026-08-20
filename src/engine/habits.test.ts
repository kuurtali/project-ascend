/**
 * SÜREKLİLİK KATMANI TESTLERİ
 *
 * Korunan vaat: bu katman GÜN sayar, tekrar değil — ve kullanıcının
 * kendi belirlediği aralığı cezalandırmaz. "2 günde bir" diyen biri
 * ikinci gün geciktirmiş sayılamaz.
 */

import { describe, expect, it } from 'vitest';
import type { HabitDef, PlayerState } from './types';
import {
  chainDays, DEFAULT_HABITS, daysSince, doneToday, habitsOf, isDue, isLate,
  recentMarks, toggleHabit,
} from './habits';

const TODAY = new Date('2026-08-20T10:00:00');
const H: HabitDef = { id: 'h-pushup', label: 'Şınav', everyDays: 2 };

function state(dates: string[] = []): PlayerState {
  return {
    xp: 0, equipment: ['floor'], constraints: [], mastery: [] as never,
    logs: [], weeklyTarget: 5, testDayOfWeek: 1,
    habitLog: dates.map((date) => ({ date, habitId: H.id })),
  } as unknown as PlayerState;
}

const back = (n: number) =>
  new Date(TODAY.getTime() - n * 86_400_000).toISOString().slice(0, 10);

describe('işaretleme', () => {
  it('boşken hiçbir şey yapılmamış sayılır', () => {
    expect(doneToday(state(), H.id, TODAY)).toBe(false);
    expect(daysSince(state(), H.id, TODAY)).toBe(Infinity);
    expect(chainDays(state(), H, TODAY)).toBe(0);
  });

  it('tek dokunuşla işaretlenir ve geri alınır', () => {
    const on = toggleHabit(state(), H.id, TODAY);
    expect(doneToday(on, H.id, TODAY)).toBe(true);
    const off = toggleHabit(on, H.id, TODAY);
    expect(doneToday(off, H.id, TODAY)).toBe(false);
  });

  it('aynı gün iki kez işaretlemek kayıt çoğaltmaz', () => {
    const on = toggleHabit(state(), H.id, TODAY);
    const again = toggleHabit(toggleHabit(on, H.id, TODAY), H.id, TODAY);
    expect((again.habitLog ?? []).filter((h) => h.date === back(0))).toHaveLength(1);
  });
});

describe('aralık — kullanıcının planı cezalandırılmaz', () => {
  it('bugün yapılmışsa tekrar beklenmez', () => {
    expect(isDue(state([back(0)]), H, TODAY)).toBe(false);
  });

  it('aralık dolduğunda beklenir ama gecikmiş sayılmaz', () => {
    const s = state([back(2)]);
    expect(isDue(s, H, TODAY)).toBe(true);
    expect(isLate(s, H, TODAY)).toBe(false);
  });

  it('aralık aşılınca gecikmiş sayılır', () => {
    expect(isLate(state([back(3)]), H, TODAY)).toBe(true);
  });

  it('aralığın içindeki gün ne bekleniyor ne gecikmiş', () => {
    const s = state([back(1)]);
    expect(isDue(s, H, TODAY)).toBe(false);
    expect(isLate(s, H, TODAY)).toBe(false);
  });
});

describe('zincir GÜN sayar, işaret değil', () => {
  it('düzenli 2 günde bir → kesintisiz gün sayısı', () => {
    // 8 gün önce başlayıp 2 günde bir: 8,6,4,2,0
    const s = state([back(8), back(6), back(4), back(2), back(0)]);
    expect(chainDays(s, H, TODAY)).toBe(9);
  });

  it('aralık aşılınca zincir kopar', () => {
    // Son işaret 4 gün önce, aralık 2 → zincir yok
    expect(chainDays(state([back(8), back(6), back(4)]), H, TODAY)).toBe(0);
  });

  it('kopmadan önceki geçmiş zincire dâhil edilmez', () => {
    // Eski bir seri var, sonra 10 günlük boşluk, sonra yeniden başlamış
    const s = state([back(30), back(28), back(26), back(2), back(0)]);
    expect(chainDays(s, H, TODAY)).toBe(3);
  });

  it('tek işaret bile zinciri başlatır', () => {
    expect(chainDays(state([back(0)]), H, TODAY)).toBe(1);
  });

  it('farklı aralıklı alışkanlıklar aynı ölçüyle karşılaştırılabilir', () => {
    const gym: HabitDef = { id: 'h-pushup', label: 'Salon', everyDays: 3 };
    const s = state([back(6), back(3), back(0)]);
    expect(chainDays(s, gym, TODAY)).toBe(7);
  });
});

describe('nokta şeridi', () => {
  it('istenen gün sayısı kadar nokta döner, eskiden yeniye', () => {
    const m = recentMarks(state([back(0), back(3)]), H.id, 14, TODAY);
    expect(m).toHaveLength(14);
    expect(m.at(-1)!.done).toBe(true);
    expect(m.at(-4)!.done).toBe(true);
    expect(m.at(-2)!.done).toBe(false);
  });
});

describe('varsayılan liste', () => {
  it('temel hareketler hazır gelir', () => {
    expect(habitsOf(state()).length).toBeGreaterThan(0);
    expect(habitsOf(state())).toEqual(DEFAULT_HABITS);
  });

  it('her alışkanlığın aralığı ve etiketi var', () => {
    for (const h of DEFAULT_HABITS) {
      expect(h.label.length).toBeGreaterThan(0);
      expect(h.everyDays).toBeGreaterThan(0);
    }
  });

  it('kullanıcı kendi listesini verebilir', () => {
    const own: HabitDef[] = [{ id: 'x', label: 'Yürüyüş', everyDays: 1 }];
    expect(habitsOf({ ...state(), habits: own })).toEqual(own);
  });
});
