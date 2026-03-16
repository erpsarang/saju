import { describe, it, expect } from 'vitest';
import { getSystemPrompt, buildUserPrompt } from '../utils/promptBuilder';
import type { SajuInput } from '../types/saju.types';

describe('getSystemPrompt', () => {
  it('returns Korean system prompt', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('사주명리학');
    expect(prompt).toContain('한국어');
  });

  it('includes all section headers', () => {
    const prompt = getSystemPrompt();
    expect(prompt).toContain('총운');
    expect(prompt).toContain('재산운');
    expect(prompt).toContain('연애운');
    expect(prompt).toContain('사업운');
    expect(prompt).toContain('건강운');
    expect(prompt).toContain('가족/인간관계운');
    expect(prompt).toContain('학업/자기계발운');
    expect(prompt).toContain('월별');
    expect(prompt).toContain('종합 조언');
  });
});

describe('buildUserPrompt', () => {
  const baseInput: SajuInput = {
    name: '홍길동',
    gender: 'male',
    birthDate: '1990-06-15',
    birthHour: '오시',
    isLunar: false,
    concern: '직장 이직 고민',
  };

  it('includes user info', () => {
    const prompt = buildUserPrompt(baseInput);
    expect(prompt).toContain('홍길동');
    expect(prompt).toContain('남');
    expect(prompt).toContain('1990-06-15');
    expect(prompt).toContain('오시');
    expect(prompt).toContain('직장 이직 고민');
  });

  it('includes saju chart', () => {
    const prompt = buildUserPrompt(baseInput);
    expect(prompt).toContain('연주(年柱)');
    expect(prompt).toContain('월주(月柱)');
    expect(prompt).toContain('일주(日柱)');
    expect(prompt).toContain('시주(時柱)');
    expect(prompt).toContain('오행 분포');
  });

  it('handles anonymous user', () => {
    const prompt = buildUserPrompt({ ...baseInput, name: '' });
    expect(prompt).toContain('익명');
  });

  it('handles no concern', () => {
    const prompt = buildUserPrompt({ ...baseInput, concern: '' });
    expect(prompt).toContain('없음');
  });

  it('handles female gender', () => {
    const prompt = buildUserPrompt({ ...baseInput, gender: 'female' });
    expect(prompt).toContain('여');
  });

  it('handles 모름 birth hour', () => {
    const prompt = buildUserPrompt({ ...baseInput, birthHour: '모름' });
    expect(prompt).toContain('시주(時柱): 미상');
  });

  it('handles lunar date', () => {
    const prompt = buildUserPrompt({ ...baseInput, isLunar: true, birthDate: '1990-05-23' });
    expect(prompt).toContain('음력');
  });
});
