export interface Choice {
  id: string;
  text: string;
}
export interface Question {
  id: string;
  ttsText: string;
  choices: Choice[];
  correctId: string;
}
