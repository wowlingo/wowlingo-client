import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react'; // 뒤로가기 아이콘

interface IntroHeaderProps {
  groupName: string;
}

export default function IntroHeader({ groupName }: IntroHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-4">
      <button
        onClick={() => navigate(-1)} // 이전 페이지로 이동
        aria-label="Go back"
        className="p-2"
      >
        <ChevronLeft size={28} />
      </button>
      <h1 className="text-lg font-bold">{groupName}</h1>
      <div className="w-10"></div> {/* 제목을 중앙에 맞추기 위한 빈 공간 */}
    </header>
  );
}