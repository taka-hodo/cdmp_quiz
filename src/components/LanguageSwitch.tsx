import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import ConfirmDialog from './ConfirmDialog';

interface LanguageSwitchProps {
  disabled?: boolean;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ disabled = false }) => {
  const { 
    language, 
    setLanguage, 
    currentQuestionNumber, 
    questions, 
    setCurrentQuestionIndex,
    isTestActive
  } = useQuizStore();

  const [showLanguageConfirm, setShowLanguageConfirm] = useState(false);

  const handleSwitchClick = () => {
    if (!disabled && !isTestActive) {
      setShowLanguageConfirm(true);
    }
  };

  const confirmLanguageSwitch = () => {
    const targetLanguage = language === 'ja' ? 'en' : 'ja';
    setLanguage(targetLanguage);
    setShowLanguageConfirm(false);
  };

  // テストモード中または明示的にdisabledの場合は無効化
  const isDisabled = disabled || isTestActive;

  // 言語切り替え後、同じ問題番号の問題に移動
  useEffect(() => {
    if (questions.length > 0 && currentQuestionNumber) {
      const questionIndex = questions.findIndex(q => q.id === currentQuestionNumber);
      if (questionIndex !== -1) {
        setCurrentQuestionIndex(questionIndex);
      }
    }
  }, [questions, currentQuestionNumber, setCurrentQuestionIndex]);

  const targetLanguage = language === 'ja' ? 'en' : 'ja';
  const buttonText = language === 'ja' ? '英語に切り替える' : '日本語に切り替える';
  const confirmMessage = `${targetLanguage === 'en' ? '英語' : '日本語'}に切り替えますか？`;

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleSwitchClick}
          disabled={isDisabled}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {buttonText}
        </button>
        {isDisabled && (
          <span className="text-xs text-gray-400">
            (テスト中は変更不可)
          </span>
        )}
      </div>

      <ConfirmDialog
        isOpen={showLanguageConfirm}
        title="言語切り替え"
        message={confirmMessage}
        confirmText="YES"
        cancelText="NO"
        onConfirm={confirmLanguageSwitch}
        onCancel={() => setShowLanguageConfirm(false)}
      />
    </>
  );
};

export default LanguageSwitch;