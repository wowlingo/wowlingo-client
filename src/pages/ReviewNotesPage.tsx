import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import ReviewCard from '../components/review-notes/ReviewCard';
import { useReviewStore } from '../store/ReviewStore';


const ReviewNotesPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { hashtags, isLoading, error, questItemUnits, fetchHashtags, fetchQuestItemUnits } = useReviewStore();

    useEffect(() => {
        fetchHashtags();
        fetchQuestItemUnits();
    }, [fetchHashtags, fetchQuestItemUnits]);

    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    const handleClick = (tagId: number) => {
        let newSelected;
        if (selectedTags.includes(tagId)) {
            newSelected = selectedTags.filter(id => id !== tagId); // 클릭 시 해제
        } else {
            newSelected = [...selectedTags, tagId]; // 추가 선택
        }
        setSelectedTags(newSelected);
        fetchQuestItemUnits(newSelected, currentDate, 'latest');
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const handleDateChange = (offset: number) => {
        // setCurrentDate(prevDate => {
        //     const newDate = new Date(prevDate);
        //     newDate.setDate(newDate.getDate() + offset);
        //     return newDate;
        // });
        // const newDate = currentDate.setDate(currentDate.getDate() + offset); 
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + offset);
        console.log(newDate);

        setCurrentDate(newDate);
        fetchQuestItemUnits(selectedTags, newDate, 'latest');
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

                {/* <div className="flex items-center space-x-2 mb-5">
                    <h2 className="font-semibold">틀린 문제 {mockProblems.length}개</h2>
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
                        #환경음
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
                        #말소리
                    </button>
                </div> */}
                <div className="flex items-center mb-5 overflow-hidden">
                    <button className="flex items-center text-sm font-medium flex-shrink-0 mr-2">
                        최신순 <ChevronDown size={16} className="ml-1" />
                    </button>
                    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                        {/* {isLoading && <p>태그 로딩 중...</p>} */}
                        {/* {error && <p>오류: {error}</p>} */}

                        {!isLoading && !error && hashtags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.hashtagId);
                            return (
                                <button key={tag.hashtagId}
                                    className={`px-3 py-1 text-sm rounded-full flex-shrink-0
                                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                    `}
                                    onClick={() => handleClick(tag.hashtagId)}>
                                    #{tag.name}
                                </button>
                            )
                        })
                        }
                    </div>
                </div>

                {/* 오답 문제 리스트 */}
                <div className="space-y-3">
                    {questItemUnits.map(item => (
                        <ReviewCard
                            key={item.questItemUnitId}
                            word={item.str}
                            description='학습 타이틀명'
                            urlNormal={item.urlNormal}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewNotesPage;