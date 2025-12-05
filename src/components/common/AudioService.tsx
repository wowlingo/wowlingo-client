/**
 * 이 모듈 내부에서만 관리되는 오디오 인스턴스입니다.
 */
let currentAudio: HTMLAudioElement | null = null;
/**
 * 오디오 재생이 완료되었을 때 호출될 콜백 함수입니다.
 */
let onEndedCallback: (() => void) | null = null;

/**
 * 현재 재생 중인 오디오를 정지하고 리소스를 해제합니다.
 * 이 함수는 다른 오디오를 재생하기 직전에 항상 호출됩니다.
 */
export const stopAudio = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.loop = false;
        currentAudio.onended = null; // onended 이벤트 리스너 제거
        currentAudio = null;
    }
    
    onEndedCallback = null;
};

/**
 * 오디오를 1회 재생합니다.
 * @param audioUrl 재생할 오디오 파일의 URL
 * @param onEnded 오디오 재생이 완료되었을 때 호출될 콜백
 */
export const playAudio = (audioUrl: string, onEnded?: () => void) => {
    stopAudio(); // 1. 기존 오디오가 있다면 정지

    currentAudio = new Audio(audioUrl);
    onEndedCallback = onEnded || null;

    currentAudio.onended = () => {
        if (onEndedCallback) {
            onEndedCallback();
        }
        // 한 번 호출된 콜백은 초기화
        onEndedCallback = null;
    };

    currentAudio.play().catch(e => {
        console.error("오디오 재생 오류:", e);
        stopAudio(); // 재생 실패 시 완전 초기화
    });
};

/**
 * 여러 오디오를 순차적으로 재생합니다.
 * @param audioUrls 순차적으로 재생할 오디오 파일의 URL 배열
 * @param onEnded 모든 오디오 재생이 완료되었을 때 호출될 콜백
 */
export const playAudios = (audioUrls: string[], onEnded?: () => void) => {
    stopAudio();
    if (audioUrls.length === 0) {
        onEnded?.();
        return;
    }

    let currentIndex = 0;
    onEndedCallback = onEnded || null;

    const playNext = () => {
        // 모든 오디오 재생 완료
        if (currentIndex >= audioUrls.length) {
            if (onEndedCallback) {
                onEndedCallback();
            }
            onEndedCallback = null; // 콜백 실행 후 초기화
            return;
        }

        // 다음 오디오 재생
        currentAudio = new Audio(audioUrls[currentIndex]);
        currentAudio.onended = () => {
            currentIndex++;
            playNext();
        };
        currentAudio.play().catch(e => {
            console.error("오디오 시퀀스 재생 오류:", e);
            stopAudio(); // 재생 실패 시 완전 초기화
        });
    };

    playNext();
};


/**
 * 오디오를 반복 재생합니다.
 * @param audioUrl 반복 재생할 오디오 파일의 URL
 */
export const playLoopAudio = (audioUrl: string) => {
    // 이미 같은 오디오가 반복 재생 중이면 정지
    if (currentAudio?.loop && currentAudio.src.endsWith(audioUrl)) {
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