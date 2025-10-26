import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import { useLearningStore } from '../store/learningStore';
import Question from '../components/learning/Question';

// 각 레이아웃에서 커스터마이징할 수 있는 props
interface BaseLearningLayoutProps {
  children?: React.ReactNode; // 중앙 배경 영역 (이미지 스택 또는 배경 컴포넌트)
  submitButtonClassName?: string; // 제출 버튼 스타일 커스터마이징
}

export default function BaseLearningLayout({
  children,
  submitButtonClassName = "bg-blue-500 hover:bg-[#2265CC] rounded-[999px]"
}: BaseLearningLayoutProps) {
  const navigate = useNavigate();
  const { questId, stepId } = useParams<{ questId: string; stepId: string }>();
  const urlQuestId = parseInt(questId || '1', 10);
  const currentStep = parseInt(stepId || '1', 10); // URL에서 직접 가져옴

  // Zustand 스토어에서 상태와 액션을 가져옵니다.
  const {
    totalSteps,
    selectedAnswer,
    isCorrect,
    isCompleted,
    checkAnswer,
    endLearning,
    sendLearningResult,
    learningData,
    startStep,
    endStep,
    rawQuestData, // quest title을 위해 추가
    stepProgress, // 정답/오답 개수 계산을 위해 추가
  } = useLearningStore();

  const currentQuestionData = learningData[currentStep];

  // 정답/오답 개수 계산
  const correctCount = Object.values(stepProgress).filter(step => step.isCorrect === true).length;
  const incorrectCount = Object.values(stepProgress).filter(step => step.isCorrect === false).length;

  // 현재 단계가 시작될 때 시간 기록
  React.useEffect(() => {
    if (currentQuestionData) {
      startStep(currentStep);
    }
  }, [currentStep, currentQuestionData]);

  // step이 변경될 때 정답/오답 상태 초기화
  React.useEffect(() => {
    console.log('Step changed to:', currentStep);
    // 새로운 문제로 이동할 때 상태 초기화
    useLearningStore.setState({
      isCorrect: null,
      selectedAnswer: null
    });
  }, [currentStep]);

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
      navigate(`/learning/${urlQuestId}/${currentStep + 1}`);
    } else {
      // 마지막 문제일 경우
      endLearning();
      sendLearningResult();
      // navigate('/result'); // 더 이상 결과 페이지로 이동하지 않음
    }
  };

  const handleConfirm = () => {
    navigate('/');
  };


  return (
    <div className="relative h-screen max-w-lg mx-auto font-sans overflow-hidden">
      {/* 배경 그라디언트 */}
      <div
        className="absolute inset-0 bg-gradient-to-b"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(219, 234, 254, 0.5), rgba(239, 246, 255, 0.5))'
        }}
      />

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col h-full">
      {/* 1. 헤더 (타이틀과 나가기 버튼) - 52px */}
      <header className="flex-shrink-0 h-[52px] flex justify-between items-center px-5">
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

      {/* 2. 진행도 (Progress Bar) - 12px */}
      <div className="flex-shrink-0 px-5 py-2">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* 3. Question (Learning Set) or 완료 텍스트 - 상단 고정 */}
      {!isCompleted ? (
        <div className="flex-shrink-0 px-5 pt-2 flex justify-center">
          {currentQuestionData && <Question key={currentStep} sounds={currentQuestionData.sounds} />}
        </div>
      ) : (
        <div className="flex-shrink-0 px-5 pt-4 flex justify-center">
          <div className="text-center">
            <h2 className="text-gray-800 text-slate-800 text-2xl font-semibold font-['Pretendard'] leading-9">학습 완료!</h2>
            <p className="text-gray-500 text-base font-medium font-['Pretendard'] leading-6">수고하셨어요</p>
          </div>
        </div>
      )}

      {/* 4. 중앙 배경 영역 - Cake */}
      <div className="flex-grow flex items-center justify-center px-5 relative min-h-[270px]">
        {children}
      </div>

      {/* 5. 하단 영역 - 답 선택/피드백/완료 + 버튼 */}
      <div className="flex-shrink-0 flex flex-col justify-end relative">
        {isCompleted ? (
          // 학습 완료 시: 결과 표시 + 확인 버튼
          <div className="flex-shrink-0 px-5 pb-4 space-y-4 relative z-50">
            {/* 정답/오답 결과 박스 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-center gap-12">
              <div className="text-center">
                <p className="text-base text-gray-600 font-medium mb-2">정답</p>
                <p className="text-4xl font-bold text-blue-500">{correctCount}</p>
              </div>
              <div className="text-center">
                <p className="text-base text-gray-600 font-medium mb-2">오답</p>
                <p className="text-4xl font-bold text-red-500">{incorrectCount}</p>
              </div>
            </div>

            {/* 확인 버튼 */}
            <button
              onClick={handleConfirm}
              className={`w-full h-[53px] ${submitButtonClassName} text-white font-bold transition-colors text-[16px]`}
            >
              확인
            </button>
          </div>
        ) : isCorrect === null ? (
          // 답 선택 시: Learning Btn (Outlet) + Primary Button
          <div className="flex-shrink-0 px-5 pb-4 space-y-2 relative z-50">
            <main className="w-full">
              <Outlet />
            </main>
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || !currentQuestionData}
              className={`w-full h-[53px] ${submitButtonClassName} text-white font-bold disabled:bg-gray-300 transition-colors text-[16px]`}
            >
              정답 제출
            </button>
          </div>
        ) : (
          // 정답/오답 시: Bottom Sheet + Button (같은 위치)
          <div className={`flex-shrink-0 relative z-50 animate-slide-u rounded-tl-3xl rounded-tr-3xl outline outline-1 shadow-2xl overflow-hidden ${
                isCorrect ? 'outline-blue-200 bg-blue-100' : 'outline-red-200 bg-red-100'
              }`}>
            {/* Bottom Sheet 배경 */}
            <div
              className={`px-5 pt-6 pb-4`}
            >
              {/* 피드백 헤더 */}
              <div className="flex items-center gap-2 mb-4">
                {isCorrect ? (
                  <>
                    <img src="/images/ic_explain_correct.png" alt="정답" className="w-6 h-6" />
                    <span className="justify-start text-blue-500 text-xl font-semibold font-['Pretendard'] leading-7">
                      정답이에요! 이어서 가볼까요?
                    </span>
                  </>
                ) : (
                  <>
                    <img src="/images/ic_explain_incorrect.png" alt="오답" className="w-6 h-6" />
                    <span className="justify-start text-red-500 text-xl font-semibold font-['Pretendard'] leading-7">
                      아쉽지만 오답이에요
                    </span>
                  </>
                )}
              </div>

              {/* 정답 설명 */}
              {currentQuestionData && (
                <div className="justify-start text-gray-600 text-lg font-semibold font-['Pretendard'] leading-7">
                  정답: {currentQuestionData.answerDetail.label}
                  <br />
                  "{currentQuestionData.answerDetail.units.join(', ')}"
                </div>
              )}
            </div>

            {/* 다음 버튼 - Bottom Sheet 밖에 배치하여 "정답 제출"과 같은 위치 */}
            <div className="px-5 pb-4">
              <button
                onClick={handleNext}
                className={`w-full h-[53px] ${isCorrect ? submitButtonClassName : 'bg-red-400 hover:bg-red-500 rounded-[999px]'} text-white font-bold transition-colors text-[16px]`}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      </div>
  );
}
