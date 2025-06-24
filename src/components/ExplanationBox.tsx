import React from 'react';
import { useQuizStore } from '../store/quizStore';
import type { Question } from '../types';

interface ExplanationBoxProps {
  question: Question;
}

const ExplanationBox: React.FC<ExplanationBoxProps> = ({ question }) => {
  const { showExplanation, selectedAnswer } = useQuizStore();

  if (!showExplanation || selectedAnswer === null) {
    return null;
  }

  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <div className="mt-8 space-y-4">
      <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? '正解です！' : '不正解です'}
        </p>
        {!isCorrect && (
          <p className="mt-2 text-gray-700">
            正解は「{question.options[question.correctIndex].text}」でした。
          </p>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">解説</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isCorrectOption = index === question.correctIndex;
            const isSelectedOption = index === selectedAnswer;
            
            return (
              <div
                key={option.id}
                className={`p-3 rounded ${
                  isCorrectOption
                    ? 'bg-green-100 border border-green-300'
                    : isSelectedOption
                    ? 'bg-red-100 border border-red-300'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <span className="font-medium mr-2">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="font-medium">{option.text}</p>
                    <p className="text-sm text-gray-600 mt-1">{option.explanation}</p>
                  </div>
                  {isCorrectOption && (
                    <span className="ml-2 text-green-600 font-bold">✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplanationBox;