interface ResultsInfoProps {
  correctCount: number;
  incorrectCount: number;
  durationInSeconds: number;
  accuracy: number;
}

export default function ResultsInfo({ correctCount, incorrectCount, durationInSeconds, accuracy }: ResultsInfoProps) {

  // 오답 개수에 따른 격려의 말
  const getEncouragementMessage = () => {
    if (incorrectCount === 0) return "🎉 완벽해요! 모든 문제를 맞혔어요!";
    if (incorrectCount <= 3) return "👍 정말 잘했어요!";
    return "😊 수고했어요! 다음엔 더 잘할 수 있을 거예요.";
  };

  // 초를 hh:mm 형식으로 변환
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    // ✨ 전체를 감싸는 컨테이너를 추가하고, 두 정보 블록 사이의 간격을 줍니다.
    <div className="w-full flex flex-col gap-4">

      {/* 정답, 오답, 격려의 말 */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        {/* 정답, 오답 개수 */}
        <div className="flex justify-around text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">정답 {correctCount}개</p>
          </div>
        </div>

        {/* 격려의 말 */}
        <p className="text-md font-semibold text-gray-700 text-center">{getEncouragementMessage()}</p>
      </div>

      {/* 총 소요시간, 정답률 */}
      <div className="bg-sky-50 rounded-lg p-4">
        <div className="flex justify-around text-center">
          {/* 왼쪽: 총 소요시간 */}
          <div>
            <p className="text-sm text-gray-500">스피드</p>
            <p className="text-2xl font-bold text-gray-800">{formatTime(durationInSeconds)}</p>
          </div>
          {/* 오른쪽: 정답률 */}
          <div>
            <p className="text-sm text-gray-500">정답률</p>
            <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}