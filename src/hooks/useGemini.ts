import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SajuInput, FortuneSection } from '../types/saju.types';
import { FORTUNE_CATEGORIES } from '../types/saju.types';
import { getSystemPrompt, buildUserPrompt } from '../utils/promptBuilder';

interface UseGeminiReturn {
  isLoading: boolean;
  streamingText: string;
  sections: FortuneSection[];
  error: string | null;
  loadingPhase: string;
  generateFortune: (apiKey: string, input: SajuInput) => Promise<void>;
  reset: () => void;
}

const LOADING_PHASES = [
  '사주팔자를 펼치는 중...',
  '천간을 분석하는 중...',
  '지지의 관계를 살피는 중...',
  '오행의 균형을 확인하는 중...',
  '십신을 배치하는 중...',
  '운세를 정리하는 중...',
];

function parseStars(text: string): number | undefined {
  const match = text.match(/⭐+/);
  if (match) return match[0].length;
  const numMatch = text.match(/\((\d)\/5\)/);
  if (numMatch) return parseInt(numMatch[1]);
  return undefined;
}

function parseSections(rawText: string): FortuneSection[] {
  const sections: FortuneSection[] = [];

  for (const cat of FORTUNE_CATEGORIES) {
    // Find section by emoji or label
    const patterns = [
      new RegExp(`##\\s*${cat.emoji}\\s*${cat.label}([\\s\\S]*?)(?=##\\s*[🌟💰❤️💼🏥👨‍👩‍👧🎓📅🔮]|$)`),
      new RegExp(`##\\s*${cat.label}([\\s\\S]*?)(?=##|$)`),
    ];

    let content = '';
    for (const pattern of patterns) {
      const match = rawText.match(pattern);
      if (match) {
        content = match[1].trim();
        break;
      }
    }

    if (content) {
      sections.push({
        category: cat.category,
        label: cat.label,
        emoji: cat.emoji,
        content,
        stars: parseStars(content),
      });
    }
  }

  return sections;
}

export function useGemini(): UseGeminiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sections, setSections] = useState<FortuneSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState('');
  const abortRef = useRef(false);
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const reset = useCallback(() => {
    setIsLoading(false);
    setStreamingText('');
    setSections([]);
    setError(null);
    setLoadingPhase('');
    abortRef.current = true;
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
  }, []);

  const generateFortune = useCallback(async (apiKey: string, input: SajuInput) => {
    setIsLoading(true);
    setStreamingText('');
    setSections([]);
    setError(null);
    abortRef.current = false;

    // Rotate loading phases
    let phaseIdx = 0;
    setLoadingPhase(LOADING_PHASES[0]);
    phaseIntervalRef.current = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % LOADING_PHASES.length;
      setLoadingPhase(LOADING_PHASES[phaseIdx]);
    }, 3000);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: getSystemPrompt(),
      });

      const userPrompt = buildUserPrompt(input);
      const result = await model.generateContentStream(userPrompt);

      let fullText = '';
      for await (const chunk of result.stream) {
        if (abortRef.current) break;
        const text = chunk.text();
        fullText += text;
        setStreamingText(fullText);
        // Parse sections progressively
        const parsed = parseSections(fullText);
        if (parsed.length > 0) {
          setSections(parsed);
        }
      }

      // Final parse
      const finalSections = parseSections(fullText);
      if (finalSections.length > 0) {
        setSections(finalSections);
      } else if (fullText.length > 0) {
        // Fallback: show raw text as single section
        setSections([{
          category: 'overall',
          label: '운세 결과',
          emoji: '🔮',
          content: fullText,
        }]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('401') || message.includes('API_KEY_INVALID')) {
        setError('API Key가 유효하지 않습니다.');
      } else if (message.includes('429') || message.includes('RATE_LIMIT')) {
        setError('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (message.includes('500')) {
        setError('Gemini 서버 오류입니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(`오류가 발생했습니다: ${message}`);
      }
    } finally {
      setIsLoading(false);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      setLoadingPhase('');
    }
  }, []);

  return { isLoading, streamingText, sections, error, loadingPhase, generateFortune, reset };
}
