import type { SajuChart, SajuPillar } from '../types/saju.types';

const 천간 = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
const 지지 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

// 천간 오행
const 천간오행: Record<string, string> = {
  갑: '목(木)', 을: '목(木)',
  병: '화(火)', 정: '화(火)',
  무: '토(土)', 기: '토(土)',
  경: '금(金)', 신: '금(金)',
  임: '수(水)', 계: '수(水)',
};

// 지지 오행
const 지지오행: Record<string, string> = {
  자: '수(水)', 축: '토(土)',
  인: '목(木)', 묘: '목(木)',
  진: '토(土)', 사: '화(火)',
  오: '화(火)', 미: '토(土)',
  신: '금(金)', 유: '금(金)',
  술: '토(土)', 해: '수(水)',
};

function get오행(char: string, type: 'stem' | 'branch'): string {
  return type === 'stem' ? 천간오행[char] : 지지오행[char];
}

const 시간지지맵: Record<string, number> = {
  자시: 0, 축시: 1, 인시: 2, 묘시: 3, 진시: 4, 사시: 5,
  오시: 6, 미시: 7, 신시: 8, 유시: 9, 술시: 10, 해시: 11,
};

/**
 * 연주(年柱) 계산
 * 갑자년(1984)을 기준으로 60갑자 순환
 */
export function calcYearPillar(year: number): SajuPillar {
  // 갑자년 기준: 4를 빼면 됨 (서기 4년이 갑자년)
  const idx = (year - 4) % 60;
  const stem = idx % 10;
  const branch = idx % 12;
  return {
    천간: 천간[(stem + 10) % 10],
    지지: 지지[(branch + 12) % 12],
  };
}

/**
 * 월주(月柱) 계산
 * 연간(年干)에 따라 월간(月干)이 결정됨
 */
export function calcMonthPillar(year: number, month: number): SajuPillar {
  // 월지: 인월(1월=寅)부터 시작
  const monthBranchIdx = (month + 1) % 12; // 1월->인(2), 2월->묘(3)...

  // 연간에 따른 월간 시작점
  const yearStem = ((year - 4) % 10 + 10) % 10;
  // 갑기년: 병인월(2), 을경년: 무인월(4), 병신년: 경인월(6), 정임년: 임인월(8), 무계년: 갑인월(0)
  const monthStemStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIdx = (monthStemStart[yearStem] + month - 1) % 10;

  return {
    천간: 천간[stemIdx],
    지지: 지지[monthBranchIdx],
  };
}

/**
 * 일주(日柱) 계산
 * 2000년 1월 1일은 갑진일 (천간: 갑(0), 지지: 진(4))
 */
export function calcDayPillar(year: number, month: number, day: number): SajuPillar {
  // 2000-01-07 = 경술일. 기준일로부터의 차이로 계산
  // 2000-01-01 = 갑진일: 천간 0, 지지 4 -> 60갑자 중 40번째 (0-indexed)
  const baseDate = new Date(2000, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  const baseStemIdx = 0;  // 갑
  const baseBranchIdx = 4; // 진

  const stemIdx = ((baseStemIdx + diffDays) % 10 + 10) % 10;
  const branchIdx = ((baseBranchIdx + diffDays) % 12 + 12) % 12;

  return {
    천간: 천간[stemIdx],
    지지: 지지[branchIdx],
  };
}

/**
 * 시주(時柱) 계산
 */
export function calcHourPillar(dayStem: string, hourName: string): SajuPillar | null {
  if (hourName === '모름') return null;

  const branchIdx = 시간지지맵[hourName];
  if (branchIdx === undefined) return null;

  // 일간에 따른 시간 시작점
  const dayStemIdx = 천간.indexOf(dayStem as typeof 천간[number]);
  // 갑기일: 갑자시(0), 을경일: 병자시(2), 병신일: 무자시(4), 정임일: 경자시(6), 무계일: 임자시(8)
  const hourStemStart = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const stemIdx = (hourStemStart[dayStemIdx] + branchIdx) % 10;

  return {
    천간: 천간[stemIdx],
    지지: 지지[branchIdx],
  };
}

/**
 * 전체 사주팔자 계산
 */
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hourName: string,
): SajuChart {
  const yearPillar = calcYearPillar(year);
  const monthPillar = calcMonthPillar(year, month);
  const dayPillar = calcDayPillar(year, month, day);
  const hourPillar = calcHourPillar(dayPillar.천간, hourName);

  return {
    연주: yearPillar,
    월주: monthPillar,
    일주: dayPillar,
    시주: hourPillar,
  };
}

/**
 * 오행 분석
 */
export function analyzeOheng(chart: SajuChart): Record<string, number> {
  const counts: Record<string, number> = {
    '목(木)': 0, '화(火)': 0, '토(土)': 0, '금(金)': 0, '수(水)': 0,
  };

  const pillars = [chart.연주, chart.월주, chart.일주];
  if (chart.시주) pillars.push(chart.시주);

  for (const pillar of pillars) {
    counts[get오행(pillar.천간, 'stem')]++;
    counts[get오행(pillar.지지, 'branch')]++;
  }

  return counts;
}

/**
 * 사주 차트를 텍스트로 포맷팅
 */
export function formatSajuChart(chart: SajuChart): string {
  const lines: string[] = [];
  lines.push(`연주(年柱): ${chart.연주.천간}${chart.연주.지지} [${get오행(chart.연주.천간, 'stem')}, ${get오행(chart.연주.지지, 'branch')}]`);
  lines.push(`월주(月柱): ${chart.월주.천간}${chart.월주.지지} [${get오행(chart.월주.천간, 'stem')}, ${get오행(chart.월주.지지, 'branch')}]`);
  lines.push(`일주(日柱): ${chart.일주.천간}${chart.일주.지지} [${get오행(chart.일주.천간, 'stem')}, ${get오행(chart.일주.지지, 'branch')}]`);
  if (chart.시주) {
    lines.push(`시주(時柱): ${chart.시주.천간}${chart.시주.지지} [${get오행(chart.시주.천간, 'stem')}, ${get오행(chart.시주.지지, 'branch')}]`);
  } else {
    lines.push(`시주(時柱): 미상`);
  }

  const oheng = analyzeOheng(chart);
  lines.push('');
  lines.push('오행 분포:');
  for (const [key, count] of Object.entries(oheng)) {
    lines.push(`  ${key}: ${'●'.repeat(count)}${'○'.repeat(Math.max(0, 3 - count))} (${count})`);
  }

  return lines.join('\n');
}
