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
      backgroundClassName="bg-purple-50 relative"
      submitButtonClassName="bg-blue-500 hover:bg-blue-600"
    >
      {/* 배경 컴포넌트 */}
      <CatImageStack />
    </BaseLearningLayout>
  );
}