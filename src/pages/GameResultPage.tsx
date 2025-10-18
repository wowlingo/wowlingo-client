import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ProgressBar from '../components/common/ProgressBar';
import { useGameStore } from '../store/gameStore';

export default function GameResultPage() {
  const navigate = useNavigate();
  const { totalSteps, startTime, endTime, reset, waterDropStack, correctCount } = useGameStore();
  
  // 총 소요 시간 계산
  const duration = (endTime && startTime) ? Math.floor((endTime - startTime) / 1000) : 0; // 초 단위

  // 정답률 계산
  const accuracy = totalSteps > 0 ? Math.round((correctCount / totalSteps) * 100) : 0;
  
  const handleConfirm = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans bg-gray-100">
      <Header />
      
      {/* 진행도는 완료 상태로 표시 */}
      <ProgressBar currentStep={totalSteps} totalSteps={totalSteps} />
      
      <h2 className="text-3xl font-bold text-center text-gray-800 my-6">
        Game Clear !!
      </h2>

      <div className="flex-grow"></div>

      <main className="flex-grow flex flex-col justify-center items-center text-center gap-8 mb-12">
        {/* 최종 물방울 스택 표시 */}
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          {waterDropStack.map((layer, index) => (
            <img
              key={index}
              src="/images/water-drop.png"
              alt={`Final Water Drop Layer ${index + 1}`}
              className="absolute w-full h-full object-contain"
              style={layer.style}
            />
          ))}
        </div>

        <div className="flex-grow"></div>

        {/* 결과 정보 */}
        <div className="w-full flex flex-col gap-4">
          {/* 물방울 획득 정보 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-around text-center mb-4">
              <div>
                <p className="text-sm text-gray-500">스피드</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.floor(duration / 60).toString().padStart(2, '0')}:
                  {(duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">정답률</p>
                <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
              </div>
            </div>
          </div>
        </div>
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

      {/* 물방울 획득 모달 */}
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center gap-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold">Game Clear!!</h2>
          <p className="text-lg">정교한 물방울 획득</p>
          
          {/* 물방울 아이콘 */}
          <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
            <img 
              src="/images/water-drop.png" 
              alt="Water Drop" 
              className="w-12 h-12 object-contain"
            />
          </div>
          
          {/* 획득한 물방울 개수 */}
          <p className="text-2xl font-bold">{correctCount}개</p>
          
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
