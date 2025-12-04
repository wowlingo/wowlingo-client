import React, { useState, useEffect, useMemo } from 'react';
import LearningLayout1 from './LearningLayout1';
import LearningLayout2 from './LearningLayout2';
import LearningLayout3 from './LearningLayout3';
import LearningLayout4 from './LearningLayout4';
import TutorialModal from '../components/modals/TutorialModal';
import { useLearningStore } from '../store/learningStore';

const layouts = [LearningLayout1, LearningLayout2, LearningLayout3, LearningLayout4];

const tutorialData = {
  1:
  {
    title: '맛있는 푸딩 만들기',
    description1: '맞추는 문제에 따라 토핑을 올려',
    description2: '다채로운 푸딩을 만들 수 있어요.',
    image: '/images/tutorial-1.png'
  },

  2:
  {
    title: '고양이의 마법 스프 만들기',
    description1: '맞추는 문제 개수에 따라',
    description2: '스프가 항아리에 가득 채워져요.',
    image: '/images/tutorial-2.png'
  },

  3:
  {
    title: '캡슐 모으기',
    description1: '맞추는 문제 개수에 따라',
    description2: '물방울이 담긴 캡슐을 수집할 수 있어요.',
    image: '/images/tutorial-3.png'
  },

  4:
  {
    title: '물방울 카드 모으기',
    description1: '맞추는 문제 개수에 따라',
    description2: '물방울 카드를 수집할 수 있어요.',
    image: '/images/tutorial-4.png'
  },

};

export default function LearningFlow() {
  const { setSelectedLayoutType } = useLearningStore();
  const [showTutorial, setShowTutorial] = useState(false);

  const [SelectedLayout, selectedLayoutType] = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * layouts.length);
    const layoutType = randomIndex + 1;
    setSelectedLayoutType(layoutType);
    console.log(`Random layout selected: ${layoutType}`);
    return [layouts[randomIndex], layoutType];
  }, [setSelectedLayoutType]);

  useEffect(() => {
    // const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    // if (hasSeenTutorial !== 'true') {
    setShowTutorial(true);
    // }
  }, []);

  const handleTutorialConfirm = () => {
    // localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  if (showTutorial) {
    const tutorialContent = tutorialData[selectedLayoutType as keyof typeof tutorialData] || {};
    console.log('tutorialContent:', tutorialContent);
    return (
      <TutorialModal
        isOpen={true}
        onConfirm={handleTutorialConfirm}
        tutorialContent={tutorialContent}
      />
    );
  }

  return <SelectedLayout />;
}