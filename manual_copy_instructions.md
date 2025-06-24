# Manual Copy Instructions

Due to shell execution issues, please manually copy the complete CSV files using the following commands in your terminal:

## Commands to Run

```bash
# Navigate to the project directory
cd "/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer"

# Copy the English CSV file
cp "../docs/cdmp_questions_en.csv" "public/data/cdmp_questions_en.csv"

# Copy the Japanese CSV file
cp "../docs/cdmp_questions_ja.csv" "public/data/cdmp_questions_ja.csv"

# Verify the copy
echo "Verification:"
echo "English CSV lines: $(wc -l < public/data/cdmp_questions_en.csv)"
echo "Japanese CSV lines: $(wc -l < public/data/cdmp_questions_ja.csv)"
echo "English CSV size: $(ls -lh public/data/cdmp_questions_en.csv | awk '{print $5}')"
echo "Japanese CSV size: $(ls -lh public/data/cdmp_questions_ja.csv | awk '{print $5}')"
```

## Expected Results

The copied files should contain approximately:
- **800 lines each** (including header)
- **~799 questions each**
- **Several MB in size each**

## Verification

After copying, the files should start with the header:
```
number,question,choice_1,explanation_1,choice_2,explanation_2,choice_3,explanation_3,choice_4,explanation_4,choice_5,explanation_5,correct,domain
```

And contain actual question data instead of just the header row.