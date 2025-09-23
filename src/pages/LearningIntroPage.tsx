import { useNavigate } from 'react-router-dom';
import { useLearningStore } from '../store/learningStore';
import IntroHeader from '../components/intro/IntroHeader';
import { useEffect, useState } from 'react'; // useState 추가

export default function PracticeIntroPage() {
  const navigate = useNavigate();
  const { reset, startLearning, fetchQuestData, isLoading } = useLearningStore();
  const [isFetching, setIsFetching] = useState(false); // 로딩 상태 추가

  const handleStart = async () => {
    setIsFetching(true); // 로딩 시작
    reset();           // 이전 학습 기록 초기화
    startLearning();   // 학습 시작 시간 기록

    // 퀘스트 ID를 1로 가정하고 데이터를 미리 불러옵니다.
    // 실제 앱에서는 introData에서 questId를 가져오거나, 사용자가 선택하도록 할 수 있습니다.
    await fetchQuestData(1);
    setIsFetching(false); // 로딩 종료
    navigate('/learning/1'); // 첫 번째 문제로 이동
  };

  // 실제 앱에서는 이 데이터를 외부(예: API)에서 받아옵니다.
  const introData = {
    groupName: '듣기 연습 2',
    title: '2.1 평서문/의문문 억양 변별',
    imageUrl: 'https://picsum.photos/200/300',
    hashtags: ['#듣기연습2'],
    description: (
      <>
       다음 문장을 듣고, <strong>평서문</strong>과 <strong>의문문</strong> 중 {"\n"}
       맞는 보기를 고르세요.
       {"\n"}{"\n"}
       정답을 맞추고 우측 상단의 보상을 얻어 {"\n"}케이크를 완성해주세요.
      </>
    ),
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans">
      {/* 1. 헤더 (이전 버튼, 문제 그룹 이름) */}
      <IntroHeader groupName={introData.groupName} />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        {/* 2. 타이틀 */}
        <h2 className="text-3xl font-bold mb-4">{introData.title}</h2>

        {/* 3. 이미지 */}
        <div className="w-full max-w-sm aspect-video rounded-lg shadow-md mb-6 overflow-hidden">
          <img
            src={introData.imageUrl}
            alt={introData.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 4. #해시태그 안내 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {introData.hashtags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold">
              {tag}
            </span>
          ))}
        </div>

        {/* 5. 문제 설명서 */}
        <p className="text-gray-600 whitespace-pre-line">
          {introData.description}
        </p>
      </main>

      {/* 6. 'START' 버튼 */}
      <div className="mt-auto py-4">
        <button
          onClick={handleStart}
          disabled={isFetching || isLoading} // 로딩 중일 때 버튼 비활성화
          className="w-full bg-blue-500 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
        >
          {isFetching ? '로딩 중...' : 'START'}
        </button>
      </div>
    </div>
  );
}