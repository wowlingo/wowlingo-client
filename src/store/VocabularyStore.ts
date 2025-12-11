import { create } from 'zustand';
import ClarityTracker from '../hooks/useClarityTracking';


type VocabularyData = {
    vocabId: number;
    userId: string;
    str: string;
    urlNormal: string;
    slowNormal: string;
    createdAt: string;
    createdAtKST: string;
};

type HashtagData = {
    hashtagId: number;
    name: string;
};

type ApiHashtagResponseData = {
    hashtagId: number;
    code: string;
    name: string;
};

interface VocabularyState {
    hashtags: HashtagData[];
    isLoading: boolean;
    error: string | null;
    vocabulary: VocabularyData[];
    fetchHashtags: (userId: number) => Promise<void>;
    fetchVocabulary: (userId: number, hashtagIds?: number[], sort?: string) => Promise<void>;
    deleteVocabulary: (vocabId: number) => Promise<void>;
    addVocabulary: (userId: number, questItemId: number) => Promise<void>;
}

export const useVocabularyStore = create<VocabularyState>((set) => ({
    hashtags: [],
    isLoading: false,
    error: null,
    vocabulary: [],

    fetchHashtags: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vocabulary/hashtags?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonResponse: { data: ApiHashtagResponseData[] } = await response.json();
            const resData = jsonResponse.data;

            const newHashtags: HashtagData[] = resData.map(ht => ({
                hashtagId: ht.hashtagId,
                name: ht.name,
            }))
            // const newHashtags = Array.isArray(result.data) ? result.data : [];
            set({ hashtags: newHashtags, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },

    fetchVocabulary: async (userId: number, hashtagIds: number[] = [], sort: string = 'latest') => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('userId', String(userId));
            hashtagIds.forEach(id => params.append('hashtags', id.toString()));
            if (sort) params.append('sort', sort);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vocabulary?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse: { data: VocabularyData[] } = await response.json();

            const newVocabulary = jsonResponse.data;

            set({ vocabulary: newVocabulary, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },

    deleteVocabulary: async (vocabId: number) => {
        // 삭제 전 현재 상태 백업 (롤백용)
        const previousVocabulary = useVocabularyStore.getState().vocabulary;

        set(state => ({
            vocabulary: state.vocabulary.filter(v => v.vocabId !== vocabId)
        }));

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vocabulary/${vocabId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete vocabulary item.');
            }

            set({ error: null });
        } catch (error) {
            // 삭제 실패 시 이전 상태로 롤백
            set({
                vocabulary: previousVocabulary,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
            console.error('Failed to delete vocabulary:', error);
        }
    },

    addVocabulary: async (userId: number, questItemId: number) => {
        try {
            const resultData = {
                userId: userId,
                questItemId: questItemId,
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vocabulary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resultData),
            });

            if (!response.ok) {
                throw new Error('Failed to add vocabulary item.');
            }

            const jsonResponse: { data: VocabularyData[] } = await response.json();
            const newVocabs = jsonResponse.data;

            // 새로 추가/업데이트된 단어들을 처리
            set(state => {
                // 기존 vocabulary에서 새로 추가된 단어들의 ID를 제외
                const newVocabIds = newVocabs.map(v => v.vocabId);
                const filteredVocabulary = state.vocabulary.filter(
                    v => !newVocabIds.includes(v.vocabId)
                );

                return {
                    vocabulary: [...newVocabs, ...filteredVocabulary],
                    error: null
                };
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ error: errorMessage });
        }
    }
}));