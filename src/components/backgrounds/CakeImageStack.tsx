import { useLearningStore } from '../../store/learningStore';

export default function CakeImageStack() {
  const { correctImageStack } = useLearningStore();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80 max-w-sm aspect-square">
        {correctImageStack.map((layer, index) => (
          <img
            key={index}
            src={layer.src}
            alt={`Correct Answer Layer ${index + 1}`}
            className="absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-out"
            style={layer.style}
          />
        ))}
      </div>
      {/* 케이크 이미지 스택 컨테이너: 고정 크기로 설정하여 이미지가 보이도록 함 */}
    </div>
  );
}
