import React from 'react';

interface LanguageSelectionDialogProps {
  isOpen: boolean;
  practiceSetName: string;
  practiceSetRange: string;
  onLanguageSelect: (language: 'ja' | 'en') => void;
  onClose: () => void;
}

const LanguageSelectionDialog: React.FC<LanguageSelectionDialogProps> = ({
  isOpen,
  practiceSetName,
  practiceSetRange,
  onLanguageSelect,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-mx-4 shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {practiceSetName}を開始
          </h3>
          <p className="text-gray-600">{practiceSetRange}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4 text-center">
            言語を選択してください
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onLanguageSelect('ja')}
              className="w-full p-4 rounded-lg border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🇯🇵</span>
                <div className="text-left">
                  <div className="font-semibold text-blue-900">日本語</div>
                  <div className="text-sm text-blue-700">Japanese</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => onLanguageSelect('en')}
              className="w-full p-4 rounded-lg border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🇺🇸</span>
                <div className="text-left">
                  <div className="font-semibold text-green-900">English</div>
                  <div className="text-sm text-green-700">英語</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionDialog;