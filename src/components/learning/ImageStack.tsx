// src/components/learning/ImageStack.tsx

import React from 'react';
import { useLearningStore } from '../../store/learningStore';

const ImageStack: React.FC = () => {
  // learningStore에서 이미지 스택 데이터를 가져옵니다.
  const correctImageStack = useLearningStore((state) => state.correctImageStack);

  // 부모 컨테이너 스타일
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%', // 부모 요소에 맞춰 채워지도록 설정
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      {correctImageStack.map((layer) => (
        <img
          key={layer.src} // src를 key로 사용 (고유하다고 가정)
          src={layer.src}
          alt="" // 장식용 이미지이므로 alt는 비워둡니다.
          style={{
            position: 'absolute',
            objectFit: 'cover',
            transition: 'all 0.5s ease-in-out', // 부드러운 전환 효과
            ...layer.style,
          }}
        />
      ))}
    </div>
  );
};

export default ImageStack;
