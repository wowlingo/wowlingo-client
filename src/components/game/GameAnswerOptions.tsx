import { useGameStore } from '../../store/gameStore';
import { CircleCheck, CircleQuestionMark, CircleX, Dot } from 'lucide-react';

export interface GameAnswerOption {
  type: string;
  label: string;
  unitId: number;
}

interface GameAnswerOptionsProps {
  options: GameAnswerOption[];
}

export default function GameAnswerOptions({ options }: GameAnswerOptionsProps) {
  const { selectedAnswer, setSelectedAnswer } = useGameStore();

  const renderIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'statement': <Dot size={24} className="text-blue-500" />,
      'question': <CircleQuestionMark size={24} className="text-blue-500" />,
      'same': <CircleCheck size={24} className="text-blue-500" />,
      'different': <CircleX size={24} className="text-red-500" />,
      'word': <Dot size={24} className="text-green-500" />,
      'sentence': <CircleX size={24} className="text-purple-500" />,
    };
    
    return iconMap[type] || <Dot size={24} className="text-gray-500" />;
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((option) => (
          <button
            key={option.unitId}
            onClick={() => setSelectedAnswer(option.type)}
            className={`flex items-center justify-center gap-3 p-4 border rounded-lg text-lg transition-all font-semibold
              ${selectedAnswer === option.type
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'bg-white hover:bg-gray-50 border-gray-200'
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
