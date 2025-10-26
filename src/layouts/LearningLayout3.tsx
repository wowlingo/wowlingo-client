import BaseLearningLayout from './BaseLearningLayout';
import { useLearningStore } from '../store/learningStore';
import { useEffect } from 'react';
import GameTypeCBg from '../components/backgrounds/GameTypeCBg';

export default function LearningLayout3() {
  const { setSelectedLayoutType } = useLearningStore();

  // Layout3 사용 시 레이아웃 타입을 3으로 설정
  useEffect(() => {
    setSelectedLayoutType(3);
  }, [setSelectedLayoutType]);

  return (
    <BaseLearningLayout
      submitButtonClassName="bg-blue-500 hover:bg-[#2265CC] rounded-[999px]"
      backgroundGradient="linear-gradient(180deg, #D8DCFB 0%, #FFF 100%)"
    >
      <GameTypeCBg />
    </BaseLearningLayout>
  );
}