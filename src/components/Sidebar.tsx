import React from 'react';
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import QuestionList from './QuestionList';
import FilterDropdown from './FilterDropdown';
import LanguageSwitch from './LanguageSwitch';

const Sidebar: React.FC = () => {
  const { questions } = useQuizStore();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">CDMP練習サイト</h1>
      </div>
      
      <div className="p-4 space-y-3">
        <FilterDropdown />
        <LanguageSwitch />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <QuestionList />
      </div>
      
      <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
        全{questions.length}問
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

export default Sidebar;