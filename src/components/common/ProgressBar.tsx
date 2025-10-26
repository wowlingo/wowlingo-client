
// 컴포넌트가 받을 props의 타입을 정의합니다.
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  // 진행률을 퍼센트로 계산합니다.
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full my-2">
      {/* 진행률 텍스트 (예: 1 / 10) */}

      {/* <div className="text-right text-sm text-gray-600 mb-1">
        <span>{currentStep}</span> / <span>{totalSteps}</span>
      </div> */}

      <div className="flex items-center gap-2">
        {/* 프로그레스 바의 배경 */}
        <div className="w-sm bg-[#E5E7EB] rounded-full h-3 flex-1">
          {/* 실제 진행 상태를 보여주는 바 */}
          <div
            className="bg-[#2B7FFF] h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}