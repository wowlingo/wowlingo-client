import { X } from 'lucide-react';

interface HelloModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  username?: string;
}

export default function HelloModal({ isOpen, onConfirm, onClose, username = '' }: HelloModalProps) {
  if (!isOpen) return null;

  return (
    // [수정 1] h-full 대신 h-[100dvh]를 사용하여 모바일 브라우저의 주소창/하단바 영역을 제외한 실제 높이를 잡습니다.
    <div className="fixed top-0 left-1/2 px-4 -translate-x-1/2 w-full max-w-lg z-[100] flex flex-col h-[100dvh] bg-black overflow-hidden">

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

      {/* 2. 중앙 콘텐츠 영역 (flex-1로 남은 공간 차지) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0">

        {/* 이미지 영역 */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 배경 효과 등 */}
          </div>
          <img
            src="/images/imagegroup.png"
            alt="Watering Can"
            className="relative w-full mb-4 object-contain z-10 max-h-[40vh]" // 이미지가 너무 커서 밀어내지 않도록 최대 높이 제한 추가 권장
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="shrink-0">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight text-center">
            {username}님, 다시 만나 반가워요!
          </h2>

          <p className="text-gray-300 text-base leading-relaxed text-center">
            물방울을 모아서 식물을 키우고<br />
            신비로운 열매를 수확해 보세요.
          </p>
        </div>
      </div>

      {/* 3. 하단 버튼 영역 */}
      {/* [수정 2] pb-8은 유지하되, 필요하다면 safe-area를 고려해 padding-bottom을 더 줄 수 있습니다. */}
      <div className="flex flex-col items-center justify-center w-full pb-8 shrink-0">
        <button
          onClick={onConfirm}
          // w-sm은 Tailwind 기본 클래스가 아니므로 w-full과 max-w-sm을 조합하는 것이 안전합니다.
          className="w-full max-w-sm mx-auto pt-4 pb-3.5 bg-blue-500 gap-2 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-colors shadow-lg disabled:bg-gray-400"
        >
          학습 시작
        </button>
      </div>

    </div>
  );
}