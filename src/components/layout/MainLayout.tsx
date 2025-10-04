// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto p-4 font-sans">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;