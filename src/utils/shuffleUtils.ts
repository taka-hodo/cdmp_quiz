import type { Question } from '../types';

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle questions
export const shuffleQuestions = (questions: Question[]): Question[] => {
  return shuffleArray(questions);
};

// Shuffle options within a question while maintaining correctness
export const shuffleQuestionOptions = (question: Question): Question => {
  const originalOptions = question.options;
  const originalCorrectIndex = question.correctIndex;
  const originalExplanations = question.explanations;
  
  // Create array of indices to shuffle
  const indices = [0, 1, 2, 3, 4];
  const shuffledIndices = shuffleArray(indices);
  
  // Reorder options, explanations, and find new correct index
  const shuffledOptions = shuffledIndices.map(index => originalOptions[index]);
  const shuffledExplanations = shuffledIndices.map(index => originalExplanations[index]);
  const newCorrectIndex = shuffledIndices.indexOf(originalCorrectIndex);
  
  return {
    ...question,
    options: shuffledOptions,
    explanations: shuffledExplanations,
    correctIndex: newCorrectIndex as 0 | 1 | 2 | 3 | 4
  };
};

// Shuffle both questions and their options
export const shuffleQuestionsAndOptions = (questions: Question[]): Question[] => {
  const shuffledQuestions = shuffleQuestions(questions);
  return shuffledQuestions.map(question => shuffleQuestionOptions(question));
};