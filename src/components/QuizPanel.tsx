import React from 'react';
import { useQuizStore } from '../store/quizStore';
import ProgressBar from './ProgressBar';
import QuestionDisplay from './QuestionDisplay';
import OptionButtons from './OptionButtons';
import ExplanationBox from './ExplanationBox';
import BookmarkButton from './BookmarkButton';

interface QuizPanelProps {
  showQuestionNumber?: boolean;
}

const QuizPanel: React.FC<QuizPanelProps> = ({ showQuestionNumber = false }) => {
  const { questions, currentQuestionIndex } = useQuizStore();
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">問題がありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressBar />
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            問題 {showQuestionNumber ? currentQuestionIndex + 1 : currentQuestion.id}
          </h2>
          <BookmarkButton questionId={currentQuestion.id} />
        </div>
        
        <QuestionDisplay question={currentQuestion} />
        
        <div className="mt-8">
          <OptionButtons question={currentQuestion} />
        </div>
        
        <ExplanationBox question={currentQuestion} />
      </div>
    </div>
  );
};

export default QuizPanel;