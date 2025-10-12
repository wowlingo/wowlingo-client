import { Ghost } from 'lucide-react';
import GameQuestion from './GameQuestion';

interface GameIncorrectModalProps {
  onNext: () => void;
  sounds: { id: string | number; type: string; url: string; label?: string }[];
}

export default function GameIncorrectModal({ onNext, sounds }: GameIncorrectModalProps) {
  const handleAddToNotes = () => {
    console.log('오답노트에 추가되었습니다.');
    alert('오답노트에 추가되었습니다.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Ghost size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-500">틀렸대~요</h2>
        
        {/* 음성 다시 듣기 버튼 */}
        <GameQuestion sounds={sounds} />

        {/* 오답노트 추가 버튼 */}
        <button
          onClick={handleAddToNotes}
          className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          오답노트에 추가
        </button>

        {/* 다음 문제 버튼 */}
        <button
          onClick={onNext}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          다음 문제
        </button>
      </div>
    </div>
  );
}
