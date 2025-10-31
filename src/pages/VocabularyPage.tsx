// src/pages/VocabularyPage.tsx
import { Play, ChevronDown } from 'lucide-react';
import VocaCard from '../components/vocabulary/VocaCard';
import { useEffect, useState } from 'react';
import { useVocabularyStore } from '../store/VocabularyStore';
import { SortDropdown, SortOptionKey } from '../components/ui/SortDropdown';
import { WordCard } from '../components/ui/WordCard';




const VocabularyPage = () => {
    const { hashtags, isLoading, error, vocabulary, fetchHashtags, fetchVocabulary } = useVocabularyStore();

    const [sortBy, setSortBy] = useState<SortOptionKey>('newest'); // 타입 변경
    // const [filterTags, setFilterTags] = useState<string[]>([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHashtags();
        fetchVocabulary();
    }, [fetchHashtags, fetchVocabulary]);

    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    const handleClick = (tagId: number) => {
        let newSelected;
        if (selectedTags.includes(tagId)) {
            newSelected = selectedTags.filter(id => id !== tagId); // 클릭 시 해제
        } else {
            newSelected = [...selectedTags, tagId]; // 추가 선택
        }
        setSelectedTags(newSelected);
        fetchVocabulary(newSelected, 'latest');
    };

    return (
        <div className="h-full w-full">
            <div className="p-4 flex flex-col h-full">
                {/* 전체 개수 및 전체 듣기 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <p className="text-[16px] text-gray-500">전체</p>
                        <p className="text-[16px] text-black">{vocabulary.length}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* 분리된 SortDropdown 컴포넌트 사용 */}
                        <SortDropdown selected={sortBy} onSelect={setSortBy} />
                    </div>
                </div>

                {/* 정렬 및 필터 */}
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

                {/* 단어 리스트 */}
                <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                    {vocabulary.map(item => (
                        // <VocaCard
                        //     key={item.vocabId}
                        //     word={item.str}
                        //     savedDate={item.createdAtKST}
                        //     urlNormal={item.urlNormal}
                        //     urlSlow={item.slowNormal}
                        // />
                        <WordCard 
                            key={item.vocabId} 
                            quest='소리의 감지' 
                            unit={item.str} 
                            urlNormal={item.urlNormal}
                            urlSlow={item.slowNormal}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VocabularyPage;