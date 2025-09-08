export interface Choice {
  id: string;
  label: string;
}
export interface Question {
  id: string;
  text: string; // 예: "다음 중 '봄'을 고르세요"
  choices: Choice[]; // 3지선다
  correctId: string;
}
export type PlanetStatus = "idle" | "correct" | "wrong" | "dim";
