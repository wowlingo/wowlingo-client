import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    ttsText: "오리",
    choices: [
      { id: "duck", text: "오리" },
      { id: "we", text: "우리" },
    ],
    correctId: "duck",
  },
  {
    id: "q2",
    ttsText: "바다",
    choices: [
      { id: "sea", text: "바다" },
      { id: "floor", text: "바닥" },
    ],
    correctId: "sea",
  },
  {
    id: "q3",
    ttsText: "사과",
    choices: [
      { id: "apple", text: "사과" },
      { id: "pear", text: "배" },
    ],
    correctId: "apple",
  },
];
