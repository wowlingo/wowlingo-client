import { useState, useEffect } from 'react';

// 애니메이션을 위한 이미지 경로 배열
export const SPEAKER_FRAMES = [
    '/images/sound_04.png',
    '/images/sound_01.png',
    '/images/sound_02.png',
    '/images/sound_03.png',
];

export const SLOWLY_FRAMES = [
    '/images/slowly_04.png',
    '/images/slowly_01.png',
    '/images/slowly_02.png',
    '/images/slowly_03.png',
];

export const usePlayAnimation = (isPlaying: boolean, isSlowPlaying: boolean) => {
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        let animationInterval: ReturnType<typeof setInterval> | undefined;

        const active = isPlaying || isSlowPlaying;
        const frames = isPlaying ? SPEAKER_FRAMES : SLOWLY_FRAMES;

        if (active) {
            animationInterval = setInterval(() => {
                setFrameIndex((prev) => (prev + 1) % frames.length);
            }, 200);
        } else {
            setFrameIndex(0);
        }

        return () => {
            if (animationInterval) clearInterval(animationInterval);
        };
    }, [isPlaying, isSlowPlaying]);

    // 일반 속도 / 느리게 속도 프레임 
    const currentFrames = isPlaying ? SPEAKER_FRAMES : SLOWLY_FRAMES;

    return currentFrames[frameIndex] || currentFrames[0];
};