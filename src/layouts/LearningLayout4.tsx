import BaseLearningLayout from './BaseLearningLayout';
import GameTypeDBg from '../components/backgrounds/GameTypeDBg';
import { useLearningStore } from '../store/learningStore';
import { useEffect } from 'react';

export default function LearningLayout4() {
  const { setSelectedLayoutType } = useLearningStore();

  // Layout4 사용 시 레이아웃 타입을 4로 설정
  useEffect(() => {
    setSelectedLayoutType(4);
  }, [setSelectedLayoutType]);

  return (
    <BaseLearningLayout
      backgroundClassName="bg-[#F5F9FF]"
      submitButtonClassName="bg-blue-500 hover:bg-blue-600"
    >
      {/* 배경 컴포넌트 - 블러 처리된 이미지 스택과 그라데이션 오버레이 */}
      <GameTypeDBg />
    </BaseLearningLayout>
  );
}