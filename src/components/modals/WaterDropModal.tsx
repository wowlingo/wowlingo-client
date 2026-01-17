interface WaterDropModalProps {
  isOpen: boolean;
  waterDropCount: number;
  onConfirm: () => void;
}

export default function WaterDropModal({ isOpen, waterDropCount, onConfirm }: WaterDropModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center px-4">
      {/* 배경 오버레이 - 어두운 색으로 투명하게 처리 */}
      <div className="absolute inset-0 bg-black/80" onClick={onConfirm} />

      {/* 모달 컨텐츠 */}
      <div className="relative p-8 flex flex-col items-center max-w-sm w-[90%] mx-4">
        {/* 물방울 이미지 */}
        <div className="">
          <img
            src="/images/img_complete_waterdrop.png"
            alt="Water Drop"
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* 획득 메시지 */}
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          물방울 {waterDropCount}개 획득!
        </h2>

        {/* 확인 버튼 */}
        <button
          onClick={onConfirm}
          className="w-full bg-blue-500 text-white font-bold text-lg py-3 px-6 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
        >
          받기
        </button>
      </div>
    </div>
  );
}
