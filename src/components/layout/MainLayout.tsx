// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto font-sans">
            <Header />
            <main className='flex-grow px-4 py-6'>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;