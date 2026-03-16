import { ArrowLeft, RotateCcw } from 'lucide-react';
import type { FortuneSection } from '../types/saju.types';
import FortuneCard from './FortuneCard';
import LoadingOrb from './LoadingOrb';

interface SajuResultProps {
  isLoading: boolean;
  sections: FortuneSection[];
  streamingText: string;
  error: string | null;
  loadingPhase: string;
  onBack: () => void;
  onRetry: () => void;
}

export default function SajuResult({
  isLoading,
  sections,
  streamingText,
  error,
  loadingPhase,
  onBack,
  onRetry,
}: SajuResultProps) {
  const hasContent = sections.length > 0 || streamingText.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          다시 입력
        </button>
        {hasContent && !isLoading && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            다시 분석
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 mb-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && !hasContent && (
        <LoadingOrb phase={loadingPhase} />
      )}

      {/* Results grid */}
      {hasContent && (
        <>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            🔮 사주 분석 결과
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, idx) => (
              <FortuneCard
                key={section.category}
                section={section}
                isStreaming={isLoading && idx === sections.length - 1}
              />
            ))}
          </div>

          {/* Raw text fallback during streaming with no parsed sections */}
          {isLoading && sections.length === 0 && streamingText && (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mt-4">
              <div className="fortune-content text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-0.5 h-4 bg-gold-400 animate-blink ml-1" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
