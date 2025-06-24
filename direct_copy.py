#!/usr/bin/env python3
"""
Direct file copy utility for copying complete CSV files from source to destination.
This script bypasses shell issues by using pure Python file operations.
"""

import os
import sys

def copy_file_direct(source_path, dest_path):
    """Copy a file directly using Python file operations"""
    try:
        with open(source_path, 'r', encoding='utf-8') as source_file:
            with open(dest_path, 'w', encoding='utf-8') as dest_file:
                # Copy in chunks to handle large files efficiently
                chunk_size = 8192
                while True:
                    chunk = source_file.read(chunk_size)
                    if not chunk:
                        break
                    dest_file.write(chunk)
        return True
    except Exception as e:
        print(f"Error copying file: {e}")
        return False

def main():
    """Main function to copy the CSV files"""
    # Define paths
    base_path = "/Users/taka/Desktop/アプリ開発/CDMP"
    source_dir = os.path.join(base_path, "docs")
    dest_dir = os.path.join(base_path, "five-choice-quizzer", "public", "data")
    
    files_to_copy = [
        "cdmp_questions_en.csv",
        "cdmp_questions_ja.csv"
    ]
    
    print("Starting direct file copy process...")
    print(f"Source directory: {source_dir}")
    print(f"Destination directory: {dest_dir}")
    
    for filename in files_to_copy:
        source_path = os.path.join(source_dir, filename)
        dest_path = os.path.join(dest_dir, filename)
        
        print(f"\nCopying {filename}...")
        print(f"  From: {source_path}")
        print(f"  To: {dest_path}")
        
        # Check if source file exists
        if not os.path.exists(source_path):
            print(f"  ✗ Source file not found: {source_path}")
            continue
            
        # Copy the file
        if copy_file_direct(source_path, dest_path):
            print(f"  ✓ Successfully copied {filename}")
            
            # Verify the copy
            try:
                src_size = os.path.getsize(source_path)
                dest_size = os.path.getsize(dest_path)
                
                print(f"  Source size: {src_size:,} bytes")
                print(f"  Destination size: {dest_size:,} bytes")
                
                if src_size == dest_size:
                    print(f"  ✓ File sizes match - copy verified")
                else:
                    print(f"  ⚠ Warning: File sizes don't match")
                    
                # Count lines
                with open(dest_path, 'r', encoding='utf-8') as f:
                    line_count = sum(1 for _ in f)
                print(f"  Lines in destination: {line_count:,}")
                
            except Exception as e:
                print(f"  Error verifying copy: {e}")
        else:
            print(f"  ✗ Failed to copy {filename}")
    
    print("\nDirect copy process completed!")

if __name__ == "__main__":
    main()