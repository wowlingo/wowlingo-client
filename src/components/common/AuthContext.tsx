import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// 1. 타입 정의
interface User {
    userId: number;
    username: string;
}

interface TokenPayload {
    userId: number;
    username: string;
    iat: number;
    exp: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean; // 로딩 상태 (새로고침 시 깜빡임 방지용)
    login: (token: string, username: string, userId: number) => void;
    logout: () => void;

    // 로그인 모달 관리
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

// 2. Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider 컴포넌트 생성
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    // 초기 로딩 시 쿠키 체크 (기존 로직 이동)
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = Cookies.get('accessToken');

            if (token) {
                try {
                    const decoded = jwtDecode<TokenPayload>(token);

                    // 토큰 만료 체크
                    if (decoded.exp * 1000 < Date.now()) {
                        console.log("토큰이 만료되었습니다.");
                        handleLogout();
                    } else {
                        // 유저 상태 복구
                        setUser({
                            userId: decoded.userId,
                            username: decoded.username
                        });
                    }
                } catch (error) {
                    console.error("유효하지 않은 토큰입니다.", error);
                    handleLogout();
                }
            }
            setIsLoading(false); // 체크 완료
        };

        checkLoginStatus();
    }, []);

    // 로그인 액션
    const handleLogin = (token: string, nickname: string, id: number) => {
        Cookies.set('accessToken', token, { expires: 1 });
        setUser({ userId: id, username: nickname });

        closeLoginModal();
    };

    // 로그아웃 액션
    const handleLogout = () => {
        Cookies.remove('accessToken');
        setUser(null);
        // 필요 시 페이지 리로드나 리다이렉트
        window.location.href = '/'; 
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login: handleLogin, logout: handleLogout,
            isLoginModalOpen, openLoginModal, closeLoginModal }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Custom Hook 생성 (컴포넌트에서 쉽게 쓰기 위해)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};