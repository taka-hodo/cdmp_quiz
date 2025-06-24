const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function copyCSVFile(sourcePath, targetPath) {
  try {
    console.log(`📁 Copying ${path.basename(sourcePath)}...`);
    
    const fileStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(targetPath);
    
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineCount = 0;
    for await (const line of rl) {
      writeStream.write(line + '\n');
      lineCount++;
      if (lineCount % 50 === 0) {
        console.log(`  📊 Processed ${lineCount} lines...`);
      }
    }
    
    writeStream.end();
    
    // Wait for write to complete
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    console.log(`✅ ${path.basename(sourcePath)} copied successfully! (${lineCount} lines)`);
    
    // Verify file size
    const stats = fs.statSync(targetPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error copying ${sourcePath}:`, error.message);
    return false;
  }
}

async function main() {
  const sourceDir = '/Users/taka/Desktop/アプリ開発/CDMP/docs';
  const targetDir = '/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data';
  
  const files = [
    { source: 'cdmp_questions_en.csv', target: 'cdmp_questions_en.csv' },
    { source: 'cdmp_questions_ja.csv', target: 'cdmp_questions_ja.csv' }
  ];
  
  console.log('🚀 Starting CSV file copy process...\n');
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file.source);
    const targetPath = path.join(targetDir, file.target);
    
    await copyCSVFile(sourcePath, targetPath);
    console.log(''); // Empty line for spacing
  }
  
  console.log('🎉 All CSV files copied successfully!');
}

// Check if this is being run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { copyCSVFile };