import { useState } from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  const [nickname, setNickname] = useState('');

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // '저장' 버튼 클릭 시 실행될 핸들러
  const handleSubmit = () => {
    if (nickname.trim().length > 0) {
      console.log('저장할 닉네임:', nickname);
      // TODO: 여기에 닉네임 저장 로직 (API 호출)
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 배경 오버레이 - 어두운 색으로 투명하게 처리 */}
      <div className="absolute inset-0 bg-black/80" onClick={onConfirm} />

      {/* 모달 컨텐츠 */}
      <div className="relative p-8 flex flex-col items-center max-w-sm w-[90%] mx-4 bg-white rounded-3xl shadow-xl">

        {/* 메시지 */}
        <h2 className="text-[22px] text-gray-800 mb-8 mt-2 text-center">
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