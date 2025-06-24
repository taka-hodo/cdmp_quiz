const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least header and one data row');
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  console.log('CSV headers:', headers);
  
  const dataLines = lines.slice(1).filter(line => line.trim().length > 0);
  console.log(`Processing ${dataLines.length} data lines`);
  
  return dataLines.map((line, index) => {
    try {
      // Handle quoted fields that may contain commas
      const fields = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim().replace(/^"|"$/g, ''));
      
      const question = {};
      headers.forEach((header, fieldIndex) => {
        question[header] = fields[fieldIndex] || '';
      });
      
      return question;
    } catch (rowError) {
      console.error(`Error parsing row ${index + 1}:`, rowError);
      return null;
    }
  }).filter(q => q !== null);
}

function transformCSVToQuestion(csvQuestion) {
  try {
    const number = parseInt(csvQuestion.number);
    const correct = parseInt(csvQuestion.correct);

    // Required fields validation
    if (!number || !csvQuestion.question || !correct) {
      console.error('Missing required fields in question:', csvQuestion.number);
      return null;
    }

    if (correct < 1 || correct > 5) {
      console.error('Correct index must be between 1-5:', number, correct);
      return null;
    }

    const choices = [
      csvQuestion.choice_1,
      csvQuestion.choice_2,
      csvQuestion.choice_3,
      csvQuestion.choice_4,
      csvQuestion.choice_5
    ];

    const explanations = [
      csvQuestion.explanation_1,
      csvQuestion.explanation_2,
      csvQuestion.explanation_3,
      csvQuestion.explanation_4,
      csvQuestion.explanation_5
    ];

    // Check if all choices and explanations exist
    if (choices.some(choice => !choice) || explanations.some(explanation => !explanation)) {
      console.error('Missing choices or explanations in question:', number);
      return null;
    }

    const options = choices.map((choice, index) => ({
      id: number * 10 + index + 1,
      text: choice,
      explanation: explanations[index]
    }));

    return {
      id: number,
      text: csvQuestion.question,
      options,
      correctIndex: correct - 1,
      explanations,
      domain: csvQuestion.domain || 'Unknown'
    };
  } catch (error) {
    console.error('Error transforming question:', csvQuestion?.number, error);
    return null;
  }
}

function convertCSVToJSON(csvFilePath, jsonFilePath) {
  try {
    console.log(`Converting ${csvFilePath} to ${jsonFilePath}...`);
    
    // Read CSV file
    const csvText = fs.readFileSync(csvFilePath, 'utf8');
    console.log(`CSV file size: ${csvText.length} characters`);
    
    // Parse CSV
    const csvQuestions = parseCSV(csvText);
    console.log(`Parsed ${csvQuestions.length} questions from CSV`);
    
    // Transform to JSON format
    const questions = csvQuestions
      .map(csvQuestion => transformCSVToQuestion(csvQuestion))
      .filter(q => q !== null);
    
    console.log(`Successfully transformed ${questions.length} questions`);
    
    // Create JSON structure
    const jsonData = {
      questions: questions
    };
    
    // Write JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`JSON file written to ${jsonFilePath}`);
    console.log(`File size: ${fs.statSync(jsonFilePath).size} bytes`);
    
    return questions.length;
  } catch (error) {
    console.error(`Error converting ${csvFilePath}:`, error);
    return 0;
  }
}

// Convert both files
const baseDir = path.dirname(__filename);
const docsDir = path.resolve(baseDir, '../docs');
const publicDataDir = path.resolve(baseDir, 'public/data');

// Ensure output directory exists
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

console.log('Starting CSV to JSON conversion...');

// Convert English file
const enCsvPath = path.join(docsDir, 'cdmp_questions_en.csv');
const enJsonPath = path.join(publicDataDir, 'cdmp_questions_en.json');
const enCount = convertCSVToJSON(enCsvPath, enJsonPath);

console.log('---');

// Convert Japanese file
const jaCsvPath = path.join(docsDir, 'cdmp_questions_ja.csv');
const jaJsonPath = path.join(publicDataDir, 'cdmp_questions_ja.json');
const jaCount = convertCSVToJSON(jaCsvPath, jaJsonPath);

console.log('---');
console.log('Conversion complete!');
console.log(`English: ${enCount} questions`);
console.log(`Japanese: ${jaCount} questions`);
console.log('');
console.log('Files created:');
console.log(`- ${enJsonPath}`);
console.log(`- ${jaJsonPath}`);