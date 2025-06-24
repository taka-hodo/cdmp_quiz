import React from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import TestQuestionList from './TestQuestionList';
import LanguageSwitch from './LanguageSwitch';

interface TestSidebarProps {
  testQuestions: any[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  timeLeft: number;
  onQuestionSelect: (index: number) => void;
}

const TestSidebar: React.FC<TestSidebarProps> = ({
  testQuestions,
  currentQuestionIndex,
  selectedAnswers,
  timeLeft,
  onQuestionSelect
}) => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const answeredCount = selectedAnswers.filter(answer => answer !== null).length;

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">CDMP練習サイト</h1>
        <p className="text-sm text-gray-600 mt-1">テストモード</p>
      </div>
      
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="text-center">
          <div className="text-sm text-gray-500">残り時間</div>
          <div className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <LanguageSwitch disabled={true} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <TestQuestionList 
          testQuestions={testQuestions}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswers={selectedAnswers}
          onQuestionSelect={onQuestionSelect}
        />
      </div>
      
      <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
        <div>全{testQuestions.length}問</div>
        <div>解答済み: {answeredCount}問</div>
      </div>
      
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            ログアウト
          </button>
        </div>
      )}
    </aside>
  );
};

export default TestSidebar;