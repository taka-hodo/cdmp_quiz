export interface Option {
  id: number;
  text: string;
  explanation: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctIndex: 0 | 1 | 2 | 3 | 4;
  explanations: string[];
  domain?: string;
}

export interface AnswerLog {
  id: string;
  userId: string;
  questionId: number;
  chosenIndex: 0 | 1 | 2 | 3 | 4;
  isCorrect: boolean;
  answeredAt: string;
}

export interface LocalUserState {
  bookmarks: Set<number>;
  lastOpenQuestion: number;
}

export type FilterOption = 'all' | 'bookmarked' | 'correct' | 'incorrect';
export type DomainFilterOption = 'all' | string;

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  showExplanation: boolean;
  selectedAnswer: number | null;
  filter: FilterOption;
  bookmarks: Set<number>;
  answerHistory: Map<number, boolean>;
}