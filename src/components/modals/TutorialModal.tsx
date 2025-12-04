import React, { useState, useEffect } from 'react';

interface TutorialModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    tutorialContent: { title: string; description1: string; description2: string; image: string };
}

const firstTutorialData = {
    title: '학습을 시작하면 음성이 나와요',
    description1: '상단 버튼을 통해 문제를 다시 듣거나,',
    description2: '문제의 단어/문장을 단어장에 추가할 수 있어요.',
    image: '/images/tutorial-0.png'
}

const lastTutorialData = {
    title: '물방울을 수집해요',
    description1: '학습하면서 얻은 물방울로',
    description2: '씨앗을 키울 수 있어요.',
    image: '/images/tutorial-5.png'
}

export default function TutorialModal({ isOpen, onConfirm, tutorialContent }: TutorialModalProps) {
    const [step, setStep] = useState(0);
    const [newContent, setNewContent] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            setNewContent([
                firstTutorialData,
                tutorialContent,
                lastTutorialData,
            ]);
            setStep(0);
        }
    }, [isOpen]);

    console.log('isOpen:', isOpen);
    console.log('newContent:', newContent);

    if (!isOpen || !newContent || newContent.length === 0) {
        return null;
    }
    const currentContent = newContent[step];
    const isLastStep = step === newContent.length - 1;

    const handleNext = () => {
        if (!isLastStep) {
            setStep(step + 1);
        } else {
            onConfirm();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full z-[100] flex items-center justify-center z-50 absolute inset-0 bg-black/80">

            <div className="relative z-10 p-8 flex flex-col items-center w-100 bg-white rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">{currentContent.title}</h3>
                <p className="text-base text-gray-600 mb-4 text-center leading-relaxed">
                    {currentContent.description1}<br />
                    {currentContent.description2}
                </p>
                <img src={currentContent.image} alt={currentContent.title} className="mx-auto w-100 object-contain" />

                <div className="flex justify-center space-x-2 mt-4">
                    {newContent.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full ${step === index ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    ))}
                </div>

                <div className="flex w-full mt-6 gap-3">
                    <button
                        onClick={handlePrev}
                        disabled={step === 0}
                        className="flex-1 py-3 bg-blue-100 text-blue-600 font-bold text-lg rounded-full hover:bg-blue-200 transition-colors
                        disabled:bg-gray-200 disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                    >
                        이전
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex-1 py-3 bg-blue-500 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-colors shadow-md"
                    >
                        {isLastStep ? '닫기' : '다음'}
                    </button>
                </div>

            </div>
        </div>
    );
}