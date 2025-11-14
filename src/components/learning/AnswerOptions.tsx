import { useLearningStore } from '../../store/learningStore';
import { useState, useEffect } from 'react';

export interface AnswerOption {
  id?: string | number; // choice 타입의 경우 number, 다른 타입의 경우 선택적
  type: string;
  label: string;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
  questType?: string; // quest 타입 정보 추가
}

export default function AnswerOptions({ options, questType }: AnswerOptionsProps) {
  const { setSelectedAnswer } = useLearningStore();
  // 로컬 상태로 선택된 옵션 인덱스 관리 (시각적 선택용)
  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);

  // 옵션이 변경될 때 로컬 선택 상태 초기화
  useEffect(() => {
    setLocalSelectedIndex(null);
  }, [options]);

  const renderIcon = (type: string) => {
    // 타입에 따른 아이콘 이미지 매핑
    const iconMap: Record<string, string> = {
      'statement': '/images/ic_choice_statement.png',
      'question': '/images/ic_choice_question.png',
      'same': '/images/ic_choice_o.png',
      'different': '/images/ic_choice_x.png',
    };

    const iconSrc = iconMap[type];
    if (!iconSrc) return null;

    return (
      <img
        src={iconSrc}
        alt={type}
        className="w-12 h-12"
      />
    );
  };

  const handleOptionClick = (option: AnswerOption, index: number) => {
    // quest type에 따라 다른 값 사용
    const answerValue = questType === 'choice'
      ? (option.id !== undefined ? option.id : option.type) // choice 타입은 id 사용, 없으면 type 사용
      : option.type;
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
      // Figma 디자인 스타일 적용 - 세로 배치
      const baseClasses = "flex items-center justify-center gap-4 w-full rounded-2xl transition-all";
      const textClasses = "text-[16px] font-semibold leading-[22.4px] tracking-[-0.32px]";
      const paddingClasses = "py-[15px] px-4"; // 상단 16px, 하단 15px (총 높이 약 53px)

      return `${baseClasses} ${paddingClasses} ${textClasses} ${
        isSelected
          ? 'bg-blue-100 outline outline-2 outline-offset-[-2px] outline-blue-500 text-blue-500 text-lg font-semibold' // 선택됨: 파란 배경, 흰색 텍스트
          : 'bg-white border border-[#E5E7EB] text-gray-600 hover:bg-[#F9FAFB]' // 미선택: 흰색 배경, 회색 텍스트
      }`;
    }

    // 사각형 가로 두개 배치 스타일 (statement-question, same-different 타입)
    // Figma 디자인: 높이 120px, 가로 배치
    const baseClasses = "flex flex-col items-center justify-center gap-2 rounded-2xl transition-all h-[15vh] min-h-[90px] max-h-[120px]";
    const textClasses = "text-[16px] font-semibold leading-[22.4px] tracking-[-0.32px]";

    return `${baseClasses} ${textClasses} ${
      isSelected
        ? 'bg-blue-100 outline outline-2 outline-offset-[-2px] outline-blue-500 text-blue-500 text-lg font-semibold' // 선택됨: 파란 배경, 흰색 텍스트
        : 'bg-white border border-[#E5E7EB] text-gray-600 text-lg font-semibold leading-6 hover:bg-[#F9FAFB]' // 미선택: 흰색 배경, 회색 텍스트
    }`;
  };

  // questType에 따른 그리드 스타일 결정
  const getGridStyle = () => {
    if (questType === 'choice') {
      return "flex flex-col gap-2 w-full"; // choice 타입일 때 세로 배치
    }
    return "grid grid-cols-2 gap-4 w-full"; // 기본적으로 가로 배치
  };

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
            >
              {questType !== 'choice' && renderIcon(option.type)}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}