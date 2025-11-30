import BaseLearningLayout from './BaseLearningLayout';
import CatImageStack from '../components/backgrounds/CatImageStack';
import { useLearningStore } from '../store/learningStore';
import { useEffect } from 'react';

export default function LearningLayout2() {
  const { setSelectedLayoutType } = useLearningStore();

  // Layout2 사용 시 레이아웃 타입을 2로 설정
  useEffect(() => {
    setSelectedLayoutType(2);
  }, [setSelectedLayoutType]);

  return (
    <BaseLearningLayout
      submitButtonClassName="bg-blue-500 hover:bg-[#2265CC] rounded-[999px]"
      backgroundGradient="linear-gradient(to bottom, #D8DCFB 0%, #FFFFFF 100%)"
      learningBg="/images/bg_cat.png"
      learningBgClass="absolute bottom-0 left-0 right-0 top-126 z-0 pointer-events-none"
    >
      {/* 배경 컴포넌트 */}
      <CatImageStack />
    </BaseLearningLayout>
  );
}