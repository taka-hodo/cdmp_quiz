import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import PracticeSetSelector from '../components/PracticeSetSelector';
import LanguageSelectionDialog from '../components/LanguageSelectionDialog';

const Home: React.FC = () => {
  const { user } = useAuthStore();
  const { setPracticeSet, setLanguage, startPractice, allQuestions } = useQuizStore();
  const navigate = useNavigate();
  const [showPracticeSelector, setShowPracticeSelector] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedPracticeSet, setSelectedPracticeSet] = useState<{
    id: number;
    name: string;
    range: string;
  } | null>(null);

  const handlePracticeSetSelect = (set: number) => {
    // シングルクリック時は選択状態のみ更新（演習は開始しない）
    setPracticeSet(set);
  };

  const handlePracticeSetDoubleClick = (set: number, setInfo: { name: string; range: string }) => {
    setSelectedPracticeSet({ id: set, name: setInfo.name, range: setInfo.range });
    setShowLanguageDialog(true);
  };

  const handleLanguageSelect = (language: 'ja' | 'en') => {
    console.log('Language button clicked:', language, 'selectedPracticeSet:', selectedPracticeSet);
    if (selectedPracticeSet) {
      console.log('Setting practice set:', selectedPracticeSet.id, 'and language:', language);
      setPracticeSet(selectedPracticeSet.id);
      setLanguage(language);
      setShowLanguageDialog(false);
      
      // データ読み込み完了を待ってから演習を開始
      const waitForDataAndStart = () => {
        console.log('Checking allQuestions length:', allQuestions.length);
        if (allQuestions.length > 0) {
          console.log('Data loaded, starting practice and navigating...');
          startPractice();
          navigate('/practice');
        } else {
          console.log('Data not ready, waiting 10ms...');
          // 10ms後に再チェック
          setTimeout(waitForDataAndStart, 10);
        }
      };
      
      // 少し待ってからチェック開始（言語変更のuseEffectが発火するため）
      setTimeout(waitForDataAndStart, 50);
    }
  };

  const handleLanguageDialogClose = () => {
    setShowLanguageDialog(false);
    setSelectedPracticeSet(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CDMP練習サイト</h1>
          <p className="text-xl text-gray-600">CDMPの資格取得を目指して効率的に学習しましょう</p>
          {user && (
            <p className="mt-4 text-gray-700">
              ようこそ、<span className="font-semibold">{user.user_metadata?.full_name || user.email}</span> さん
            </p>
          )}
        </div>

        {!showPracticeSelector ? (
          <div className="grid md:grid-cols-3 gap-8">
            {/* 演習モード */}
            <button
              onClick={() => setShowPracticeSelector(true)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">演習モード</h3>
                <p className="text-gray-600">
                  799問から200問ずつを選んで練習します。
                  各問題で即座に解説を確認できます。
                </p>
              </div>
            </button>

          {/* テストモード */}
          <Link
            to="/test"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">テストモード</h3>
              <p className="text-gray-600">
                制限時間内に複数の問題を連続で解いて、
                本番に近い環境でスキルをテストできます。
              </p>
            </div>
          </Link>

          {/* マイページ */}
          <Link
            to="/mypage"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">マイページ</h3>
              <p className="text-gray-600">
                学習履歴や成績を確認できます。
                間違えた問題を復習して、弱点を克服しましょう。
              </p>
            </div>
          </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <button
                onClick={() => setShowPracticeSelector(false)}
                className="text-blue-600 hover:text-blue-800 text-sm mb-4"
              >
                ← ホームに戻る
              </button>
              <PracticeSetSelector 
                onSetSelect={handlePracticeSetSelect}
                onSetDoubleClick={handlePracticeSetDoubleClick}
              />
            </div>
          </div>
        )}

        <LanguageSelectionDialog
          isOpen={showLanguageDialog}
          practiceSetName={selectedPracticeSet?.name || ''}
          practiceSetRange={selectedPracticeSet?.range || ''}
          onLanguageSelect={handleLanguageSelect}
          onClose={handleLanguageDialogClose}
        />

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">CDMPとは</h2>
          <p className="text-gray-600 leading-relaxed">
            CDMP（Certified Data Management Professional）は、
            データマネジメント分野における国際的な資格認定制度です。
            データガバナンス、データアーキテクチャ、データ品質管理など、
            現代のデータ駆動型組織に必要な知識とスキルを体系的に学習できます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;