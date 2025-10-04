import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from '../components/review-notes/ReviewCard';

const mockProblems = [
    { id: 1, word: '목도리', description: '길이가 다른 낱말 변별' },
    { id: 2, word: '목도리' },
    { id: 3, word: '목도리' },
    { id: 4, word: '목도리' },
];

const ReviewNotesPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const handleDateChange = (offset: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + offset);
            return newDate;
        });
    };

    return (
        <div className=" h-full w-full">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="p-2 text-gray-600 hover:text-black"
                        onClick={() => handleDateChange(-1)}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <span className="font-bold text-lg tabular-nums">
                        {formatDate(currentDate)}
                    </span>

                    <button
                        className="p-2 text-gray-600 hover:text-black"
                        onClick={() => handleDateChange(1)}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* 문제 요약 및 필터 */}
                <div className="flex items-center space-x-2 mb-5">
                    <h2 className="font-semibold">틀린 문제 {mockProblems.length}개</h2>
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
                        #환경음
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
                        #말소리
                    </button>
                </div>

                {/* 오답 문제 리스트 */}
                <div className="space-y-3">
                    {mockProblems.map(problem => (
                        <ReviewCard
                            key={problem.id}
                            word={problem.word}
                            description={problem.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewNotesPage;