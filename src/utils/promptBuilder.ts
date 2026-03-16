import type { SajuInput } from '../types/saju.types';
import { calculateSaju, formatSajuChart } from './sajuCalculator';
import { lunarToSolar } from './lunarConverter';

const SYSTEM_PROMPT = `당신은 30년 경력의 한국 사주명리학 전문가입니다.
사주팔자(四柱八字) — 연주(年柱), 월주(月柱), 일주(日柱), 시주(時柱) — 를
천간(天干 10개)과 지지(地支 12개), 오행(木火土金水), 십신(十神) 이론으로
해석하는 깊이 있는 풀이를 제공합니다.

[출력 규칙]
- 반드시 한국어로 작성
- 각 섹션을 ## 헤더로 구분
- 섹션 순서: 총운 → 재산운 → 연애운 → 사업운 → 건강운 → 가족/인간관계운 → 학업/자기계발운 → 월별운세 → 종합조언
- 각 섹션 헤더는 다음 형식을 정확히 따를 것:
  ## 🌟 총운
  ## 💰 재산운
  ## ❤️ 연애운
  ## 💼 사업운
  ## 🏥 건강운
  ## 👨‍👩‍👧 가족/인간관계운
  ## 🎓 학업/자기계발운
  ## 📅 월별 주요 운세
  ## 🔮 종합 조언 및 길일/흉일
- 각 섹션 시작 시 별점을 매길 것 (예: ⭐⭐⭐⭐ (4/5))
- 월별 운세는 마크다운 테이블 형식으로 출력
- 근거 있는 해석: 어떤 천간/지지/오행의 작용인지 간략히 언급
- 지나치게 부정적인 표현 자제, 개선 방향 함께 제시
- 분량: 각 섹션 최소 150자 이상, 전체 1500자 이상`;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(input: SajuInput): string {
  // 음력인 경우 양력으로 변환
  let solarDate = input.birthDate;
  let lunarNote = '';
  if (input.isLunar) {
    solarDate = lunarToSolar(input.birthDate);
    lunarNote = ` (음력 ${input.birthDate} → 양력 ${solarDate})`;
  }

  const [year, month, day] = solarDate.split('-').map(Number);
  const chart = calculateSaju(year, month, day, input.birthHour);
  const chartText = formatSajuChart(chart);

  const currentYear = new Date().getFullYear();

  return `[사주 분석 요청]
- 이름: ${input.name || '익명'}
- 성별: ${input.gender === 'male' ? '남' : '여'}
- 양력 생년월일: ${solarDate}${lunarNote}
- 태어난 시간: ${input.birthHour}
- 현재 고민/관심사: ${input.concern || '없음'}

[사주팔자 계산 결과]
${chartText}

위 사주팔자를 바탕으로 ${currentYear}년 전체 운세를 상세히 풀어주세요.
천간, 지지, 오행의 상호작용을 근거로 각 영역별 운세를 분석해 주세요.`;
}
