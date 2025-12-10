import { useState, useEffect } from 'react';
import LearningLayout1 from './LearningLayout1';
import LearningLayout2 from './LearningLayout2';
import LearningLayout3 from './LearningLayout3';
import LearningLayout4 from './LearningLayout4';
import TutorialModal from '../components/modals/TutorialModal';
import { useLearningStore } from '../store/learningStore';

const layouts = [LearningLayout1, LearningLayout2, LearningLayout3, LearningLayout4];

const tutorialData: Record<number, 
{ title: string; description1: string; description2: string; image: string }> = {
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
  
  // 컴포넌트 마운트 시 딱 한 번만 랜덤값 생성 (useState 초기값 함수 사용)
  const [layoutType] = useState(() => Math.floor(Math.random() * layouts.length) + 1);

  // const [SelectedLayout, selectedLayoutType] = useMemo(() => {
  //   const randomIndex = Math.floor(Math.random() * layouts.length);
  //   const layoutType = randomIndex + 1;
  //   setSelectedLayoutType(layoutType);
  //   console.log(`Random layout selected: ${layoutType}`);
  //   return [layouts[randomIndex], layoutType];
  // }, [setSelectedLayoutType]);

  // 토어 업데이트 및 튜토리얼 노출 여부 체크
  useEffect(() => {
    // 스토어에 현재 레이아웃 타입 저장
    setSelectedLayoutType(layoutType);

    // 로컬 스토리지 확인
    const hasSeenTutorials = localStorage.getItem('hasSeenTutorials');
    const parsedArray = hasSeenTutorials ? JSON.parse(hasSeenTutorials) : [];

    console.log(`Current Layout: ${layoutType}, Viewed:`, parsedArray);

    // 현재 뽑힌 layoutType이 배열에 없으면 튜토리얼 보여주기
    if (!parsedArray.includes(layoutType)) {
      setShowTutorial(true);
    }
  }, [layoutType, setSelectedLayoutType]);

  // 튜토리얼 확인 버튼 핸들러
  const handleTutorialConfirm = () => {
    const hasSeenTutorials = localStorage.getItem('hasSeenTutorials');
    const parsedArray = hasSeenTutorials ? JSON.parse(hasSeenTutorials) : [];

    // 중복 방지를 위해 확인 후 push
    if (!parsedArray.includes(layoutType)) {
      parsedArray.push(layoutType);
      localStorage.setItem('hasSeenTutorials', JSON.stringify(parsedArray));
    }

    console.log(`Updated Viewed List: `, parsedArray);
    setShowTutorial(false);
  };

  // 현재 선택된 레이아웃 컴포넌트 결정
  const SelectedLayout = layouts[layoutType - 1];

  // 튜토리얼 모달 렌더링
  if (showTutorial) {
    const tutorialContent = tutorialData[layoutType];

    return (
      <TutorialModal
        isOpen={true}
        onConfirm={handleTutorialConfirm}
        // tutorialContent가 없을 경우 대비 (타입 안정성)
        tutorialContent={tutorialContent || { title: '', description1: '', description2: '', image: '' }}
      />
    );
  }

  return <SelectedLayout />;
}