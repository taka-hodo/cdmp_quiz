#!/usr/bin/env python3
"""
Script to copy large CSV files from source to destination.
"""

import os
import shutil
import sys

def copy_file(source, destination):
    """Copy a file from source to destination."""
    try:
        # Create destination directory if it doesn't exist
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        
        # Copy the file
        shutil.copy2(source, destination)
        print(f"Successfully copied: {source} -> {destination}")
        
        # Verify the copy by checking file sizes
        source_size = os.path.getsize(source)
        dest_size = os.path.getsize(destination)
        
        if source_size == dest_size:
            print(f"  File size verified: {source_size} bytes")
            return True
        else:
            print(f"  ERROR: File size mismatch! Source: {source_size}, Destination: {dest_size}")
            return False
            
    except Exception as e:
        print(f"ERROR copying {source}: {e}")
        return False

def main():
    # Define source and destination paths
    files_to_copy = [
        {
            'source': '/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_en.csv',
            'destination': '/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/cdmp_questions_en.csv'
        },
        {
            'source': '/Users/taka/Desktop/アプリ開発/CDMP/docs/cdmp_questions_ja.csv',
            'destination': '/Users/taka/Desktop/アプリ開発/CDMP/five-choice-quizzer/public/data/cdmp_questions_ja.csv'
        }
    ]
    
    print("Starting file copy process...")
    
    success_count = 0
    for file_info in files_to_copy:
        source = file_info['source']
        destination = file_info['destination']
        
        print(f"\nCopying: {os.path.basename(source)}")
        
        # Check if source file exists
        if not os.path.exists(source):
            print(f"  ERROR: Source file does not exist: {source}")
            continue
            
        # Perform the copy
        if copy_file(source, destination):
            success_count += 1
    
    print(f"\n=== Copy Results ===")
    print(f"Successfully copied: {success_count}/{len(files_to_copy)} files")
    
    # Verify final results
    print(f"\n=== File Verification ===")
    for file_info in files_to_copy:
        source = file_info['source']
        destination = file_info['destination']
        
        if os.path.exists(source) and os.path.exists(destination):
            source_size = os.path.getsize(source)
            dest_size = os.path.getsize(destination)
            
            # Count lines in both files
            try:
                with open(source, 'r', encoding='utf-8') as f:
                    source_lines = sum(1 for _ in f)
                with open(destination, 'r', encoding='utf-8') as f:
                    dest_lines = sum(1 for _ in f)
                    
                print(f"{os.path.basename(source)}:")
                print(f"  Source: {source_size:,} bytes, {source_lines:,} lines")
                print(f"  Destination: {dest_size:,} bytes, {dest_lines:,} lines")
                print(f"  Match: {'✓' if source_size == dest_size and source_lines == dest_lines else '✗'}")
                
            except Exception as e:
                print(f"  Error reading files: {e}")

if __name__ == "__main__":
    main()