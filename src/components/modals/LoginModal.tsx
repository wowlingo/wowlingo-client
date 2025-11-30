import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onConfirm: (nickname: string) => void;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onConfirm, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const [nickname, setNickname] = useState('');

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center px-4">

      {/* 배경 오버레이 - MainLayout 영역 안에서만 어둡게 처리 */}
      {/* 클릭 시 onClose가 실행되도록 하여 배경 클릭으로 닫기 구현 */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 - 배경 위에 떠야 하므로 relative와 z-index 필요 */}
      <div className="relative z-10 p-8 flex flex-col items-center w-100 bg-white rounded-3xl shadow-xl">

        {/* 메시지 */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          로그인하고 학습을 시작해보세요
        </h2>
        <p className="text-base text-gray-600 mb-6 text-center leading-relaxed">
          학습 기록과 성장 과정을 확인할 수 있어요.
        </p>

        {/* 입력 */}
        <div className="flex flex-col h-full w-full mb-6">
          <input
            type="text"
            placeholder="최대 8글자로 입력해주세요."
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={8} // 8글자 제한
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* 확인 버튼 */}
        <button
          onClick={() => onConfirm(nickname)}
          className="w-full bg-blue-500 text-white font-bold text-lg py-4 px-6 rounded-full hover:bg-blue-600 transition-colors shadow-md"
        >
          로그인
        </button>
      </div>
    </div>
  );
}