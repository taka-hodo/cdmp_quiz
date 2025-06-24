import type { Question } from '../types';

interface QuestionData {
  questions: Question[];
}

// .backup ファイル用のインターフェース
interface BackupChoice {
  choice: string;
  explanation: string;
}

interface BackupQuestion {
  number: number;
  question: string;
  choices: BackupChoice[];
  correct: number;
  domain: string;
}


export async function loadQuestions(language: 'en' | 'ja' = 'en', practiceSet?: number): Promise<Question[]> {
  try {
    const fileName = language === 'ja' ? 'cdmp_questions_ja.json.backup' : 'cdmp_questions_en.json.backup';
    console.log(`Fetching JSON file: ${fileName}...`);
    const response = await fetch(`/data/${fileName}`);
    console.log('Request URL:', new URL(`/data/${fileName}`, window.location.origin).href);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }
    
    const jsonText = await response.text();
    console.log('JSON text length:', jsonText.length);
    
    if (jsonText.length < 100) {
      throw new Error(`JSON file appears to be empty or too small. Length: ${jsonText.length}`);
    }
    
    let backupQuestions: BackupQuestion[];
    try {
      backupQuestions = JSON.parse(jsonText);
      console.log('JSON parsing successful');
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      throw new Error(`JSON parsing error: ${parseError.message}`);
    }
    
    if (!backupQuestions || backupQuestions.length === 0) {
      throw new Error(`No questions found in JSON data. Found ${backupQuestions?.length || 0} questions.`);
    }
    
    // .backup形式から現在のアプリ形式に変換
    let questions: Question[] = backupQuestions.map(backupQ => {
      const options = backupQ.choices.map(choice => ({
        id: 0, // 一時的なID
        text: choice.choice,
        explanation: choice.explanation
      }));
      
      const explanations = backupQ.choices.map(choice => choice.explanation);
      
      return {
        id: backupQ.number,
        text: backupQ.question,
        options: options,
        correctIndex: backupQ.correct - 1, // 1-basedから0-basedに変換
        explanations: explanations,
        domain: backupQ.domain
      };
    });
    console.log('Total questions loaded:', questions.length);
    
    // Filter by practice set if specified
    if (practiceSet && practiceSet >= 1 && practiceSet <= 4) {
      const startNum = (practiceSet - 1) * 200 + 1;
      const endNum = Math.min(practiceSet * 200, 799);
      console.log(`Filtering for practice set ${practiceSet}: ${startNum}-${endNum}`);
      console.log(`Questions before filtering: ${questions.length}`);
      
      questions = questions.filter(q => 
        q.id >= startNum && q.id <= endNum
      );
      console.log(`Filtered to practice set ${practiceSet}: ${questions.length} questions (${startNum}-${endNum})`);
    }
    
    console.log('Successfully loaded questions:', questions.length);
    console.log('Sample question:', questions[0]);
    
    if (questions.length === 0) {
      throw new Error('No valid questions found after filtering');
    }
    
    return questions;
  } catch (error) {
    console.error('Error loading questions:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
}