const Footer = () => {
    return (
        <footer className="px-4 py-4 flex flex-col items-center text-center">
            {/* 로고 영역 */}
            <div className="flex items-center gap-3 mb-3 text-[10px] text-[#1E1E1E]">
                <span className="text-sm font-medium tracking-tight">kakao</span>
                <span className="w-[1px] h-3 bg-gray-300"></span>
                <a
                    href="https://techforimpact.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold tracking-tighter hover:text-gray-800 transition-colors"
                >
                    TECH FOR !MPACT
                </a>
            </div>

            {/* 안내 문구 */}
            <p className="text-[10px] text-[#000000] leading-relaxed break-keep">
                본 서비스는 카카오임팩트 재단의 지원과 <br className="sm:hidden" />
                테크포임팩트 커뮤니티의 기여로 개발되었습니다.
            </p>
        </footer>
    );
};

export default Footer;