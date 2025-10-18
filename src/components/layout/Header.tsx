import { NavLink } from '../ui/NavLink';

const Header = () => {
    return (
        <header className="sticky top-0 bg-white shadow-sm z-10">
            <div className="bg-gray-100">
                <nav className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
                    <div className="flex space-x-4 text-gray-500">
                        <NavLink to="/home">홈</NavLink>
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