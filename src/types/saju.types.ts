export interface SajuInput {
  name?: string;
  gender: 'male' | 'female';
  birthDate: string;        // YYYY-MM-DD (양력)
  birthHour: string;        // '자시' | '축시' | ... | '모름'
  isLunar: boolean;
  concern?: string;
}

export interface FortuneSection {
  category: FortuneCategory;
  label: string;
  emoji: string;
  content: string;
  stars?: number;           // 1-5
}

export type FortuneCategory =
  | 'overall' | 'wealth' | 'love' | 'career'
  | 'health' | 'family' | 'study' | 'monthly' | 'advice';

export interface SajuResult {
  input: SajuInput;
  sections: FortuneSection[];
  rawText: string;
  generatedAt: Date;
}

export interface SajuPillar {
  천간: string;
  지지: string;
}

export interface SajuChart {
  연주: SajuPillar;
  월주: SajuPillar;
  일주: SajuPillar;
  시주: SajuPillar | null;
}

export const FORTUNE_CATEGORIES: { category: FortuneCategory; label: string; emoji: string }[] = [
  { category: 'overall', label: '총운', emoji: '🌟' },
  { category: 'wealth', label: '재산운', emoji: '💰' },
  { category: 'love', label: '연애운', emoji: '❤️' },
  { category: 'career', label: '사업운', emoji: '💼' },
  { category: 'health', label: '건강운', emoji: '🏥' },
  { category: 'family', label: '가족/인간관계운', emoji: '👨‍👩‍👧' },
  { category: 'study', label: '학업/자기계발운', emoji: '🎓' },
  { category: 'monthly', label: '월별 주요 운세', emoji: '📅' },
  { category: 'advice', label: '종합 조언 및 길일/흉일', emoji: '🔮' },
];

export const BIRTH_HOURS = [
  { value: '자시', label: '자시 (23:00~01:00)' },
  { value: '축시', label: '축시 (01:00~03:00)' },
  { value: '인시', label: '인시 (03:00~05:00)' },
  { value: '묘시', label: '묘시 (05:00~07:00)' },
  { value: '진시', label: '진시 (07:00~09:00)' },
  { value: '사시', label: '사시 (09:00~11:00)' },
  { value: '오시', label: '오시 (11:00~13:00)' },
  { value: '미시', label: '미시 (13:00~15:00)' },
  { value: '신시', label: '신시 (15:00~17:00)' },
  { value: '유시', label: '유시 (17:00~19:00)' },
  { value: '술시', label: '술시 (19:00~21:00)' },
  { value: '해시', label: '해시 (21:00~23:00)' },
  { value: '모름', label: '모름' },
] as const;
