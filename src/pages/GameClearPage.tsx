import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ProgressBar from '../components/common/ProgressBar';
import ResultsInfo from '../components/result/ResultsInfo';
import { useLearningStore } from '../store/learningStore';

export default function GameClearPage() {
  const navigate = useNavigate();
  const { totalSteps, answers, startTime, endTime, reset, correctImageStack } = useLearningStore();

  const { learningData } = useLearningStore((state) => ({
    fetchLearningData: state.fetchQuestData,
    learningData: state.learningData,
    isLoading: state.isLoading,
    startLearning: state.startLearning,
  }));
  
  // 1. 정답/오답 개수 계산
  const correctCount = Object.keys(answers).reduce((count, step) => {
    const stepNum = parseInt(step, 10);
    const question = learningData[stepNum as keyof typeof learningData];
    if (question && answers[stepNum] === question.correctAnswer) {
      return count + 1;
    }
    return count;
  }, 0);
  const incorrectCount = totalSteps - correctCount;

  // 2. 총 소요 시간 계산
  const duration = (endTime && startTime) ? Math.floor((endTime - startTime) / 1000) : 0; // 초 단위

  // 3. 정답률 계산
  const accuracy = totalSteps > 0 ? Math.round((correctCount / totalSteps) * 100) : 0;
  
  const handleConfirm = () => {
    reset(); // 상태 초기화
    navigate('/'); // 홈으로 이동
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans">
      <Header />
      {/* 진행도는 10/10으로 꽉 찬 상태로 표시 */}
      <ProgressBar currentStep={totalSteps} totalSteps={totalSteps} />
      
      <h2 className="text-3xl font-bold text-center text-gray-800 my-6">
        Game Clear !!
      </h2>

      <div className="flex-grow"></div>

      <main className="flex-grow flex flex-col justify-center items-center text-center gap-8 mb-12">
        {/* 풀이 끝 이미지 */}
        {/* <img src="https://picsum.photos/200/300" alt="Game Clear" className="w-full max-w-sm rounded-lg shadow-md" /> */}
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          {correctImageStack.map((layer, index) => (
            <img
              key={index}
              src={layer.src}
              alt={`Final Layer ${index + 1}`}
              className="absolute w-full h-full object-contain"
              style={layer.style}
            />
          ))}
        </div>

        <div className="flex-grow"></div>

        {/* 결과 정보 컴포넌트 */}
        <ResultsInfo
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          durationInSeconds={duration}
          accuracy={accuracy}
        />

      </main>

      {/* 확인 버튼 */}
      <div className="mt-auto">
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}