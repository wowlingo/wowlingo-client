import BaseLearningLayout from './BaseLearningLayout';
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
      backgroundClassName="bg-blue-50"
      submitButtonClassName="bg-blue-500 hover:bg-blue-600"
    />
  );
}