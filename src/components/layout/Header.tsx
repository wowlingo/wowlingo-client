import React, { useState } from 'react';
import { NavLink } from '../ui/NavLink';

import LoginModal from '../modals/LoginModal';
import LogoutModal from '../modals/LogoutModal';

interface HeaderProps {
    bgColor?: string;
}

interface User {
    nickname: string;
}

const Header: React.FC<HeaderProps> = ({ bgColor = 'bg-white' }) => {
    // 상태 관리
    const [user, setUser] = useState<User | null>(null); // 로그인된 유저 정보
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // 로그인 모달 열기
    const openLoginModal = () => setIsLoginModalOpen(true);

    // 로그아웃 모달 열기
    const openLogoutModal = () => setIsLogoutModalOpen(true);

    // 모달 닫기
    const closeModals = () => {
        setIsLoginModalOpen(false);
        setIsLogoutModalOpen(false);
    };

    // 로그인 처리 (LoginModal에서 호출됨)
    const handleLogin = (nickname: string) => {
        setUser({ nickname });
        closeModals();
    };

    // 로그아웃 처리 (LogoutModal에서 호출됨)
    const handleLogout = () => {
        setUser(null);
        closeModals();
    };

    return (
        <>
            <header className={`sticky top-0 ${bgColor} z-10`}>
                <div className="">
                    <nav className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
                        <div className="flex space-x-4 text-black-500">
                            <NavLink to="/">홈</NavLink>
                            <NavLink to="/learning-status">학습현황</NavLink>
                            <NavLink to="/review-notes">오답노트</NavLink>
                            <NavLink to="/vocabulary">단어장</NavLink>
                        </div>
                        <div className="flex space-x-4">
                            {user ? (
                                /* 로그인 상태일 때: 닉네임 표시 -> 클릭 시 로그아웃 모달 */
                                <button
                                    onClick={openLogoutModal}
                                    className="text-gray-900 hover:text-gray-600"
                                >
                                    {user.nickname}
                                </button>
                            ) : (
                                /* 비로그인 상태일 때: 로그인 텍스트 -> 클릭 시 로그인 모달 */
                                <button
                                    onClick={openLoginModal}
                                    className="text-gray-500 hover:text-gray-900"
                                >
                                    로그인
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginModalOpen}
                onConfirm={handleLogin}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleLogout}
            />

        </>
    );
};

export default Header;