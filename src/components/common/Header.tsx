import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react'; // 아이콘 라이브러리 (선택사항)
// lucide-react 설치: npm install lucide-react

export default function Header() {
  const navigate = useNavigate();

  // '나가기' 버튼 클릭 시 홈('/')으로 이동하는 핸들러
  const handleExit = () => {
    // 학습을 중단할 것인지 확인하는 로직을 추가할 수 있습니다.
    // if (window.confirm('학습을 중단하고 나가시겠습니까?')) { ... }
    navigate('/');
  };

  return (
    <header className="flex justify-end items-center py-2">
      <button
        onClick={handleExit}
        aria-label="Exit learning session"
        className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors"
      >
        {/* 아이콘을 사용하면 더 직관적입니다 */}
        <X size={24} /> 
      </button>
    </header>
  );
}