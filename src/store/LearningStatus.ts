import { create } from 'zustand';


interface LearningStatus {
    isLoading: boolean;
    error: string | null;
    loginedDates: number[];
    attemptedDates: number[];
    attemptedDays: any[];
    fetchQuestAttempts: (userId: number, year: number, month: number) => Promise<void>;
    fetchQuestAttemptsThisWeek: (userId: number) => Promise<void>;
}

export const useLearningStatusStore = create<LearningStatus>((set) => ({
    isLoading: false,
    error: null,
    loginedDates: [],
    attemptedDates: [],
    attemptedDays: [],

    fetchQuestAttempts: async (userId: number, year: number, month: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/quest-attempts?year=${year}&month=${month}`
            );
            const json = await response.json();

            if (json.result && Array.isArray(json.data)) {
                const data = json.data;

                // loginDateKST, attemptDateKST 에서 '일(day)' 추출
                const logins = data
                    .filter((d: { loginDateKST: any; }) => d.loginDateKST)
                    .map((d: { loginDateKST: any; }) => new Date(d.loginDateKST).getDate());

                const attempts = data
                    .filter((d: { attemptDateKST: any; }) => d.attemptDateKST)
                    .map((d: { attemptDateKST: any; }) => new Date(d.attemptDateKST).getDate());

                // setLoginedDates([...new Set(logins)]); // 중복 제거
                // setAttemptedDates([...new Set(attempts)]);
                set({ loginedDates: logins, attemptedDates: attempts, isLoading: false });
            } else {
                console.error("데이터 없음:", json);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },

    fetchQuestAttemptsThisWeek: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/quest-attempts/this-week`
            );
            const json = await response.json();

            if (json.result && Array.isArray(json.data)) {
                const data = json.data;

                // loginDateKST, attemptDateKST 에서 '일(day)' 추출
                const logins = data
                    .filter((d: { loginDateKST: any; }) => d.loginDateKST)
                    .map((d: { loginDateKST: any; }) => new Date(d.loginDateKST).getDate());

                const attempts = data
                    .filter((d: { attemptDateKST: any; }) => d.attemptDateKST)
                    .map((d: { attemptDateKST: any; }) => new Date(d.attemptDateKST).getDate());

                const days = data
                    .filter((d: { attemptDateKST: any; }) => d.attemptDateKST)
                    .map((d: { attemptDateKST: any; }) => new Date(d.attemptDateKST).getDay());

                // setLoginedDates([...new Set(logins)]); // 중복 제거
                // setAttemptedDates([...new Set(attempts)]);
                set({ loginedDates: logins, attemptedDates: attempts, isLoading: false, attemptedDays: days });
            } else {
                console.error("데이터 없음:", json);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ isLoading: false, error: errorMessage });
        }
    },
}))