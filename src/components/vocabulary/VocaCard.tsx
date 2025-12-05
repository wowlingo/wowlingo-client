import { Volume2, Turtle, Trash2 } from 'lucide-react';
import { playAudio } from '../common/AudioService';

interface VocaCardProps {
    word: string;
    urlNormal: string;
    urlSlow: string;
    savedDate: string;
}

const VocaCard = ({ word, savedDate, urlNormal, urlSlow }: VocaCardProps) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold">{word}</h3>
                <div className="flex items-center space-x-4 text-gray-700">
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black"
                        onClick={() => playAudio(urlNormal)}
                    >
                        <Volume2 size={22} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black"
                        onClick={() => playAudio(urlSlow)}
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