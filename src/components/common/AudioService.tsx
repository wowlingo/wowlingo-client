/**
 * 이 모듈 내부에서만 관리되는 오디오 인스턴스입니다.
 */
let currentAudio: HTMLAudioElement | null = null;

/**
 * 현재 재생 중인 오디오를 정지하고 리소스를 해제합니다.
 * 이 함수는 다른 오디오를 재생하기 직전에 항상 호출됩니다.
 */
export const stopAudio = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.loop = false; // 혹시 모를 루프 상태 해제
        currentAudio = null; // 참조 해제
    }
};

/**
 * 오디오를 1회 재생합니다.
 * @param audioUrl 재생할 오디오 파일의 URL
 */
export const playAudio = (audioUrl: string) => {
    stopAudio(); // 1. 기존 오디오가 있다면 정지

    // 2. 새 오디오 생성 및 재생
    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(e => {
        console.error("오디오 재생 오류:", e);
        currentAudio = null; // 재생 실패 시 참조 해제
    });
};

export const playAudios = (audioUrls: string[]) => {
    if (audioUrls.length === 0) return;

    const playAudio = (index: number) => {
        if (index >= audioUrls.length) return;

        const audio = new Audio(audioUrls[index]);
        audio.play()
            .then(() => {
                audio.onended = () => playAudio(index + 1);
            })
            .catch(e => console.error("오디오 재생 오류:", e));
    };

    playAudio(0);
};

/**
 * 오디오를 반복 재생합니다.
 * @param audioUrl 반복 재생할 오디오 파일의 URL
 */
export const playLoopAudio = (audioUrl: string) => {
    if (currentAudio?.loop) {
        stopAudio();
        return;
    }

    stopAudio();

    currentAudio = new Audio(audioUrl);
    currentAudio.loop = true;
    currentAudio.play().catch(e => {
        console.error("오디오 반복 재생 오류:", e);
        currentAudio = null; // 재생 실패 시 참조 해제
    });
};