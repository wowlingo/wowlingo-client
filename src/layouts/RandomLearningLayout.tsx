import { useMemo } from 'react';
import LearningLayout1 from './LearningLayout1';
import LearningLayout2 from './LearningLayout2';
import LearningLayout3 from './LearningLayout3';
import LearningLayout4 from './LearningLayout4';
import { useLearningStore } from '../store/learningStore';
import { useParams } from 'react-router-dom';

const layouts = [LearningLayout1, LearningLayout2, LearningLayout3, LearningLayout4];

export default function RandomLearningLayout() {
  const { setSelectedLayoutType } = useLearningStore();
  
  const SelectedLayout = useMemo(() => {
    let randomIndex = Math.floor(Math.random() * layouts.length);

    // 테스트 시연을 위해 레이아웃 고정.
    const { questId } = useParams();
    if (questId === '1') {randomIndex = 0;}
    else if (questId === '2') { randomIndex = 1; }
    else if (questId === '3') { randomIndex = 2; }
    else if (questId === '4') { randomIndex = 3; }

    const layoutType = randomIndex + 1; // 1, 2, 3, 4

    // 스토어에 선택된 레이아웃 타입 저장
    setSelectedLayoutType(layoutType);    
    
    console.log(`Random layout selected: ${layoutType}`);
    return layouts[randomIndex];
  }, [setSelectedLayoutType]);

  return <SelectedLayout />;
}
