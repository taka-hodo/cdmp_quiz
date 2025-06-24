import React from 'react';

interface ESLTimeExtensionDialogProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ESLTimeExtensionDialog: React.FC<ESLTimeExtensionDialogProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  console.log('ESLTimeExtensionDialog render - isOpen:', isOpen);
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
      style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{ backgroundColor: 'white', border: '3px solid red' }}
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            ESL時間延長オプション
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            CDMPの場合、ESL（English as a Second Language）の受験者には追加で20分の猶予が与えられます。
            <br />
            <br />
            時間延長を希望しますか？
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 text-sm">
              <strong>通常時間:</strong> 90分<br />
              <strong>延長時間:</strong> 110分（+20分）
            </p>
          </div>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onDecline}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              通常時間で開始
            </button>
            <button
              onClick={onAccept}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              20分延長で開始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESLTimeExtensionDialog;