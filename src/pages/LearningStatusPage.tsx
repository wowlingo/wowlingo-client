// src/pages/LearningStatusPage.tsx
import { useState } from 'react';
import Calendar from '../components/learning-status/Calendar';
import DailySummary from '../components/learning-status/DailySummary';

const LearningStatusPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const completedDates = [7, 8, 13, 14, 15];

    const summaryData = {
        date: `${selectedDate.getMonth() + 1}.${selectedDate.getDate()}`,
        message: '오늘은 20문제 중 15개나 맞추셨어요👏',
        tags: ['#성공적', '#높은정답률', '#듣기능력향상'],
        detail: '모음 구분은 매우 잘하셨고, 특히 동물 단어에서 90% 이상의 정답률을 기록했습니다.',
    };

    return (
        <div className="p-4 space-y-6">
            <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                completedDates={completedDates}
            />
            <DailySummary data={summaryData} />
        </div>
    );
};

export default LearningStatusPage;