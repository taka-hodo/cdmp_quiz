import React from 'react';
import { useQuizStore } from '../store/quizStore';

const ProgressBar: React.FC = () => {
  const { questions, currentQuestionIndex, answerHistory } = useQuizStore();
  
  const answeredCount = answerHistory.size;
  const correctCount = Array.from(answerHistory.values()).filter(v => v === true).length;
  const progress = (currentQuestionIndex + 1) / questions.length * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>進捗: {currentQuestionIndex + 1} / {questions.length}</span>
        <span>正解数: {correctCount} / {answeredCount}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;