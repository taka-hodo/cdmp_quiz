#!/usr/bin/env python3
import shutil
import os

def copy_csv_files():
    """Copy complete CSV files from docs to public/data directory"""
    
    # Define source and destination paths
    source_dir = "../docs/"
    dest_dir = "public/data/"
    
    files_to_copy = [
        "cdmp_questions_en.csv",
        "cdmp_questions_ja.csv"
    ]
    
    print("Copying complete CSV files...")
    
    for filename in files_to_copy:
        source_path = os.path.join(source_dir, filename)
        dest_path = os.path.join(dest_dir, filename)
        
        try:
            # Copy the file
            shutil.copy2(source_path, dest_path)
            print(f"✓ Copied {filename}")
            
            # Check file size to verify copy
            src_size = os.path.getsize(source_path)
            dest_size = os.path.getsize(dest_path)
            
            print(f"  Source size: {src_size:,} bytes")
            print(f"  Destination size: {dest_size:,} bytes")
            
            if src_size == dest_size:
                print(f"  ✓ File sizes match")
            else:
                print(f"  ⚠ Warning: File sizes don't match")
            
        except Exception as e:
            print(f"✗ Error copying {filename}: {e}")
    
    print("\nVerifying line counts...")
    
    for filename in files_to_copy:
        dest_path = os.path.join(dest_dir, filename)
        try:
            with open(dest_path, 'r', encoding='utf-8') as f:
                line_count = sum(1 for _ in f)
            print(f"{filename}: {line_count:,} lines")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
    
    print("\nFile copy process completed!")

if __name__ == "__main__":
    copy_csv_files()