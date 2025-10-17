import { Turtle, Volume2, NotebookPen } from 'lucide-react'; // 듣기 아이콘

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
      return <Volume2 size={24} className="text-blue-600" />;
    }
    if (type === 'slow') {
      return <Turtle size={24} className="text-blue-600" />;
    }
    return <Volume2 size={24} className="text-blue-600" />;
  };

  // 사운드를 재생하는 함수
  const handlePlaySound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("오디오 재생 오류:", e));
  };

  // 단어장 추가 함수
  const handleAddToVocabulary = () => {
    // TODO: 단어장 추가 로직 구현
    console.log("단어장에 추가");
  };

  return (
    // 피그마 디자인에 맞는 컨테이너
    <div 
      className="w-[335px] h-[115px] bg-gray-100 rounded-2xl p-2 flex items-center gap-[9px] mx-auto my-4"
      style={{
        paddingTop: '8px',
        paddingRight: '10px', 
        paddingBottom: '8px',
        paddingLeft: '10px'
      }}
    >
      {/* 문제 듣기 버튼 */}
      <button
        onClick={() => sounds.find(s => s.type === 'normal') && handlePlaySound(sounds.find(s => s.type === 'normal')!.url)}
        className="flex-1 flex flex-col items-center justify-center p-3 bg-white rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="문제 듣기"
      >
        {renderIcon('normal')}
        <span className="text-xs text-gray-700 mt-1 font-medium">문제 듣기</span>
      </button>

      {/* 구분선 */}
      <div className="w-px h-12 bg-gray-300"></div>

      {/* 천천히 듣기 버튼 */}
      <button
        onClick={() => sounds.find(s => s.type === 'slow') && handlePlaySound(sounds.find(s => s.type === 'slow')!.url)}
        className="flex-1 flex flex-col items-center justify-center p-3 bg-white rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="천천히 듣기"
      >
        {renderIcon('slow')}
        <span className="text-xs text-gray-700 mt-1 font-medium">천천히 듣기</span>
      </button>

      {/* 구분선 */}
      <div className="w-px h-12 bg-gray-300"></div>

      {/* 단어장 추가 버튼 */}
      <button
        onClick={handleAddToVocabulary}
        className="flex-1 flex flex-col items-center justify-center p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="단어장 추가"
      >
        <NotebookPen size={24} className="text-gray-700" />
        <span className="text-xs text-gray-700 mt-1 font-medium">단어장 추가</span>
      </button>
    </div>
  );
}