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
    path: '/learning/intro',
    element: <LearningIntroPage />,
  },
  {
    path: "/learning",
    element: <LearningLayout />, // 공통 레이아웃을 부모로 지정
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
