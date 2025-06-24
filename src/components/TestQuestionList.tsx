import React from 'react';

interface TestQuestionListProps {
  testQuestions: any[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  onQuestionSelect: (index: number) => void;
}

const TestQuestionList: React.FC<TestQuestionListProps> = ({
  testQuestions,
  currentQuestionIndex,
  selectedAnswers,
  onQuestionSelect
}) => {
  const getStatusIcon = (index: number) => {
    return selectedAnswers[index] !== null ? '●' : '○';
  };

  return (
    <div className="p-4">
      {testQuestions.map((question, index) => {
        const isActive = index === currentQuestionIndex;
        
        return (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            className={`w-full text-left p-3 mb-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 border-2 border-blue-500' 
                : 'hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  {getStatusIcon(index)}
                </span>
                <span className="text-sm font-medium">
                  問題 {index + 1}
                </span>
              </div>
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

export default TestQuestionList;