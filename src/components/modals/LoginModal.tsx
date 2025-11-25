import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onConfirm: (nickname: string) => void;
}

export default function LoginModal({ isOpen, onConfirm }: LoginModalProps) {
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
      {/* <div className="absolute inset-0 bg-black/80" onClick={onConfirm} /> */}

      {/* 모달 컨텐츠 */}
      <div className="relative p-8 flex flex-col items-center max-w-sm w-[90%] mx-4 bg-white rounded-3xl shadow-xl">

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
          className="w-full bg-blue-500 text-white font-bold text-lg py-4 px-6 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
        >
          로그인
        </button>
      </div>
    </div>
  );
}