import BaseLearningLayout from './BaseLearningLayout';
import { useLearningStore } from '../store/learningStore';
import { useEffect } from 'react';

export default function LearningLayout3() {
  const { setSelectedLayoutType } = useLearningStore();

  // Layout3 사용 시 레이아웃 타입을 3으로 설정
  useEffect(() => {
    setSelectedLayoutType(3);
  }, [setSelectedLayoutType]);

  return (
    <BaseLearningLayout
      backgroundClassName="bg-green-50"
      submitButtonClassName="bg-blue-500 hover:bg-blue-600"
    >
      {/* Layout3은 plain background (이미지 스택 없음) */}
    </BaseLearningLayout>
  );
}