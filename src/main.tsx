import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import LearningLayout from './layouts/LearningLayout';
import LearningStepPage from './pages/LearningStepPage';
import GameClearPage from './pages/GameClearPage';
import LearningIntroPage from './pages/LearningIntroPage';
import GameLayout from './layouts/GameLayout';
import GameStepPage from './pages/GameStepPage';
import GameResultPage from './pages/GameResultPage';
import GameIntroPage from './pages/GameIntroPage';
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
    // element: <RandomLearningLayout />, // 랜덤 레이아웃.
    element: <LearningLayout />,
    children: [
      {
        path: ':stepId', // 동적 경로 파라미터 사용
        element: <LearningStepPage />,
      },
    ],
  },
  {
    path: '/result',
    element: <GameClearPage />,
  },
  // 새로운 게임 페이지들
  {
    path: '/game/intro',
    element: <GameIntroPage />,
  },
  {
    path: "/game",
    element: <GameLayout />,
    children: [
      {
        path: ':stepId',
        element: <GameStepPage />,
      },
    ],
  },
  {
    path: '/game/result',
    element: <GameResultPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
