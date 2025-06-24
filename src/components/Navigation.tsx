import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isPracticeActive, savePracticeProgress, isTestActive } = useQuizStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string>('');

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string, event: React.MouseEvent) => {
    // 演習モード中のナビゲーション
    if (isPracticeActive && location.pathname === '/practice' && path !== '/practice') {
      event.preventDefault();
      setPendingPath(path);
      setShowConfirmDialog(true);
    }
    // テストモード中のナビゲーション
    else if (isTestActive && location.pathname === '/test' && path !== '/test') {
      event.preventDefault();
      setPendingPath(path);
      setShowConfirmDialog(true);
    }
  };

  const handleSuspendPractice = () => {
    if (isPracticeActive) {
      savePracticeProgress();
    }
    setShowConfirmDialog(false);
    navigate(pendingPath);
  };

  const handleFinishTest = () => {
    // テスト完了処理をトリガー
    const event = new CustomEvent('finishTest');
    window.dispatchEvent(event);
    setShowConfirmDialog(false);
    navigate(pendingPath);
  };

  const handleContinue = () => {
    setShowConfirmDialog(false);
    setPendingPath('');
  };

  const navItems = [
    { path: '/', label: 'ホーム', icon: 'home' },
    { path: '/practice', label: '演習', icon: 'book' },
    { path: '/test', label: 'テスト', icon: 'clipboard' },
    { path: '/mypage', label: 'マイページ', icon: 'user' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            onClick={(e) => handleNavigation('/', e)}
            className="text-xl font-bold text-gray-900"
          >
            CDMP練習サイト
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavigation(item.path, e)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {getIcon(item.icon)}
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 中断確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            {isTestActive ? (
              // テストモード中
              <>
                <h3 className="text-lg font-semibold mb-4">テストを完了しますか？</h3>
                <p className="text-gray-600 mb-6">
                  テストを完了すると、現在の解答状況で採点が行われ、結果が保存されます。
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={handleContinue}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    続ける
                  </button>
                  <button
                    onClick={handleFinishTest}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    完了する
                  </button>
                </div>
              </>
            ) : (
              // 演習モード中
              <>
                <h3 className="text-lg font-semibold mb-4">演習を中断しますか？</h3>
                <p className="text-gray-600 mb-6">
                  演習を中断すると、現在の進行状況が保存され、後で再開できます。
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={handleContinue}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    中断しない
                  </button>
                  <button
                    onClick={handleSuspendPractice}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    中断する
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;