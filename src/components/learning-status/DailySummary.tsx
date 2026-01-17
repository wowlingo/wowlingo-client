import React from 'react';

interface SummaryData {
    date: string;
    message: string;
    // tags: string[];
    detail: string;
}

const DailySummary = ({ date, data }: { date: string, data: SummaryData | null }) => {

    if (!data) {
        return (
            <div>
                <h3 className="text-sm mb-2">{date}</h3>
                <div className="p-5 rounded-lg bg-gray-100 text-center">
                    <p className="text-lg font-semibold text-gray-500">피드백을 작성중이예요</p>
                </div>
            </div>
        );
    }

    const renderDetail = () => {
        if (!data.detail) return null;
        return data.detail.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div>
            <h3 className="text-sm mb-2">{date}</h3>
            <div className="p-5 rounded-lg bg-[#3182F71A]">
                <p className="text-lg font-semibold mb-3">{data.message}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{renderDetail()}</p>
            </div>
        </div>
    );
};

export default DailySummary;