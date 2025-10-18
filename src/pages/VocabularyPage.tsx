// src/pages/VocabularyPage.tsx
import { Play, ChevronDown } from 'lucide-react';
import VocaCard from '../components/vocabulary/VocaCard';
import { useEffect, useState } from 'react';
import { useVocabularyStore } from '../store/VocabularyStore';


const VocabularyPage = () => {
    const { hashtags, isLoading, error, vocabulary, fetchHashtags, fetchVocabulary } = useVocabularyStore();
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
                    <h2 className="font-semibold text-gray-800">전체 {vocabulary.length}</h2>
                    <button className="flex text-gray-700 hover:text-black">
                        <Play size={24} />
                    </button>
                </div>

                {/* 정렬 및 필터 */}
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

                {/* 단어 리스트 */}
                <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                    {vocabulary.map(item => (
                        <VocaCard 
                            key={item.vocabId} 
                            word={item.str} 
                            savedDate={item.createdAtKST} 
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