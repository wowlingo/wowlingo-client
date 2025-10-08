import { create } from 'zustand';


type QuestItemUnit = {
    questItemUnitId: number;
    type: string;
    str: string;
    urlNormal: string;
    slowNormal: string;
    remark: string;
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
    questItemUnits: QuestItemUnit[];
    fetchHashtags: () => Promise<void>;
    fetchQuestItemUnits: (hashtagIds?: number[], sort?: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
    hashtags: [],
    isLoading: false,
    error: null,
    questItemUnits: [],

    fetchHashtags: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:8080/api/user-quests/review-notes/hashtags?userId=1&date=2025-09-25');
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

    fetchQuestItemUnits: async (hashtagIds: number[] = [], sort: string = 'latest') => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('userId', "1");
            hashtagIds.forEach(id => params.append('hashtags', id.toString()));
            params.append('date', '2025-09-25');
            // if (sort) params.append('sort', sort);

            const response = await fetch(`http://localhost:8080/api/user-quests/review-notes?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonResponse: { data: QuestItemUnit[] } = await response.json();

            const newQuestItemUnits = jsonResponse.data;

            set({ questItemUnits: newQuestItemUnits, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },

}));