import BaseLearningLayout from './BaseLearningLayout';
import CakeImageStack from '../components/backgrounds/CakeImageStack';
import { useLearningStore } from '../store/learningStore';
import { useEffect } from 'react';

export default function LearningLayout1() {
  const { setSelectedLayoutType } = useLearningStore();

  // Layout1 사용 시 레이아웃 타입을 1로 설정
  useEffect(() => {
    setSelectedLayoutType(1);
  }, [setSelectedLayoutType]);

  return (
    <BaseLearningLayout
      submitButtonClassName="bg-blue-500 hover:bg-[#2265CC] rounded-full"
      backgroundGradient="linear-gradient(to bottom, #D8E8FF 0%, #FFFFFF 100%)"
      learningBg="/images/bg_cake.png"
      learningBgClass="absolute bottom-0 left-0 right-0 top-126 z-0 pointer-events-none"
    >
      {/* 배경 컴포넌트 */}
      <CakeImageStack />
    </BaseLearningLayout>
  );
}