import { create } from 'zustand';


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
    fetchHashtags: () => Promise<void>;
    fetchVocabulary: (hashtagIds?: number[], sort?: string) => Promise<void>;
}

export const useVocabularyStore = create<VocabularyState>((set) => ({
    hashtags: [],
    isLoading: false,
    error: null,
    vocabulary: [],

    fetchHashtags: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:8080/api/vocabulary/hashtags?userId=1');
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

    fetchVocabulary: async (hashtagIds: number[] = [], sort: string = 'latest') => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('userId', "1");
            hashtagIds.forEach(id => params.append('hashtags', id.toString()));
            if (sort) params.append('sort', sort);

            const response = await fetch(`http://localhost:8080/api/vocabulary?${params.toString()}`);
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
}));