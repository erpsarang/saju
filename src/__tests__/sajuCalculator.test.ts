import { describe, it, expect } from 'vitest';
import {
  calcYearPillar,
  calcMonthPillar,
  calcDayPillar,
  calcHourPillar,
  calculateSaju,
  analyzeOheng,
} from '../utils/sajuCalculator';

describe('calcYearPillar', () => {
  it('1984년은 갑자년', () => {
    const result = calcYearPillar(1984);
    expect(result.천간).toBe('갑');
    expect(result.지지).toBe('자');
  });

  it('1985년은 을축년', () => {
    const result = calcYearPillar(1985);
    expect(result.천간).toBe('을');
    expect(result.지지).toBe('축');
  });

  it('2024년은 갑진년', () => {
    const result = calcYearPillar(2024);
    expect(result.천간).toBe('갑');
    expect(result.지지).toBe('진');
  });

  it('2025년은 을사년', () => {
    const result = calcYearPillar(2025);
    expect(result.천간).toBe('을');
    expect(result.지지).toBe('사');
  });

  it('2000년은 경진년', () => {
    const result = calcYearPillar(2000);
    expect(result.천간).toBe('경');
    expect(result.지지).toBe('진');
  });

  it('1990년은 경오년', () => {
    const result = calcYearPillar(1990);
    expect(result.천간).toBe('경');
    expect(result.지지).toBe('오');
  });
});

describe('calcMonthPillar', () => {
  it('returns valid 천간 and 지지', () => {
    const result = calcMonthPillar(1990, 5);
    expect(result.천간).toBeTruthy();
    expect(result.지지).toBeTruthy();
  });

  it('different months yield different pillars', () => {
    const jan = calcMonthPillar(2000, 1);
    const feb = calcMonthPillar(2000, 2);
    expect(jan.지지).not.toBe(feb.지지);
  });
});

describe('calcDayPillar', () => {
  it('2000-01-01은 갑진일', () => {
    const result = calcDayPillar(2000, 1, 1);
    expect(result.천간).toBe('갑');
    expect(result.지지).toBe('진');
  });

  it('consecutive days have consecutive stems', () => {
    const day1 = calcDayPillar(2000, 1, 1);
    const day2 = calcDayPillar(2000, 1, 2);
    const stems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const idx1 = stems.indexOf(day1.천간);
    const idx2 = stems.indexOf(day2.천간);
    expect(idx2).toBe((idx1 + 1) % 10);
  });
});

describe('calcHourPillar', () => {
  it('모름이면 null 반환', () => {
    const result = calcHourPillar('갑', '모름');
    expect(result).toBeNull();
  });

  it('갑일 자시 -> 갑자시', () => {
    const result = calcHourPillar('갑', '자시');
    expect(result).not.toBeNull();
    expect(result!.천간).toBe('갑');
    expect(result!.지지).toBe('자');
  });

  it('갑일 오시 -> 경오시', () => {
    const result = calcHourPillar('갑', '오시');
    expect(result).not.toBeNull();
    expect(result!.천간).toBe('경');
    expect(result!.지지).toBe('오');
  });
});

describe('calculateSaju', () => {
  it('returns complete chart', () => {
    const chart = calculateSaju(1990, 6, 15, '오시');
    expect(chart.연주).toBeDefined();
    expect(chart.월주).toBeDefined();
    expect(chart.일주).toBeDefined();
    expect(chart.시주).not.toBeNull();
  });

  it('returns null 시주 when 모름', () => {
    const chart = calculateSaju(1990, 6, 15, '모름');
    expect(chart.시주).toBeNull();
  });
});

describe('analyzeOheng', () => {
  it('returns counts for all five elements', () => {
    const chart = calculateSaju(1990, 6, 15, '오시');
    const oheng = analyzeOheng(chart);
    expect(Object.keys(oheng)).toHaveLength(5);
    const total = Object.values(oheng).reduce((a, b) => a + b, 0);
    expect(total).toBe(8); // 4 pillars × 2 (천간+지지)
  });

  it('모름 시주일 때 총 6개', () => {
    const chart = calculateSaju(1990, 6, 15, '모름');
    const oheng = analyzeOheng(chart);
    const total = Object.values(oheng).reduce((a, b) => a + b, 0);
    expect(total).toBe(6); // 3 pillars × 2
  });
});
