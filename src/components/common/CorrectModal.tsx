import { PartyPopper } from 'lucide-react';

interface CorrectModalProps {
  onNext: () => void;
}

export default function CorrectModal({ onNext }: CorrectModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center gap-6 w-full max-w-sm">
        <PartyPopper size={48} className="text-green-500" />
        <h2 className="text-2xl font-bold">정답입니다!</h2>
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