import { RefreshCw, Volume2, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import { playAudio, playLoopAudio, stopAudio } from '../common/AudioService';

interface ReviewCardProps {
    word: string;
    description?: string;
    urlNormal: string;
}

const ReviewCard = ({ word, description, urlNormal }: ReviewCardProps) => {
    const [isLooping, setIsLooping] = useState(false);

    // 컴포넌트가 언마운트될 때 오디오를 정지
    useEffect(() => {
        return () => {
            if (isLooping) {
                stopAudio();
            }
        };
    }, [isLooping]);

    const handleLoopingClick = () => {
        // 같은 URL이면 정지, 다른 URL이면 이전 것 정지 후 새로 재생
        playLoopAudio(urlNormal);

        setIsLooping(prev => !prev);
    };

    const handleSinglePlayClick = () => {
        if (isLooping) {
            setIsLooping(false);
        }
        // 기존 오디오 정지, 새롭게 재생.
        playAudio(urlNormal);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex flex-col text-left">
                <h3 className="text-xl font-bold">{word}</h3>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-black" onClick={handleLoopingClick}>
                    {isLooping ? <Pause size={26} /> : <RefreshCw size={26} />}
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black"
                    onClick={handleSinglePlayClick}
                >
                    <Volume2 size={22} />
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;