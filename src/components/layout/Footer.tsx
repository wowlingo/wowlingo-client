import kakaoLogo from '../../assets/kakao_logo.png';
import techForImpactLogo from '../../assets/TF!_Logo_B1.png';

const Footer = () => {
    return (
        <footer className="px-4 py-6 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-3">
                <img
                    src={kakaoLogo}
                    alt="kakao"
                    className="h-3.5 w-auto object-contain"
                />

                <span className="w-[1px] h-3 bg-gray-300"></span>

                <a
                    href="https://techforimpact.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                >
                    <img
                        src={techForImpactLogo}
                        alt="TECH FOR !MPACT"
                        className="h-3.5 w-auto object-contain"
                    />
                </a>
            </div>

            <p className="text-[10px] text-gray-800 leading-relaxed break-keep">
                본 서비스는 카카오임팩트 재단의 지원과 <br className="sm:hidden" />
                테크포임팩트 커뮤니티의 기여로 개발되었습니다.
            </p>
        </footer>
    );
};

export default Footer;