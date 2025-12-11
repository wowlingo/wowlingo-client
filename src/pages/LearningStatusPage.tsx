// src/pages/LearningStatusPage.tsx
import { useEffect, useState } from 'react';
import Calendar from '../components/learning-status/Calendar';
import DailySummary from '../components/learning-status/DailySummary';
import { useLearningStatusStore } from '../store/LearningStatus';
import { useAuth } from '../components/common/AuthContext';
import ClarityTracker from '../hooks/useClarityTracking';

const LearningStatusPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { user } = useAuth();
    const { loginedDates, attemptedDates, aiFeedbacks,
        fetchQuestAttempts, fetchQuestAttemptAiFeedbacks } = useLearningStatusStore();

    useEffect(() => {
        ClarityTracker.learningStatusViewed();

        if (user) {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            fetchQuestAttempts(user.userId, year, month + 1);
            fetchQuestAttemptAiFeedbacks(user.userId, year, month + 1);
        }
    }, [user, selectedDate, fetchQuestAttempts, fetchQuestAttemptAiFeedbacks]);

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const formattedSelectedDate = `${y}-${m}-${d}`; // 예: "2025-11-06"
    const summaryDate = `${selectedDate.getMonth() + 1}.${selectedDate.getDate()}`;

    const selectedFeedbacks = aiFeedbacks.filter(feedback =>
        feedback.userQuestAttempt?.loginDateKST?.startsWith(formattedSelectedDate)
    );

    const dailySummaryData = selectedFeedbacks.length > 0
        ? selectedFeedbacks[selectedFeedbacks.length - 1]
        : null; // 일치하는 데이터가 없으면 null 전달

    let transformedSummaryData = null;

    if (dailySummaryData) {
        transformedSummaryData = {
            date: `${selectedDate.getMonth() + 1}.${selectedDate.getDate()}`,
            message: dailySummaryData.title,
            detail: dailySummaryData.message
        };
    } else {
        // console.log(dailySummaryData)
        // transformedSummaryData = {
        //     date: `${selectedDate.getMonth() + 1}.${selectedDate.getDate()}`,
        //     message: '학습 피드백이 없어요',
        //     detail: ''
        // };
    }

    return (
        <div className="">
            <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={(newDate) => {
                    if (user) {
                        const year = newDate.getFullYear();
                        const month = newDate.getMonth() + 1;
                        fetchQuestAttempts(user.userId, year, month);
                        fetchQuestAttemptAiFeedbacks(user.userId, year, month);
                    }
                }}
                loginedDates={loginedDates}
                attemptedDates={attemptedDates}
            />
            <div className='mb-6' />
            <div className="w-full h-[6px] bg-[#F2F2F7]" />
            <div className='mb-6' />

            <DailySummary date={summaryDate} data={transformedSummaryData} />
        </div>
    );
};

export default LearningStatusPage;