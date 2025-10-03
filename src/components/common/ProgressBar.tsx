import React from 'react';
import { Turtle, NotebookPen } from 'lucide-react';

// 컴포넌트가 받을 props의 타입을 정의합니다.
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  enableButton: boolean;
}

export default function ProgressBar({ currentStep, totalSteps, enableButton }: ProgressBarProps) {
  // 진행률을 퍼센트로 계산합니다.
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full my-2">
      {/* 진행률 텍스트 (예: 1 / 10) */}

      {/* <div className="text-right text-sm text-gray-600 mb-1">
        <span>{currentStep}</span> / <span>{totalSteps}</span>
      </div> */}

      <div className="flex items-center gap-2">
        {/* 프로그레스 바의 배경 */}
        <div className="w-sm bg-gray-200 rounded-full h-2.5 flex-1">
          {/* 실제 진행 상태를 보여주는 바 */}
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {enableButton === true && (
          <button
            // key={sound.id + sound.type}
            // onClick={() => handlePlaySound(sound.url)}
            className="flex flex-col items-center justify-center p-3 bg-sky-100 text-sky-700 rounded-2xl shadow-sm hover:bg-sky-200 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <NotebookPen size={20} className="" />
          </button>
        )}

      </div>
    </div>
  );
}