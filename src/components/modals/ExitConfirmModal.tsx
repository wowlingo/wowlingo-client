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
      <div className="relative p-8 max-w-sm w-full">
        {/* 제목 */}
        <h2 className="text-center text-xl font-bold text-white mb-3">
          학습을 중단하시겠습니까?
        </h2>

        {/* 설명 */}
        <p className="text-center text-white text-sm mb-8">
          지금까지의 진행 상황이 저장되지 않습니다.
        </p>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-3">
          {/* 이어서 하기 버튼 (Primary) */}
          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-colors"
          >
            이어서 하기
          </button>

          {/* 중단하기 버튼 (Secondary) */}
          <button
            onClick={onExit}
            className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold rounded-full transition-colors"
          >
            중단하기
          </button>
        </div>
      </div>
    </div>
  );
}
