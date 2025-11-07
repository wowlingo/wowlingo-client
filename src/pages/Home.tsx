import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLearningStore } from '../store/learningStore';
import Header from '../components/layout/Header';
import { useNavigate } from "react-router-dom";

// 임시 주간 출석 데이터 (나중에 API로 교체)
type WeeklyAttendance = {
    day: string;
    attended: boolean;
}[];

// 임시 퀘스트 타입 (API 연동 시 교체 예정)
interface Quest {
    questId: number;
    title: string;
    description: string;
    type: string;
    tags: string[];
    questItemCount: number;
    correctCount: number;
    totalCount: number;
    isCompleted: boolean;
    isStarted: boolean;
}

type LearningItemProps = {
    tags: string[];
    title: string;
    progress: number;
    total: number;
    isEnable: boolean;
}

// 학습 단계 항목별 태그 컴포넌트
const Tag = ({ text }: { text: string }) => (
    <span className="px-3 py-1 bg-blue-100 text-blue-500 text-[12px] rounded-full font-medium">
        {text}
    </span>
)

// 학습 단계 항목별 진행도 컴포넌트
const ProgressIcon = ({ progress, total }: { progress: number; total: number }) => {
    const isComplete = true;//progress === total && total > 0;
    const inProgress = false;//progress > 0 && progress < total;

    if (isComplete) {
        return (
            <div className="flex items-center gap-1">
                <img src="/images/ic_learning_waterdrop.png" alt="progress" className="w-5 h-5" />
                <span className="font-semibold text-[14px] text-blue-500">{progress}</span>
                <span className="font-semibold text-[14px] text-gray-400">/ {total}</span>
            </div>
        )
    }

    if (inProgress) {
        return (
            <div className="flex items-center gap-1">
                <img src="/images/ic_learning_waterdrop.png" alt="progress" className="w-5 h-5" />
                <span className="font-semibold text-[14px] text-blue-500">{progress}</span>
                <span className="font-semibold text-[14px] text-gray-400">/ {total}</span>
            </div>
        )
    }

    // Not started (0 / 70)
    return (
        <div className="flex items-center gap-1">
            <img src="/images/ic_learning_waterdrop_gray.png" alt="not-started" className="w-5 h-5" />
            <span className="font-semibold text-[14px] text-gray-400">{progress} / {total}</span>
        </div>
    )
}

const CompleteTag = () => (
    <div className="flex items-center gap-1.5 bg-blue-500 text-white text-[12px] font-semibold px-2 py-1 rounded-[4px] select-none">
        <img
            src="/images/ic_learning_confetti.png"
            alt="완료"
            className="w-[16px] h-[16px]"
        />
        완료
    </div>
);

