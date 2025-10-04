import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import WordTest from "./features/wordtest/WordTest";
import { SpacePlanetQuestion } from "./features/space";
import LearningLayout from './layouts/LearningLayout';
import LearningStepPage from './pages/LearningStepPage';
import GameClearPage from './pages/GameClearPage';
import LearningIntroPage from './pages/LearningIntroPage';
import Home from './pages/Home';
import LearningStatusPage from './pages/LearningStatusPage';
import MainLayout from './components/layout/MainLayout';
import ReviewNotesPage from './pages/ReviewNotesPage';
import VocabularyPage from './pages/VocabularyPage';


import RandomLearningLayout from './layouts/RandomLearningLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <WordTest /> },
      { path: "space", element: <SpacePlanetQuestion /> },
    ],
  },
  {
    path: "/home",
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
    path: '/learning/intro',
    element: <LearningIntroPage />,
  },
  {
    path: "/learning",
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
