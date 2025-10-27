import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLearningStore } from '../store/learningStore';
import Header from '../components/layout/Header';

// 임시 주간 출석 데이터 (나중에 API로 교체)
type WeeklyAttendance = {
  day: string;
  attended: boolean;
}[];

const Home: React.FC = () => {
    const { fetchUserQuestProgress, userQuestProgress, isLoading, fetchQuestList, questList, activeQuestId } = useLearningStore();

    // 임시 주간 출석 데이터 (API 연동 시 교체 예정)
    const [weeklyAttendance] = useState<WeeklyAttendance>([
      { day: '월', attended: true },
      { day: '화', attended: true },
      { day: '수', attended: false },
      { day: '목', attended: false },
      { day: '금', attended: false },
      { day: '토', attended: false },
      { day: '일', attended: false },
    ]);

    // 임시 식물 레벨 (나중에 유저 데이터로 교체)
    const [plantLevel] = useState(1);
    const [plantImage] = useState('/images/seed.png');

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
        <div className="flex flex-col min-h-screen max-w-lg mx-auto font-sans bg-white">
            {/* Header with Navigation */}
            <Header />

            <div className="flex-grow px-4 py-6">
                {/* 성장 시스템 섹션 */}
                <section className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-6 mb-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-blue-600 mb-2">성장 시스템</h2>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">현재 레벨</p>
                            <p className="text-3xl font-bold text-gray-900">{plantLevel}</p>
                        </div>
                        <div className="w-32 h-32 flex items-center justify-center">
                            <img
                                src={plantImage}
                                alt={`Level ${plantLevel} plant`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        문제를 맞춰 식물을 성장시켜보세요!
                    </p>
                </section>

                {/* 이번 주 출석 체크 섹션 */}
                <section className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-gray-900">이번주 출석 체크</h2>
                        <button className="text-gray-400 text-xs flex items-center">
                            전체보기
                            <ChevronRight size={14} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {weeklyAttendance.map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-xs text-gray-500 mb-2">{item.day}</span>
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <img
                                        src={item.attended ? '/images/attempt_date_drop.png' : '/images/attempt_date_drop_default.png'}
                                        alt={item.attended ? '출석완료' : '미출석'}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 학습 퀘스트 섹션 */}
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">학습 단계</h3>
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
                        {isLoading ? (
                            <div className="text-gray-500">로딩 중...</div>
                        ) : Array.isArray(userQuestProgress) && userQuestProgress.length > 0 ? (
                            userQuestProgress.map((quest) => {
                                // 퀘스트 상태 결정
                                const isCompleted = quest.isCompleted;
                                const isActive = quest.questId === activeQuestId;
                                const isLocked = !isCompleted && !isActive;

                                // 공통 컨텐츠
                                const questContent = (
                                    <>
                                        {/* 진행 상태 */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-sm font-semibold ${isLocked ? 'text-gray-400' : ''}`}>
                                                {quest.correctCount}/{quest.totalCount}
                                            </span>
                                            {isCompleted && (
                                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                                    완료
                                                </span>
                                            )}
                                        </div>

                                        {/* 퀘스트 제목 */}
                                        <h4 className={`text-xl font-bold mb-3 ${isLocked ? 'text-gray-400' : ''}`}>
                                            {quest.title}
                                        </h4>

                                        {/* 태그 */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {quest.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        isLocked
                                                            ? 'bg-gray-200 text-gray-400'
                                                            : isActive
                                                            ? 'bg-blue-600 text-white'
                                                            : quest.isStarted
                                                            ? 'bg-blue-200 text-blue-800'
                                                            : 'bg-gray-200 text-gray-600'
                                                    }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                );

                                // 잠긴 퀘스트는 div로, 활성/완료 퀘스트는 Link로 렌더링
                                if (isLocked) {
                                    return (
                                        <div
                                            key={quest.questId}
                                            className="flex-shrink-0 w-64 snap-center block rounded-2xl p-6 shadow-md transition-all relative cursor-not-allowed bg-gray-100 text-gray-400"
                                        >
                                            {questContent}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={quest.questId}
                                        to={`/learning/intro/${quest.questId}`}
                                        className={`flex-shrink-0 w-64 snap-center block rounded-2xl p-6 shadow-md transition-all relative ${
                                            isActive
                                                ? 'bg-blue-500 text-white'
                                                : quest.isStarted
                                                ? 'bg-blue-50 text-blue-900'
                                                : 'bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {questContent}
                                    </Link>
                                );
                            })
                        ) : Array.isArray(questList) && questList.length > 0 ? (
                            questList.map((quest) => (
                                <Link
                                    to={`/learning/intro/${quest.questId}`}
                                    key={quest.questId}
                                    className="flex-shrink-0 w-64 snap-center block bg-gray-50 rounded-2xl p-6 shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-600">
                                            0/{quest.questItemCount}
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-bold mb-3 text-gray-900">
                                        {quest.title}
                                    </h4>

                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
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
        </div>
    );
};

export default Home;