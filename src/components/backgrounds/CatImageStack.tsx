
import { useLearningStore } from '../../store/learningStore';

export default function CatImageStack() {
  const { stepProgress } = useLearningStore();

  // 정답 개수 계산
  const correctCount = Object.values(stepProgress).filter(step => step.isCorrect === true).length;

  // 현재 레벨 계산 (0부터 10까지, 최대 10)
  const currentLevel = Math.min(correctCount, 10);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Cat 이미지 (cat, jar, speech bubble 포함) */}
      <div className="relative w-80 h-80 max-w-sm aspect-square flex items-center justify-center">
        <img
          src={`/images/cat-${currentLevel}.png`}
          alt={`Cat Level ${currentLevel}`}
          className="w-full h-full object-contain transition-all duration-500 ease-out"
        />
      </div>
    </div>
  );
}