const LearningItem = ({ tags, title, progress, total, isEnable }: LearningItemProps) => {
    const bgColor = isEnable ? "bg-white" : "bg-gray-200";
    const textColor = isEnable ? "text-gray-800" : "text-gray-400";
    const isComplete = progress === total && total > 0;
    const completeTag = isComplete ? <CompleteTag /> : "";

    return (
        <div className={`p-4 rounded-[16px] border border-gray-200 mb-4 ${bgColor}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                    ))}
                </div>
                <ProgressIcon progress={progress} total={total} />
            </div>
            <div className="flex items-center justify-between">
            <h3 className={`text-[16px] font-semibold ${textColor}`}>{title}</h3>
                {completeTag}
            </div>
        </div>
    );
};


const Home: React.FC = () => {
    const { fetchUserQuestProgress, userQuestProgress, isLoading, fetchQuestList, questList, activeQuestId } = useLearningStore();
    const navigate = useNavigate();

    // 임시 주간 출석 데이터 (API 연동 시 교체 예정)
    const [weeklyAttendance] = useState<WeeklyAttendance>([
        { day: '월', attended: true },
        { day: '화', attended: true },
        { day: '수', attended: true },
        { day: '목', attended: false },
        { day: '금', attended: false },
        { day: '토', attended: false },
        { day: '일', attended: true }, // Added '일' as attended to match the image
    ]);

    // 임시 식물 레벨 (나중에 유저 데이터로 교체)
    const [plantLevel] = useState(3); // Changed to level 3 to match the image
    const [plantImage] = useState('/images/tree.png'); // Placeholder image for level 3 plant

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


    const handleStartLearning = () => {
        navigate(`/learning/intro/1`);
    };

    return (
        <div className="flex flex-col min-h-screen max-w-lg mx-auto font-sans"
            style={{ background: 'linear-gradient(180deg, #DBEEFD 0%, #FFFFFF 60.00%)' }}>
            {/* Header with Navigation */}
            <Header bgColor="bg-[#DBEEFD]" />

            <div className="flex-grow px-3">
                {/* 성장 시스템 섹션 */}
                <section className="rounded-3xl p-6 relative">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <h2 className="text-[20px] font-bold text-gray-900 mr-2">성장의 나무</h2>
                            <span className="bg-[#615FFF] text-white text-[14px] font-semibold px-3 py-1 rounded-full">
                                LV.{plantLevel}
                            </span>
                        </div>
                        <button className="p-2 rounded-full bg-transparent">
                            <img src="/images/ic_co_book.png" alt="Bookmark" className="w-[24px] h-[24px]" />
                        </button>
                    </div>

                    <div className="absolute top-[80px] right-[40px] bg-white rounded-xl px-[10px] py-[8px] text-[14px] text-gray-600">
                        <div>
                            레벨 업까지 <span className="text-blue-600 font-bold">3문제!</span>
                        </div>
                        {/* 꼬리 */}
                        <div className="absolute top-[25px] right-[90px] w-3 h-5 bg-white rotate-60"></div>
                    </div>

                    <div className="w-[300px] h-[300px] mx-auto relative flex items-center justify-center mt-12">
                        {/* 동심원 배경 */}
                        <img
                            src="/images/bg-home.png" // ← 첨부한 배경 이미지 이름 (원하는 경로에 저장)
                            alt="circle background"
                            className="absolute inset-0 w-full h-full object-contain opacity-90"
                        />

                        {/* 나무 이미지 */}
                        <img
                            src={plantImage}
                            alt={`Level ${plantLevel} plant`}
                            className="relative w-[250px] h-[250px] object-contain z-10"
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <img src="/images/group_152.png" alt="Level Progress" className="w-[240px] h-[28px]" />
                    </div>
                </section>


                {/* 이번 주 출석 체크 섹션 */}
                <section className="bg-white rounded-[16px] p-6 mb-6 shadow-sm border border-gray-100">
                    <h2 className="text-[16px] font-semibold text-gray-800 mb-4">이번주 학습현황</h2>
                    <div className="grid grid-cols-7 gap-1">
                        {weeklyAttendance.map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-[14px] text-gray-500 mb-2">{item.day}</span>
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <img
                                        src={item.attended ? '/images/attempt_date_drop.png' : '/images/attempt_date_drop_default.png'}
                                        alt={item.attended ? '출석완료' : '미출석'}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-4 bg-blue-500 text-white text-[16px] font-bold rounded-[999px] shadow-md"
                        onClick={handleStartLearning}>
                        학습 시작
                    </button>
                </section>

                <section className="p-4">
                    <h2 className="text-[20px] font-semibold text-gray-800 mb-3 px-1">학습 단계</h2>
                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="text-gray-500">로딩 중...</div>
                        ) : Array.isArray(userQuestProgress) && userQuestProgress.length > 0 ? (
                            userQuestProgress.map((quest) => {
                                const isCompleted = quest.isCompleted;
                                const isActive = quest.questId === activeQuestId;
                                const isLocked = false;//!isCompleted && !isActive;

                                if (isLocked) {
                                    return (
                                        <div
                                            key={quest.questId}
                                        >
                                            <LearningItem
                                                key={quest.questId}
                                                tags={quest.tags}
                                                title={quest.title}
                                                progress={0}
                                                total={quest.totalCount}
                                                isEnable={false}
                                            />
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={quest.questId}
                                        to={`/learning/intro/${quest.questId}`}
                                    >
                                        <LearningItem
                                            key={quest.questId}
                                            tags={quest.tags}
                                            title={quest.title}
                                            progress={quest.correctCount}
                                            total={quest.totalCount}
                                            isEnable={true}
                                        />
                                    </Link>
                                );
                            })
                        ) : Array.isArray(questList) && questList.length > 0 ? (
                            questList.map((quest) => {
                                return (
                                    <Link
                                        key={quest.questId}
                                        to={`/learning/intro/${quest.questId}`}
                                        className="flex-shrink-0 w-64 snap-center block rounded-2xl p-6 shadow-md transition-all relative bg-gray-50 text-gray-700"
                                    >
                                        <LearningItem
                                            key={quest.questId}
                                            tags={[]}
                                            title={quest.title}
                                            progress={0}
                                            total={quest.questItemCount}
                                            isEnable={true}
                                        />
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="text-gray-500">퀘스트 데이터를 불러올 수 없습니다.</div>
                        )}
                    </div>
                </section>

                {/* <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">학습 단계</h3>
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
                        {isLoading ? (
                            <div className="text-gray-500">로딩 중...</div>
                        ) : Array.isArray(userQuestProgress) && userQuestProgress.length > 0 ? (
                            userQuestProgress.map((quest) => {
                                // 퀘스트 상태 결정
                                const isCompleted = quest.isCompleted;
                                const isActive = quest.questId === activeQuestId;
                                const isLocked = false;//!isCompleted && !isActive;

                                // 공통 컨텐츠
                                const questContent = (
                                    <>
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

                                        <h4 className={`text-xl font-bold mb-3 ${isLocked ? 'text-gray-400' : ''}`}>
                                            {quest.title}
                                        </h4>

                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {quest.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${isLocked
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
                                        className={`flex-shrink-0 w-64 snap-center block rounded-2xl p-6 shadow-md transition-all relative ${isActive
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
                </section> */}
            </div>
        </div>
    );
};

export default Home;