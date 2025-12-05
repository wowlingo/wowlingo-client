import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageButton } from '../ui/ImageButton';
import { playAudio, playLoopAudio, stopAudio } from '../common/AudioService';
import { usePlayAnimation } from '../../shared/hooks/usePlayAnimation';
import { useAudioControlStore } from '../../store/AudioStore';

interface WordCardProps {
    id: number;
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

export const WordCard: React.FC<WordCardProps> = ({ id, unit, urlNormal, urlSlow, onDeleteVoca }) => {
    const [isLooping, setIsLooping] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSlowPlaying, setIsSlowPlaying] = useState(false);

    // 전역 재생 상태 가져오기.
    const { playingCardId, setPlayingCardId } = useAudioControlStore();

    const currentPlayAnimation = usePlayAnimation(isPlaying, isSlowPlaying);

    // 다른 카드가 재생을 시작하면 나는 멈춰야 함
    useEffect(() => {
        // 누군가 재생 중인데(playingCardId 존재), 그게 내가 아니라면(id !== playingCardId)
        if (playingCardId && playingCardId !== id) {
            handleStopAll(); // 내 상태 모두 초기화
        }

    }, [playingCardId, id]);

    // 내 상태 모두 초기화
    const handleStopAll = useCallback(() => {
        // 이미 멈춰있다면 실행 안 함
        // if (!isPlaying && !isSlowPlaying && !isLooping) return;

        setIsPlaying(false);
        setIsSlowPlaying(false);
        setIsLooping(false);

    }, [isPlaying, isSlowPlaying, isLooping]);

    // 컴포넌트 언마운트 시 오디오 정지
    useEffect(() => {
        return () => {
            stopAudio();
            setPlayingCardId(null);
        };
    }, [id, playingCardId, setPlayingCardId]);

    const playNormal = useCallback(() => {
        if (isPlaying || isSlowPlaying || isLooping) return;

        setPlayingCardId(id);
        setIsPlaying(true);
        const onPlayEnd = () => {
            setIsPlaying(false);
            if (playingCardId === id) {
                setPlayingCardId(null);
            }
        };

        playAudio(urlNormal, onPlayEnd);

    }, [isPlaying, isSlowPlaying, isLooping, id, urlNormal, setPlayingCardId, playingCardId]);

    const playSlow = useCallback(() => {
        if (isPlaying || isSlowPlaying || isLooping) return;

        setPlayingCardId(id);
        setIsSlowPlaying(true);
        const onPlayEnd = () => {
            setIsSlowPlaying(false);
            if (playingCardId === id) {
                setPlayingCardId(null);
            }
        };

        playAudio(urlSlow, onPlayEnd);

    }, [isPlaying, isSlowPlaying, isLooping, id, urlSlow, setPlayingCardId, playingCardId]);

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
            duration: 2000, // 3초 뒤 자동으로 닫힘
        });

        // 토스트가 닫힐 때 실행되도록 타이머로 제어
        setTimeout(() => {
            console.log("toast setTimeout")
            if (!isCancelled) {
                onDeleteVoca();
            }
        }, 4000);
    };

    const handleLoopClick = () => {
        if (isLooping) {
            // 현재 반복 중(pause 버튼 보임) -> 클릭 시 정지
            stopAudio();
            setIsLooping(false);
            if (playingCardId === id) {
                setPlayingCardId(null);
            }
        } else {
            // 현재 정지 중(repeat 버튼 보임) -> 클릭 시 반복 재생
            playLoopAudio(urlNormal);
            setIsLooping(true);
            setPlayingCardId(id);
        }
    };

    return (
        <article
            className="rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 bg-white border border-gray-200"
        >
            <div className="p-5 sm:p-6 text-left">

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {unit}
                </h3>

                <div className="flex items-center justify-center rounded-xl overflow-hidden">
                    <ImageButton
                        image='sound'
                        label="문제 듣기"
                        onClick={playNormal}
                        disabled={isSlowPlaying || isLooping}
                        isPlaying={isPlaying}
                        animationSrc={currentPlayAnimation}
                        className="w-full h-full"
                    />

                    <div className="w-[1px] h-[67px] bg-[#E5E7EB] relative z-10" />

                    <ImageButton
                        image='slow'
                        label="천천히 듣기"
                        onClick={playSlow}
                        disabled={isPlaying || isLooping}
                        isPlaying={isSlowPlaying}
                        animationSrc={currentPlayAnimation}
                        className="w-full h-full"
                    />

                    <div className="w-[1px] h-[67px] bg-[#E5E7EB] relative z-10" />

                    <ImageButton
                        image={isLooping ? 'pause' : 'repeat'}
                        label={isLooping ? '반복 정지' : '반복 듣기'}
                        onClick={handleLoopClick}
                        disabled={isPlaying || isSlowPlaying}
                        className="w-full h-full"
                    />
                </div>
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

