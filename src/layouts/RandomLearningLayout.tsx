import { useMemo } from 'react';
import LearningLayout1 from './LearningLayout1';
import LearningLayout2 from './LearningLayout2';
import LearningLayout3 from './LearningLayout3';
import LearningLayout4 from './LearningLayout4';
import { useLearningStore } from '../store/learningStore';

const layouts = [LearningLayout1, LearningLayout2, LearningLayout3, LearningLayout4];

export default function RandomLearningLayout() {
  const { setSelectedLayoutType } = useLearningStore();
  
  const SelectedLayout = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * layouts.length);
    const layoutType = randomIndex + 1; // 1, 2, 3, 4
    
    // 스토어에 선택된 레이아웃 타입 저장
    setSelectedLayoutType(layoutType);
    
    console.log(`Random layout selected: ${layoutType}`);
    return layouts[randomIndex];
  }, [setSelectedLayoutType]);

  return <SelectedLayout />;
}
