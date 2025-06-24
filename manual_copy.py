#!/usr/bin/env python3
import os

# File paths
source_en = "/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_en.csv"
source_ja = "/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_ja.csv"
dest_en = "/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/cdmp_questions_en.csv"
dest_ja = "/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/cdmp_questions_ja.csv"

def copy_file(source, dest):
    try:
        with open(source, 'r', encoding='utf-8') as src:
            with open(dest, 'w', encoding='utf-8') as dst:
                # Copy in chunks
                while True:
                    chunk = src.read(8192)  # 8KB chunks
                    if not chunk:
                        break
                    dst.write(chunk)
        return True
    except Exception as e:
        print(f"Error copying {source}: {e}")
        return False

# Copy English file
if copy_file(source_en, dest_en):
    print("✅ English CSV copied successfully")
    print(f"📊 Size: {os.path.getsize(dest_en)} bytes")

# Copy Japanese file  
if copy_file(source_ja, dest_ja):
    print("✅ Japanese CSV copied successfully")
    print(f"📊 Size: {os.path.getsize(dest_ja)} bytes")

print("🎉 Copy operation completed!")

# Verify files
for file in [dest_en, dest_ja]:
    if os.path.exists(file):
        size_kb = os.path.getsize(file) / 1024
        print(f"✓ {os.path.basename(file)}: {size_kb:.1f}KB")
    else:
        print(f"✗ {os.path.basename(file)}: Not found")