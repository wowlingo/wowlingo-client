import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnswerOptions from '../components/learning/AnswerOptions';
import { useLearningStore, QuestionData } from '../store/learningStore';

export default function LearningStepPage() {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const urlStepNumber = parseInt(stepId || '1', 10); // URL에서 가져온 현재 문제 번호

  const { learningData, isLoading, startLearning, currentStep, currentQuestId: storeLoadedQuestId } = useLearningStore((state) => ({
    learningData: state.learningData,
    isLoading: state.isLoading,
    startLearning: state.startLearning,
    currentStep: state.currentStep,
    currentQuestId: state.currentQuestId, // 스토어에 로드된 퀘스트 ID
  }));

  // 퀘스트 데이터가 로드되지 않았거나 유효하지 않은 경우 인트로 페이지로 리다이렉트
  useEffect(() => {
    // 로딩 중이 아니고, 스토어에 로드된 퀘스트 ID가 없거나, learningData가 비어있으면 리다이렉트
    // (이는 직접 접근했거나, 로딩 실패, 또는 퀘스트 데이터가 아직 없는 경우)
    if (!isLoading && (!storeLoadedQuestId || Object.keys(learningData).length === 0)) {
      navigate('/learning/intro');
    }
  }, [isLoading, storeLoadedQuestId, learningData, navigate]);

  // 스토어의 currentStep과 URL의 stepNumber가 다르면 스토어의 currentStep으로 이동
  useEffect(() => {
    // storeLoadedQuestId가 있고, learningData가 비어있지 않으며,
    // URL의 stepNumber가 스토어의 currentStep과 다르면 동기화
    if (storeLoadedQuestId && Object.keys(learningData).length > 0 && urlStepNumber !== currentStep) {
      navigate(`/learning/${currentStep}`);
    }
  }, [urlStepNumber, currentStep, navigate, storeLoadedQuestId, learningData]);


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

  const data: QuestionData | undefined = learningData[currentStep];

  // 특정 단계의 데이터가 없으면 에러 메시지 또는 인트로로 리다이렉트 (이미 위에서 처리됨)
  if (!data) {
    return <div>Invalid learning step data.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 3-1. 문제 */}
      {/* <Question sounds={data.sounds} /> */}

      {/* 3-2. 정답 (이미지 + 버튼) */}
      <AnswerOptions options={data.options} />
    </div>
  );
}