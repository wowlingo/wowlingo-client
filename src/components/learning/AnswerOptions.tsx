import { useLearningStore } from '../../store/learningStore';
import { CircleCheck, CircleQuestionMark, CircleX, Dot } from 'lucide-react';
import Question from './Question';

export interface AnswerOption {
  type: 'statement' | 'question' | 'same' | 'different';
  label: string;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
}

export default function AnswerOptions({ options }: AnswerOptionsProps) {
  const { selectedAnswer, setSelectedAnswer } = useLearningStore();

  const renderIcon = (type: AnswerOption['type']) => {
    if (type === 'statement') {
      return <Dot size={24} className="text-blue-500" />;
    }
    if (type === 'question') {
      return <CircleQuestionMark size={24} className="text-blue-500" />;
    }
    if (type === 'same') {
      return <CircleCheck size={24} className="text-blue-500" />;
    }
    if (type === 'different') {
      return <CircleX size={24} className="text-red-500" />;
    }
    return null; // 다른 타입의 버튼에는 아이콘 없음
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* <img src={imageSrc} alt="Question clue" className="w-full max-w-sm rounded-lg shadow-md mb-4" /> */}

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((option) => (
          <button
            key={option.type}
            onClick={() => setSelectedAnswer(option.type)}
            className={`flex items-center justify-center gap-4 p-8 border rounded-lg text-lg transition-all font-semibold
              ${selectedAnswer === option.type
                ? 'ring-2 ring-offset-2 border-blue-500 bg-blue-100 text-blue-700'
                : 'bg-white hover:bg-gray-50'
              }`}
          >
            {renderIcon(option.type)}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}