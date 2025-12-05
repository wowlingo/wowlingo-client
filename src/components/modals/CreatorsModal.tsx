interface CreatorsModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function CreatorsModal({ isOpen, onConfirm }: CreatorsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center px-4">

      <div className="absolute inset-0 " onClick={onConfirm} />

      <div className="relative p-8 flex flex-col items-center max-w-sm w-[90%] mx-4 bg-white rounded-3xl shadow-xl">

        <h2 className="text-2xl font-bold text-gray-800 text-center">만든 사람</h2>
        <p className="text-[#3B82F6] font-bold text-lg mt-1 mb-4">온소리 LAB 와우링고팀</p>

        <div className="bg-[#EFF6FF] w-full rounded-2xl p-5 flex flex-col gap-4 mb-4">

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-11 h-11 bg-white rounded-full flex items-center justify-center mt-0.5">
              <img
                src="/images/paintbrush.png"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-slate-400 mb-0.5">디자인&기획</span>
              <span className="text-slate-700 font-semibold leading-tight">
                임예지 김보예 손혜수 이유아
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-11 h-11 bg-white rounded-full flex items-center justify-center mt-0.5">
              <img
                src="/images/laptop.png"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-slate-400 mb-0.5">백엔드 개발</span>
              <span className="text-slate-700 font-semibold">
                김보란 장예진
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-11 h-11 bg-white rounded-full flex items-center justify-center mt-0.5">
              <img
                src="/images/speaker_high_volume.png"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-slate-400 mb-0.5">AI음성 생성</span>
              <span className="text-slate-700 font-semibold">
                전민정 홍승혁
              </span>
            </div>
          </div>

        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onConfirm}
          className="w-full bg-blue-500 text-white font-bold text-lg py-4 px-6 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
}