import { useMemo } from 'react';
import LearningLayout1 from './LearningLayout1';
import LearningLayout2 from './LearningLayout2';
import LearningLayout3 from './LearningLayout3';
import LearningLayout4 from './LearningLayout4';

const layouts = [LearningLayout1, LearningLayout2, LearningLayout3, LearningLayout4];

export default function RandomLearningLayout() {
  const SelectedLayout = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * layouts.length);
    return layouts[randomIndex];
  }, []);

  return <SelectedLayout />;
}
