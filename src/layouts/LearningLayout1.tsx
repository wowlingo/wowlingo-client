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
      submitButtonClassName="bg-blue-500 hover:bg-[#2265CC] rounded-[999px]"
    >
      {/* 배경 컴포넌트 */}
      <CakeImageStack />
    </BaseLearningLayout>
  );
}