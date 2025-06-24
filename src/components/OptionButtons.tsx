import React from 'react';
import { useQuizStore } from '../store/quizStore';
import type { Question } from '../types';
import { supabase } from '../lib/supabase';

interface OptionButtonsProps {
  question: Question;
}

const OptionButtons: React.FC<OptionButtonsProps> = ({ question }) => {
  const { 
    selectedAnswer, 
    setSelectedAnswer, 
    showExplanation, 
    setShowExplanation,
    recordAnswer 
  } = useQuizStore();

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    // 正誤判定とログは解説表示時に実行
  };

  const handleShowExplanation = async () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
      
      // 解説表示時に正誤判定を実行
      const isCorrect = selectedAnswer === question.correctIndex;
      recordAnswer(question.id, isCorrect);
      
      // Log answer to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const response = await supabase.functions.invoke('log-answer', {
            body: {
              questionId: question.id,
              chosenIndex: selectedAnswer,
              isCorrect
            }
          });
          console.log('Answer logged:', response);
        }
      } catch (error) {
        console.error('Failed to log answer:', error);
      }
    }
  };

  const getButtonStyle = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index
        ? 'bg-blue-100 border-blue-500'
        : 'bg-white hover:bg-gray-50 border-gray-300';
    }
    
    const isCorrect = index === question.correctIndex;
    const isSelected = selectedAnswer === index;
    
    if (isCorrect) {
      return 'bg-green-100 border-green-500';
    } else if (isSelected) {
      return 'bg-red-100 border-red-500';
    }
    
    return 'bg-gray-50 border-gray-300';
  };

  return (
    <div>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(index)}
            disabled={showExplanation}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${getButtonStyle(index)}`}
          >
            <span className="font-medium mr-3">{index + 1}.</span>
            {option.text}
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={handleShowExplanation}
          disabled={selectedAnswer === null || showExplanation}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedAnswer === null || showExplanation
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          解説を見る
        </button>
      </div>
    </div>
  );
};

export default OptionButtons;