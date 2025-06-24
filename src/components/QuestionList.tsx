import React from 'react';
import { useQuizStore } from '../store/quizStore';

const QuestionList: React.FC = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    filter,
    domainFilter,
    bookmarks,
    answerHistory
  } = useQuizStore();

  const filteredQuestions = questions.filter((question) => {
    // Apply status filter
    if (filter === 'bookmarked') {
      if (!bookmarks.has(question.id)) return false;
    } else if (filter === 'correct') {
      if (answerHistory.get(question.id) !== true) return false;
    } else if (filter === 'incorrect') {
      if (answerHistory.get(question.id) !== false) return false;
    }
    
    // Apply domain filter
    if (domainFilter !== 'all' && question.domain !== domainFilter) {
      return false;
    }
    
    return true;
  });

  const getQuestionStatus = (questionId: number) => {
    const isBookmarked = bookmarks.has(questionId);
    const answerStatus = answerHistory.get(questionId);
    
    return { isBookmarked, answerStatus };
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === true) return '✅';
    if (status === false) return '❌';
    return '○';
  };

  return (
    <div className="p-4">
      {filteredQuestions.map((question, filteredIndex) => {
        const { isBookmarked, answerStatus } = getQuestionStatus(question.id);
        const isActive = questions[currentQuestionIndex]?.id === question.id;
        
        return (
          <button
            key={question.id}
            onClick={() => {
              const actualIndex = questions.findIndex(q => q.id === question.id);
              setCurrentQuestionIndex(actualIndex);
            }}
            className={`w-full text-left p-3 mb-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 border-2 border-blue-500' 
                : 'hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  {getStatusIcon(answerStatus)}
                </span>
                <span className="text-sm font-medium">
                  問題 {questions.findIndex(q => q.id === question.id) + 1}
                </span>
              </div>
              {isBookmarked && (
                <span className="text-yellow-500">★</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {question.text}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default QuestionList;