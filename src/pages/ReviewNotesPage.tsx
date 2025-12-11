import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReviewStore } from '../store/ReviewStore';
import { ReviewCard } from '../components/ui/ReviewCard';
import { useVocabularyStore } from '@/store/VocabularyStore';
import ClarityTracker from '../hooks/useClarityTracking';


const ReviewNotesPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { hashtags, isLoading, error, reviewQuestItems, fetchHashtags, fetchQuestItemUnits } = useReviewStore();
    const { addVocabulary } = useVocabularyStore();

    useEffect(() => {
        ClarityTracker.reviewNotesOpened();

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
        fetchHashtags(newDate);
        fetchQuestItemUnits(selectedTags, newDate, 'latest');
    };

    return (
        <div className=" h-full w-full">
            <div className="">
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="p-2 text-gray-600 hover:text-black"
                        onClick={() => handleDateChange(-1)}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <span className="text-xl">
                        {formatDate(currentDate)}
                    </span>

                    <button
                        className="p-2 text-gray-600 hover:text-black"
                        onClick={() => handleDateChange(1)}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <p className="text-[16px] text-gray-500">틀린 문제</p>
                            <p className="text-[16px] text-black">{reviewQuestItems?.length}</p>
                        </div>
                    </div>

                    <div className="flex items-center mb-5 overflow-hidden">
                        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                            {/* {isLoading && <p>태그 로딩 중...</p>} bg-[#DBEAFE]*/}
                            {/* {error && <p>오류: {error}</p>} */}

                            {!isLoading && !error && hashtags.map((tag) => {
                                const isSelected = selectedTags.includes(tag.hashtagId);
                                return (
                                    <button key={tag.hashtagId}
                                        className={`px-3 py-1 text-[14px] rounded-full flex-shrink-0
                                    ${isSelected ? 'bg-blue-100 text-blue-500 hover:bg-blue-200' : 'border border-gray-200 text-gray-500 hover:bg-gray-200'}
                                    `}
                                        onClick={() => handleClick(tag.hashtagId)}>
                                        #{tag.name}
                                    </button>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>

                {/* 오답 문제 리스트 */}
                {/* <div className="space-y-3">
                    {questItemUnits.map(item => (
                        <ReviewCard
                            key={item.questItemUnitId}
                            word={item.str}
                            description='학습 타이틀명'
                            urlNormal={item.urlNormal}
                        />
                    ))}
                </div> */}

                <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                    {reviewQuestItems.map(item => (
                        <ReviewCard
                            // title, questItemId, sounds, units, onAddVoca
                            id={item.questItemId}
                            key={item.questItemId}
                            questItemId={item.questItemId}
                            title={item.title}
                            sounds={item.sounds}
                            units={item.units}
                            onAddVoca={() => addVocabulary(item.questItemId)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewNotesPage;