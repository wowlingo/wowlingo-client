interface Sound {
  id: number | string;
  type: string;
  url: string;
  label?: string;
}

interface GameQuestionProps {
  sounds: Sound[];
}

export default function GameQuestion({ sounds }: GameQuestionProps) {
  const renderIcon = (type: string) => {
    if (type === 'normal') {
      return <img src="/images/sound.png" alt="Sound" className="w-8 h-8" />;
    }
    if (type === 'slow') {
      return <img src="/images/turtle.png" alt="Slow" className="w-8 h-8" />;
    }
    return <img src="/images/sound.png" alt="Sound" className="w-8 h-8" />;
  };

  const handlePlaySound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("오디오 재생 오류:", e));
  };

  return (
    <div className="flex justify-center items-center gap-4 my-4">
      {sounds.map((sound) => (
        <button
          key={sound.id}
          onClick={() => handlePlaySound(sound.url)}
          className="flex flex-col items-center justify-center p-6 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200"
          aria-label={`${sound.label || '소리'} 듣기`}
        >
          {renderIcon(sound.type)}
        </button>
      ))}
    </div>
  );
}
