// src/pages/VocabularyPage.tsx
import { Play, ChevronDown } from 'lucide-react';
import VocaCard from '../components/vocabulary/VocaCard';

// 실제 데이터는 API를 통해 가져옵니다.
const mockWords = [
    { id: 1, word: '목도리', savedDate: '2025.10.03', featured: true },
    { id: 2, word: '목도리', savedDate: '2025.10.03', featured: false },
    // ... more words
];
const filterTags = ['#환경음', '#말소리', '#환경음', '#말소리', '#음절', '#단어'];

const VocabularyPage = () => {
    return (
        <div className="h-full w-full">
            <div className="p-4 flex flex-col h-full">
                {/* 전체 개수 및 전체 듣기 */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800">전체 111</h2>
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
                        {filterTags.map((tag, index) => (
                            <button key={index} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 flex-shrink-0">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 단어 리스트 */}
                <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                    {mockWords.map(item => (
                        <VocaCard key={item.id} word={item.word} savedDate={item.savedDate} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VocabularyPage;