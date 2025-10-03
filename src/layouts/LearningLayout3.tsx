import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import ProgressBar from '../components/common/ProgressBar';
import { useLearningStore } from '../store/learningStore';
import CorrectModal from '../components/common/CorrectModal';
import IncorrectModal from '../components/common/IncorrectModal';
import Question from '../components/learning/Question';

export default function LearningLayout3() {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const currentStep = parseInt(stepId || '1', 10);

  // Zustand 스토어에서 상태와 액션을 가져옵니다.
  const {
    totalSteps,
    selectedAnswer,
    modalState,
    correctImageStack,
    isCorrect,
    checkAnswer,
    showIncorrectModal,
    closeModalAndGoToNextStep,
    endLearning,
    sendLearningResult,
    learningData, // 스토어에서 learningData 가져오기
  } = useLearningStore();

  const currentQuestionData = learningData[currentStep];

  const handleSubmit = () => {
    // 여기에 정답 확인 로직을 추가할 수 있습니다.
    console.log(`Step ${currentStep} Answer: ${selectedAnswer}`);

    if (!selectedAnswer || !currentQuestionData) return;

    // Zustand 스토어의 checkAnswer 액션 호출
    checkAnswer(currentQuestionData.correctAnswer, currentQuestionData.stackImage);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      closeModalAndGoToNextStep(); // 스토어 액션 호출
      navigate(`/learning/${currentStep + 1}`);
    } else {
      // 마지막 문제일 경우
      endLearning(); // 학습 종료 시간 기록
      sendLearningResult(); // 학습 정보 API 전송
      navigate('/result'); // 결과 페이지로 이동
    }
  };

  // 현재 문제의 사운드 데이터를 가져옵니다 (오답 모달용).
  const currentSounds = currentQuestionData?.sounds || [];
  // 오답 모달에서는 느린 속도 버튼이 없으므로, 필터링합니다.
  const incorrectModalSounds = currentSounds.map(sound => ({ ...sound, label: undefined }));


  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans">
      {/* 1. 헤더 (나가기 버튼) */}
      <Header />

      {/* 2. 진행도 (Progress Bar) */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} enableButton={true} />

      {/* 3. 문제와 정답 영역 (동적으로 변경됨) */}
      {/* <main className="flex-grow my-6">
        <Outlet />
      </main> */}

      {/* ✨ 메인 콘텐츠 영역 레이아웃 수정 */}
      <div className="flex-grow flex flex-col justify-center items-center py-4 gap-6">

        {/* 1. 소리 재생 버튼 */}
        {currentQuestionData && <Question sounds={currentQuestionData.sounds} />}

        <div className="flex-grow"></div>

        {/* 1. 이미지 스택 표시 영역 */}
        <div className="relative w-full max-w-sm mx-auto aspect-square flex-shrink-0 flex items-center justify-center">
          {correctImageStack.map((layer, index) => (
            <img
              key={index}
              src={layer.src}
              alt={`Correct Answer Layer ${index + 1}`}
              className="absolute w-full h-full object-contain transition-all duration-500 ease-out"
              style={layer.style}
            />
          ))
          }
        </div>

        {/* 콘텐츠 사이의 공간을 채움 */}
        <div className="flex-grow"></div>

        {/* 2. 문제 풀이(Outlet) 영역 */}
        <main className="flex-shrink-0">
          <Outlet />
        </main>
      </div>

      {/* 4. 정답 제출 버튼 */}
      <div className="flex-shrink-0">

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
        {/* <h3 className="text-xl font-bold text-red-500 mb-4 bg-gray-100">오답 문구</h3> */}

        <button
          onClick={() => {
            if (isCorrect === null) {
              handleSubmit();
            } else if (isCorrect === true) {
              handleNext();
            } else { // isCorrect === false (오답)
              if (modalState === 'closed') {
                // 3. 오답이고, 모달이 닫혀있을 때 -> 모달 띄우기
                showIncorrectModal(); // 새로 만든 액션 호출
              } else {
                // 4. 오답이고, 모달이 열려있을 때 -> 다음 문제로
                handleNext();
              }
            }
          }}
          disabled={!selectedAnswer || !currentQuestionData} // 선택된 정답이 없으면 비활성화
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
        >
          {(isCorrect != null) ? '다음' : '정답 제출'}
        </button>
      </div>

      {/* {modalState === 'correct' && <CorrectModal onNext={handleNext} />} */}
      {modalState === 'incorrect' && (
        <IncorrectModal
          onNext={handleNext}
          sounds={incorrectModalSounds}
        />
      )}
    </div>
  );
}