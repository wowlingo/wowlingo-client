import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';

interface IntroHeaderProps {
  groupName: string;
  buttonType?: 'back' | 'close'; // 'back'은 뒤로가기, 'close'는 X 버튼
  onClose?: () => void; // close 버튼 클릭 시 커스텀 핸들러
}

export default function IntroHeader({ groupName, buttonType = 'back', onClose }: IntroHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로
  };

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/'); // 기본 close 동작: 홈으로 이동
    }
  };

  return (
    <header className="flex justify-between items-center py-4">
      {/* 왼쪽 뒤로가기 버튼 */}
      {buttonType === 'back' ? (
        <button
          onClick={handleBackClick}
          aria-label="Go back"
          className="p-2"
        >
          <ChevronLeft size={28} />
        </button>
      ) : (
        <div className="w-10"></div>
      )}

      {/* 가운데 타이틀 */}
      <h1 className="text-lg font-bold text-gray-900 text-center flex-1">{groupName}</h1>

      {/* 우측 닫기 버튼 */}
      {buttonType === 'close' ? (
        <button
          onClick={handleCloseClick}
          aria-label="Close"
          className="p-2"
        >
          <X size={28} />
        </button>
      ) : (
        <div className="w-10"></div>
      )}
    </header>
  );
}