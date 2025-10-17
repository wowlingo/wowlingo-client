
import { useLearningStore } from '../../store/learningStore';

export default function CatImageStack() {
  const { stepProgress, totalSteps } = useLearningStore();
  
  // 정답 개수 계산
  const correctCount = Object.values(stepProgress).filter(step => step.isCorrect === true).length;
  
  // 현재 jar 레벨 계산 (0부터 시작)
  const currentJarLevel = Math.min(correctCount, totalSteps - 1);
  
  // 말풍선 텍스트 배열 (퀘스트 진행에 따라 변경)
  const speechTexts = [
    "스프를 만들어보자냥",
    "재료를 넣어보자냥",
    "더 맛있게 만들어보자냥",
    "완성이다냥!"
  ];
  
  // 현재 말풍선 텍스트 (correctCount에 따라 결정)
  const currentSpeechText = speechTexts[Math.min(correctCount, speechTexts.length - 1)];

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Layout2 배경 - cat, jar, speech bubble */}
      <div className="relative w-80 h-80 max-w-sm aspect-square">
        {/* Speech Bubble - 피그마 기준: width: 130, height: 76, top: 283.94px, left: 41px */}
        <div 
          className="absolute z-20"
          style={{
            width: '34.67%', // 130/375 * 100
            height: '20.28%', // 76/375 * 100
            top: '10%',
            left: '10.93%', // 41/375 * 100
          }}
        >
          <img
            src="/images/speech_bubble.png"
            alt="Speech Bubble"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-black px-1 py-1 leading-tight">
              {currentSpeechText}
            </span>
          </div>
        </div>

        {/* Cat - 피그마 기준: width: 175, height: 262.5, top: 269.58px, left: 147.68px */}
        <div 
          className="absolute z-10"
          style={{
            width: '46.67%', // 175/375 * 100
            height: '70%', // 262.5/375 * 100
            top: '10%',
            left: '39.38%', // 147.68/375 * 100
          }}
        >
          <img
            src="/images/cat.png"
            alt="Cat"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Jar - 퀘스트 진행에 따라 jar-0, jar-1, jar-2... 로 변경 */}
        <div 
          className="absolute z-10"
          style={{
            width: '48%', // 180/375 * 100
            height: '48%', // 180/375 * 100
            bottom: '10%', // 화면 하단에서 10% 위에 배치
            left: '20%', // 75/375 * 100
          }}
        >
          <img
            src={`/images/jar-${currentJarLevel}.png`}
            alt={`Jar Level ${currentJarLevel}`}
            className="w-full h-full object-contain transition-all duration-500 ease-out"
          />
        </div>
      </div>
    </div>
  );
}
