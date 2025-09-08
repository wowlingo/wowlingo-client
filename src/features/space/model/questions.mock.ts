import type { Question } from "./types";

// 임시 문제 데이터
// [TODO] 서버에서 받아오는 걸로 변경
export const QUESTION: Question = {
  id: "q1",
  text: "다음 중 '봄'을 고르세요",
  choices: [
    { id: "a", label: "부엌" },
    { id: "b", label: "봄" },
    { id: "c", label: "바람개비" },
  ],
  correctId: "b",
};
