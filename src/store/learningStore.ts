import { create } from 'zustand';
import type { CSSProperties } from 'react'; // CSSProperties 타입을 가져옵니다.

const BASE_IMAGE_URL = '/images/layer-0.png';

// 모달 상태를 위한 타입 추가
type ModalState = 'correct' | 'incorrect' | 'closed';

// API로부터 받는 아이템 데이터 타입
type ApiQuestUnit = {
  id: number;
  url: string;
  type: string;
};

type ApiQuestItem = {
  units: ApiQuestUnit[];
  answer: string;
};

type ApiQuestResponseData = {
  questId: number;
  title: string;
  type: string; // e.g., "statement-question"
  items: ApiQuestItem[];
};

// 학습 데이터 타입 (기존 QuestionData와 유사)
export type QuestionData = {
  sounds: { id: string; type: string; url: string; label?: string }[];
  image: string;
  options: { type: string; label: string }[];
  stackImage: string;
  correctAnswer: string;
};

// 새로 추가할 타입: 각 이미지 레이어의 구조 정의
type ImageLayer = {
  src: string;
  style: CSSProperties;
};

// 쌓이는 레이어들에 적용할 스타일 목록
// zIndex를 통해 쌓이는 순서를 제어합니다.
const STACK_LAYER_STYLES: CSSProperties[] = [
  { width: '138px', top: '-25%', left: '15%', zIndex: 2 },//빼빼로 10
  { width: '150px', top: '-20%', left: '27%', zIndex: 3 },//오렌지 22
  { width: '102px', top: '-20%', left: '50%', zIndex: 4 },//웨하스 45
  { width: '90px', top: '-15%', left: '53%', zIndex: 5 },//초콜릿문구 48
  { width: '90px', top: '-22%', left: '45%', zIndex: 6 },//초 43

  { width: '114px', top: '-15%', left: '38%', zIndex: 7 }, //키위 33
  { width: '114px', top: '-17%', left: '20%', zIndex: 8 },//딸기 15
  { width: '78px', top: '-7%', left: '33%', zIndex: 9 },//블루베리 28
  { width: '84px', top: '-7%', left: '48%', zIndex: 10 },//휘핑 43
  { width: '78px', top: '-4%', left: '43%', zIndex: 11 },//초코칩 38
];

// 기본 배경 이미지 레이어
const BASE_IMAGE_LAYER: ImageLayer = {
  src: '/images/layer-0.png',
  style: {
    width: '400px',
    top: '0%',
    left: '0%',
    zIndex: 1,
  },
};

// 상태(state)와 액션(actions)에 대한 타입을 정의합니다.
interface LearningState {
  currentStep: number;
  totalSteps: number;
  selectedAnswer: string | null; // 사용자가 선택한 답
  answers: Record<number, string>; // 단계별 사용자의 답 기록
  modalState: ModalState;
  isCorrect: boolean | null;
  startTime: number | null; // 학습 시작 시간 (타임스탬프)
  endTime: number | null;   // 학습 종료 시간 (타임스탬프)
  correctImageStack: ImageLayer[]; // 타입을 string[] 에서 ImageLayer[] 로 변경
  learningData: Record<number, QuestionData>; // API로부터 받은 학습 데이터 (변환된 형태)
  isLoading: boolean;
  currentQuestId: number | null; // 현재 로드된 퀘스트 ID
}

interface LearningActions {
  goToNextStep: () => void;
  setSelectedAnswer: (answer: string) => void;
  reset: () => void;
  checkAnswer: (correctAnswer: string, stackImageUrl: string) => void;
  closeModalAndGoToNextStep: () => void;
  startLearning: () => void;
  endLearning: () => void;
  fetchQuestData: (questId: number) => Promise<void>; // 퀘스트 전체를 가져오는 액션
}

