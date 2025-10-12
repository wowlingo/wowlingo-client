import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import IntroHeader from '../components/intro/IntroHeader';
import { useState } from 'react';

export default function GameIntroPage() {
  const navigate = useNavigate();
  const { reset, startGame, fetchQuestData, isLoading } = useGameStore();
  const [isFetching, setIsFetching] = useState(false);

  const handleStart = async () => {
    setIsFetching(true);
    reset();
    startGame();

    // 새로운 타로카드 게임용 퀘스트 ID 3 사용
    await fetchQuestData(3);
    setIsFetching(false);
    navigate('/game/1');
  };

  const introData = {
    groupName: '듣기 연습 2',
    title: '타로카드 단어 변별',
    imageUrl: 'https://picsum.photos/200/300',
    hashtags: ['#실제단어', '#가짜단어'],
    description: (
      <>
       다음 단어를 듣고, 들려주는 낱말이 일치하는 것을 고르세요.{"\n"}
       {"\n"}
       정답을 맞추고 물방울을 획득하여 {"\n"}보상을 받아보세요.
      </>
    ),
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans">
      <IntroHeader groupName={introData.groupName} />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">{introData.title}</h2>

        <div className="w-full max-w-sm aspect-video rounded-lg shadow-md mb-6 overflow-hidden">
          <img
            src={introData.imageUrl}
            alt={introData.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {introData.hashtags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 whitespace-pre-line">
          {introData.description}
        </p>
      </main>

      <div className="mt-auto py-4">
        <button
          onClick={handleStart}
          disabled={isFetching || isLoading}
          className="w-full bg-blue-500 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
        >
          {isFetching ? '로딩 중...' : 'START!'}
        </button>
      </div>
    </div>
  );
}
