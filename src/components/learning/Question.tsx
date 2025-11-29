import { useState, useEffect, useRef } from 'react'; // React Hook 추가
import { toast } from 'sonner';
import { ToastBlueIcon } from '../ui/WordCard';

// 애니메이션을 위한 이미지 경로 배열 (실제 파일 경로로 변경 필요)
// motion.png의 스피커 이미지를 4개로 잘라서 저장했다고 가정합니다.
const SPEAKER_FRAMES = [
  '/images/sound_04.png', // 정지 상태 (또는 입 다문 상태)
  '/images/sound_01.png', // 입 조금 벌린 상태
  '/images/sound_02.png', // 입 벌린 상태
  '/images/sound_03.png', // 소리 파장 있는 상태
];

const SLOWLY_FRAMES = [
  '/images/slowly_04.png', // 정지 상태 (또는 입 다문 상태)
  '/images/slowly_01.png', // 입 조금 벌린 상태
  '/images/slowly_02.png', // 입 벌린 상태
  '/images/slowly_03.png', // 소리 파장 있는 상태
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
  // 1. 상태 관리 추가
  const [isPlaying, setIsPlaying] = useState(false); // 재생 중 여부
  const [frameIndex, setFrameIndex] = useState(0);   // 현재 보여줄 이미지 인덱스
  const [isSlowPlaying, setIsSlowPlaying] = useState(false); // 재생 중 여부
  const [slowframeIndex, setSlowFrameIndex] = useState(0);   // 현재 보여줄 이미지 인덱스

  // 2. 애니메이션 효과 (isPlaying이 true일 때만 작동)
  useEffect(() => {
    let animationInterval: ReturnType<typeof setInterval> | undefined;

    if (isPlaying) {
      animationInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % SPEAKER_FRAMES.length); // 0, 1, 2, 3 반복
      }, 200); // 200ms마다 이미지 변경 (속도 조절 가능)
    } else {
      setFrameIndex(0); // 멈추면 첫 번째 이미지로 초기화
    }

    if (isSlowPlaying) {
      animationInterval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % SLOWLY_FRAMES.length); // 0, 1, 2, 3 반복
      }, 200); // 200ms마다 이미지 변경 (속도 조절 가능)
    } else {
      setSlowFrameIndex(0); // 멈추면 첫 번째 이미지로 초기화
    }

    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [isPlaying, isSlowPlaying]);


  // 단일 사운드 재생 수정
  const handlePlaySound = (audioUrl: string) => {
    setIsPlaying(true); // 재생 시작 상태 설정

    const audio = new Audio(audioUrl);
    audio.play()
      .then(() => {
        // 재생이 끝나면 상태 변경
        audio.onended = () => setIsPlaying(false);
      })
      .catch(e => {
        console.error("오디오 재생 오류:", e);
        setIsPlaying(false); // 에러 시에도 상태 복구
      });
  };

  const handleSlowPlaySound = (audioUrl: string) => {
    setIsSlowPlaying(true); // 재생 시작 상태 설정

    const audio = new Audio(audioUrl);
    audio.play()
      .then(() => {
        // 재생이 끝나면 상태 변경
        audio.onended = () => setIsSlowPlaying(false);
      })
      .catch(e => {
        console.error("오디오 재생 오류:", e);
        setIsSlowPlaying(false); // 에러 시에도 상태 복구
      });
  };

  // 연속 사운드 재생 수정
  const handlePlaySounds = (audioUrls: string[]) => {
    if (audioUrls.length === 0) return;

    setIsPlaying(true); // 재생 시작

    const playAudio = (index: number) => {
      // 모든 재생이 끝났을 때
      if (index >= audioUrls.length) {
        setIsPlaying(false);
        return;
      }

      const audio = new Audio(audioUrls[index]);
      audio.play()
        .then(() => {
          audio.onended = () => playAudio(index + 1);
        })
        .catch(e => {
          console.error("오디오 재생 오류:", e);
          setIsPlaying(false);
        });
    };

    playAudio(0);
  };

  const handleSlowPlaySounds = (audioUrls: string[]) => {
    if (audioUrls.length === 0) return;

    setIsSlowPlaying(true); // 재생 시작

    const playAudio = (index: number) => {
      // 모든 재생이 끝났을 때
      if (index >= audioUrls.length) {
        setIsSlowPlaying(false);
        return;
      }

      const audio = new Audio(audioUrls[index]);
      audio.play()
        .then(() => {
          audio.onended = () => playAudio(index + 1);
        })
        .catch(e => {
          console.error("오디오 재생 오류:", e);
          setIsSlowPlaying(false);
        });
    };

    playAudio(0);
  };

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
        onClick={() => {
          // 이미 재생 중이면 중복 클릭 방지 (선택 사항)
          if (isPlaying) return;

          if (isDouble) {
            const soundUrls = sounds.filter(s => s.type === 'normal').map(s => s.url);
            if (soundUrls && soundUrls.length > 0)
              handlePlaySounds(soundUrls);
          } else {
            const normalSound = sounds.find(s => s.type === 'normal');
            if (normalSound) handlePlaySound(normalSound.url);
          }
        }}
        className="w-full h-full flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50 transition-colors"
        aria-label="문제 듣기"
      >
        <div className="w-22 h-10 flex items-center justify-center">
          {/* 3. 이미지 렌더링 로직 변경 */}
          {isPlaying ? (
            // 재생 중일 때: 애니메이션 프레임 이미지 표시
            <img
              src={SPEAKER_FRAMES[frameIndex]}
              alt="듣는 중"
              className="object-contain" // object-contain으로 비율 유지
            />
          ) : (
            // 정지 상태일 때: 기존 아이콘 표시
            <img
              src="/images/sound_03.png"
              alt="문제 듣기"
            />
          )}
        </div>
        <span className={`text-[16px] font-semibold leading-[22.4px] tracking-[-0.32px] text-[#4A5564]`}>
          {/* 재생 중일 때 텍스트 색상 변경 효과도 줄 수 있습니다 (선택) */}
          문제 듣기
        </span>
      </button>

      {/* 구분선 */}
      <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />

      {/* 천천히 듣기 버튼 (거북이도 동일한 방식으로 적용 가능) */}
      <button
        onClick={() => {
          if (isSlowPlaying) return;

          // 현재는 기존 로직 유지
          if (isDouble) {
            const soundUrls = sounds.filter(s => s.type === 'slow').map(s => s.url);
            if (soundUrls && soundUrls.length > 0)
              handleSlowPlaySounds(soundUrls);
          } else {
            const normalSound = sounds.find(s => s.type === 'slow');
            if (normalSound) handleSlowPlaySound(normalSound.url);
          }

        }}
        className="w-full h-full flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50 transition-colors"
        aria-label="천천히 듣기"
      >
        <div className="w-22 h-10 flex items-center justify-center">
          {/* 3. 이미지 렌더링 로직 변경 */}
          {isSlowPlaying ? (
            // 재생 중일 때: 애니메이션 프레임 이미지 표시
            <img
              src={SLOWLY_FRAMES[frameIndex]}
              alt="듣는 중"
              className="object-contain" // object-contain으로 비율 유지
            />
          ) : (
            // 정지 상태일 때: 기존 아이콘 표시
            <img
              src="/images/slowly_04.png"
              alt="천천히 듣기"
              className=""
            />
          )}
        </div>
        <span className="text-[16px] font-semibold text-[#4A5564] leading-[22.4px] tracking-[-0.32px]">
          천천히 듣기
        </span>
      </button>

      <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
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