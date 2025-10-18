import { RefreshCw, Volume2, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ReviewCardProps {
    word: string;
    description?: string;
    urlNormal: string;
}

let currentAudio: HTMLAudioElement | null = null;
let activeUrl: string | null = null;
let activeSetIsPlaying: ((isPlaying: boolean) => void) | null = null;

// const handlePlaySound = (audioUrl: string) => {
//     // 이전 오디오가 재생 중이면 정지
//     if (currentAudio) {
//         currentAudio.pause();
//         currentAudio.currentTime = 0;
//     }

//     // 새로운 오디오 생성
//     currentAudio = new Audio(audioUrl);
//     currentAudio.play().catch(e => console.error("오디오 재생 오류:", e));
// };

const stopCurrentAudio = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    if (activeSetIsPlaying) {
        activeSetIsPlaying(false);
        activeSetIsPlaying = null;
    }

    activeUrl = null;
}

const ReviewCard = ({ word, description, urlNormal }: ReviewCardProps) => {
    // const [isPlaying, setIsPlaying] = useState(false);
    // const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLooping, setIsLooping] = useState(false);

    useEffect(() => {
        // // const audio = new Audio(urlNormal);
        // // audio.loop = true; // 반복 재생.
        // // audioRef.current = audio;
        // const isActive = activeUrl === urlNormal && !currentAudio?.paused;
        // setIsPlaying(isActive);
        const isActive = activeUrl === urlNormal && !!currentAudio && !currentAudio.paused && currentAudio.loop;
        setIsLooping(isActive);

        return () => {
            // audio.pause();
            // audio.loop = false;
            if (activeUrl === urlNormal) {
                // currentAudio?.pause();
                // currentAudio = null;
                // activeUrl = null;
                // activeSetIsPlaying = null;
                stopCurrentAudio();
            }
        };
    }, [urlNormal]);

    // const handlePlayPause = () => {
    //     // const audio = audioRef.current;
    //     // if (!audio) return;

    //     if (currentAudio && activeUrl !== urlNormal) {
    //         currentAudio.pause();
    //         activeSetIsPlaying?.(false);
    //     }   

    //     if (isPlaying) {
    //         // audio.pause();
    //         currentAudio?.pause();
    //         setIsPlaying(false);
    //         activeUrl = null;
    //         activeSetIsPlaying = null;
    //     } else {
    //         // audio.currentTime = 0;
    //         // audio.play().catch(e => {
    //         //     setIsPlaying(false);
    //         // });
    //         if (activeUrl !== urlNormal) {
    //             currentAudio = new Audio(urlNormal);
    //             currentAudio.loop = true;
    //         }

    //         currentAudio!.play().catch(e => console.error("오디오 재생 오류:", e));

    //         activeUrl = urlNormal;
    //         activeSetIsPlaying = setIsPlaying; 
    //         setIsPlaying(true);
    //     }
    // };

    const handleLoopingPlayPause = () => {
        if (isLooping) {
            stopCurrentAudio();
        } else {
            stopCurrentAudio();
            currentAudio = new Audio(urlNormal);
            currentAudio.loop = true;
            currentAudio.play().catch(e => console.error("오디오 재생 오류:", e));

            activeUrl = urlNormal;
            activeSetIsPlaying = setIsLooping;
            setIsLooping(true);
        }
    };

    const handleSinglePlay = () => {
        stopCurrentAudio();

        currentAudio = new Audio(urlNormal);
        currentAudio.loop = false;
        currentAudio.play().catch(e => console.error("오디오 재생 오류:", e));

        activeUrl = urlNormal;

        currentAudio.onended = () => {
            if (activeUrl === urlNormal && !currentAudio?.loop) {
                stopCurrentAudio();
            }
        };
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex flex-col text-left">
                <h3 className="text-xl font-bold">{word}</h3>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-black" onClick={handleLoopingPlayPause}>
                    {isLooping ? <Pause size={26} /> : <RefreshCw size={26} />}
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black"
                    onClick={handleSinglePlay}
                >
                    <Volume2 size={22} />
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;