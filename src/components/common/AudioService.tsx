let currentAudio: HTMLAudioElement | null = null;
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

    const audio = new Audio(audioUrl);
    currentAudio = audio;

    if (onEnded) {
        audio.onended = onEnded;
    }

    // play()는 Promise를 반환합니다.
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // 재생이 성공적으로 시작됨
                // 필요하다면 여기서 로직 처리
            })
            .catch((error) => {
                // 재생이 시작되기 전에 pause()가 호출되면 AbortError가 발생합니다.
                if (error.name === 'AbortError') {
                    // 의도된 중단이므로 에러 로그를 무시하거나 가볍게 처리
                    console.log('Audio play aborted cleanly');
                    playAudio(audioUrl, onEnded);
                } else {
                    // 그 외 진짜 재생 에러 처리
                    console.error('Audio play failed:', error);
                }
            });
    }
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
    stopAudio();

    const audio = new Audio(audioUrl);
    audio.loop = true;
    currentAudio = audio;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // 재생 성공
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    console.log('Loop audio aborted cleanly');
                    playLoopAudio(audioUrl);
                } else {
                    console.error('Loop audio failed:', error);
                }
            });
    }
};