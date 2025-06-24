import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import QuizPanel from '../components/QuizPanel';
import ConfirmDialog from '../components/ConfirmDialog';
import QuestionDebug from '../components/QuestionDebug';
import { useQuizStore } from '../store/quizStore';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { 
    startPractice, 
    questions, 
    allQuestions,
    practiceProgress,
    resumePractice, 
    clearPracticeProgress, 
    savePracticeProgress,
    practiceSet,
    language
  } = useQuizStore();
  
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const initializePractice = useCallback(() => {
    if (initialized) return;
    if (allQuestions.length === 0) {
      console.log('Waiting for allQuestions to load...');
      return;
    }
    
    try {
      console.log('Initializing practice with', allQuestions.length, 'questions');
      // 中断した進捗がある場合はダイアログ表示
      if (practiceProgress !== null) {
        console.log('Found practice progress, showing resume dialog');
        setShowResumeDialog(true);
      } else {
        // 進捗がない場合は新規開始
        console.log('No practice progress, starting new practice');
        startPractice();
      }
      setInitialized(true);
    } catch (error) {
      console.error('Practice initialization error:', error);
    }
  }, [practiceProgress, initialized, startPractice, allQuestions]);
  
  useEffect(() => {
    initializePractice();
  }, [initializePractice]);

  // 演習セットまたは言語が変更された時に初期化状態をリセット
  useEffect(() => {
    console.log(`Practice set or language changed: set=${practiceSet}, lang=${language}`);
    setInitialized(false);
    // 進行中の演習を停止
    clearPracticeProgress();
  }, [practiceSet, language, clearPracticeProgress]);
  
  const handleResume = () => {
    resumePractice();
    setShowResumeDialog(false);
    setInitialized(true);
  };
  
  const handleStartNew = () => {
    clearPracticeProgress();
    startPractice();
    setShowResumeDialog(false);
    setInitialized(true);
  };
  
  const handleSuspend = () => {
    savePracticeProgress();
    navigate('/');
  };
  
  // ローディング状態の表示条件を修正
  if ((allQuestions.length === 0 || (questions.length === 0 && !showResumeDialog && initialized))) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">
              {allQuestions.length === 0 ? '問題データを読み込んでいます...' : '問題を準備しています...'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              言語: {language}, 演習セット: {practiceSet}, allQuestions: {allQuestions.length}, questions: {questions.length}, initialized: {initialized.toString()}
            </p>
            <div className="mt-4">
              <QuestionDebug />
            </div>
            {allQuestions.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ 問題データが読み込めません。CSVファイルが正しく配置されているか確認してください。
                </p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4 bg-white border-b px-4 py-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            演習{practiceSet} ({questions.length}問)
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => startPractice()}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              新しい問題セット
            </button>
            <button
              onClick={() => setShowSuspendDialog(true)}
              className="text-orange-600 hover:text-orange-800 text-sm"
            >
              中断
            </button>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
      <QuizPanel showQuestionNumber={false} />
      
      <ConfirmDialog
        isOpen={showResumeDialog}
        title="演習を再開しますか？"
        message="前回の途中から続けるか、最初から始めるか選択してください。"
        confirmText="続きから"
        cancelText="最初から"
        onConfirm={handleResume}
        onCancel={handleStartNew}
      />
      
      <ConfirmDialog
        isOpen={showSuspendDialog}
        title="演習を中断しますか？"
        message="現在の進捗が保存され、後で続きから再開できます。"
        confirmText="中断する"
        cancelText="続ける"
        onConfirm={handleSuspend}
        onCancel={() => setShowSuspendDialog(false)}
      />
    </Layout>
  );
};

export default Practice;