import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ToastBlueIcon } from '../ui/WordCard';
import { playAudio, playAudios, stopAudio } from '../common/AudioService';

// 애니메이션을 위한 이미지 경로 배열
const SPEAKER_FRAMES = [
  '/images/sound_04.png',
  '/images/sound_01.png',
  '/images/sound_02.png',
  '/images/sound_03.png',
];

const SLOWLY_FRAMES = [
  '/images/slowly_04.png',
  '/images/slowly_01.png',
  '/images/slowly_02.png',
  '/images/slowly_03.png',
];

interface Sound {
  id: number | string;
  type: string;
  url: string;
  label?: string;
}

interface QuestionProps {
  isDouble: boolean | null;
  sounds: Sound[];
  onAddVoca: () => void;
}

export default function Question({ sounds, isDouble, onAddVoca }: QuestionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // 애니메이션 효과
  useEffect(() => {
    let animationInterval: ReturnType<typeof setInterval> | undefined;

    const active = isPlaying || isSlowPlaying;
    const frames = isPlaying ? SPEAKER_FRAMES : SLOWLY_FRAMES;

    if (active) {
      animationInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % frames.length);
      }, 200);
    } else {
      setFrameIndex(0);
    }

    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [isPlaying, isSlowPlaying]);

  // 컴포넌트 언마운트 시 오디오 정지
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const playNormal = useCallback(() => {
    if (isPlaying || isSlowPlaying) return;

    setIsPlaying(true);
    const onPlayEnd = () => setIsPlaying(false);

    const soundUrls = sounds.filter(s => s.type === 'normal').map(s => s.url);

    if (isDouble) {
      if (soundUrls.length > 0) {
        playAudios(soundUrls, onPlayEnd);
      } else {
        setIsPlaying(false);
      }
    } else {
      if (soundUrls.length > 0) {
        playAudio(soundUrls[0], onPlayEnd);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isDouble, sounds, isPlaying, isSlowPlaying]);

  const playSlow = () => {
    if (isPlaying || isSlowPlaying) return;

    setIsSlowPlaying(true);
    const onPlayEnd = () => setIsSlowPlaying(false);

    const soundUrls = sounds.filter(s => s.type === 'slow').map(s => s.url);

    if (isDouble) {
      if (soundUrls.length > 0) {
        playAudios(soundUrls, onPlayEnd);
      } else {
        setIsSlowPlaying(false);
      }
    } else {
      if (soundUrls.length > 0) {
        playAudio(soundUrls[0], onPlayEnd);
      } else {
        setIsSlowPlaying(false);
      }
    }
  };

  // 화면 진입 시 자동 재생
  useEffect(() => {
    const timer = setTimeout(playNormal, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToVocabulary = () => {
    onAddVoca();
    toast("단어장에 추가 되었습니다", {
      icon: <ToastBlueIcon />,
      duration: 3000,
    });
  };

  return (
    <div className="w-90 h-30 flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
      {/* 문제 듣기 버튼 */}
      <button
        onClick={playNormal}
        disabled={isSlowPlaying}
        className={`w-full h-full flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] transition-colors ${isSlowPlaying ? 'cursor-not-allowed opacity-40 grayscale' : 'hover:bg-gray-50'}`}
        aria-label="문제 듣기"
      >
        <div className="w-22 h-10 flex items-center justify-center">
          <img
            src={isPlaying ? SPEAKER_FRAMES[frameIndex] : '/images/sound_03.png'}
            alt={isPlaying ? "듣는 중" : "문제 듣기"}
            className="object-contain"
          />
        </div>
        <span className={`text-[16px] font-semibold leading-[22.4px] tracking-[-0.32px] ${isSlowPlaying ? 'text-gray-300' : 'text-[#4A5564]'}`}>
          문제 듣기
        </span>
      </button>

      {/* 구분선 */}
      <div className="w-[1px] h-[67px] bg-[#E5E7EB] relative z-10" />

      {/* 천천히 듣기 버튼 */}
      <button
        onClick={playSlow}
        disabled={isPlaying}
        className={`w-full h-full flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] transition-colors ${isPlaying ? 'cursor-not-allowed opacity-40 grayscale' : 'hover:bg-gray-50'}`}
        aria-label="천천히 듣기"
      >
        <div className="w-22 h-10 flex items-center justify-center">
          <img
            src={isSlowPlaying ? SLOWLY_FRAMES[frameIndex] : '/images/slowly_04.png'}
            alt={isSlowPlaying ? "듣는 중" : "천천히 듣기"}
            className="object-contain"
          />
        </div>
        <span className={`text-[16px] font-semibold leading-[22.4px] tracking-[-0.32px] ${isPlaying ? 'text-gray-300' : 'text-[#4A5564]'}`}>
          천천히 듣기
        </span>
      </button>

      <div className="w-[1px] h-[67px] bg-[#E5E7EB] relative z-10" />

      <button
        onClick={handleAddToVocabulary}
        className="w-full h-full flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50 transition-colors"
        aria-label="단어장 추가"
      >
        <div className="w-22 h-10 flex items-center justify-center">
          <img src="/images/ic_set_add.png" alt="단어장 추가" className="w-10 h-10" />
        </div>
        <span className="text-[16px] font-semibold text-[#4A5564] leading-[22.4px] tracking-[-0.32px]">
          단어장 추가
        </span>
      </button>
    </div>
  );
}