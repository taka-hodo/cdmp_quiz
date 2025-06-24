#!/bin/bash

echo "Starting file copy process..."

# Source files
EN_SOURCE="/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_en.csv"
JA_SOURCE="/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_ja.csv"

# Destination files
EN_DEST="/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/cdmp_questions_en.csv"
JA_DEST="/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/cdmp_questions_ja.csv"

# Create destination directory if it doesn't exist
mkdir -p "/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data"

echo "Copying English CSV file..."
cp "$EN_SOURCE" "$EN_DEST"
if [ $? -eq 0 ]; then
    echo "✓ Successfully copied cdmp_questions_en.csv"
else
    echo "✗ Failed to copy cdmp_questions_en.csv"
fi

echo "Copying Japanese CSV file..."
cp "$JA_SOURCE" "$JA_DEST"
if [ $? -eq 0 ]; then
    echo "✓ Successfully copied cdmp_questions_ja.csv"
else
    echo "✗ Failed to copy cdmp_questions_ja.csv"
fi

echo ""
echo "=== File Verification ==="

# Check English file
if [ -f "$EN_SOURCE" ] && [ -f "$EN_DEST" ]; then
    EN_SRC_SIZE=$(stat -f%z "$EN_SOURCE" 2>/dev/null || wc -c < "$EN_SOURCE")
    EN_DEST_SIZE=$(stat -f%z "$EN_DEST" 2>/dev/null || wc -c < "$EN_DEST")
    EN_SRC_LINES=$(wc -l < "$EN_SOURCE")
    EN_DEST_LINES=$(wc -l < "$EN_DEST")
    
    echo "English file (cdmp_questions_en.csv):"
    echo "  Source: $EN_SRC_SIZE bytes, $EN_SRC_LINES lines"
    echo "  Destination: $EN_DEST_SIZE bytes, $EN_DEST_LINES lines"
    
    if [ "$EN_SRC_SIZE" -eq "$EN_DEST_SIZE" ] && [ "$EN_SRC_LINES" -eq "$EN_DEST_LINES" ]; then
        echo "  Status: ✓ Match"
    else
        echo "  Status: ✗ Mismatch"
    fi
fi

echo ""

# Check Japanese file
if [ -f "$JA_SOURCE" ] && [ -f "$JA_DEST" ]; then
    JA_SRC_SIZE=$(stat -f%z "$JA_SOURCE" 2>/dev/null || wc -c < "$JA_SOURCE")
    JA_DEST_SIZE=$(stat -f%z "$JA_DEST" 2>/dev/null || wc -c < "$JA_DEST")
    JA_SRC_LINES=$(wc -l < "$JA_SOURCE")
    JA_DEST_LINES=$(wc -l < "$JA_DEST")
    
    echo "Japanese file (cdmp_questions_ja.csv):"
    echo "  Source: $JA_SRC_SIZE bytes, $JA_SRC_LINES lines"
    echo "  Destination: $JA_DEST_SIZE bytes, $JA_DEST_LINES lines"
    
    if [ "$JA_SRC_SIZE" -eq "$JA_DEST_SIZE" ] && [ "$JA_SRC_LINES" -eq "$JA_DEST_LINES" ]; then
        echo "  Status: ✓ Match"
    else
        echo "  Status: ✗ Mismatch"
    fi
fi

echo ""
echo "Copy process complete!"