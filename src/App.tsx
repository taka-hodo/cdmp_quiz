import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Test from './pages/Test';
import MyPage from './pages/MyPage';
import Auth from './components/Auth';
import { useQuizStore } from './store/quizStore';
import { useAuthStore } from './store/authStore';
import { loadQuestions } from './utils/questionLoader';
import { shuffleQuestionsAndOptions } from './utils/shuffleUtils';
import { supabase } from './lib/supabase';

function App() {
  const { setAllQuestions, language, practiceSet } = useQuizStore();
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  useEffect(() => {
    const initializeQuestions = async () => {
      console.log(`Loading all questions in ${language}...`);
      // 全ての問題を読み込み（演習セット別のフィルタリングは後で行う）
      const questions = await loadQuestions(language);
      console.log('Loaded all questions:', questions.length);
      setAllQuestions(questions);
    };
    
    initializeQuestions();
  }, [setAllQuestions, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/test" element={<Test />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;