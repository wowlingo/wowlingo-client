import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameAnswerOptions from '../components/game/GameAnswerOptions';
import { useGameStore, GameQuestionData } from '../store/gameStore';

export default function GameStepPage() {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const urlStepNumber = parseInt(stepId || '1', 10);

  const { gameData, isLoading, startGame, currentStep, currentQuestId: storeLoadedQuestId } = useGameStore((state) => ({
    gameData: state.gameData,
    isLoading: state.isLoading,
    startGame: state.startGame,
    currentStep: state.currentStep,
    currentQuestId: state.currentQuestId,
  }));

  // 퀘스트 데이터가 로드되지 않았거나 유효하지 않은 경우 인트로 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && (!storeLoadedQuestId || Object.keys(gameData).length === 0)) {
      navigate('/game/intro');
    }
  }, [isLoading, storeLoadedQuestId, gameData, navigate]);

  // 스토어의 currentStep과 URL의 stepNumber가 다르면 스토어의 currentStep으로 이동
  useEffect(() => {
    if (storeLoadedQuestId && Object.keys(gameData).length > 0 && urlStepNumber !== currentStep) {
      navigate(`/game/${currentStep}`);
    }
  }, [urlStepNumber, currentStep, navigate, storeLoadedQuestId, gameData]);

  useEffect(() => {
    // 1단계일 때만 게임 시작 기록
    if (currentStep === 1) {
      startGame();
    }
  }, [currentStep, startGame]);

  // 퀘스트 데이터가 아직 로드되지 않았거나, 현재 단계의 데이터가 없으면 로딩 스피너 표시
  if (isLoading || !storeLoadedQuestId || Object.keys(gameData).length === 0) {
    return <div>Loading...</div>;
  }

  const data: GameQuestionData | undefined = gameData[currentStep];

  // 특정 단계의 데이터가 없으면 에러 메시지 또는 인트로로 리다이렉트
  if (!data) {
    return <div>Invalid game step data.</div>;
  }

  // 옵션이 없는 경우 처리
  if (!data.options || data.options.length === 0) {
    return <div>No options available for this question.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 정답 선택지 */}
      <GameAnswerOptions options={data.options} />
    </div>
  );
}
