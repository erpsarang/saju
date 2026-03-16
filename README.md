# 🔮 사주팔자 운세 분석

Gemini API 기반 사주명리학 운세 분석 웹앱입니다.
사용자가 Gemini API Key와 생년월일시를 입력하면, 천간지지·오행·십신 이론을 기반으로
8개 카테고리의 사주 풀이를 실시간 스트리밍으로 제공합니다.

## 기술 스택

- **React 18** + **Vite 5** + **TypeScript 5**
- **@google/generative-ai** (Gemini 1.5 Pro, 스트리밍)
- **Tailwind CSS v3** (다크 테마)
- **react-hook-form** (폼 관리)
- **korean-lunar-calendar** (음력 변환)
- **lucide-react** (아이콘)

## 시작하기

### 1. Gemini API Key 발급

[Google AI Studio](https://aistudio.google.com/app/apikey)에서 무료 API Key를 발급받으세요.

### 2. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

### 3. 환경변수 (선택)

API Key를 환경변수로도 설정할 수 있습니다:

```bash
cp .env.example .env
# .env 파일에서 VITE_GEMINI_API_KEY 값을 설정
```

## 주요 기능

- **사주팔자 자동 계산**: 생년월일시를 기반으로 연주·월주·일주·시주 자동 계산
- **음력 지원**: 음력 생년월일 입력 시 양력으로 자동 변환
- **실시간 스트리밍**: Gemini API 스트리밍을 통한 실시간 타이핑 효과
- **8개 운세 카테고리**: 총운, 재산운, 연애운, 사업운, 건강운, 가족운, 학업운, 월별운세, 종합조언
- **보안**: API Key는 브라우저에서만 사용되며 서버로 전송되지 않음

## 프로젝트 구조

```
src/
├── components/
│   ├── ApiKeySetup.tsx       # API Key 입력 및 검증
│   ├── SajuForm.tsx          # 사주 정보 입력 폼
│   ├── LoadingOrb.tsx        # 로딩 애니메이션
│   ├── SajuResult.tsx        # 결과 컨테이너
│   └── FortuneCard.tsx       # 개별 운세 카드
├── hooks/
│   ├── useGemini.ts          # Gemini API 스트리밍 훅
│   └── useSajuForm.ts        # 폼 상태 관리 훅
├── utils/
│   ├── lunarConverter.ts     # 음력→양력 변환
│   ├── sajuCalculator.ts     # 천간지지 계산
│   └── promptBuilder.ts      # Gemini 프롬프트 조립
├── types/
│   └── saju.types.ts         # 타입 정의
└── App.tsx
```

## 참고

본 서비스의 사주 분석 결과는 오락 및 참고 목적으로만 제공됩니다.
중요한 결정은 전문가와 상담하시기 바랍니다.
