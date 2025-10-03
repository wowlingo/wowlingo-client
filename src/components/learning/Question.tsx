import React from 'react';
import { Turtle, Volume2 } from 'lucide-react'; // 듣기 아이콘

// 하나의 사운드에 대한 타입 정의
interface Sound {
  id: number | string; // key로 사용될 고유 ID
  type: string;
  url: string;         // 오디오 파일의 경로
  label?: string;       // 버튼에 표시될 텍스트 (예: '느리게')
}

// 컴포넌트가 받을 props 타입 정의
interface QuestionProps {
  sounds: Sound[];
}

export default function Question({ sounds }: QuestionProps) {

  const renderIcon = (type: Sound['type']) => {
    if (type === 'normal') {
      return <Volume2 size={40} className="mt-2 text-sm font-semibold" />;
    }
    if (type === 'slow') {
      return <Turtle size={40} className="mt-2 text-sm font-semibold" />;
    }
    return <Volume2 size={40} className="mt-2 text-sm font-semibold" />;
  };

  // 사운드를 재생하는 함수
  const handlePlaySound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("오디오 재생 오류:", e));
  };

  return (
    // 버튼들을 감싸는 컨테이너. 버튼 개수에 따라 중앙 정렬됨
    <div className="flex justify-center items-center gap-4 my-4">
      {sounds.map((sound) => (
        <button
          key={sound.id + sound.type}
          onClick={() => handlePlaySound(sound.url)}
          className="flex flex-col items-center justify-center p-10 bg-sky-100 text-sky-700 rounded-2xl shadow-sm hover:bg-sky-200 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={`${sound.label || '소리'} 듣기`}
        >
          {renderIcon(sound.type)}
        </button>
      ))}
    </div>
  );
}