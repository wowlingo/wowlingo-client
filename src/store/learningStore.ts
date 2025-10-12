import { create } from 'zustand';
import type { CSSProperties } from 'react'; // CSSProperties 타입을 가져옵니다.

// 모달 상태를 위한 타입 추가
type ModalState = 'correct' | 'incorrect' | 'closed';

// API로부터 받는 아이템 데이터 타입
type ApiQuestUnit = {
  id: number;
  url: string;
  type: string;
};

type ApiQuestOption = {
  id: string;
  type: string;
  label: string;
};

type ApiQuestItem = {
  units: ApiQuestUnit[];
  answer: string;
  options: ApiQuestOption[];
};

type ApiQuestResponseData = {
  questId: number;
  title: string;
  type: string; // e.g., "statement-question"
  items: ApiQuestItem[];
};


type ApiQuestListData = {
  questId: number;
  title: string;
  type: string;
  questItemCount: number;
  order: number;
};

// 학습 데이터 타입 (기존 QuestionData와 유사)
export type QuestionData = {
  sounds: { id: string; type: string; url: string; label?: string }[];
  image: string;
  options: { id: string; type: string; label: string }[];
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
  { width: '100%', top: '0%', left: '0%', zIndex: 2 },//빼빼로 10
  { width: '100%', top: '0%', left: '0%', zIndex: 3 },//오렌지 22
  { width: '100%', top: '0%', left: '0%', zIndex: 4 },//웨하스 45
  { width: '100%', top: '0%', left: '0%', zIndex: 5 },//초콜릿문구 48
  { width: '100%', top: '0%', left: '0%', zIndex: 6 },//초 43

  { width: '100%', top: '0%', left: '0%', zIndex: 7 }, //키위 33
  { width: '100%', top: '0%', left: '0%', zIndex: 8 },//딸기 15
  { width: '100%', top: '0%', left: '0%', zIndex: 9 },//블루베리 28
  { width: '100%', top: '0%', left: '0%', zIndex: 10 },//휘핑 43
  { width: '100%', top: '0%', left: '0%', zIndex: 11 },//초코칩 38
];

// 기본 배경 이미지 레이어
const BASE_IMAGE_LAYER: ImageLayer = {
  src: '/images/layer-0.png',
  style: {
    width: '100%',
    top: '0%',
    left: '0%',
    zIndex: 1,
  },
};

// 문제별 진행 상황을 추적하는 타입
type StepProgress = {
  questItemId: number; // 실제 questItemId (API에서 받은 값)
  startedAt: number; // 문제 시작 시간
  endedAt: number | null; // 문제 종료 시간
  attemptCount: number; // 시도 횟수
  userAnswer: string | null; // 사용자 답변
  correctAnswer: string; // 정답
  isCorrect: boolean | null; // 정답 여부
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
  rawQuestData: ApiQuestResponseData | null; // 원본 API 응답 데이터 저장
  isLoading: boolean;
  currentQuestId: number | null; // 현재 로드된 퀘스트 ID
  questList: ApiQuestListData[];
  totalQuestCount: number;
  stepProgress: Record<number, StepProgress>; // 각 단계별 진행 상황
}

interface LearningActions {
  goToNextStep: () => void;
  setSelectedAnswer: (answer: string) => void;
  reset: () => void;
  checkAnswer: (correctAnswer: string, stackImageUrl: string) => void;
  showIncorrectModal: () => void;
  closeModalAndGoToNextStep: () => void;
  startLearning: () => void;
  endLearning: () => void;
  startStep: (stepNumber: number) => void; // 단계별 시작 시간 기록
  endStep: (stepNumber: number, userAnswer: string, correctAnswer: string) => void; // 단계별 종료 시간 및 답변 기록
  sendLearningResult: () => Promise<void>; // 학습 결과 전송 액션
  fetchQuestData: (questId: number) => Promise<void>; // 퀘스트 전체를 가져오는 액션
  fetchQuestList: () => Promise<void>;
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
  rawQuestData: null,
  isLoading: false,
  currentQuestId: null,
  questList: [],
  totalQuestCount: 0,
  stepProgress: {},

