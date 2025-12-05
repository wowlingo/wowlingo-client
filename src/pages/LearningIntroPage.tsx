import { useNavigate, useParams } from 'react-router-dom';
import { useLearningStore } from '../store/learningStore';
import IntroHeader from '../components/intro/IntroHeader';
import { useState, useEffect } from 'react';

// quest type에 따른 설명 매핑
const getDescriptionByType = (type: string): { description_a: React.ReactNode; description_b: React.ReactNode } => {
  switch (type) {
    case 'statement-question':
      return {
        description_a: (
          <>
            문장을 듣고, 평서문과 의문문 중{'\n'}
            맞는 보기를 고르세요.
          </>
        ),
        description_b: (
          <>
            문제를 맞춰 물방울을 모아보세요.{'\n'}
            70개를 모으면 열매를 수확할 수 있어요!
          </>
        )
      }
    case 'choice':
      return {
        description_a: (
          <>
            들려준 문장과{'\n'}
            일치하는 보기를 고르세요.
          </>
        ),
        description_b: (
          <>
            문제를 맞춰 물방울을 모아보세요.{'\n'}
            70개를 모으면 열매를 수확할 수 있어요!
          </>
        )
      }
    case 'same-different':
      return {
        description_a: (
          <>
            들려준 2개의 단어가{'\n'}
            일치하는 지 구분해 주세요.
          </>
        ),
        description_b: (
          <>
            문제를 맞춰 물방울을 모아보세요.{'\n'}
            70개를 모으면 열매를 수확할 수 있어요!
          </>
        )
      }
    default:
      return {
        description_a: (
          <>

          </>
        ),
        description_b: (
          <>
            문제를 맞춰 물방울을 모아보세요.{'\n'}
            70개를 모으면 열매를 수확할 수 있어요!
          </>
        )
      }
  }
};

// correctCount에 따라 물뿌리개 이미지 결정
const getWateringCanImage = (correctCount: number): string => {
  if (correctCount >= 61) return '/images/img_tutorial_wateringcan_70.png';
  if (correctCount >= 51) return '/images/img_tutorial_wateringcan_60.png';
  if (correctCount >= 41) return '/images/img_tutorial_wateringcan_50.png';
  if (correctCount >= 31) return '/images/img_tutorial_wateringcan_40.png';
  if (correctCount >= 21) return '/images/img_tutorial_wateringcan_30.png';
  if (correctCount >= 11) return '/images/img_tutorial_wateringcan_20.png';
  return '/images/img_tutorial_wateringcan_10.png';
};

export default function PracticeIntroPage() {
  const navigate = useNavigate();
  const { questId } = useParams<{ questId: string }>();
  const { reset, startLearning, fetchQuestData, isLoading, userQuestProgress, fetchUserQuestProgress } = useLearningStore();
  const [isFetching, setIsFetching] = useState(false); // 로딩 상태 추가

  // URL에서 questId가 없으면 기본값 1 사용
  const selectedQuestId = parseInt(questId || '1', 10);

  // userQuestProgress가 비어있으면 가져오기 (userId는 임시로 1 사용)
  useEffect(() => {
    if (userQuestProgress.length === 0) {
      fetchUserQuestProgress(1); // TODO: 실제 userId로 변경
    }
  }, [userQuestProgress.length, fetchUserQuestProgress]);

  // 현재 quest 정보 찾기
  const currentQuest = userQuestProgress.find(q => q.questId === selectedQuestId);

  const handleStart = async () => {
    setIsFetching(true); // 로딩 시작
    reset();           // 이전 학습 기록 초기화
    startLearning();   // 학습 시작 시간 기록

    // URL에서 받은 questId로 데이터를 불러옵니다.
    await fetchQuestData(selectedQuestId);
    setIsFetching(false); // 로딩 종료
    navigate(`/learning/${selectedQuestId}/1`); // questId와 함께 첫 번째 문제로 이동
  };

  // 물방울 개수와 물뿌리개 이미지
  const correctCount = currentQuest?.correctCount || 0;
  const wateringCanImage = getWateringCanImage(correctCount);

  // 화면에 표시할 데이터
  const introData = {
    title: currentQuest?.title || '학습 시작',
    wateringCanImage,
    waterDropCount: correctCount,
    hashtags: currentQuest?.tags || ['#학습'],
    description_a: currentQuest ? getDescriptionByType(currentQuest.type).description_a : '학습을 시작해주세요.',
    description_b: currentQuest ? getDescriptionByType(currentQuest.type).description_b : '학습을 시작해주세요.',
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-lg mx-auto font-sans bg-gradient-to-b from-white to-white">

      {/* 1. 헤더 (이전 버튼) */}
      <IntroHeader groupName={introData.title} />

      <main className="flex-grow flex flex-col text-center px-5 overflow-y-auto min-h-0">

        <div className="flex flex-col items-center my-auto py-8">
          {/* 3. 물뿌리개 이미지와 말풍선 */}
          <div className="relative mb-4">

            {/* 말풍선 UI */}
            <div className="absolute -top-8 -left-20 z-10 animate-bounce-slow">
              <div className="relative bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                {/* 물방울 아이콘 (SVG) */}
                <img
                  src="/images/ic_possession_waterdrop.png"
                  width={30}
                  height={30}
                  alt="물방울"
                  className="object-contain" // object-contain으로 비율 유지
                />

                {/* 텍스트 */}
                <span className="text-slate-500 font-bold text-sm">물방울</span>
                <span className="text-blue-500 font-extrabold text-sm">{introData.waterDropCount}개</span>

                {/* 말풍선 꼬리 (삼각형) */}
                <div className="absolute -bottom-2 left-20 w-5 h-5 bg-[#EFF6FF] transform rotate-45"></div>
              </div>
            </div>

            <img
              src={introData.wateringCanImage}
              alt="Watering Can"
              className="w-60 h-60 object-contain"
            />
            {/* 물방울 개수 표시 */}
            {/* <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
              {introData.waterDropCount}
            </div> */}
          </div>

          {/* 4. #해시태그 */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-5">
            {introData.hashtags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-500 rounded-full px-2 py-1 text-sm font-semibold text-center font-semibold font-['Pretendard'] leading-5"
              >
                {`#${tag}`}
              </span>
            ))}
          </div>

          {/* 5. 문제 설명 */}
          <p className="mb-3 self-stretch text-center justify-start text-slate-800 text-xl font-semibold font-['Pretendard'] leading-8 whitespace-pre-line">
            {introData.description_a}
          </p>
          <p className="text-gray-600 text-base whitespace-pre-line leading-relaxed whitespace-pre-line">
            {introData.description_b}
          </p>
        </div>
      </main>

      {/* 6. START 버튼 */}
      <div className="px-5 pb-6 flex-shrink-0">
        <button
          onClick={handleStart}
          disabled={isFetching || isLoading}
          className="w-full px-6 pt-4 pb-3.5 bg-blue-500 gap-2 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {isFetching ? '로딩 중...' : '학습 시작'}
        </button>
      </div>
    </div>
  );
}