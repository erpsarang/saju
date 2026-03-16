import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import ApiKeySetup from './components/ApiKeySetup';
import SajuForm from './components/SajuForm';
import SajuResult from './components/SajuResult';
import { useGemini } from './hooks/useGemini';
import type { SajuInput } from './types/saju.types';

type Step = 'apiKey' | 'form' | 'result';

export default function App() {
  const [step, setStep] = useState<Step>('apiKey');
  const [apiKey, setApiKey] = useState('');
  const [sajuInput, setSajuInput] = useState<SajuInput | null>(null);
  const gemini = useGemini();

  const handleKeyValidated = useCallback((key: string) => {
    setApiKey(key);
    setStep('form');
  }, []);

  const handleFormSubmit = useCallback(async (data: SajuInput) => {
    setSajuInput(data);
    setStep('result');
    await gemini.generateFortune(apiKey, data);
  }, [apiKey, gemini]);

  const handleBack = useCallback(() => {
    gemini.reset();
    setStep('form');
  }, [gemini]);

  const handleRetry = useCallback(async () => {
    if (sajuInput) {
      gemini.reset();
      await gemini.generateFortune(apiKey, sajuInput);
    }
  }, [apiKey, sajuInput, gemini]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-6 h-6 text-gold-400" />
          <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-gold-400 to-amber-300 bg-clip-text text-transparent">
            사주팔자
          </h1>
          <Star className="w-6 h-6 text-gold-400" />
        </div>
        <p className="text-gray-400 text-sm">AI 기반 사주명리학 운세 분석</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {['API Key', '정보 입력', '결과'].map((label, idx) => {
            const stepNames: Step[] = ['apiKey', 'form', 'result'];
            const currentIdx = stepNames.indexOf(step);
            const isActive = idx === currentIdx;
            const isDone = idx < currentIdx;
            return (
              <div key={label} className="flex items-center gap-2">
                {idx > 0 && (
                  <div className={`w-8 h-px ${isDone ? 'bg-gold-500' : 'bg-white/10'}`} />
                )}
                <div
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : isDone
                        ? 'bg-gold-500/10 text-gold-500/60'
                        : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-8">
        {step === 'apiKey' && <ApiKeySetup onKeyValidated={handleKeyValidated} />}
        {step === 'form' && <SajuForm onSubmit={handleFormSubmit} />}
        {step === 'result' && (
          <SajuResult
            isLoading={gemini.isLoading}
            sections={gemini.sections}
            streamingText={gemini.streamingText}
            error={gemini.error}
            loadingPhase={gemini.loadingPhase}
            onBack={handleBack}
            onRetry={handleRetry}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-gray-500 text-xs">
        <p>본 서비스의 사주 분석 결과는 오락 및 참고 목적으로만 제공됩니다.</p>
        <p className="mt-1">중요한 결정은 전문가와 상담하시기 바랍니다.</p>
      </footer>
    </div>
  );
}
