import { NavLink } from '../ui/NavLink';

type HeaderProps = {
    bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({ bgColor = 'bg-white' }) => {
    return (
        <header className={`sticky top-0 ${bgColor} z-10`}>
            <div className="">
                <nav className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
                    <div className="flex space-x-4 text-black-500">
                        <NavLink to="/">홈</NavLink>
                        <NavLink to="/learning-status">학습현황</NavLink>
                        <NavLink to="/review-notes">오답노트</NavLink>
                        <NavLink to="/vocabulary">단어장</NavLink>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                        <NavLink to="/login" className="text-gray-500">로그인</NavLink>
                    </div> */}
                </nav>
            </div>
        </header>
    );
};

export default Header;