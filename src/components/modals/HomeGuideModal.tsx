import { useState } from 'react';
import CreatorsModal from './CreatorsModal'

interface HomeGuideModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function HomeGuideModal({ isOpen, onConfirm }: HomeGuideModalProps) {
  if (!isOpen) return null;

  const [isCreatorsModalOpen, setIsCreatorsModalOpen] = useState(false);

  const fruitDefaultImages = ['/images/apple_silhouette.png', '/images/strawberry_ silhouette.png', '/images/peach_silhouette.png', '/images/cherry_silhouette.png', '/images/blueberry_silhouette.png',];

  const fruitImages = fruitDefaultImages;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center px-4">
      
      {/* 배경 오버레이 - 어두운 색으로 투명하게 처리 */}
      <div className="absolute inset-0 bg-black/80" onClick={onConfirm} />

      {/* 모달 컨텐츠 */}
      <div className="relative p-8 flex flex-col items-center max-w-sm w-[90%] mx-4 bg-white rounded-3xl shadow-xl">

        {/* 메시지 */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          완성의 열매 도감
        </h2>
        <p className="text-base text-gray-600 mb-6 text-center leading-relaxed">
          LV. 5를 달성하면 열매를 수확할 수 있어요.<br />
          랜덤하게 수확되는 열매를 모아보세요!
        </p>

        {/* 과일 이미지 섹션 */}
        <div
          className="flex justify-around items-center w-full mb-8 p-4 rounded-xl"
          style={{
            // 첫 번째 배경: 중간부터 하단으로 흐르는 그라데이션 (상단 50%는 투명)
            background: 'linear-gradient(180deg, transparent 60%, rgba(115, 115, 115, 0.16) 50%, rgba(217, 217, 217, 0) 100%), #F3F4F6',
          }}
        >
          {fruitImages.map((src, index) => (
            <div key={index} className="w-1/5 flex justify-center">
              {src ? (
                // <Image> 컴포넌트를 <img> 태그로 변경
                <img
                  src={src}
                  alt={`Fruit ${index + 1}`}
                  width={48} // 너비
                  height={48} // 높이
                  className="object-contain" // 이미지 비율 유지를 위해
                />
              ) : (
                // 이미지가 없을 경우 회색 원으로 표시
                <div className="w-12 h-12 bg-gray-400 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={() => setIsCreatorsModalOpen(true)}
          className="w-full bg-blue-500 text-white font-bold text-lg py-4 px-6 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
        >
          확인
        </button>
      </div>

      <CreatorsModal
        isOpen={isCreatorsModalOpen}
        onConfirm={() => {
          onConfirm();
          setIsCreatorsModalOpen(false)
        }}
      />

    </div>
  );
}