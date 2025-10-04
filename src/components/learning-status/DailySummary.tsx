interface SummaryData {
    date: string;
    message: string;
    tags: string[];
    detail: string;
}

const DailySummary = ({ data }: { data: SummaryData }) => {
    return (
        <div className="p-5 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="font-bold mb-2">{data.date}</h3>
            <p className="text-lg font-semibold mb-3">{data.message}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {data.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                        {tag}
                    </span>
                ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{data.detail}</p>
        </div>
    );
};

export default DailySummary;