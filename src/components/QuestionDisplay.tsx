import React from 'react';
import type { Question } from '../types';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="mb-6">
      <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
        {question.text}
      </p>
    </div>
  );
};

export default QuestionDisplay;