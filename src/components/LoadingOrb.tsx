interface LoadingOrbProps {
  phase: string;
}

export default function LoadingOrb({ phase }: LoadingOrbProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Spinning Yin-Yang */}
      <div className="animate-spin-slow mb-8">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          {/* Outer circle */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#grad1)" strokeWidth="2" />
          {/* Yin-Yang symbol */}
          <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill="url(#grad1)" />
          <path d="M50 2 A48 48 0 0 0 50 98 A24 24 0 0 0 50 50 A24 24 0 0 1 50 2" fill="url(#grad2)" />
          <circle cx="50" cy="26" r="6" fill="#1e1b4b" />
          <circle cx="50" cy="74" r="6" fill="#F59E0B" />
        </svg>
      </div>

      {/* Loading text */}
      <p className="text-gold-400 text-lg font-serif mb-2">사주를 살펴보는 중입니다...</p>
      <p className="text-gray-400 text-sm animate-pulse">{phase}</p>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gold-500"
            style={{
              animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
