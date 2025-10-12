interface GameCorrectModalProps {
  onNext: () => void;
}

export default function GameCorrectModal({ onNext }: GameCorrectModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <img 
            src="/images/water-drop.png" 
            alt="Water Drop" 
            className="w-8 h-8 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-blue-600">정답!</h2>
        <p className="text-gray-600">물방울을 획득했습니다!</p>
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