// 스토어를 생성합니다.
export const useLearningStore = create<LearningState & LearningActions>((set, get) => ({
  // 초기 상태
  currentStep: 1,
  totalSteps: 0, // 초기 totalSteps는 0으로 설정
  selectedAnswer: null,
  answers: {},
  modalState: 'closed',
  isCorrect: null,
  startTime: null,
  endTime: null,
  correctImageStack: [BASE_IMAGE_LAYER], // 초기값을 객체 배열로 변경
  learningData: {},
  isLoading: false,
  currentQuestId: null,

  // API로부터 퀘스트 데이터를 가져오는 액션
  fetchQuestData: async (questId: number) => {
    // 이미 해당 퀘스트 데이터가 로드되어 있고, currentQuestId와 일치하면 다시 호출하지 않음
    if (get().currentQuestId === questId && Object.keys(get().learningData).length > 0) {
      return;
    }

    set({ isLoading: true, currentQuestId: questId, learningData: {} }); // 새 퀘스트 로드 시 데이터 초기화
    try {
      const response = await fetch(`http://localhost:8080/api/quests/${questId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse: { data: ApiQuestResponseData } = await response.json();
      const questData = jsonResponse.data;

      const transformedLearningData: Record<number, QuestionData> = {};
      const defaultOptions = questData.type === 'statement-question'
        ? [{ type: 'statement', label: '평서문' }, { type: 'question', label: '의문문' }]
        : []; // 다른 타입에 대한 기본 옵션 추가 필요

      questData.items.forEach((item, index) => {
        transformedLearningData[index + 1] = { // 1-based index
          sounds: item.units.map(unit => ({
            id: String(unit.id), // id를 string으로 변환
            url: unit.url,
            type: unit.type,
            // label은 필요에 따라 추가
          })),
          image: `https://picsum.photos/200/300?random=${questId}-${index}`, // 예시 이미지
          options: defaultOptions,
          stackImage: `/images/layer-${index + 1}.png`, // 예시 스택 이미지 (4개 레이어 반복)
          correctAnswer: item.answer,
        };
      });

      set({
        learningData: transformedLearningData,
        totalSteps: questData.items.length,
        isLoading: false,
        currentStep: 1, // 새 퀘스트 로드 시 currentStep을 1로 초기화
      });
    } catch (error) {
      console.error("Failed to fetch quest data:", error);
      set({ isLoading: false, learningData: {}, totalSteps: 0 });
    }
  },

  // 답변을 확인하고 모달 상태를 변경하는 액션
  checkAnswer: (correctAnswer, stackImageUrl) =>
    set((state) => {
      const isCorrect = state.selectedAnswer === correctAnswer;
      if (!isCorrect) {
        return {
          isCorrect: false,
          modalState: 'incorrect',
        };
      }

      // 정답일 경우, 새 레이어 객체를 생성하여 스택에 추가
      const nextLayerIndex = state.correctImageStack.length - 1; // 베이스 이미지를 제외한 인덱스
      const newLayerStyle = STACK_LAYER_STYLES[nextLayerIndex % STACK_LAYER_STYLES.length];

      const newImageLayer: ImageLayer = {
        src: stackImageUrl,
        style: newLayerStyle,
      };

      return {
        isCorrect: true,
        modalState: 'correct',
        correctImageStack: [...state.correctImageStack, newImageLayer],
      };
    }),

  // 모달을 닫고 다음 단계로 진행하는 액션
  closeModalAndGoToNextStep: () =>
    set((state) => {
      // 다음 단계로 넘어가기 전에 현재 답을 기록 (오답이라도 기록)
      const newAnswers = { ...state.answers, [state.currentStep]: state.selectedAnswer! };
      return {
        modalState: 'closed', // 모달 닫기
        currentStep: state.currentStep + 1,
        selectedAnswer: null, // 선택 초기화
        answers: newAnswers,
      };
    }),

  // 액션 구현
  goToNextStep: () =>
    set((state) => {
      // 다음 단계로 넘어가기 전에 현재 답을 기록
      const newAnswers = { ...state.answers, [state.currentStep]: state.selectedAnswer! };
      return {
        currentStep: state.currentStep + 1,
        selectedAnswer: null, // 다음 문제를 위해 선택 초기화
        answers: newAnswers,
      };
    }),

  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),

  reset: () =>
    set({
      currentStep: 1,
      totalSteps: 0,
      selectedAnswer: null,
      answers: {},
      startTime: null,
      endTime: null,
      correctImageStack: [BASE_IMAGE_LAYER], // 이미지 스택 초기화
      learningData: {}, // 학습 데이터 초기화
      isLoading: false,
      currentQuestId: null,
    }),

  // 학습 시작 시 호출, 시작 시간 기록
  startLearning: () => set((state) => {
    // 이미 시작했다면 다시 기록하지 않음
    if (state.startTime) return {};
    return { startTime: Date.now() };
  }),

  // 학습 종료 시 호출, 종료 시간 기록
  endLearning: () => set({ endTime: Date.now() }),
}));
