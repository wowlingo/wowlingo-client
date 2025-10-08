import { create } from 'zustand';


interface LearningStatus {
    isLoading: boolean;
    error: string | null;
    loginedDates: number[];
    attemptedDates: number[];
    fetchQuestAttempts: (userId: number, year: number, month: number) => Promise<void>;
}

export const useLearningStatusStore = create<LearningStatus>((set) => ({
    isLoading: false,
    error: null,
    loginedDates: [],
    attemptedDates: [],

    fetchQuestAttempts: async (userId: number, year: number, month: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(
                `http://localhost:8080/api/users/${userId}/quest-attempts?year=${year}&month=${month}`
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
}))