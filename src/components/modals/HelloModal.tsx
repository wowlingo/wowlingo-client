import { X } from 'lucide-react';


interface HelloModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  username?: string; // 사용자 이름 prop 추가 (선택 사항)
}

export default function HelloModal({ isOpen, onConfirm, onClose, username = '' }: HelloModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-1/2 px-4 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex flex-col h-full w-full bg-black">

      {/* 1. 상단 오른쪽 X 버튼 영역 */}
      <div className="absolute top-0 right-0 p-6 z-50 mt-4 mr-2">
        <button
          onClick={onClose}
          aria-label="Exit learning session"
          className="p-2 text-white"
        >
          <X size={30} />
        </button>
      </div>

      {/* 2. 중앙 콘텐츠 영역 (나머지 공간 차지) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">

        {/* 이미지 영역 */}
        <div className="relative flex items-center justify-center">
          {/* 배경 빛 번짐 효과 (이미지 경로 예시) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <img
              src="/images/img_complete_waterdrop_bg.png"
              alt=""
              className="object-contain opacity-60 scale-140"
            /> */}
          </div>
          {/* 물뿌리개 메인 이미지 */}
          <img
            src="/images/imagegroup.png"
            alt="Watering Can"
            className="relative w-full mb-4 object-contain z-10"
          />
        </div>

        {/* 텍스트 영역 */}
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight text-center">
          {username}님, 다시 만나 반가워요!
        </h2>

        <p className="text-gray-300 text-base leading-relaxed text-center">
          물방울을 모아서 식물을 키우고<br />
          신비로운 열매를 수확해 보세요.
        </p>
      </div>

      {/* 3. 하단 버튼 영역 */}
      <div className="flex flex-col items-center justify-center w-full pb-8">
        <button
          onClick={onConfirm}
          className="w-sm mx-auto pt-4 pb-3.5 bg-blue-500 gap-2 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-colors shadow-lg disabled:bg-gray-400"
        >
          학습 시작
        </button>
      </div>

    </div>
  );
}