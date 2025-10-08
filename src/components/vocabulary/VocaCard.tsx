import { Volume2, Turtle, Trash2 } from 'lucide-react';

interface VocaCardProps {
    word: string;
    urlNormal: string;
    urlSlow: string;
    savedDate: string;
}

// const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

// const handlePlaySound = (audioUrl: string) => {
//     if (audio) {
//         audio.pause();
//         audio.currentTime = 0;
//     }
//     const newAudio = new Audio(audioUrl);
//     setAudio(newAudio);
//     newAudio.play().catch(e => console.error(e));
// };

let currentAudio: HTMLAudioElement | null = null;

const handlePlaySound = (audioUrl: string) => {
    // 이전 오디오가 재생 중이면 정지
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // 새로운 오디오 생성
    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(e => console.error("오디오 재생 오류:", e));
};


const VocaCard = ({ word, savedDate, urlNormal, urlSlow }: VocaCardProps) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold">{word}</h3>
                <div className="flex items-center space-x-4 text-gray-700">
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black"
                        onClick={() => handlePlaySound(urlNormal)}
                    >
                        <Volume2 size={22} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black"
                        onClick={() => handlePlaySound(urlSlow)}
                    >
                        <Turtle size={22} />
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400">{savedDate} 저장</span>
                <button className="text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default VocaCard;