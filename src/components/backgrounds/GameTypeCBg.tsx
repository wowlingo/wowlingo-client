import { useLearningStore } from '../../store/learningStore';
import { useState, useEffect } from 'react';

/**
 * 게임유형 C의 배경 이미지 스택 컴포넌트
 * Figma 디자인: 뽑기
 */
export default function GameTypeCBg() {
  const { isCorrect } = useLearningStore();
  const [isCatching, setIsCatching] = useState(false);
  const [currentCatch, setCurrentCatch] = useState('/images/img_catcher.png');

  useEffect(() => {
    if (isCorrect === null) {
      // 초기 상태
      setCurrentCatch('/images/img_catcher.png');
      setIsCatching(false);
    } else if (isCorrect === true) {
      // 정답
      setIsCatching(true);
      setTimeout(() => {
        setCurrentCatch('/images/img_learning_correct_c.png');
        setTimeout(() => setIsCatching(false), 300);
      }, 300);
    } else if (isCorrect === false) {
      // 오답
      setIsCatching(true);
      setTimeout(() => {
        setCurrentCatch('/images/img_catcher_open.png');
        setTimeout(() => setIsCatching(false), 300);
      }, 300);
    }
  }, [isCorrect]);

  return (
    <>
      {/* 배경 이미지 레이어 - 부모 컨텐츠 영역 전체를 덮고 하단에서 시작 */}
      <div className="absolute bottom-0 left-0 right-0 top-0 z-0 pointer-events-none">
        <img
          src="/images/img_learning_bg_c.png"
          alt="Learning background"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* 중앙 카드 이미지 - absolute로 중앙 배치 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          className="transition-transform duration-300 ease-in-out w-full max-w-[200px] px-5"
          style={{
            transform: isCatching ? 'rotateY(90deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={currentCatch}
            alt="Learning card"
            className="w-full h-auto drop-shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>
    </>
  );
}
