// src/types/question.ts

export interface BaseQuestion {
  question: string;
  difficulty?: string;
  explanation?: string;
}

export interface MCQQuestion extends BaseQuestion {
  options: string[];
  correct?: number;
}

export interface TextQuestion extends BaseQuestion {
  options?: never;
}

export type Question = MCQQuestion | TextQuestion;
