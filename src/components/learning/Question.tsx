import { toast } from 'sonner';
import { ToastBlueIcon } from '../ui/WordCard';

// 하나의 사운드에 대한 타입 정의
interface Sound {
  id: number | string; // key로 사용될 고유 ID
  type: string;
  url: string;         // 오디오 파일의 경로
  label?: string;       // 버튼에 표시될 텍스트
}

// 컴포넌트가 받을 props 타입 정의
interface QuestionProps {
  isDouble: boolean | null;
  sounds: Sound[];
  onAddVoca: () => void;
}

export default function Question({ sounds, isDouble, onAddVoca }: QuestionProps) {
  // 사운드를 재생하는 함수
  const handlePlaySound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("오디오 재생 오류:", e));
  };

  const handlePlaySounds = (audioUrls: string[]) => {
    if (audioUrls.length === 0) return;

    const playAudio = (index: number) => {
      if (index >= audioUrls.length) return;

      const audio = new Audio(audioUrls[index]);
      audio.play()
        .then(() => {
          audio.onended = () => playAudio(index + 1);
        })
        .catch(e => console.error("오디오 재생 오류:", e));
    };

    playAudio(0);
  };

  // 단어장 추가 함수
  const handleAddToVocabulary = () => {

    onAddVoca();

    toast("단어장에 추가 되었습니다", {
      icon: <ToastBlueIcon />,
      duration: 3000,
    });

  };

  return (
    <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
      {/* 문제 듣기 버튼 */}
      <button
        onClick={() => {
          if (isDouble) {
            const soundUrls = sounds.filter(s => s.type === 'normal').map(s => s.url);
            if (soundUrls && soundUrls.length > 0)
              handlePlaySounds(soundUrls);
          } else {
            const normalSound = sounds.find(s => s.type === 'normal');
            if (normalSound) handlePlaySound(normalSound.url);
          }
        }}
        className="w-[100px] h-[99px] flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50 transition-colors"
        aria-label="문제 듣기"
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/images/ic_set_sound.png" alt="문제 듣기" className="w-10 h-10" />
        </div>
        <span className="text-[16px] font-semibold text-[#4A5564] leading-[22.4px] tracking-[-0.32px]">
          문제 듣기
        </span>
      </button>

      {/* 구분선 */}
      <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />

      {/* 천천히 듣기 버튼 */}
      <button
        onClick={() => {
          if (isDouble) {
            const soundUrls = sounds.filter(s => s.type === 'slow').map(s => s.url);
            if (soundUrls && soundUrls.length > 0)
              handlePlaySounds(soundUrls);
          } else {
            const normalSound = sounds.find(s => s.type === 'slow');
            if (normalSound) handlePlaySound(normalSound.url);
          }

        }}
        className="w-[100px] h-[99px] flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50 transition-colors"
        aria-label="천천히 듣기"
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/images/ic_set_slowly.png" alt="천천히 듣기" className="w-10 h-10" />
        </div>
        <span className="text-[16px] font-semibold text-[#4A5564] leading-[22.4px] tracking-[-0.32px]">
          천천히 듣기
        </span>
      </button>

      {/* 구분선 */}
      <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />

      {/* 단어장 추가 버튼 */}
      <button
        onClick={handleAddToVocabulary}
        className="w-[100px] h-[99px] flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50 transition-colors"
        aria-label="단어장 추가"
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/images/ic_set_add.png" alt="단어장 추가" className="w-10 h-10" />
        </div>
        <span className="text-[16px] font-semibold text-[#4A5564] leading-[22.4px] tracking-[-0.32px]">
          단어장 추가
        </span>
      </button>
    </div>
  );
}