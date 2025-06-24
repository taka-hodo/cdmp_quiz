import React, { useState } from 'react';
import { loadQuestions } from '../utils/questionLoader';
import * as yaml from 'js-yaml';

const QuestionDebug: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const testFetch = async () => {
    try {
      const response = await fetch('/data/CDMP_questions.yaml');
      const text = await response.text();
      setResult(`Status: ${response.status}\nLength: ${text.length}\nFirst 500 chars:\n${text.substring(0, 500)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const testYAMLParse = async () => {
    try {
      const response = await fetch('/data/CDMP_questions.yaml');
      const text = await response.text();
      const yamlData = yaml.load(text);
      const data = yamlData as { questions?: unknown[] } | null;
      setResult(`YAML Parse Success:\nType: ${typeof yamlData}\nKeys: ${Object.keys(yamlData || {})}\nQuestions: ${data?.questions?.length || 0}\nFirst question: ${JSON.stringify(data?.questions?.[0], null, 2)}`);
    } catch (error) {
      setResult(`YAML Parse Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${error instanceof Error ? error.stack : 'Unknown'}`);
    }
  };
  
  const testFullLoad = async () => {
    try {
      const questions = await loadQuestions();
      setResult(`Full Load Success:\nLoaded questions: ${questions.length}\nFirst question: ${JSON.stringify(questions[0], null, 2)}`);
    } catch (error) {
      setResult(`Full Load Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${error instanceof Error ? error.stack : 'Unknown'}`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 border rounded">
      <h3 className="font-bold mb-2">YAML File Debug</h3>
      <div className="flex gap-2 mb-4">
        <button 
          onClick={testFetch}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Test Fetch
        </button>
        <button 
          onClick={testYAMLParse}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
        >
          Test YAML Parse
        </button>
        <button 
          onClick={testFullLoad}
          className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
        >
          Test Full Load
        </button>
      </div>
      <pre className="text-xs bg-white p-2 border rounded overflow-auto max-h-64">
        {result}
      </pre>
    </div>
  );
};

export default QuestionDebug;