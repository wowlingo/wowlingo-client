import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react'; // 아이콘 라이브러리 예시
import { useLearningStore } from '../store/learningStore';

const Home: React.FC = () => {
    const { fetchUserQuestProgress, userQuestProgress, isLoading, fetchQuestList, questList, activeQuestId } = useLearningStore();

    useEffect(() => {
        console.log('Home useEffect - fetchUserQuestProgress called');
        fetchUserQuestProgress(1); // 사용자 ID 1의 퀘스트 진행 상태 요청
        
        // API가 아직 구현되지 않은 경우를 위한 fallback
        if (questList.length === 0) {
            fetchQuestList();
        }
    }, [fetchUserQuestProgress, fetchQuestList, questList.length]);

    // 페이지 포커스 및 학습 완료 시 진행 상태 새로고침
    useEffect(() => {
        const handleFocus = () => {
            fetchUserQuestProgress(1);
        };

        const handleLearningCompleted = () => {
            fetchUserQuestProgress(1);
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('learningCompleted', handleLearningCompleted);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('learningCompleted', handleLearningCompleted);
        };
    }, [fetchUserQuestProgress]);


    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans">
            {/* 오늘 진행사항 섹션 */}
            <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <div className="flex items-center text-sm font-semibold text-orange-500 mb-2">
                    오늘 진행사항
                </div>
                <div className="flex items-baseline mb-4">
                    <h2 className="text-4xl font-extrabold text-gray-900 mr-2">정답률 NN%</h2>
                    <span className="text-green-500 text-sm font-medium">어제보다 8% 올랐어요!</span>
                </div>
                {/* 1-2 비디오/이미지 영역 */}
                <div className="bg-black w-full h-40 rounded-lg mb-6 flex items-center justify-center text-white">
                    <span className="text-gray-400 text-lg">1-2 Video/Image Area</span>
                </div>

                {/* 이번 주 진행사항 섹션 */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm font-semibold text-gray-700">
                            이번주 진행사항을 보여드려요!
                        </div>
                        <Link to="/weekly-progress" className="flex items-center text-gray-500 text-sm font-medium">
                            전체보기
                            <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* 요일별 아이콘 (예시) */}
                        <div className="flex flex-col items-center justify-center p-2 bg-purple-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">월</span>
                            <span className="text-3xl">😈</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-red-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">화</span>
                            <span className="text-3xl">😡</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-green-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">수</span>
                            <span className="text-3xl">😌</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-blue-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">목</span>
                            <span className="text-3xl">😢</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-orange-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">금</span>
                            <span className="text-3xl">🤩</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">토</span>
                            <span className="text-3xl"></span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded-lg">
                            <span className="text-xs text-gray-600 mb-1">일</span>
                            <span className="text-3xl"></span>
                        </div>
                    </div>
                </div>

                {/* 오답노트 진행 및 스탬프 섹션 */}
                <div className="bg-gray-800 text-white p-4 rounded-xl flex items-center justify-between">
                    <span className="font-semibold">오답노트 진행하고 머..스탬프 바꾸기..?</span>
                </div>
            </section>

            {/* 게임 STAGE 섹션 */}
            <section>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-4">게임 STAGE</h3>
                <div className="scrollbar-hide flex overflow-x-auto snap-x snap-mandatory gap-4">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : Array.isArray(userQuestProgress) && userQuestProgress.length > 0 ? (
                        userQuestProgress.map((quest) => (
                            <Link 
                                to={`/learning/intro/${quest.questId}`} 
                                key={quest.questId} 
                                className={`flex-shrink-0 w-2xs snap-center block rounded-2xl p-6 relative overflow-hidden shadow-md ${
                                    quest.questId === activeQuestId
                                        ? 'bg-black text-white' 
                                        : quest.isStarted 
                                            ? 'bg-blue-50 text-blue-800' 
                                            : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {/* 진행 상태 표시 */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm font-semibold">
                                        {quest.correctCount}/{quest.totalCount}
                                    </div>
                                </div>
                                
                                {/* 퀘스트 제목 */}
                                <div className={`text-2xl font-extrabold mb-4 ${
                                    quest.questId === activeQuestId ? 'text-white' : quest.isStarted ? 'text-blue-800' : 'text-gray-800'
                                }`}>
                                    {quest.title}
                                </div>
                                
                                {/* 태그 */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {quest.tags.map((tag, index) => (
                                        <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                                            quest.questId === activeQuestId 
                                                ? 'bg-gray-700 text-gray-300' 
                                                : quest.isStarted
                                                    ? 'bg-blue-200 text-blue-700'
                                                    : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* 정답률 및 진행률 표시 */}
                                {quest.isStarted && (
                                    <div className={`text-xs ${
                                        quest.questId === activeQuestId ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        정답률: {quest.accuracyRate}% | 진행률: {quest.progressRate}%
                                    </div>
                                )}
                            </Link>
                        ))
                    ) : Array.isArray(questList) && questList.length > 0 ? (
                        // API가 구현되지 않은 경우 기존 questList 사용
                        questList.map((quest) => (
                            <Link 
                                to={`/learning/intro/${quest.questId}`} 
                                key={quest.questId} 
                                className="flex-shrink-0 w-2xs snap-center block bg-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-md"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm font-semibold text-gray-600">
                                        0/{quest.questItemCount}
                                    </div>
                                </div>
                                
                                <div className="text-2xl font-extrabold mb-4 text-gray-800">
                                    {quest.title}
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mb-4">
                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                        #{quest.type}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-gray-500">퀘스트 데이터를 불러올 수 없습니다.</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;