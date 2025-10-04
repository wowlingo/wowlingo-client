import { RefreshCw, Volume2 } from 'lucide-react';

interface ReviewCardProps {
    word: string;
    description?: string;
}

const ReviewCard = ({ word, description }: ReviewCardProps) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex flex-col text-left">
                <h3 className="text-xl font-bold">{word}</h3>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-black">
                    <RefreshCw size={26} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-black">
                    <Volume2 size={22} />
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;