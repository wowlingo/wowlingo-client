import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageButton } from '../ui/ImageButton';
import { playAudio, playLoopAudio, stopAudio } from '../common/AudioService';

interface WordCardProps {
    unit: string;
    urlNormal: string;
    urlSlow: string;
    onDeleteVoca: () => void;
}

export const ToastBlueIcon = () => (
    <div style={{
        background: '#3182F7',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '14px',
        flexShrink: 0,
        marginRight: '10px',
    }}>
        &#10003;
    </div>
);

export const WordCard: React.FC<WordCardProps> = ({ unit, urlNormal, urlSlow, onDeleteVoca }) => {
    const [isLooping, setIsLooping] = useState(false);

    const handleComplete = () => {
        console.log("handleComplete")
        let isCancelled = false;

        const toastId = toast("완료한 카드는 사라집니다", {
            icon: <ToastBlueIcon />,
            action: {
                label: "취소하기",
                onClick: () => {
                    isCancelled = true;
                    toast.dismiss(toastId);
                },
            },
            duration: 3000, // 3초 뒤 자동으로 닫힘
        });

        // 토스트가 닫힐 때 실행되도록 타이머로 제어
        setTimeout(() => {
            console.log("toast setTimeout")
            if (!isCancelled) {
                onDeleteVoca();
            }
        }, 5000);
    };

    const handleLoopClick = () => {
        if (isLooping) {
            // 현재 반복 중(pause 버튼 보임) -> 클릭 시 정지
            stopAudio();
            setIsLooping(false);
        } else {
            // 현재 정지 중(repeat 버튼 보임) -> 클릭 시 반복 재생
            playLoopAudio(urlNormal);
            setIsLooping(true);
        }
    };

    return (
        <article
            className="rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 bg-white border border-gray-200"
        >
            <div className="p-5 sm:p-6 text-left">
                {/* <p className="text-sm text-gray-600 font-medium mb-2">
                    {quest}
                </p> */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {unit}
                </h3>

                {/* <div className="grid grid-cols-3 gap-4 text-center"> */}
                {/* <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm"></div> */}
                <div className="flex items-center justify-center rounded-xl overflow-hidden">
                    <ImageButton
                        image='sound'
                        label="문제 듣기"
                        onClick={() => playAudio(urlNormal)} />
                    <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
                    <ImageButton image='slow' label="천천히 듣기"
                        onClick={() => playAudio(urlSlow)} />
                    <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
                    <ImageButton image={isLooping ? 'pause' : 'repeat'} 
                        label={isLooping ? '반복 정지' : '반복 듣기'}
                        onClick={handleLoopClick} />
                </div>
                {/* <div className="flex-shrink-0 px-5 pt-2 flex justify-center">
                    <Question key={mockSounds[0].id} sounds={mockSounds} />
                </div> */}
            </div>

            {/* 하단 완료 상태 */}
            <div
                className={`flex justify-between items-center p-4 mt-auto bg-gray-50`}
            >
                <span
                    className={`text-sm font-medium text-[#8E8E93]`}
                >
                    학습을 완료했어요
                </span>
                <button onClick={handleComplete}>
                    <CheckCircle className="text-gray-500" size={20} />
                </button>
            </div>
        </article>
    );
};

