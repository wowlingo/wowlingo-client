import { create } from 'zustand';
import type { CSSProperties } from 'react';

// 모달 상태를 위한 타입
type GameModalState = 'correct' | 'incorrect' | 'closed';

// API로부터 받는 아이템 데이터 타입
type ApiQuestUnit = {
  id: number;
  url: string;
  type: string;
};

type ApiQuestOption = {
  type: string;
  label: string;
  unitId: number;
};

type ApiQuestItem = {
  units: ApiQuestUnit[];
  answer: string;
  options: ApiQuestOption[];
};

type ApiQuestResponseData = {
  questId: number;
  title: string;
  type: string;
  items: ApiQuestItem[];
};

// 게임 데이터 타입
export type GameQuestionData = {
  sounds: { id: string; type: string; url: string; label?: string }[];
  image: string;
  options: { type: string; label: string; unitId: number }[];
  stackImage: string;
  correctAnswer: string;
};

// 물방울 레이어 타입
type WaterDropLayer = {
  src: string;
  style: CSSProperties;
};

// 물방울 레이어 스타일들
const WATER_DROP_STYLES: CSSProperties[] = [
  { width: '60px', top: '20%', left: '30%', zIndex: 2 },
  { width: '50px', top: '15%', left: '60%', zIndex: 3 },
  { width: '45px', top: '25%', left: '20%', zIndex: 4 },
  { width: '55px', top: '10%', left: '70%', zIndex: 5 },
  { width: '40px', top: '30%', left: '50%', zIndex: 6 },
  { width: '50px', top: '20%', left: '40%', zIndex: 7 },
  { width: '45px', top: '15%', left: '80%', zIndex: 8 },
  { width: '60px', top: '25%', left: '10%', zIndex: 9 },
  { width: '55px', top: '12%', left: '90%', zIndex: 10 },
  { width: '40px', top: '28%', left: '60%', zIndex: 11 },
];

// 기본 배경 이미지 레이어
const BASE_CARD_LAYER: WaterDropLayer = {
  src: '/images/layer-0.png',
  style: {
    width: '300px',
    top: '0%',
    left: '0%',
    zIndex: 1,
  },
};

// 게임 상태와 액션 타입
interface GameState {
  currentStep: number;
  totalSteps: number;
  selectedAnswer: string | null;
  answers: Record<number, string>;
  modalState: GameModalState;
  isCorrect: boolean | null;
  startTime: number | null;
  endTime: number | null;
  waterDropStack: WaterDropLayer[];
  gameData: Record<number, GameQuestionData>;
  isLoading: boolean;
  currentQuestId: number | null;
  correctCount: number; // 정답 개수 (물방울 개수)
}

interface GameActions {
  goToNextStep: () => void;
  setSelectedAnswer: (answer: string) => void;
  reset: () => void;
  checkAnswer: (correctAnswer: string, waterDropImageUrl: string) => void;
  closeModalAndGoToNextStep: () => void;
  startGame: () => void;
  endGame: () => void;
  fetchQuestData: (questId: number) => Promise<void>;
}

// 게임 스토어 생성
export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // 초기 상태
  currentStep: 1,
  totalSteps: 0,
  selectedAnswer: null,
  answers: {},
  modalState: 'closed',
  isCorrect: null,
  startTime: null,
  endTime: null,
  waterDropStack: [BASE_CARD_LAYER],
  gameData: {},
  isLoading: false,
  currentQuestId: null,
  correctCount: 0,

  // API로부터 퀘스트 데이터를 가져오는 액션
  fetchQuestData: async (questId: number) => {
    if (get().currentQuestId === questId && Object.keys(get().gameData).length > 0) {
      return;
    }

    set({ isLoading: true, currentQuestId: questId, gameData: {} });
    try {
      const response = await fetch(`http://localhost:8080/api/quests/${questId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse: { data: ApiQuestResponseData } = await response.json();
      const questData = jsonResponse.data;

      const transformedGameData: Record<number, GameQuestionData> = {};

      questData.items.forEach((item, index) => {
        transformedGameData[index + 1] = {
          sounds: item.units.map(unit => ({
            id: String(unit.id),
            url: unit.url,
            type: unit.type,
          })),
          image: `https://picsum.photos/200/300?random=${questId}-${index}`,
          options: item.options.map(option => ({
            type: option.type,
            label: option.label,
            unitId: option.unitId,
          })),
          stackImage: '/images/water-drop.png', // 물방울 이미지
          correctAnswer: item.answer,
        };
      });

      set({
        gameData: transformedGameData,
        totalSteps: questData.items.length,
        isLoading: false,
        currentStep: 1,
      });
    } catch (error) {
      console.error("Failed to fetch quest data:", error);
      set({ isLoading: false, gameData: {}, totalSteps: 0 });
    }
  },

  // 답변을 확인하고 모달 상태를 변경하는 액션
  checkAnswer: (correctAnswer, waterDropImageUrl) =>
    set((state) => {
      // correctAnswer는 unitId이므로, 선택된 답의 타입과 비교
      const currentQuestionData = state.gameData[state.currentStep];
      if (!currentQuestionData) {
        return { isCorrect: false, modalState: 'incorrect' };
      }

      // 선택된 답의 타입을 찾기
      const selectedOption = currentQuestionData.options.find(option => option.type === state.selectedAnswer);
      const isCorrect = selectedOption && selectedOption.unitId.toString() === correctAnswer;
      
      if (!isCorrect) {
        return {
          isCorrect: false,
          modalState: 'incorrect',
        };
      }

      // 정답일 경우, 물방울 레이어 추가
      const nextLayerIndex = state.waterDropStack.length - 1;
      const newLayerStyle = WATER_DROP_STYLES[nextLayerIndex % WATER_DROP_STYLES.length];

      const newWaterDropLayer: WaterDropLayer = {
        src: waterDropImageUrl,
        style: newLayerStyle,
      };

      return {
        isCorrect: true,
        modalState: 'correct',
        waterDropStack: [...state.waterDropStack, newWaterDropLayer],
        correctCount: state.correctCount + 1, // 정답 개수 증가
      };
    }),

  // 모달을 닫고 다음 단계로 진행하는 액션
  closeModalAndGoToNextStep: () =>
    set((state) => {
      const newAnswers = { ...state.answers, [state.currentStep]: state.selectedAnswer! };
      return {
        modalState: 'closed',
        currentStep: state.currentStep + 1,
        selectedAnswer: null,
        answers: newAnswers,
      };
    }),

  // 액션 구현
  goToNextStep: () =>
    set((state) => {
      const newAnswers = { ...state.answers, [state.currentStep]: state.selectedAnswer! };
      return {
        currentStep: state.currentStep + 1,
        selectedAnswer: null,
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
      waterDropStack: [BASE_CARD_LAYER],
      gameData: {},
      isLoading: false,
      currentQuestId: null,
      correctCount: 0,
    }),

  // 게임 시작 시 호출
  startGame: () => set((state) => {
    if (state.startTime) return {};
    return { startTime: Date.now() };
  }),

  // 게임 종료 시 호출
  endGame: () => set({ endTime: Date.now() }),
}));
