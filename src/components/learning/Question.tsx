import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ToastBlueIcon } from '../ui/WordCard';
import { playAudio, playAudios, stopAudio } from '../common/AudioService';
import { usePlayAnimation } from '../../shared/hooks/usePlayAnimation';

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

  const currentPlayAnimation = usePlayAnimation(isPlaying, isSlowPlaying);

  // 컴포넌트 언마운트 시 오디오 정지
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // 화면 가시성 변경 감지 (홈 버튼, 탭 전환 등)
  useEffect(() => {
    const handleVisibilityChange = () => {
      // 화면이 숨겨졌을 때 (백그라운드로 이동 시)
      if (document.visibilityState === 'hidden') {
        stopAudio();           // 오디오 정지
        setIsPlaying(false);   // 재생 상태 UI 초기화
        setIsSlowPlaying(false); // 재생 상태 UI 초기화
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    const timer = setTimeout(playNormal, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToVocabulary = () => {
    onAddVoca();
    toast("단어장에 추가 되었습니다", {
      icon: <ToastBlueIcon />,
      duration: 3000,
      dismissible: false,
    });
  };

  return (
    <div className="flex items-center justify-center gap-3 w-full">
      {/* 문제 듣기 버튼 */}
      <button
        onClick={playNormal}
        disabled={isSlowPlaying}
        className={`w-[100px] h-[100px] flex flex-col items-center justify-center gap-[2px] px-[6px] pt-[18px] pb-[17px] bg-white rounded-xl transition-colors ${isSlowPlaying ? 'cursor-not-allowed opacity-40 grayscale' : 'hover:bg-gray-50'}`}
        aria-label="문제 듣기"
      >
        <div className="w-[88px] h-10 flex items-center justify-center">
          {isPlaying ? (
            // 재생 중일 때: 훅에서 받아온 이미지 사용
            <img
              src={currentPlayAnimation}
              alt="듣는 중"
              className="object-contain"
            />
          ) : (
            // 정지 상태: 고정 이미지
            <img src="/images/sound_03.png" alt="문제 듣기" className="object-contain" />
          )}
        </div>
        <span className={`text-base font-semibold leading-6 tracking-[-0.32px] ${isSlowPlaying ? 'text-gray-300' : 'text-[#4A5564]'}`}>
          문제 듣기
        </span>
      </button>

      {/* 천천히 듣기 버튼 */}
      <button
        onClick={playSlow}
        disabled={isPlaying}
        className={`w-[100px] h-[100px] flex flex-col items-center justify-center gap-[2px] px-[6px] pt-[18px] pb-[17px] bg-white rounded-xl transition-colors ${isPlaying ? 'cursor-not-allowed opacity-40 grayscale' : 'hover:bg-gray-50'}`}
        aria-label="천천히 듣기"
      >
        <div className="w-[88px] h-10 flex items-center justify-center">
          {isSlowPlaying ? (
            // 재생 중일 때: 훅에서 받아온 이미지 사용
            <img
              src={currentPlayAnimation}
              alt="듣는 중"
              className="object-contain"
            />
          ) : (
            // 정지 상태: 고정 이미지
            <img src="/images/slowly_04.png" alt="천천히 듣기" className="object-contain" />
          )}
        </div>
        <span className={`text-base font-semibold leading-6 tracking-[-0.32px] ${isPlaying ? 'text-gray-300' : 'text-[#4A5564]'}`}>
          천천히 듣기
        </span>
      </button>

      {/* 단어장 추가 버튼 */}
      <button
        onClick={handleAddToVocabulary}
        className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-[2px] px-[6px] pt-[18px] pb-[17px] bg-white rounded-xl hover:bg-gray-50 transition-colors"
        aria-label="단어장 추가"
      >
        <div className="w-[88px] h-10 flex items-center justify-center">
          <img src="/images/ic_set_add.png" alt="단어장 추가" className="w-10 h-10" />
        </div>
        <span className="text-base font-semibold text-[#4A5564] leading-6 tracking-[-0.32px]">
          단어장 추가
        </span>
      </button>
    </div>
  );
}