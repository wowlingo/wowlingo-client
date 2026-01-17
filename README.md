# 단어학습 (WowLingo)

농난청인을 위한 한국어 학습 애플리케이션입니다. 음성 합성 기술을 활용하여 한국어 단어를 듣고 정답을 선택하는 학습 도구입니다.

## 주요 기능

### 🎧 학습 시스템
- **음성 듣기**: TTS를 활용한 한국어 발음 학습
- **다양한 문제 유형**: 4가지 학습 레이아웃으로 체계적인 학습
- **천천히 듣기**: 학습자 수준에 맞는 재생 속도 조절
- **오디오 애니메이션**: 재생 상태를 시각적으로 표현
- **이어서 하기**: 학습 중단 시 진행상황 저장

### 📚 학습 관리
- **단어장**: 학습한 단어 저장 및 태그별 관리
- **오답노트**: 틀린 문제 복습 기능
- **학습 현황**: 일별/주별/월별 학습 통계
- **레벨 시스템**: 학습 진도에 따른 레벨업 및 과일 수집
- **열매 도감**: 모은 과일 컬렉션 확인

### 👤 사용자 관리
- **JWT 인증**: 안전한 사용자 인증 시스템
- **개인화**: 사용자별 학습 데이터 관리
- **튜토리얼**: 첫 방문자를 위한 가이드

### 🎨 UI/UX
- **반응형 디자인**: 모바일과 데스크톱 최적화
- **다크 모드 지원**: 눈의 피로도 감소
- **접근성**: 농난청인을 위한 시각적 피드백 강화
- **인터랙티브**: 학습 과정의 즉각적인 피드백

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Authentication**: JWT + Cookie
- **Code Quality**: ESLint + Prettier
- **Deployment**: Docker + Nginx

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── backgrounds/    # 학습 화면 배경
│   ├── common/         # 공통 컴포넌트 (AudioService, AuthContext)
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer)
│   ├── learning/       # 학습 관련 컴포넌트
│   ├── modals/         # 모달 컴포넌트
│   ├── ui/             # UI 컴포넌트 (Card, Button 등)
│   ├── vocabulary/     # 단어장 컴포넌트
│   ├── review-notes/   # 오답노트 컴포넌트
│   └── learning-status/ # 학습 현황 컴포넌트
├── layouts/            # 학습 레이아웃
│   ├── BaseLearningLayout.tsx  # 기본 학습 레이아웃
│   ├── LearningFlow.tsx        # 학습 흐름 관리
│   └── LearningLayout[1-4].tsx # 문제 유형별 레이아웃
├── pages/              # 페이지 컴포넌트
│   ├── Home.tsx               # 홈 화면
│   ├── LearningIntroPage.tsx  # 학습 시작
│   ├── LearningStepPage.tsx   # 학습 진행
│   ├── VocabularyPage.tsx     # 단어장
│   ├── ReviewNotesPage.tsx    # 오답노트
│   └── LearningStatusPage.tsx # 학습 현황
├── store/              # Zustand 스토어
│   ├── learningStore.ts      # 학습 상태
│   ├── VocabularyStore.ts    # 단어장 상태
│   ├── ReviewStore.ts        # 오답노트 상태
│   ├── LearningStatus.ts     # 학습 통계
│   └── AudioStore.ts         # 오디오 상태
├── shared/             # 공유 리소스
│   └── hooks/          # 커스텀 훅
│       └── usePlayAnimation.ts # 오디오 애니메이션
└── main.tsx            # 앱 진입점
```

## 시작하기

### 환경 설정

1. 환경 변수 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일에 백엔드 API URL 설정:
```
VITE_BACKEND_URL=http://your-backend-url
```

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프로덕션 배포 (Docker)

```bash
# Docker 이미지 빌드
docker build -t wowlingo-client .

# 컨테이너 실행
docker run -p 80:80 wowlingo-client
```

### 기타 스크립트

```bash
npm run lint      # ESLint 실행
npm run typecheck # TypeScript 타입 체크
npm run format    # Prettier 포맷팅
npm run preview   # 빌드된 앱 미리보기
```

## 브라우저 지원

- 모던 브라우저 권장 (Chrome, Edge, Safari, Firefox)
- 모바일 브라우저 지원 (iOS Safari, Chrome Mobile)

## 기여하기

이 프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

## Acknowledgement

본 프로젝트는 카카오임팩트 테크포임팩트 프로그램을 통해 개발되었습니다.

<div align="center">
  <img src="./src/assets/kakao_impact_logo_black.png" alt="카카오임팩트 로고" width="200"/>
  <br/>
  <img src="./src/assets/TF!_Logo_B1.png" alt="테크포임팩트 로고" width="200"/>
</div>