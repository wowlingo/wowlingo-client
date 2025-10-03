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

type ApiCourseResponseData = {
  courseId: number;
  title: string;
  type: string;
  objective: string;
  totalQuestCount: number;
  doneQuestCount: number;
  enableYn: boolean;
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
  courseData: ApiCourseResponseData[];
  totalCourseCount: number;
  currentCourseId: number | null;
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
  sendLearningResult: () => Promise<void>; // 학습 결과 전송 액션
  fetchQuestData: (questId: number) => Promise<void>; // 퀘스트 전체를 가져오는 액션
  fetchCourseData: () => Promise<void>;
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
  courseData: [],
  totalCourseCount: 0,
  currentCourseId: null,

  fetchCourseData: async () => {
    set({ isLoading: true });

    try {
      const response = await fetch(`http://localhost:8080/api/courses?userId=1`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse: { data: ApiCourseResponseData[] } = await response.json();
      const courseData = jsonResponse.data;

      let lastCourseId: number | null = null;
      courseData.forEach((item) => {
        if (item.enableYn) {
          lastCourseId = item.courseId;
        }
      });

      set({
        courseData,
        totalCourseCount: courseData.length,
        isLoading: false,
        currentCourseId: lastCourseId,
      });

    } catch (error) {
      console.error("Failed to fetch quest data:", error);
      set({ isLoading: false, learningData: {}, totalSteps: 0 });
    }
  },
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

  // 학습 정보 API 전송
  sendLearningResult: async () => {
    const { currentQuestId, answers, startTime, endTime, learningData } = get();

    // 데이터가 없으면 전송하지 않음
    if (!currentQuestId || !startTime || !endTime) {
      console.error("필수 학습 정보가 부족하여 결과를 전송할 수 없습니다.");
      return;
    }

    // API로 보낼 데이터 구성
    const resultData = {
      questId: currentQuestId,
      results: Object.entries(answers).map(([step, userAnswer]) => {
        const stepNum = parseInt(step, 10);
        const questionData = learningData[stepNum];
        return {
          step: stepNum,
          questionSoundIds: questionData.sounds.map(s => s.id),
          userAnswer: userAnswer,
          correctAnswer: questionData.correctAnswer,
          isCorrect: questionData.correctAnswer === userAnswer,
        }
      }),
      startTime: new Date(startTime).toISOString(), // ISO 8601 형식
      endTime: new Date(endTime).toISOString(),     // ISO 8601 형식
    };

    try {
      console.log(resultData);
      const response = await fetch('http://localhost:8080/api/userQuest', {
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
