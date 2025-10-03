import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react'; // 아이콘 라이브러리 예시
import { useLearningStore } from '../store/learningStore';

const Home: React.FC = () => {
    const { fetchCourseData, courseData, totalCourseCount, currentCourseId, isLoading } = useLearningStore();

    useEffect(() => {
        fetchCourseData(); // Quest ID 1로 데이터 요청
    }, [fetchCourseData]);

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
                    ) : (
                        Array.from({ length: totalCourseCount }, (_, i) => i).map((idx) => (
                            <Link to={`/learning/intro`} key={idx} className="flex-shrink-0 w-2xs snap-center block bg-sky-500/60 rounded-2xl p-6 relative overflow-hidden shadow-md">

                                <div className="text-3xl font-bold text-gray-900 mb-12">{courseData[idx].doneQuestCount}/{courseData[idx].totalQuestCount}</div>
                                <div className="text-4xl font-extrabold text-gray-900 mb-4">{courseData[idx].title}</div>
                                <span className="flex items-center mb-4">
                                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs mr-2">#{courseData[idx].objective}</span>
                                </span>
                                <div className="flex space-x-2">
                                    <span className="text-3xl text-gray-400 opacity-50">⚪</span>
                                    <span className="text-3xl text-gray-400 opacity-50">⚪</span>
                                    <span className="text-3xl text-gray-400 opacity-50">⚪</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;