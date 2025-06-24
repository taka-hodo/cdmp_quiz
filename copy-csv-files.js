const fs = require('fs');
const path = require('path');

// Source file paths
const sourceDir = '/Users/taka/Desktop/アプリ開発/CDMP/docs';
const targetDir = '/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data';

const sourceEnglish = path.join(sourceDir, 'cdmp_questions_en.csv');
const sourceJapanese = path.join(sourceDir, 'cdmp_questions_ja.csv');

const targetEnglish = path.join(targetDir, 'cdmp_questions_en.csv');
const targetJapanese = path.join(targetDir, 'cdmp_questions_ja.csv');

try {
  // Copy English file
  fs.copyFileSync(sourceEnglish, targetEnglish);
  console.log('✅ English CSV file copied successfully!');
  
  // Copy Japanese file
  fs.copyFileSync(sourceJapanese, targetJapanese);
  console.log('✅ Japanese CSV file copied successfully!');
  
  // Verify files exist
  const statsEn = fs.statSync(targetEnglish);
  const statsJa = fs.statSync(targetJapanese);
  
  console.log(`📊 English file size: ${Math.round(statsEn.size / 1024)}KB`);
  console.log(`📊 Japanese file size: ${Math.round(statsJa.size / 1024)}KB`);
  
  console.log('🎉 All CSV files have been copied successfully!');
  
} catch (error) {
  console.error('❌ Error copying files:', error.message);
}