interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onConfirm, onClose }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center px-4">

      {/* 배경 오버레이 - MainLayout 영역 안에서만 어둡게 처리 */}
      {/* 클릭 시 onClose가 실행되도록 하여 배경 클릭으로 닫기 구현 */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative z-10 p-8 flex flex-col items-center w-100 bg-white rounded-3xl shadow-xl">

        {/* 메시지 */}
        <h2 className="text-xl text-gray-800 mb-8 mt-2 text-center">
          로그아웃 하시겠어요?
        </h2>

        <div className="flex w-full gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-blue-100 text-blue-600 font-bold text-lg rounded-full hover:bg-blue-200 transition-colors"
          >
            아니요
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-blue-500 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-colors shadow-md"
          >
            로그아웃
          </button>
        </div>

      </div>
    </div>
  );
}