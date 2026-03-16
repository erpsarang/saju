import { useState } from 'react';
import { Eye, EyeOff, Key, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ApiKeySetupProps {
  onKeyValidated: (key: string) => void;
}

export default function ApiKeySetup({ onKeyValidated }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [rememberKey, setRememberKey] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from session storage on mount
  useState(() => {
    const saved = sessionStorage.getItem('gemini_api_key');
    if (saved) {
      setApiKey(saved);
    }
  });

  const validateKey = async () => {
    if (!apiKey.trim()) {
      setError('API Key를 입력해주세요.');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      await model.generateContent('test');

      if (rememberKey) {
        sessionStorage.setItem('gemini_api_key', apiKey.trim());
      }
      onKeyValidated(apiKey.trim());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('401') || message.includes('API_KEY_INVALID')) {
        setError('API Key가 유효하지 않습니다. 키를 확인해주세요.');
      } else if (message.includes('429')) {
        setError('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        // If we get any other response, the key is likely valid
        if (rememberKey) {
          sessionStorage.setItem('gemini_api_key', apiKey.trim());
        }
        onKeyValidated(apiKey.trim());
      }
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-4">
          <Key className="w-8 h-8 text-gold-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">API Key 설정</h2>
        <p className="text-gray-400 text-sm">
          Gemini API Key를 입력하여 사주 분석을 시작하세요.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-200 text-sm leading-relaxed">
          API Key는 브라우저에서만 사용되며 서버로 전송되지 않습니다.
          공용 PC에서는 사용 후 반드시 키를 초기화하세요.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setError(null); }}
            placeholder="AIza..."
            className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && validateKey()}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Remember toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${rememberKey ? 'bg-gold-500' : 'bg-white/10'}`}
            onClick={() => setRememberKey(!rememberKey)}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${rememberKey ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </div>
          <span className="text-gray-300 text-sm">
            {rememberKey ? '세션 동안 기억' : '저장하지 않음'}
          </span>
        </label>

        <button
          onClick={validateKey}
          disabled={isValidating || !apiKey.trim()}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold hover:from-gold-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              검증 중...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              확인 및 시작
            </>
          )}
        </button>
      </div>
    </div>
  );
}
