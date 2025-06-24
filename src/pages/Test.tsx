import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { shuffleQuestionsAndOptions } from '../utils/shuffleUtils';
import ConfirmDialog from '../components/ConfirmDialog';
import TestSidebar from '../components/TestSidebar';
import ESLTimeExtensionDialog from '../components/ESLTimeExtensionDialog';
import LanguageSelectionDialog from '../components/LanguageSelectionDialog';
import TestExplanations from '../components/TestExplanations';

interface TestResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number[];
  incorrectAnswers: number[];
  unansweredQuestions: number[];
  completedAt: string;
}

const Test: React.FC = () => {
  const { allQuestions, isTestActive, setIsTestActive, setLanguage, language } = useQuizStore();
  const { user } = useAuthStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 60分 = 3600秒
  const [testQuestions, setTestQuestions] = useState<typeof allQuestions>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [showESLDialog, setShowESLDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [, setUseExtendedTime] = useState(false);

  // テスト用問題数と時間設定
  const TEST_QUESTION_COUNT = 100;
  const PASS_PERCENTAGE = 80;
  const NORMAL_TIME_MINUTES = 90;
  const EXTENDED_TIME_MINUTES = 110;
  const NORMAL_TIME_SECONDS = NORMAL_TIME_MINUTES * 60;
  const EXTENDED_TIME_SECONDS = EXTENDED_TIME_MINUTES * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTestActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, timeLeft]);

  // ナビゲーションからのテスト完了イベントを監視
  useEffect(() => {
    const handleFinishTestEvent = () => {
      if (isTestActive) {
        finishTest();
      }
    };

    window.addEventListener('finishTest', handleFinishTestEvent);
    return () => window.removeEventListener('finishTest', handleFinishTestEvent);
  }, [isTestActive]);

  const showLanguageSelectionDialog = () => {
    console.log('Test start button clicked - showing language dialog');
    setShowLanguageDialog(true);
  };

  const waitForDataAndStartTest = (timeInSeconds: number) => {
    console.log('Waiting for data, allQuestions length:', allQuestions.length);
    if (allQuestions.length > 0) {
      console.log('Data ready, starting test with', timeInSeconds, 'seconds');
      startTestWithTime(timeInSeconds);
    } else {
      console.log('Data not ready, waiting 10ms...');
      setTimeout(() => waitForDataAndStartTest(timeInSeconds), 10);
    }
  };

  const handleLanguageSelect = (language: 'ja' | 'en') => {
    console.log('Language selected:', language);
    setShowLanguageDialog(false);
    setLanguage(language); // 言語状態を更新
    
    if (language === 'en') {
      // 英語の場合はESLダイアログを表示
      console.log('English selected - showing ESL dialog');
      setShowESLDialog(true);
    } else {
      // 日本語の場合は直接テスト開始（データ読み込み完了を待機）
      console.log('Japanese selected - starting test directly');
      waitForDataAndStartTest(NORMAL_TIME_SECONDS);
    }
  };

  const handleESLAccept = () => {
    setUseExtendedTime(true);
    setShowESLDialog(false);
    waitForDataAndStartTest(EXTENDED_TIME_SECONDS);
  };

  const handleESLDecline = () => {
    setUseExtendedTime(false);
    setShowESLDialog(false);
    waitForDataAndStartTest(NORMAL_TIME_SECONDS);
  };

  const startTestWithTime = (timeInSeconds: number) => {
    // 問題をシャッフルして選択
    const shuffledQuestions = shuffleQuestionsAndOptions(allQuestions);
    
    // 問題数が足りない場合は繰り返し
    let selectedQuestions: typeof allQuestions = [];
    if (shuffledQuestions.length === 0) {
      alert('問題がありません。');
      return;
    }
    
    for (let i = 0; i < TEST_QUESTION_COUNT; i++) {
      const questionIndex = i % shuffledQuestions.length;
      selectedQuestions.push(shuffledQuestions[questionIndex]);
    }
    
    setTestQuestions(selectedQuestions);
    setSelectedAnswers(new Array(selectedQuestions.length).fill(null));
    setCurrentQuestionIndex(0);
    setTimeLeft(timeInSeconds);
    setIsTestActive(true);
    setTestResult(null);
    setTestStartTime(Date.now());
  };

  const selectAnswer = (answerIndex: number) => {
    if (!isTestActive) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const checkAndFinishTest = () => {
    // 未解答の問題数をカウント
    const unanswered = selectedAnswers.filter(answer => answer === null).length;
    
    if (unanswered > 0) {
      setUnansweredCount(unanswered);
      setShowCompleteDialog(true);
    } else {
      finishTest();
    }
  };
  
  const finishTest = async () => {
    if (!isTestActive) return;
    
    setIsTestActive(false);
    
    // 解答済み問題数をチェック
    const answeredCount = selectedAnswers.filter(answer => answer !== null).length;
    
    if (answeredCount === 0) {
      // 1問も解いていない場合は結果画面を表示せずホームに戻る
      alert('1問も解答されていません。ホーム画面に戻ります。');
      window.location.href = '/';
      return;
    }
    
    // 結果を計算（100問中の正解数で採点）
    let correctCount = 0;
    const correctAnswers: number[] = [];
    const incorrectAnswers: number[] = [];
    const unansweredQuestions: number[] = [];
    
    testQuestions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer === null) {
        unansweredQuestions.push(question.id);
      } else if (selectedAnswer === question.correctIndex) {
        correctCount++;
        correctAnswers.push(question.id);
      } else {
        incorrectAnswers.push(question.id);
      }
    });
    
    const timeSpent = Math.floor((Date.now() - testStartTime) / 1000);
    const result: TestResult = {
      score: Math.round((correctCount / TEST_QUESTION_COUNT) * 100),
      totalQuestions: TEST_QUESTION_COUNT,
      timeSpent,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      completedAt: new Date().toISOString()
    };
    
    setTestResult(result);
    
    // Supabaseに結果を保存
    if (user) {
      try {
        await supabase.from('test_results').insert({
          user_id: user.id,
          score: result.score,
          total_questions: result.totalQuestions,
          correct_count: correctCount,
          time_spent: result.timeSpent,
          completed_at: result.completedAt,
          language: language
        });
      } catch (error) {
        console.error('Error saving test result:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = testQuestions[currentQuestionIndex];

  // Debug logging
  console.log('Test component render - showESLDialog:', showESLDialog, 'allQuestions length:', allQuestions.length);

  if (showExplanations && testResult) {
    return (
      <TestExplanations
        testQuestions={testQuestions}
        selectedAnswers={selectedAnswers}
        correctAnswers={testResult.correctAnswers}
        incorrectAnswers={testResult.incorrectAnswers}
        unansweredQuestions={testResult.unansweredQuestions}
        onClose={() => setShowExplanations(false)}
      />
    );
  }

  if (testResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">テスト結果</h1>
              <div className="text-6xl font-bold mb-4" style={{ color: testResult.score >= PASS_PERCENTAGE ? '#10B981' : '#EF4444' }}>
                {testResult.score}%
              </div>
              <div className="mb-4">
                <p className="text-xl text-gray-600">
                  {testResult.correctAnswers.length} / {testResult.totalQuestions} 問正解
                </p>
                <p className={`text-lg font-semibold ${
                  testResult.score >= PASS_PERCENTAGE ? 'text-green-600' : 'text-red-600'
                }`}>
                  {testResult.score >= PASS_PERCENTAGE ? '合格' : '不合格'}
                </p>
              </div>
              <p className="text-gray-500 mt-2">
                所要時間: {formatTime(testResult.timeSpent)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">正解した問題</h3>
                <p className="text-green-600">{testResult.correctAnswers.length} 問</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">間違えた問題</h3>
                <p className="text-red-600">{testResult.incorrectAnswers.length} 問</p>
              </div>
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={() => setShowExplanations(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                解説を見る
              </button>
              <button
                onClick={showLanguageSelectionDialog}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                もう一度テストを受ける
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isTestActive) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">テストモード</h1>
              <p className="text-xl text-gray-600 mb-8">
                制限時間内に問題を解いて、実力をテストしましょう
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">テスト概要</h2>
                <ul className="text-left text-blue-800 space-y-2">
                  <li>• 問題数: {TEST_QUESTION_COUNT} 問</li>
                  <li>• 制限時間: {NORMAL_TIME_MINUTES}分（ESL受験者は+20分延長可能）</li>
                  <li>• 合格基準: {PASS_PERCENTAGE}% 以上</li>
                  <li>• 問題と選択肢はランダムに表示されます</li>
                  <li>• 途中で戻って答えを変更できます</li>
                  <li>• 正誤はテスト終了後に表示されます</li>
                  <li>• 時間切れまたは全問回答で自動終了します</li>
                  <li>• テスト中は言語切り替えができません</li>
                </ul>
              </div>

              <button
                onClick={showLanguageSelectionDialog}
                disabled={allQuestions.length === 0}
                className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                テストを開始する
                {allQuestions.length === 0 && ' (無効)'}
                {allQuestions.length > 0 && ` (${allQuestions.length}問利用可能)`}
              </button>
            </div>
          </div>
        </div>
        
        <LanguageSelectionDialog
          isOpen={showLanguageDialog}
          practiceSetName="テストモード"
          practiceSetRange={`${TEST_QUESTION_COUNT}問`}
          onLanguageSelect={handleLanguageSelect}
          onClose={() => setShowLanguageDialog(false)}
        />
        
        <ESLTimeExtensionDialog
          isOpen={showESLDialog}
          onAccept={handleESLAccept}
          onDecline={handleESLDecline}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <TestSidebar 
        testQuestions={testQuestions}
        currentQuestionIndex={currentQuestionIndex}
        selectedAnswers={selectedAnswers}
        timeLeft={timeLeft}
        onQuestionSelect={setCurrentQuestionIndex}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* ヘッダー */}
        <div className="mb-4 bg-white border-b px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">テストモード</h2>
              <span className="text-gray-600">
                {currentQuestionIndex + 1} / {testQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                問題 {currentQuestionIndex + 1}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {currentQuestion?.text}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-800">{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ナビゲーション */}
            <div className="flex justify-between items-center">
              <div></div>
              
              <div className="flex space-x-2">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300"
                >
                  戻る
                </button>
                {currentQuestionIndex < testQuestions.length - 1 && (
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    次へ
                  </button>
                )}
              </div>
              
              <button
                onClick={checkAndFinishTest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                テストを完了する
              </button>
            </div>
          </div>
        </div>
        
        <ConfirmDialog
          isOpen={showCompleteDialog}
          title="未解答の問題があります"
          message={`${unansweredCount}問の未解答問題があります。\n本当にテストを終了しますか？`}
          confirmText="それでも完了する"
          cancelText="問題に戻る"
          onConfirm={() => {
            setShowCompleteDialog(false);
            finishTest();
          }}
          onCancel={() => setShowCompleteDialog(false)}
          isWarning={true}
        />
        
      </main>
      
      <ESLTimeExtensionDialog
        isOpen={showESLDialog}
        onAccept={handleESLAccept}
        onDecline={handleESLDecline}
      />
    </div>
  );
};

export default Test;