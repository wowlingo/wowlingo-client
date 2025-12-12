// src/pages/VocabularyPage.tsx
import { useEffect, useState } from 'react';
import { useVocabularyStore } from '../store/VocabularyStore';
import { SortDropdown, SortOptionKey } from '../components/ui/SortDropdown';
import { WordCard } from '../components/ui/WordCard';
import { useAuth } from '../components/common/AuthContext';

const VocabularyPage = () => {
    const { user } = useAuth();
    if (!user) {
        return null;
    }

    const { hashtags, isLoading, error, vocabulary, fetchHashtags, fetchVocabulary, deleteVocabulary } = useVocabularyStore();

    const [sortBy, setSortBy] = useState<SortOptionKey>('latest');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    useEffect(() => {
        fetchHashtags();
        fetchVocabulary(user.userId, selectedTags, sortBy);
    }, [fetchHashtags, fetchVocabulary]);

    const handleClick = (tagId: number) => {
        let newSelected;
        if (selectedTags.includes(tagId)) {
            newSelected = selectedTags.filter(id => id !== tagId); // 클릭 시 해제
        } else {
            newSelected = [...selectedTags, tagId]; // 추가 선택
        }
        setSelectedTags(newSelected);
        fetchVocabulary(user.userId, newSelected, sortBy);
    };

    const handleSortChange = (newSort: SortOptionKey) => {
        setSortBy(newSort);
        fetchVocabulary(user.userId, selectedTags, newSort);
    };


    return (
        <div className="h-full w-full">
            <div className="flex flex-col h-full">
                {/* 전체 개수 및 전체 듣기 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <p className="text-[16px] text-gray-500">전체</p>
                        <p className="text-[16px] text-black">{vocabulary.length}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* 분리된 SortDropdown 컴포넌트 사용 */}
                        <SortDropdown selected={sortBy} onSelect={handleSortChange} />
                    </div>
                </div>

                {/* 정렬 및 필터 */}
                <div className="flex items-center mb-5 overflow-hidden">
                    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">

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
                        <WordCard
                            key={item.vocabId}
                            id={item.vocabId}
                            unit={item.str}
                            urlNormal={item.urlNormal}
                            urlSlow={item.slowNormal}
                            onDeleteVoca={() => deleteVocabulary(item.vocabId)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VocabularyPage;