  fetchQuestList: async () => {
    set({ isLoading: true });

    try {
      const response = await fetch(`http://localhost:8080/api/quests`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse: { data: ApiQuestListData[] } = await response.json();
      const questList = jsonResponse.data;

      set({
        questList,
        totalQuestCount: questList.length,
        isLoading: false,
      });

    } catch (error) {
      console.error("Failed to fetch quest list:", error);
      set({ isLoading: false, questList: [], totalQuestCount: 0 });
    }
  },
  // API로부터 퀘스트 데이터를 가져오는 액션
  fetchQuestData: async (questId: number) => {
    // 이미 해당 퀘스트 데이터가 로드되어 있고, currentQuestId와 일치하면 다시 호출하지 않음
    if (get().currentQuestId === questId && Object.keys(get().learningData).length > 0) {
      return;
    }

    set({ isLoading: true, currentQuestId: questId, learningData: {}, rawQuestData: null }); // 새 퀘스트 로드 시 데이터 초기화
    try {
      const response = await fetch(`http://localhost:8080/api/quests/${questId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse: { data: ApiQuestResponseData } = await response.json();
      const questData = jsonResponse.data;

      const transformedLearningData: Record<number, QuestionData> = {};

      questData.items.forEach((item, index) => {
        console.log('Processing item:', item); // 디버깅용
        transformedLearningData[index + 1] = { // 1-based index
          sounds: item.units.map(unit => ({
            id: String(unit.id), // id를 string으로 변환
            url: unit.url,
            type: unit.type,
            // label은 필요에 따라 추가
          })),
          image: `https://picsum.photos/200/300?random=${questId}-${index}`, // 예시 이미지
          options: item.options, // 서버에서 받은 옵션 사용
          stackImage: `/images/layer-${index + 1}.png`, // 예시 스택 이미지 (4개 레이어 반복)
          correctAnswer: item.answer,
        };
      });

      set({
        learningData: transformedLearningData,
        rawQuestData: questData, // 원본 API 응답 데이터 저장
        totalSteps: questData.items.length,
        isLoading: false,
        currentStep: 1, // 새 퀘스트 로드 시 currentStep을 1로 초기화
      });
    } catch (error) {
      console.error("Failed to fetch quest data:", error);
      set({ isLoading: false, learningData: {}, totalSteps: 0 });
    }
  },

  showIncorrectModal: () => set({ modalState: 'incorrect' }),

  // 답변을 확인하고 모달 상태를 변경하는 액션
  checkAnswer: (correctAnswer, stackImageUrl) =>
    set((state) => {
      const isCorrect = state.selectedAnswer === correctAnswer;
      if (!isCorrect) {
        return {
          isCorrect: false,
          // modalState: 'incorrect',
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
        isCorrect: null,
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
      rawQuestData: null, // 원본 API 데이터 초기화
      isLoading: false,
      currentQuestId: null,
      stepProgress: {}, // 단계별 진행 상황 초기화
    }),

  // 학습 시작 시 호출, 시작 시간 기록
  startLearning: () => set((state) => {
    // 이미 시작했다면 다시 기록하지 않음
    if (state.startTime) return {};
    return { startTime: Date.now() };
  }),

  // 학습 종료 시 호출, 종료 시간 기록
  endLearning: () => set((state) => {
    // 다음 단계로 넘어가기 전에 현재 답을 기록 (오답이라도 기록)
    const newAnswers = { ...state.answers, [state.currentStep]: state.selectedAnswer! };
    return {
      endTime: Date.now(),
      isCorrect: null,
      modalState: 'closed', // 모달 닫기
      selectedAnswer: null, // 선택 초기화
      answers: newAnswers,
    };
  }),

  // 단계별 시작 시간 기록
  startStep: (stepNumber: number) => set((state) => {
    const currentQuestionData = state.learningData[stepNumber];
    if (!currentQuestionData || !state.rawQuestData) return {};

    // 실제 questItemId 추출 (API 응답에서)
    // API 응답 구조에 따라 questItemId를 추출해야 함
    // 현재는 stepNumber를 사용하지만, 실제로는 API 응답에서 questItemId를 추출해야 함
    const questItemId = stepNumber; // TODO: API 응답에서 실제 questItemId 추출

    const stepProgress: StepProgress = {
      questItemId,
      startedAt: Date.now(),
      endedAt: null,
      attemptCount: 0,
      userAnswer: null,
      correctAnswer: currentQuestionData.correctAnswer,
      isCorrect: null,
    };

    return {
      stepProgress: {
        ...state.stepProgress,
        [stepNumber]: stepProgress,
      },
    };
  }),

  // 단계별 종료 시간 및 답변 기록
  endStep: (stepNumber: number, userAnswer: string, correctAnswer: string) => set((state) => {
    const currentStepProgress = state.stepProgress[stepNumber];
    if (!currentStepProgress) return {};

    const isCorrect = userAnswer === correctAnswer;
    const updatedStepProgress: StepProgress = {
      ...currentStepProgress,
      endedAt: Date.now(),
      attemptCount: currentStepProgress.attemptCount + 1,
      userAnswer,
      isCorrect,
    };

    return {
      stepProgress: {
        ...state.stepProgress,
        [stepNumber]: updatedStepProgress,
      },
    };
  }),

  // 학습 정보 API 전송
  sendLearningResult: async () => {
    const { currentQuestId, stepProgress, startTime, endTime, totalSteps, rawQuestData } = get();

    // 데이터가 없으면 전송하지 않음
    if (!currentQuestId || !startTime || !endTime) {
      console.error("필수 학습 정보가 부족하여 결과를 전송할 수 없습니다.");
      return;
    }

    const progressItems = Object.values(stepProgress);
    
    // 전체 학습 통계 계산
    const totalQuestItemCount = totalSteps;
    const correctQuestItemCount = progressItems.filter(item => item.isCorrect === true).length;
    const accuracyRate = totalQuestItemCount > 0 ? (correctQuestItemCount / totalQuestItemCount) * 100 : 0;
    const totalTimeSpent = Math.round((endTime - startTime) / 1000); // 초 단위

    // API로 보낼 데이터 구성 (새로운 형식)
    const resultData = {
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date(endTime).toISOString(),
      timeSpent: totalTimeSpent,
      doneYn: true,
      totalQuestItemCount,
      correctQuestItemCount,
      accuracyRate: Math.round(accuracyRate * 100) / 100, // 소수점 2자리까지
      items: progressItems.map((progress) => {
        const itemTimeSpent = progress.endedAt 
          ? Math.round((progress.endedAt - progress.startedAt) / 1000) // 초 단위
          : 0;
        
        // quest type에 따라 userAnswer 형식 결정
        const userAnswer = rawQuestData?.type === 'choice' 
          ? parseInt(progress.userAnswer || '0', 10) // choice 타입은 숫자
          : progress.userAnswer || ''; // 다른 타입은 문자열

        return {
          questItemId: progress.questItemId,
          userAnswer,
          correctYn: progress.isCorrect || false,
          timeSpent: itemTimeSpent,
          attemptCount: progress.attemptCount,
          startedAt: new Date(progress.startedAt).toISOString(),
          endedAt: progress.endedAt ? new Date(progress.endedAt).toISOString() : new Date().toISOString(),
        };
      }),
    };

    try {
      console.log('Sending learning result:', resultData);
      const response = await fetch(`http://localhost:8080/api/user-quests/1/${currentQuestId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('학습 결과가 성공적으로 전송되었습니다:', responseData);

    } catch (error) {
      console.error('학습 결과 전송 중 오류가 발생했습니다:', error);
    }
  },

}));
