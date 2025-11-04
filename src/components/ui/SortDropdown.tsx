import { ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';


export type SortOptionKey = 'latest' | 'oldest' | 'asc' | 'desc';

const SORT_OPTIONS: Record<SortOptionKey, string> = {
    latest: '최신순',
    oldest: '오래된순',
    asc: '가-하순',
    desc: '하-가순',
};

interface SortDropdownProps {
    selected: SortOptionKey;
    onSelect: (option: SortOptionKey) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
    selected,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 드롭다운 바깥 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSelectOption = (option: SortOptionKey) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 현재 선택된 옵션을 보여주는 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-base gap-1 text-black hover:text-black"
            >
                <span>{SORT_OPTIONS[selected]}</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                />
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-100">
                    <ul className="py-2">
                        {/* 모든 옵션을 순서대로 렌더링 */}
                        {(Object.keys(SORT_OPTIONS) as SortOptionKey[]).map((key) => (
                            <li key={key}>
                                <button
                                    onClick={() => handleSelectOption(key)}
                                    className={`w-full text-[16px] text-left px-4 py-2 text-base hover:bg-gray-100 ${selected === key ? 'font-bold text-black' : 'text-gray-500' // 선택된 항목만 굵게
                                        }`}
                                >
                                    {SORT_OPTIONS[key]}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
