interface ExitConfirmModalProps {
  isOpen: boolean;
  onContinue: () => void; // 이어서 하기
  onExit: () => void; // 중단하기
}

export default function ExitConfirmModal({ isOpen, onContinue, onExit }: ExitConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center px-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onContinue} // 배경 클릭 시 이어서 하기
      />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-lg h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">

        
        {/* 제목 */}
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight text-center">
          학습을 중단하시겠습니까?
        </h2>

        {/* 설명 */}
          <p className="text-gray-300 text-base leading-relaxed text-center">
          지금까지의 진행 상황이 저장되지 않습니다.
        </p>

        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-3 pb-8 w-full">
          {/* 이어서 하기 버튼 (Primary) */}
          <button
            onClick={onContinue}
            className="w-sm mx-auto pt-4 pb-3.5 bg-blue-500 gap-2 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            이어서 하기
          </button>

          {/* 중단하기 버튼 (Secondary) */}
          <button
            onClick={onExit}
            className="w-sm mx-auto pt-4 pb-3.5 bg-gray-200 gap-2 hover:bg-gray-300 text-gray-600 font-bold text-lg rounded-full transition-colors"
          >
            중단하기
          </button>
        </div>
      </div>
    </div>
  );
}
