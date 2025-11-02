// src/components/learning-status/Calendar.tsx
import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React from 'react';

interface CalendarProps {
    selectedDate: Date; // 선택된 날짜
    onDateSelect: (date: Date) => void;
    onMonthChange: (date: Date) => void;
    loginedDates: number[]; // 로그인한 날(day)
    attemptedDates: number[]; // 학습 시도한 날(day)
}

const Calendar = ({ selectedDate, onDateSelect, onMonthChange, loginedDates, attemptedDates }: CalendarProps) => {
    // 현재 클라이언트 날짜를 기준으로 달력 상태 관리
    const [currentDate, setCurrentDate] = useState(new Date());

    // 오늘 날짜에 대한 정보를 상수로 저장 (스타일링에 사용)
    const today = new Date();

    // 현재 상태(currentDate)를 기반으로 년, 월, 일 정보 추출
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11 (0: 1월)

    // 현재 월의 정보 동적 계산
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0: 일요일, 1: 월요일...
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 현재 월의 마지막 날짜

    // const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    // const emptyDays = Array(firstDayOfMonth).fill(null);
    // const calendarGrid = [...emptyDays, ...dates];
    const calendarGrid = React.useMemo(() => {
        const grid = [];
        for (let i = 0; i < 42; i++) {
            const dayIndex = i - firstDayOfMonth;
            if (dayIndex >= 0 && dayIndex < daysInMonth) {
                grid.push(dayIndex + 1); // 현재 월의 날짜
            } else {
                grid.push(null); // 이전/다음 월의 빈 칸
            }
        }
        return grid;
    }, [year, month]);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    // 월 이동 핸들러 함수
    const goToPreviousMonth = () => {
        const newDate = new Date(year, month - 1, 1); 
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(year, month + 1, 1); 
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    return (
        <div className="flex flex-col">
            {/* 헤더: 동적 월 표시 및 이동 버튼 */}
            <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center justify-center cursor-pointer">
                    <h2 className="text-xl">{`${year}년 ${month + 1}월`}</h2>
                    {/* <ChevronDown className="w-6 h-6 ml-1 text-gray-800" /> */}
                </div>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* 요일 표시 */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-base mb-3">
                {daysOfWeek.map((day, index) => (
                    <div key={day} className={`${index === 0 ? 'text-red-500' : ''} ${index === 6 ? 'text-blue-500' : ''} ${index > 0 && index < 6 ? 'text-gray-400' : ''}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 grid-rows-6 flex-grow place-items-center">
                {calendarGrid.map((date, index) => {
                    if (!date) return <div key={`empty-${index}`}></div>;

                    const fullDate = new Date(year, month, date);

                    // 날짜 비교 로직 수정
                    const isSelected = selectedDate.toDateString() === fullDate.toDateString();
                    const isLogined = loginedDates.includes(date);
                    const isAttempted = loginedDates.includes(date);
                    const isToday = today.toDateString() === fullDate.toDateString();

                    const dayIndex = index % 7;
                    const isSunday = dayIndex === 0;
                    const isSaturday = dayIndex === 6;

                    let dateColorClass = 'text-[#8E8E93]';
                    // if (isSunday) dateColorClass = 'text-red-500';
                    // if (isSaturday) dateColorClass = 'text-blue-500';
                    // 오늘 날짜는 선택되지 않았을 때만 특별한 스타일 적용
                    if (isToday && !isSelected) dateColorClass = 'text-white bg-[#3182F7] rounded-full';
                    if (isSelected) dateColorClass = 'text-blue-600';

                    return (
                        <div
                            key={date}
                            className={`flex flex-col items-center justify-center w-[36px] h-[72px] cursor-pointer rounded-lg transition-colors ${isSelected ? 'bg-blue-100 border border-blue-300' : 'border border-transparent'}`}
                            onClick={() => onDateSelect(fullDate)}
                        >
                            <span className={`text-base mb-1 w-6 h-6 flex items-center justify-center mt-[6px] ${dateColorClass}`}>
                                {date}
                            </span>

                            <img
                                src={isAttempted ? '/images/attempt_date_drop.png' : '/images/attempt_date_drop_default2.png'}
                                className="max-w-full max-h-full object-contain mb-[6px]"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;