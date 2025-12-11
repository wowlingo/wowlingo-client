import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import 'sonner/dist/styles.css';
import { Toaster } from "sonner";
import clarity from '@microsoft/clarity';
import LearningFlow from './layouts/LearningFlow';
import LearningStepPage from './pages/LearningStepPage';
import LearningIntroPage from './pages/LearningIntroPage';
import Home from './pages/Home';
import LearningStatusPage from './pages/LearningStatusPage';
import MainLayout from './components/layout/MainLayout';
import ReviewNotesPage from './pages/ReviewNotesPage';
import VocabularyPage from './pages/VocabularyPage';
import { AuthProvider } from './components/common/AuthContext';

if (typeof window !== 'undefined' && import.meta.env.VITE_CLARITY_PROJECT_ID) {
  clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/learning-status',
        element: <LearningStatusPage />,
      },
      {
        path: '/review-notes',
        element: <ReviewNotesPage />,
      },
      {
        path: '/vocabulary',
        element: <VocabularyPage />,
      },
    ],
  },
  {
    path: '/learning/intro/:questId?',
    element: <LearningIntroPage />,
  },
  {
    path: "/learning/:questId",
    element: <LearningFlow />, // 랜덤 레이아웃.
    children: [
      {
        path: ':stepId', // 동적 경로 파라미터 사용
        element: <LearningStepPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
    <Toaster
      theme="dark"
      position="bottom-center"
      richColors
      toastOptions={{
        style: {
          // width: '335px',
          height: '63px',
          padding: '18px 20px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          borderRadius: '999px',
          boxSizing: 'border-box',
          fontSize: '18px',
          pointerEvents: 'none',
        },
        className: 'shadow-lg',
        classNames: {
          actionButton: 'custom-toast-action-button',
          title: 'custom-toast-title'
        }
      }}
    />
  </>
);
