import { useLearningStore } from '../../store/learningStore';
import { useState, useEffect } from 'react';

/**
 * 게임유형 D의 배경 이미지 스택 컴포넌트
 * Figma 디자인: 배경 이미지와 상태에 따라 변하는 카드 이미지
 */
export default function GameTypeDBg() {
  const { isCorrect } = useLearningStore();
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentCard, setCurrentCard] = useState('/images/card-question.png');

  // 정답/오답 상태에 따라 카드 이미지 변경
  useEffect(() => {
    if (isCorrect === null) {
      // 초기 상태: 물음표 카드
      setCurrentCard('/images/card-question.png');
      setIsFlipping(false);
    } else if (isCorrect === true) {
      // 정답: 물방울 카드로 뒤집기
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentCard('/images/card-drop.png');
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
    } else if (isCorrect === false) {
      // 오답: 원 카드로 뒤집기
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentCard('/images/card-circle.png');
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
    }
  }, [isCorrect]);

  return (
    <>
      {/* 배경 이미지 레이어 - 부모 컨텐츠 영역 전체를 덮고 하단에서 시작 */}
      <div className="absolute bottom-0 left-0 right-0 top-0 z-0 pointer-events-none">
        <img
          src="/images/img_learning_bg_d.png"
          alt="Learning background"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* 중앙 카드 이미지 - absolute로 중앙 배치 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{
            transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={currentCard}
            alt="Learning card"
            className="w-[200px] h-auto drop-shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>

      {/* 하단 그라데이션 오버레이 - 부모 영역 하단에 표시 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[82px] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(245, 249, 255, 0) 0%, rgba(245, 249, 255, 0.8) 100%)'
        }}
      />
    </>
  );
}
