# 단어학습 (WowLingo)

농난청인을 위한 한국어 학습 애플리케이션입니다. 음성 합성 기술을 활용하여 한국어 단어를 듣고 정답을 선택하는 학습 도구입니다.

## 주요 기능

- 🎧 **음성 듣기**: Web Speech API를 사용한 한국어 TTS
- 📝 **단어 테스트**: 객관식 문제로 단어 학습
- 📊 **결과 확인**: 테스트 완료 후 점수 표시
- 📱 **반응형 디자인**: 모바일과 데스크톱 지원

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Code Quality**: ESLint + Prettier

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── Header.tsx      # 앱 헤더
│   ├── Modal.tsx       # 모달 컴포넌트
│   ├── Option.tsx      # 선택지 컴포넌트
│   └── IconSpeaker.tsx # 스피커 아이콘
├── features/           # 기능별 컴포넌트
│   └── wordtest/       # 단어 테스트 기능
│       └── WordTest.tsx
├── hooks/              # 커스텀 훅
│   └── useKoreanVoice.ts # 한국어 음성 합성 훅
├── data/               # 정적 데이터
│   └── questions.ts    # 테스트 문제 데이터
├── lib/                # 유틸리티 함수
│   └── classNames.ts   # CSS 클래스 유틸리티
└── App.tsx             # 메인 앱 컴포넌트
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 기타 스크립트

```bash
npm run lint      # ESLint 실행
npm run typecheck # TypeScript 타입 체크
npm run format    # Prettier 포맷팅
npm run preview   # 빌드된 앱 미리보기
```

## 브라우저 지원

- Web Speech API를 지원하는 모던 브라우저
- Chrome, Edge, Safari 권장
