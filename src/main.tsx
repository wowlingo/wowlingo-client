import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import RandomLearningLayout from './layouts/RandomLearningLayout';
import LearningStepPage from './pages/LearningStepPage';
import LearningIntroPage from './pages/LearningIntroPage';
import Home from './pages/Home';
import LearningStatusPage from './pages/LearningStatusPage';
import MainLayout from './components/layout/MainLayout';
import ReviewNotesPage from './pages/ReviewNotesPage';
import VocabularyPage from './pages/VocabularyPage';

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
    element: <RandomLearningLayout />, // 랜덤 레이아웃.
    children: [
      {
        path: ':stepId', // 동적 경로 파라미터 사용
        element: <LearningStepPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
