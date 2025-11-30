import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from '../ui/NavLink';
import LoginModal from '../modals/LoginModal';
import LogoutModal from '../modals/LogoutModal';

interface HeaderProps {
    bgColor?: string;
}

interface User {
    userId: number;
    username: string;
}

interface TokenPayload {
    userId: number;
    username: string;
    sub: number; // userId 혹은 고유값
    exp: number; // 만료 시간
}

const Header: React.FC<HeaderProps> = ({ bgColor = 'bg-white' }) => {
    // 상태 관리
    const [user, setUser] = useState<User | null>(null); // 로그인된 유저 정보
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // ★ [핵심 로직] 페이지 새로고침 시 쿠키 확인하여 로그인 상태 복구
    useEffect(() => {
        const token = Cookies.get('accessToken');

        if (token) {
            try {
                // 1. 토큰 디코딩
                const decoded = jwtDecode<TokenPayload>(token);

                // 2. 토큰 만료 여부 확인 (선택 사항이지만 권장)
                // exp는 초 단위이므로 1000을 곱해 밀리초로 변환 후 현재 시간과 비교
                if (decoded.exp * 1000 < Date.now()) {
                    console.log("토큰이 만료되었습니다.");
                    Cookies.remove('accessToken');
                    setUser(null);
                    return;
                }

                // 3. 유저 상태 복구
                // 주의: Backend 토큰 payload에 userId(sub)와 username이 들어있어야 합니다.
                setUser({
                    userId: decoded.sub,
                    username: decoded.username
                });
            } catch (error) {
                console.error("유효하지 않은 토큰입니다.", error);
                Cookies.remove('accessToken'); // 잘못된 토큰이면 삭제
                setUser(null);
            }
        }
    }, []); // 빈 배열([])을 넣어 마운트 시 1회만 실행


    const openLoginModal = () => setIsLoginModalOpen(true);
    const openLogoutModal = () => setIsLogoutModalOpen(true);

    const closeModals = () => {
        setIsLoginModalOpen(false);
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

            const { accessToken, userId, username } = data.data;
            if (accessToken) {
                // 3. 쿠키에 토큰 저장 (예: 만료 1일)
                Cookies.set('accessToken', accessToken, { expires: 1 });

                // 4. 상태 업데이트 및 모달 닫기
                setUser({ userId: userId, username: username });
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