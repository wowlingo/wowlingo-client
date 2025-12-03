import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '../common/AuthContext';
import { NavLink } from '../ui/NavLink';
import LoginModal from '../modals/LoginModal';
import LogoutModal from '../modals/LogoutModal';

interface HeaderProps {
    bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({ bgColor = 'bg-white' }) => {
    const { user, login, logout,
        isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const openLogoutModal = () => setIsLogoutModalOpen(true);

    const closeModals = () => {
        closeLoginModal();
        setIsLogoutModalOpen(false);
    };

    // 로그인 처리 (LoginModal에서 호출됨)
    const handleLogin = async (nickname: string) => {
        // 1. Backend API 호출
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname })
            }
        );

        // 응답 처리
        if (!response.ok) {
            // 에러 처리
            console.error('로그인 실패');
        } else {
            const data = await response.json();
            console.log('로그인 성공', data);

            const { accessToken, userId, username, isNewUser } = data.data;
            if (accessToken) {
                // 3. 쿠키에 토큰 저장 (예: 만료 1일)
                Cookies.set('accessToken', accessToken, { expires: 1 });

                // 4. 상태 업데이트 및 모달 닫기
                // setUser({ userId: userId, username: username });
                login(accessToken, username, userId, isNewUser);
                closeModals();

                console.log('로그인 성공 & 토큰 저장 완료');
            } else {
                alert('로그인 실패: 토큰을 받아오지 못했습니다.');
            }
        }
    };

    // 로그아웃 처리 (LogoutModal에서 호출됨)
    const handleLogout = () => {
        Cookies.remove('accessToken');

        // setUser(null);
        logout()
        closeModals();
    };

    return (
        <>
            <header className={`sticky top-0 ${bgColor} z-10`}>
                <div className="">
                    <nav className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
                        <div className="flex space-x-4 text-black-500">
                            <NavLink to="/">홈</NavLink>
                            <NavLink to="/learning-status" disabled={!user}>학습현황</NavLink>
                            <NavLink to="/review-notes" disabled={!user}>오답노트</NavLink>
                            <NavLink to="/vocabulary" disabled={!user}>단어장</NavLink>
                        </div>
                        <div className="flex space-x-4">
                            {user ? (
                                /* 로그인 상태일 때: 닉네임 표시 -> 클릭 시 로그아웃 모달 */
                                <button
                                    onClick={openLogoutModal}
                                    className="text-gray-900 hover:text-gray-600 text-[14px]"
                                >
                                    {user.username}
                                </button>
                            ) : (
                                /* 비로그인 상태일 때: 로그인 텍스트 -> 클릭 시 로그인 모달 */
                                <button
                                    onClick={openLoginModal}
                                    className="text-gray-500 hover:text-gray-900 text-[14px]"
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
                onClose={closeModals}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleLogout}
                onClose={closeModals}
            />

        </>
    );
};

export default Header;