import { create } from 'zustand';


type ReviewQuestItem = {
    // questId: number;
    // type: string;
    title: string;
    questItemId: number;
    sounds: any[];
    units: string[];
    answer?: string | number | null;
    options?: any[];
};

type HashtagData = {
    hashtagId: number;
    code: string;
    name: string;
};

interface ReviewState {
    hashtags: HashtagData[];
    isLoading: boolean;
    error: string | null;
    reviewQuestItems: ReviewQuestItem[];
    fetchHashtags: (date?: Date) => Promise<void>;
    fetchQuestItemUnits: (hashtagIds?: number[], date?: Date, sort?: string) => Promise<void>;
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const useReviewStore = create<ReviewState>((set) => ({
    hashtags: [],
    isLoading: false,
    error: null,
    reviewQuestItems: [],

    fetchHashtags: async (date?: Date) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('userId', "1");
            if (date) {
                params.append('date', formatDate(date));//'2025-09-25');
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user-quests/review-notes/hashtags?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonResponse: { data: HashtagData[] } = await response.json();
            const resData = jsonResponse.data;

            const newHashtags: HashtagData[] = resData.map(ht => ({
                hashtagId: ht.hashtagId,
                code: ht.code,
                name: ht.name,
            }))
            // const newHashtags = Array.isArray(result.data) ? result.data : [];
            set({ hashtags: newHashtags, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },

    fetchQuestItemUnits: async (hashtagIds: number[] = [], date?: Date) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('userId', "1");
            hashtagIds.forEach(id => params.append('hashtags', id.toString()));
            if (date) {
                params.append('date', formatDate(date));//'2025-09-25');
            }
            // if (sort) params.append('sort', sort);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user-quests/review-notes?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse: { data: ReviewQuestItem[] } = await response.json();

            const newDatas = jsonResponse.data;

            set({ reviewQuestItems: newDatas, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },

}));