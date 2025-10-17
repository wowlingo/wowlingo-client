import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import { useLearningStore } from '../store/learningStore';
import IncorrectModal from '../components/common/IncorrectModal';
import Question from '../components/learning/Question';
import CakeImageStack from '../components/backgrounds/CakeImageStack';

// 각 레이아웃에서 커스터마이징할 수 있는 props
interface BaseLearningLayoutProps {
  children?: React.ReactNode; // 중앙 이미지 영역
  backgroundClassName?: string; // 배경색 커스터마이징
  submitButtonClassName?: string; // 제출 버튼 스타일 커스터마이징
}

export default function BaseLearningLayout({ 
  children, 
  backgroundClassName = "bg-blue-50",
  submitButtonClassName = "bg-blue-500 hover:bg-blue-600"
}: BaseLearningLayoutProps) {
  const navigate = useNavigate();
  const { questId, stepId } = useParams<{ questId: string; stepId: string }>();
  const urlQuestId = parseInt(questId || '1', 10);
  const currentStep = parseInt(stepId || '1', 10);

  // Zustand 스토어에서 상태와 액션을 가져옵니다.
  const {
    totalSteps,
    selectedAnswer,
    modalState,
    isCorrect,
    checkAnswer,
    showIncorrectModal,
    closeModalAndGoToNextStep,
    endLearning,
    sendLearningResult,
    learningData,
    startStep,
    endStep,
    rawQuestData, // quest title을 위해 추가
  } = useLearningStore();

  const currentQuestionData = learningData[currentStep];

  // 현재 단계가 시작될 때 시간 기록
  React.useEffect(() => {
    if (currentQuestionData) {
      startStep(currentStep);
    }
  }, [currentStep, currentQuestionData]);

  const handleSubmit = () => {
    console.log(`Step ${currentStep} Answer: ${selectedAnswer}`);
    console.log(`Correct Answer: ${currentQuestionData?.correctAnswer}`);

    if (!selectedAnswer || !currentQuestionData) {
      console.log('Submit blocked - selectedAnswer:', selectedAnswer, 'currentQuestionData:', currentQuestionData);
      return;
    }

    // 현재 단계의 시간 및 답변 기록
    endStep(currentStep, selectedAnswer, currentQuestionData.correctAnswer);

    // Zustand 스토어의 checkAnswer 액션 호출
    checkAnswer(currentQuestionData.correctAnswer, currentQuestionData.stackImage);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      closeModalAndGoToNextStep();
      navigate(`/learning/${urlQuestId}/${currentStep + 1}`);
    } else {
      // 마지막 문제일 경우
      endLearning();
      sendLearningResult();
      navigate('/result');
    }
  };

  // 현재 문제의 사운드 데이터를 가져옵니다 (오답 모달용).
  const currentSounds = currentQuestionData?.sounds || [];
  const incorrectModalSounds = currentSounds.map(sound => ({ ...sound, label: undefined }));

  return (
    <div className={`flex flex-col h-screen max-w-lg mx-auto font-sans ${backgroundClassName}`}>
      {/* 1. 헤더 (타이틀과 나가기 버튼) */}
      <header className="flex justify-between items-center py-2 px-4">
        {/* 왼쪽 빈 공간 (균형을 위해) */}
        <div className="w-10"></div>
        
        {/* 가운데 타이틀 */}
        {rawQuestData?.title && (
          <h1 className="text-xl font-bold text-gray-900 text-center flex-1">{rawQuestData.title}</h1>
        )}
        
        {/* 우측 나가기 버튼 */}
        <button
          onClick={() => navigate('/')}
          aria-label="Exit learning session"
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>
      </header>

      {/* 2. 진행도 (Progress Bar) */}
      <div className="px-4">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* 3. 메인 콘텐츠 영역 */}
      <div className="flex-grow flex flex-col justify-between items-center px-4 py-2 min-h-0">
        {/* 상단: 소리 재생 버튼 */}
        <div className="flex-shrink-0 pt-2">
          {currentQuestionData && <Question key={currentStep} sounds={currentQuestionData.sounds} />}
        </div>

        {/* 중앙: 커스터마이징 가능한 이미지 영역 */}
        <div className="flex-grow flex items-center justify-center">
          {children || <CakeImageStack />}
        </div>

        {/* 하단: 문제 풀이(Outlet) 영역 */}
        <main className="flex-shrink-0 w-full">
          <Outlet />
        </main>
      </div>

      {/* 4. 정답 제출 버튼 */}
      <div className="flex-shrink-0 px-4 pb-4">
        {isCorrect === true && (
          <h3 className="w-full bg-gray-100 text-xl font-bold text-blue-500 py-3 px-4 rounded-lg mb-4">
            정답이에요! 이어서 가볼까요?
          </h3>
        )}
        {isCorrect === false && (
          <h3 className="w-full bg-gray-100 text-xl font-bold text-red-500 py-3 px-4 rounded-lg mb-4">
            오답 문구
          </h3>
        )}

        <button
          onClick={() => {
            if (isCorrect === null) {
              handleSubmit();
            } else if (isCorrect === true) {
              handleNext();
            } else { // isCorrect === false (오답)
              if (modalState === 'closed') {
                showIncorrectModal();
              } else {
                handleNext();
              }
            }
          }}
          disabled={!selectedAnswer || !currentQuestionData}
          className={`w-full ${submitButtonClassName} text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-300 transition-colors`}
        >
          {(isCorrect != null) ? '다음' : '정답 제출'}
        </button>
      </div>

      {/* 오답 모달 */}
      {modalState === 'incorrect' && (
        <IncorrectModal
          onNext={handleNext}
          sounds={incorrectModalSounds}
        />
      )}
    </div>
  );
}
