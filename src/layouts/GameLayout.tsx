import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/common/Header';
import ProgressBar from '../components/common/ProgressBar';
import { useGameStore } from '../store/gameStore';
import GameCorrectModal from '../components/game/GameCorrectModal';
import GameIncorrectModal from '../components/game/GameIncorrectModal';
import GameQuestion from '../components/game/GameQuestion';

export default function GameLayout() {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const currentStep = parseInt(stepId || '1', 10);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const { 
    totalSteps, 
    selectedAnswer, 
    modalState, 
    waterDropStack,
    checkAnswer, 
    closeModalAndGoToNextStep,
    endGame,
    gameData,
  } = useGameStore();

  const currentQuestionData = gameData[currentStep];

  const handleSubmit = () => {
    console.log(`Game Step ${currentStep} Answer: ${selectedAnswer}`);

    if (!selectedAnswer || !currentQuestionData) return;

    // 카드 뒤집기 애니메이션 시작
    setIsCardFlipped(true);
    
    // 애니메이션 후 정답 확인
    setTimeout(() => {
      checkAnswer(currentQuestionData.correctAnswer, currentQuestionData.stackImage);
    }, 500);
  };

  const handleNext = () => {
    // 카드 상태 리셋
    setIsCardFlipped(false);
    
    if (currentStep < totalSteps) {
      closeModalAndGoToNextStep();
      navigate(`/game/${currentStep + 1}`);
    } else {
      endGame();
      navigate('/game/result');
    }
  };

  const currentSounds = currentQuestionData?.sounds || [];
  const incorrectModalSounds = currentSounds.map(sound => ({ ...sound, label: undefined }));

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans bg-gray-100">
      {/* 헤더 */}
      <Header />

      {/* 진행도 */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {/* 메인 게임 영역 */}
      <div className="flex-grow flex flex-col justify-center items-center py-4 gap-6">
        {/* 오디오 컨트롤 */}
        {currentQuestionData && <GameQuestion sounds={currentQuestionData.sounds} />}

        <div className="flex-grow"></div>

        {/* 타로카드 영역 */}
        <div className="relative w-full max-w-sm mx-auto aspect-square flex-shrink-0 flex items-center justify-center">
          <div className={`relative w-full h-full rounded-2xl border-2 card-flip ${
            isCardFlipped 
              ? 'bg-white border-blue-300 flipped' 
              : 'bg-white border-yellow-300'
          }`}>
            
            {waterDropStack.length === 1 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isCardFlipped ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src="/images/water-drop.png" 
                      alt="Water Drop" 
                      className="w-16 h-16 object-contain mb-3"
                    />
                    <span className="text-lg font-bold text-blue-600">
                      {modalState === 'correct' ? '정답!' : '틀렸대~요'}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <img 
                      src="/images/card.png" 
                      alt="Card" 
                      className="w-30 h-30 object-contain mb-3"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* 문제 풀이 영역 */}
        <main className="flex-shrink-0">
          <Outlet />
        </main>
      </div>

      {/* 정답 제출 버튼 */}
      <div className="flex-shrink-0 mt-10">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || !currentQuestionData}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
        >
          정답 제출
        </button>
      </div>

      {/* 모달들 */}
      {modalState === 'correct' && <GameCorrectModal onNext={handleNext} />}
      {modalState === 'incorrect' && (
        <GameIncorrectModal 
          onNext={handleNext} 
          sounds={incorrectModalSounds} 
        />
      )}
    </div>
  );
}
