import React from 'react';
import { useQuizStore } from '../store/quizStore';

interface PracticeSetSelectorProps {
  onSetSelect: (set: number) => void;
  onSetDoubleClick: (set: number, setInfo: { name: string; range: string }) => void;
}

const PracticeSetSelector: React.FC<PracticeSetSelectorProps> = ({ onSetSelect, onSetDoubleClick }) => {
  const { practiceSet, setPracticeSet } = useQuizStore();

  const handleSingleClick = (set: number) => {
    // 即座に選択状態を更新
    setPracticeSet(set);
    onSetSelect(set);
  };

  const handleDoubleClick = (set: number, setInfo: { name: string; range: string }) => {
    // ダブルクリック時は言語選択ダイアログを表示
    onSetDoubleClick(set, setInfo);
  };

  const practiceSetOptions = [
    { id: 1, name: '演習1', range: '問題 1-200', description: 'データ管理基礎' },
    { id: 2, name: '演習2', range: '問題 201-400', description: 'データアーキテクチャ' },
    { id: 3, name: '演習3', range: '問題 401-600', description: 'データストレージと運用' },
    { id: 4, name: '演習4', range: '問題 601-799', description: 'データセキュリティと品質' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">演習セットを選択</h3>
        <p className="text-sm text-gray-600">
          選択してからダブルクリックで言語選択画面に進みます
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {practiceSetOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSingleClick(option.id)}
            onDoubleClick={() => handleDoubleClick(option.id, { name: option.name, range: option.range })}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              practiceSet === option.id
                ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{option.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{option.range}</p>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                {practiceSet === option.id && (
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    ダブルクリックで開始 →
                  </p>
                )}
              </div>
              {practiceSet === option.id && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticeSetSelector;