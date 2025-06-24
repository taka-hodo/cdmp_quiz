#!/usr/bin/env python3
import shutil

# Source file paths
source_en = "/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_en.csv"
source_ja = "/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_ja.csv"

# Destination directory
dest_dir = "/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/"

# Copy files
try:
    shutil.copy2(source_en, dest_dir)
    print("English CSV file copied successfully!")
    
    shutil.copy2(source_ja, dest_dir)
    print("Japanese CSV file copied successfully!")
    
    print("All CSV files have been copied to the destination directory.")
    
except Exception as e:
    print(f"Error copying files: {e}")