import { useLearningStore } from '../../store/learningStore';

/**
 * 게임유형 C의 배경 이미지 스택 컴포넌트
 * Figma 디자인: 뽑기 (Pickup)
 *
 * 문제 화면: img_learning_default_c.png
 * 정답 화면: img_learning_correct_c.png
 * 오답 화면: img_learning_incorrect_c.png
 */
export default function GameTypeCBg() {
  const { isCorrect } = useLearningStore();

  // isCorrect 상태에 따라 표시할 이미지 결정
  const getPickupImage = () => {
    if (isCorrect === null) {
      return '/images/img_learning_default_c.png'; // 문제 풀이 중
    } else if (isCorrect === true) {
      return '/images/img_learning_correct_c.png'; // 정답
    } else {
      return '/images/img_learning_incorrect_c.png'; // 오답
    }
  };

  return (
    <>
      {/* 배경 이미지 레이어 */}
      {/* <div className="absolute bottom-0 left-0 right-0 top-10 z-0 pointer-events-none">
        <img
          src="/images/img_learning_bg_c.png"
          alt="Learning background"
          className="w-full h-full object-cover object-top"
        />
      </div> */}

      {/* 중앙 Pickup 이미지 - Figma 기준: 132x198px, 중앙 배치 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img
          src={getPickupImage()}
          alt="Pickup item"
          className="w-full h-full object-contain transition-all duration-500 ease-out top-0 "
        />
      </div>
    </>
  );
}
