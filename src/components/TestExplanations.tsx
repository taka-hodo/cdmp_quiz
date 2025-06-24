import React, { useState } from 'react';
import type { Question } from '../types';

interface TestExplanationsProps {
  testQuestions: Question[];
  selectedAnswers: (number | null)[];
  correctAnswers: number[];
  incorrectAnswers: number[];
  unansweredQuestions: number[];
  onClose: () => void;
  testResult?: {
    score: number;
    completedAt: string;
    timeSpent: number;
  };
}

const TestExplanations: React.FC<TestExplanationsProps> = ({
  testQuestions,
  selectedAnswers,
  correctAnswers,
  incorrectAnswers,
  unansweredQuestions,
  onClose,
  testResult
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');

  const getQuestionStatus = (questionId: number) => {
    if (correctAnswers.includes(questionId)) return 'correct';
    if (incorrectAnswers.includes(questionId)) return 'incorrect';
    if (unansweredQuestions.includes(questionId)) return 'unanswered';
    return 'unknown';
  };

  const getFilteredQuestions = () => {
    return testQuestions.filter((question) => {
      const status = getQuestionStatus(question.id);
      if (filter === 'all') return true;
      return status === filter;
    });
  };

  const filteredQuestions = getFilteredQuestions();
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const currentQuestionIndexInOriginal = testQuestions.findIndex(q => q.id === currentQuestion?.id);
  const selectedAnswer = selectedAnswers[currentQuestionIndexInOriginal];
  const status = getQuestionStatus(currentQuestion?.id || 0);

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'text-green-600 bg-green-50';
      case 'incorrect': return 'text-red-600 bg-red-50';
      case 'unanswered': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'correct': return '正解';
      case 'incorrect': return '不正解';
      case 'unanswered': return '未回答';
      default: return '不明';
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">解説</h1>
              <p className="text-gray-600 mb-4">表示する問題がありません。</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">テスト解説</h1>
              {testResult && (
                <div className="text-sm text-gray-600 mt-1">
                  受験日: {new Date(testResult.completedAt).toLocaleDateString('ja-JP')} | 
                  スコア: {testResult.score}% | 
                  所要時間: {Math.floor(testResult.timeSpent / 60)}:{(testResult.timeSpent % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {testResult ? 'マイページに戻る' : '結果画面に戻る'}
            </button>
          </div>
          
          {/* フィルター */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => { setFilter('all'); setCurrentQuestionIndex(0); }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全て ({testQuestions.length})
            </button>
            <button
              onClick={() => { setFilter('correct'); setCurrentQuestionIndex(0); }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              正解 ({correctAnswers.length})
            </button>
            <button
              onClick={() => { setFilter('incorrect'); setCurrentQuestionIndex(0); }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'incorrect' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              不正解 ({incorrectAnswers.length})
            </button>
            <button
              onClick={() => { setFilter('unanswered'); setCurrentQuestionIndex(0); }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'unanswered' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              未回答 ({unansweredQuestions.length})
            </button>
          </div>

          {/* 進捗 */}
          <div className="text-center">
            <span className="text-gray-600">
              {currentQuestionIndex + 1} / {filteredQuestions.length} 問
            </span>
          </div>
        </div>

        {/* 問題と解説 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* ステータス表示 */}
          <div className="flex items-center justify-between mb-6">
            <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </div>
            <div className="text-sm text-gray-500">
              問題ID: {currentQuestion.id}
            </div>
          </div>

          {/* 問題文 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">問題</h2>
            <p className="text-gray-800 leading-relaxed text-lg">
              {currentQuestion.text}
            </p>
          </div>

          {/* 選択肢 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">選択肢</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctIndex;
                const isSelected = selectedAnswer === index;
                const isUnanswered = selectedAnswer === null;
                
                let optionClass = 'w-full text-left p-4 rounded-lg border-2 ';
                if (isCorrect) {
                  optionClass += 'border-green-500 bg-green-50 ';
                } else if (isSelected && !isUnanswered) {
                  optionClass += 'border-red-500 bg-red-50 ';
                } else {
                  optionClass += 'border-gray-200 bg-white ';
                }
                
                return (
                  <div key={index} className={optionClass}>
                    <div className="flex items-start">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 ${
                        isCorrect 
                          ? 'bg-green-500 text-white' 
                          : isSelected && !isUnanswered
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="flex-1">
                        <div className="text-gray-800">{option.text}</div>
                        {isCorrect && (
                          <div className="text-green-700 text-sm mt-1 font-medium">
                            ✓ 正解
                          </div>
                        )}
                        {isSelected && !isUnanswered && !isCorrect && (
                          <div className="text-red-700 text-sm mt-1 font-medium">
                            ✗ あなたの回答
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 解説 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">解説</h3>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-800 leading-relaxed">
                {currentQuestion.explanations[currentQuestion.correctIndex]}
              </p>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              前の問題
            </button>
            
            <div className="text-center">
              <span className="text-gray-600">
                {currentQuestionIndex + 1} / {filteredQuestions.length}
              </span>
            </div>
            
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              次の問題
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExplanations;