import React, { useState, useEffect, useCallback } from 'react';
import { ImageButton } from '../ui/ImageButton';
import { playAudio, playAudios, stopAudio } from '../common/AudioService'
import { toast } from 'sonner';
import { ToastBlueIcon } from './WordCard';
import { usePlayAnimation } from '../../shared/hooks/usePlayAnimation';
import { useAudioControlStore } from '../../store/AudioStore';


interface ReviewCardProps {
    id: number;
    // questId: number;
    title: string;
    // type: string;
    questItemId: number;
    sounds: { id: number; type: string; url: string }[];
    units: string[];
    answer?: string | number | null;
    onAddVoca: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ id, title, questItemId, sounds, units, onAddVoca }) => {
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

    }, [isPlaying, isSlowPlaying]);

    // 컴포넌트 언마운트 시 오디오 정지
    useEffect(() => {
        return () => {
            stopAudio();
            setPlayingCardId(null);
        };
    }, [id, playingCardId, setPlayingCardId]);

    const addVocabulary = (questItemId: number) => {
        console.log(questItemId);

        onAddVoca();

        toast("단어장에 추가 되었습니다", {
            icon: <ToastBlueIcon />,
            duration: 3000,
        });

    };

    const playNormal = useCallback(() => {
        if (isPlaying || isSlowPlaying) return;

        setPlayingCardId(id);
        setIsPlaying(true);
        const onPlayEnd = () => {
            setIsPlaying(false);
            if (playingCardId === id) {
                setPlayingCardId(null);
            }
        };

        handlePlay('normal', onPlayEnd);

    }, [isPlaying, isSlowPlaying, id, sounds, setPlayingCardId, playingCardId]);

    const playSlow = useCallback(() => {
        if (isPlaying || isSlowPlaying) return;

        setPlayingCardId(id);
        setIsSlowPlaying(true);
        const onPlayEnd = () => {
            setIsSlowPlaying(false);
            if (playingCardId === id) {
                setPlayingCardId(null);
            }
        };

        handlePlay('slow', onPlayEnd);

    }, [isPlaying, isSlowPlaying, id, sounds, setPlayingCardId, playingCardId]);


    const handlePlay = (type: 'normal' | 'slow', onEnded?: () => void) => {
        const soundUrls = sounds.filter(s => s.type === type).map(s => s.url);

        if (soundUrls.length > 1) {
            playAudios(soundUrls, onEnded);
        } else if (soundUrls.length === 1) {
            playAudio(soundUrls[0], onEnded);
        }
    };

    return (
        <article
            className="rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 bg-white border border-gray-200"
        >
            <div className="p-5 sm:p-6 text-left">
                <p className="text-sm text-gray-600 font-medium mb-2">
                    {title}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {Array.isArray(units) ? units.join(' - ') : units || ''}
                </h3>

                {/* <div className="grid grid-cols-3 gap-4 text-center"> 
                {/* <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm"></div> */}
                <div className="flex items-center justify-center rounded-xl overflow-hidden">
                    <ImageButton
                        image='sound'
                        label="문제 듣기"
                        onClick={playNormal}
                        disabled={isSlowPlaying}
                        isPlaying={isPlaying}
                        animationSrc={currentPlayAnimation}
                        className="w-full h-full"
                    />

                    <div className="w-[1px] h-[67px] bg-[#E5E7EB] relative z-10" />

                    <ImageButton
                        image='slow'
                        label="천천히 듣기"
                        onClick={playSlow}
                        disabled={isPlaying}
                        isPlaying={isSlowPlaying}
                        animationSrc={currentPlayAnimation}
                        className="w-full h-full"
                    />

                    <div className="w-[1px] h-[67px] bg-[#E5E7EB] relative z-10" />

                    <ImageButton
                        image='review'
                        label="단어장 추가"
                        onClick={() => addVocabulary(questItemId)}
                        className="w-full h-full"
                    />
                </div>

            </div>
        </article>
    );
};

