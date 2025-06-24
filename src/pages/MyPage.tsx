import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '../lib/supabase';
import TestExplanations from '../components/TestExplanations';

interface TestResult {
  id: string;
  score: number;
  total_questions: number;
  correct_count: number;
  time_spent: number;
  completed_at: string;
  language?: string;
}

interface TestDetail {
  testQuestions: any[];
  selectedAnswers: (number | null)[];
  correctAnswers: number[];
  incorrectAnswers: number[];
  unansweredQuestions: number[];
}


const MyPage: React.FC = () => {
  const { user } = useAuthStore();
  const { questions } = useQuizStore();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'incorrect'>('results');
  const [selectedTestResult, setSelectedTestResult] = useState<TestResult | null>(null);
  const [showTestDetail, setShowTestDetail] = useState(false);
  const [testDetail, setTestDetail] = useState<TestDetail | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // テスト結果を取得
      const { data: testData, error: testError } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (testError) {
        console.error('Error fetching test results:', testError);
      } else {
        setTestResults(testData || []);
      }

      // 間違えた問題を取得
      const { data: answerData, error: answerError } = await supabase
        .from('answer_logs')
        .select('question_id')
        .eq('user_id', user.id)
        .eq('is_correct', false);

      if (answerError) {
        console.error('Error fetching answer logs:', answerError);
      } else {
        const incorrectIds = [...new Set(answerData?.map(log => log.question_id) || [])];
        setIncorrectQuestions(incorrectIds);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getIncorrectQuestionsData = () => {
    return questions.filter(q => incorrectQuestions.includes(q.id));
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
              {user && (
                <p className="text-gray-600 mt-1">
                  {user.user_metadata?.full_name || user.email}
                </p>
              )}
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 統計情報 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {testResults.length}
              </div>
              <p className="text-gray-600">受験回数</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {testResults.length > 0 
                  ? Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
                  : 0}%
              </div>
              <p className="text-gray-600">平均スコア</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {incorrectQuestions.length}
              </div>
              <p className="text-gray-600">間違えた問題数</p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('results')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                テスト結果履歴
              </button>
              <button
                onClick={() => setActiveTab('incorrect')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'incorrect'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                間違えた問題 ({incorrectQuestions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'results' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">テスト結果履歴</h2>
                {testResults.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    まだテストを受験していません。
                  </p>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <span className={`text-2xl font-bold ${
                                result.score >= 70 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {result.score}%
                              </span>
                              <div className="flex space-x-2">
                                <span className={`px-2 py-1 text-sm rounded ${
                                  result.score >= 70 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {result.score >= 70 ? '合格' : '不合格'}
                                </span>
                                <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
                                  {result.language === 'en' ? '英語' : '日本語'}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              受験日時: {formatDate(result.completed_at)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">所要時間</div>
                            <div className="font-medium">{formatTime(result.time_spent)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'incorrect' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">間違えた問題</h2>
                {incorrectQuestions.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    間違えた問題はありません。
                  </p>
                ) : (
                  <div className="space-y-4">
                    {getIncorrectQuestionsData().map((question) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">
                            問題 {question.id}
                          </h3>
                          {question.domain && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {question.domain}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4">{question.text}</p>
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-sm ${
                                index === question.correctIndex
                                  ? 'bg-green-100 text-green-800 font-medium'
                                  : 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="mr-2">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              {option.text}
                              {index === question.correctIndex && (
                                <span className="ml-2 text-green-600">✓ 正解</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {question.explanations && question.explanations[question.correctIndex] && (
                          <div className="mt-4 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>解説:</strong> {question.explanations[question.correctIndex]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* テスト詳細表示 */}
      {showTestDetail && testDetail && selectedTestResult && (
        <TestExplanations
          testQuestions={testDetail.testQuestions}
          selectedAnswers={testDetail.selectedAnswers}
          correctAnswers={testDetail.correctAnswers}
          incorrectAnswers={testDetail.incorrectAnswers}
          unansweredQuestions={testDetail.unansweredQuestions}
          onClose={() => {
            setShowTestDetail(false);
            setTestDetail(null);
            setSelectedTestResult(null);
          }}
          testResult={{
            score: selectedTestResult.score,
            completedAt: selectedTestResult.completed_at,
            timeSpent: selectedTestResult.time_spent
          }}
        />
      )}
    </div>
  );
};

export default MyPage;