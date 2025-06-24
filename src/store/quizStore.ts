import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, FilterOption, DomainFilterOption } from '../types';

interface PracticeProgress {
  questions: Question[];
  currentQuestionIndex: number;
  answerHistory: Map<number, boolean>;
  savedAt: string;
}

interface QuizStore {
  questions: Question[];
  allQuestions: Question[]; // 全問題を保持
  currentQuestionIndex: number;
  showExplanation: boolean;
  selectedAnswer: number | null;
  filter: FilterOption;
  domainFilter: DomainFilterOption;
  bookmarks: Set<number>;
  answerHistory: Map<number, boolean>;
  practiceProgress: PracticeProgress | null;
  isPracticeActive: boolean; // 演習モードが進行中か
  isTestActive: boolean; // テストモードが進行中か
  language: 'en' | 'ja'; // 言語設定
  practiceSet: number; // 演習セット (1-4)
  currentQuestionNumber: number; // 現在の問題番号（言語切り替え時に維持）
  
  setQuestions: (questions: Question[]) => void;
  setAllQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setShowExplanation: (show: boolean) => void;
  setSelectedAnswer: (index: number | null) => void;
  setFilter: (filter: FilterOption) => void;
  setDomainFilter: (filter: DomainFilterOption) => void;
  toggleBookmark: (questionId: number) => void;
  recordAnswer: (questionId: number, isCorrect: boolean) => void;
  resetQuiz: () => void;
  startPractice: () => void;
  savePracticeProgress: () => void;
  resumePractice: () => void;
  clearPracticeProgress: () => void;
  setIsPracticeActive: (active: boolean) => void;
  setIsTestActive: (active: boolean) => void;
  setLanguage: (language: 'en' | 'ja') => void;
  setPracticeSet: (set: number) => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      questions: [],
      allQuestions: [],
      currentQuestionIndex: 0,
      showExplanation: false,
      selectedAnswer: null,
      filter: 'all',
      domainFilter: 'all',
      bookmarks: new Set(),
      answerHistory: new Map(),
      practiceProgress: null,
      isPracticeActive: false,
      isTestActive: false,
      language: 'en',
      practiceSet: 1,
      currentQuestionNumber: 1,
      
      setQuestions: (questions) => set({ questions }),
      
      setAllQuestions: (questions) => set({ allQuestions: questions }),
      
      setCurrentQuestionIndex: (index) => set((state) => ({ 
        currentQuestionIndex: index,
        showExplanation: false,
        selectedAnswer: null,
        currentQuestionNumber: state.questions[index]?.id || 1
      })),
      
      setShowExplanation: (show) => set({ showExplanation: show }),
      
      setSelectedAnswer: (index) => set({ selectedAnswer: index }),
      
      setFilter: (filter) => set({ filter }),
      
      setDomainFilter: (filter) => set({ domainFilter: filter }),
      
      toggleBookmark: (questionId) => set((state) => {
        const newBookmarks = new Set(state.bookmarks);
        if (newBookmarks.has(questionId)) {
          newBookmarks.delete(questionId);
        } else {
          newBookmarks.add(questionId);
        }
        return { bookmarks: newBookmarks };
      }),
      
      recordAnswer: (questionId, isCorrect) => set((state) => {
        const newAnswerHistory = new Map(state.answerHistory);
        newAnswerHistory.set(questionId, isCorrect);
        return { answerHistory: newAnswerHistory };
      }),
      
      resetQuiz: () => set({
        currentQuestionIndex: 0,
        showExplanation: false,
        selectedAnswer: null,
        answerHistory: new Map()
      }),
      
      startPractice: () => set((state) => {
        console.log('startPractice called with allQuestions length:', state.allQuestions.length);
        console.log('Current practice set:', state.practiceSet);
        
        if (state.allQuestions.length === 0) {
          console.error('No questions available in allQuestions');
          return { questions: [] };
        }
        
        // 演習セットに応じて問題をフィルタリング
        let filteredQuestions = state.allQuestions;
        if (state.practiceSet >= 1 && state.practiceSet <= 4) {
          const startNum = (state.practiceSet - 1) * 200 + 1;
          const endNum = Math.min(state.practiceSet * 200, 799);
          console.log(`Filtering for practice set ${state.practiceSet}: ${startNum}-${endNum}`);
          
          filteredQuestions = state.allQuestions.filter(q => 
            q.id >= startNum && q.id <= endNum
          );
          console.log(`Filtered to practice set ${state.practiceSet}: ${filteredQuestions.length} questions`);
        }
        
        if (filteredQuestions.length === 0) {
          console.error('No questions found for practice set:', state.practiceSet);
          return { questions: [] };
        }
        
        // 演習モードではシャッフルしない（順番通りに出題）
        console.log('Practice questions (no shuffle):', filteredQuestions.length);
        
        if (filteredQuestions.length === 0) {
          console.error('No filtered questions available');
          return { questions: [] };
        }
        
        console.log('Selected questions for practice:', filteredQuestions.length);
        
        return {
          questions: filteredQuestions,
          currentQuestionIndex: 0,
          showExplanation: false,
          selectedAnswer: null,
          isPracticeActive: true
        };
      }),
      
      savePracticeProgress: () => set((state) => {
        const progress: PracticeProgress = {
          questions: state.questions,
          currentQuestionIndex: state.currentQuestionIndex,
          answerHistory: state.answerHistory,
          savedAt: new Date().toISOString()
        };
        return { 
          practiceProgress: progress,
          isPracticeActive: false
        };
      }),
      
      resumePractice: () => set((state) => {
        if (state.practiceProgress) {
          return {
            questions: state.practiceProgress.questions,
            currentQuestionIndex: state.practiceProgress.currentQuestionIndex,
            answerHistory: state.practiceProgress.answerHistory,
            showExplanation: false,
            selectedAnswer: null,
            isPracticeActive: true
          };
        }
        return state;
      }),
      
      clearPracticeProgress: () => set({ 
        practiceProgress: null,
        isPracticeActive: false 
      }),
      
      setIsPracticeActive: (active) => set({ isPracticeActive: active }),
      
      setIsTestActive: (active) => set({ isTestActive: active }),
      
      setLanguage: (language) => set(() => ({
        language,
        // 言語切り替え時に問題関連の状態をリセット（但し問題番号は維持）
        questions: [],
        currentQuestionIndex: 0,
        showExplanation: false,
        selectedAnswer: null
        // currentQuestionNumberは維持して言語切り替え時に同じ問題を表示
      })),
      
      setPracticeSet: (practiceSetNumber) => set({ practiceSet: practiceSetNumber })
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        bookmarks: Array.from(state.bookmarks) as number[],
        lastOpenQuestion: state.currentQuestionIndex,
        language: state.language,
        practiceSet: state.practiceSet,
        currentQuestionNumber: state.currentQuestionNumber,
        practiceProgress: state.practiceProgress ? {
          ...state.practiceProgress,
          answerHistory: Array.from(state.practiceProgress.answerHistory.entries()) as [number, boolean][]
        } : null
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.bookmarks) {
            state.bookmarks = new Set(state.bookmarks as unknown as number[]);
          }
          if (state.practiceProgress && state.practiceProgress.answerHistory) {
            state.practiceProgress.answerHistory = new Map(state.practiceProgress.answerHistory as unknown as [number, boolean][]);
          }
        }
      }
    }
  )
);