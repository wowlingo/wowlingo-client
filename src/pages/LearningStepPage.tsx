import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnswerOptions from '../components/learning/AnswerOptions';
import { useLearningStore, QuestionData } from '../store/learningStore';

export default function LearningStepPage() {
  const navigate = useNavigate();
  const { questId, stepId } = useParams<{ questId: string; stepId: string }>();
  const urlQuestId = parseInt(questId || '1', 10); // URL에서 가져온 퀘스트 ID
  const urlStepNumber = parseInt(stepId || '1', 10); // URL에서 가져온 현재 문제 번호

  const { learningData, isLoading, startLearning, currentStep, currentQuestId: storeLoadedQuestId, fetchQuestData, rawQuestData } = useLearningStore((state) => ({
    learningData: state.learningData,
    isLoading: state.isLoading,
    startLearning: state.startLearning,
    currentStep: state.currentStep,
    currentQuestId: state.currentQuestId, // 스토어에 로드된 퀘스트 ID
    fetchQuestData: state.fetchQuestData,
    rawQuestData: state.rawQuestData, // quest 타입 정보를 위해 추가
  }));

  // URL의 questId와 스토어의 questId가 다르면 데이터를 다시 로드
  useEffect(() => {
    if (urlQuestId && urlQuestId !== storeLoadedQuestId) {
      fetchQuestData(urlQuestId);
    }
  }, [urlQuestId, storeLoadedQuestId, fetchQuestData]);

  // 퀘스트 데이터가 로드되지 않았거나 유효하지 않은 경우 인트로 페이지로 리다이렉트
  useEffect(() => {
    // 로딩 중이 아니고, 스토어에 로드된 퀘스트 ID가 없거나, learningData가 비어있으면 리다이렉트
    // (이는 직접 접근했거나, 로딩 실패, 또는 퀘스트 데이터가 아직 없는 경우)
    if (!isLoading && (!storeLoadedQuestId || Object.keys(learningData).length === 0)) {
      navigate(`/learning/intro/${urlQuestId}`);
    }
  }, [isLoading, storeLoadedQuestId, learningData, navigate, urlQuestId]);


  useEffect(() => {
    // 1단계일 때만 학습 시작 기록
    if (currentStep === 1) {
      startLearning();
    }
  }, [currentStep, startLearning]);

  // 퀘스트 데이터가 아직 로드되지 않았거나, 현재 단계의 데이터가 없으면 로딩 스피너 표시
  // (storeLoadedQuestId가 null이 아니라는 것은 퀘스트 로드를 시도했다는 의미)
  if (isLoading || !storeLoadedQuestId || Object.keys(learningData).length === 0) {
    return <div>Loading...</div>;
  }

  // URL의 stepId를 사용 (BaseLearningLayout에서 navigate로 변경한 URL 반영)
  const data: QuestionData | undefined = learningData[urlStepNumber];

  // 특정 단계의 데이터가 없으면 에러 메시지 또는 인트로로 리다이렉트 (이미 위에서 처리됨)
  if (!data) {
    return <div>Invalid learning step data.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 3-1. 문제 */}
      {/* <Question sounds={data.sounds} /> */}

      {/* 3-2. 정답 (이미지 + 버튼) */}
      <AnswerOptions options={data.options} questType={rawQuestData?.type} />
    </div>
  );
}