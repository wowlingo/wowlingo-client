import { useLearningStore } from '../../store/learningStore';
import { CircleCheck, CircleQuestionMark, CircleX, Dot } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface AnswerOption {
  id: string;
  type: string;
  label: string;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
  questType?: string; // quest 타입 정보 추가
  layoutType?: number; // 레이아웃 타입 추가 (1, 2, 3, 4)
}

export default function AnswerOptions({ options, questType, layoutType = 1 }: AnswerOptionsProps) {
  const { setSelectedAnswer } = useLearningStore();
  // 로컬 상태로 선택된 옵션 인덱스 관리 (시각적 선택용)
  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);

  // 옵션이 변경될 때 로컬 선택 상태 초기화
  useEffect(() => {
    setLocalSelectedIndex(null);
  }, [options]);

  const renderIcon = (type: string, isSelected: boolean) => {
    const iconClass = isSelected ? "text-white" : "text-blue-500";
    const iconClassRed = isSelected ? "text-white" : "text-red-500";
    const iconClassGreen = isSelected ? "text-white" : "text-green-500";
    const iconClassPurple = isSelected ? "text-white" : "text-purple-500";
    const iconClassGray = isSelected ? "text-white" : "text-gray-500";
    
    // 타입에 따른 아이콘 매핑
    const iconMap: Record<string, React.ReactNode> = {
      'statement': <Dot size={24} className={iconClass} />,
      'question': <CircleQuestionMark size={24} className={iconClass} />,
      'same': <CircleCheck size={24} className={iconClass} />,
      'different': <CircleX size={24} className={iconClassRed} />,
      'word': <Dot size={24} className={iconClassGreen} />,
      'senstence': <CircleX size={24} className={iconClassPurple} />,
    };
    
    return iconMap[type] || <Dot size={24} className={iconClassGray} />;
  };

  const handleOptionClick = (option: AnswerOption, index: number) => {
    // quest type에 따라 다른 값 사용
    const answerValue = questType === 'choice' ? option.id : option.type;
    console.log('Option clicked:', answerValue, 'Quest type:', questType, 'Index:', index); // 디버깅용
    setLocalSelectedIndex(index); // 시각적 선택 상태 업데이트
    setSelectedAnswer(answerValue); // 스토어의 정답 상태 업데이트
    console.log('selectedAnswer should be set to:', answerValue); // 디버깅용
  };

  // options가 없거나 배열이 아닌 경우 안전하게 처리
  if (!options || !Array.isArray(options)) {
    return <div>Loading options...</div>;
  }

  // questType에 따른 버튼 스타일 결정
  const getButtonStyle = (isSelected: boolean) => {
    if (questType === 'choice') {
      // 피그마 기준 스타일 적용
      const baseClasses = "flex items-center justify-center gap-4 w-full h-14 rounded-2xl border transition-all font-semibold";
      const paddingClasses = "py-4 px-4"; // padding-top: 16px, padding-bottom: 15px
      
      return `${baseClasses} ${paddingClasses} ${
        isSelected
          ? 'border-2 border-blue-500 text-white' // 선택된 상태: 2px 테두리, 파란색 배경
          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300' // 선택 안된 상태: 1px 테두리
      }`;
    }
    
    // 사각형 가로 두개 배치 스타일
    const baseClasses = "flex items-center justify-center gap-4 p-8 border-2 rounded-lg text-lg transition-all font-semibold";
    
    return `${baseClasses} ${
      isSelected
        ? 'border-blue-500 bg-blue-500 text-white ring-4 ring-blue-200 shadow-lg scale-105'
        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
    }`;
  };

  // questType에 따른 그리드 스타일 결정
  const getGridStyle = () => {
    if (questType === 'choice') {
      return "flex flex-col gap-2 w-full"; // choice 타입일 때 세로 배치
    }
    return "grid grid-cols-2 gap-4 w-full"; // 기본적으로 가로 배치
  };

  // 디버깅용 - options 데이터 확인
  console.log('AnswerOptions - options:', options);
  console.log('AnswerOptions - layoutType:', layoutType);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className={getGridStyle()}>
        {options.map((option, index) => {
          console.log(`Option ${index}:`, option); // 각 옵션 디버깅
          // 인덱스 기반으로 시각적 선택 상태 결정
          const isSelected = localSelectedIndex === index;
          return (
            <button
              key={`${option.type || 'unknown'}-${index}`} // 고유한 키 생성 (type 사용)
              onClick={() => handleOptionClick(option, index)}
              className={getButtonStyle(isSelected)}
              style={questType === 'choice' && isSelected ? {
                background: 'linear-gradient(0deg, #3182F7, #3182F7), linear-gradient(0deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85))',
              } : undefined}
            >
              {renderIcon(option.type, isSelected)}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}