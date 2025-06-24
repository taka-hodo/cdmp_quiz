#!/usr/bin/env python3
import json
import csv
import os
from pathlib import Path

def convert_csv_to_json(csv_file_path, json_file_path):
    """Convert CSV file to JSON format for the quiz application."""
    try:
        print(f"Converting {csv_file_path} to {json_file_path}...")
        
        questions = []
        
        with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
            # Use csv.DictReader to handle quoted fields with commas
            reader = csv.DictReader(csv_file)
            
            for row_num, row in enumerate(reader, 1):
                try:
                    # Parse question data
                    question_id = int(row['number'])
                    correct_index = int(row['correct']) - 1  # Convert from 1-based to 0-based
                    
                    if correct_index < 0 or correct_index > 4:
                        print(f"Warning: Invalid correct index {correct_index + 1} for question {question_id}")
                        continue
                    
                    # Extract choices and explanations
                    choices = [
                        row['choice_1'],
                        row['choice_2'],
                        row['choice_3'],
                        row['choice_4'],
                        row['choice_5']
                    ]
                    
                    explanations = [
                        row['explanation_1'],
                        row['explanation_2'],
                        row['explanation_3'],
                        row['explanation_4'],
                        row['explanation_5']
                    ]
                    
                    # Validate all fields are present
                    if not all(choices) or not all(explanations):
                        print(f"Warning: Missing choices or explanations for question {question_id}")
                        continue
                    
                    # Create options array
                    options = []
                    for i, (choice, explanation) in enumerate(zip(choices, explanations)):
                        options.append({
                            "id": question_id * 10 + i + 1,
                            "text": choice.strip(),
                            "explanation": explanation.strip()
                        })
                    
                    # Create question object
                    question = {
                        "id": question_id,
                        "text": row['question'].strip(),
                        "options": options,
                        "correctIndex": correct_index,
                        "explanations": [exp.strip() for exp in explanations],
                        "domain": row['domain'].strip() if row['domain'] else "Unknown"
                    }
                    
                    questions.append(question)
                    
                except (ValueError, KeyError) as e:
                    print(f"Error processing row {row_num}: {e}")
                    continue
        
        # Create JSON structure
        json_data = {
            "questions": questions
        }
        
        # Write JSON file
        os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(json_data, json_file, ensure_ascii=False, indent=2)
        
        print(f"Successfully converted {len(questions)} questions")
        print(f"JSON file written to: {json_file_path}")
        print(f"File size: {os.path.getsize(json_file_path):,} bytes")
        
        return len(questions)
        
    except Exception as e:
        print(f"Error converting {csv_file_path}: {e}")
        return 0

def main():
    """Main conversion function."""
    print("Starting CSV to JSON conversion...")
    
    # Define paths
    base_dir = Path(__file__).parent
    docs_dir = base_dir.parent / "docs"
    public_data_dir = base_dir / "public" / "data"
    
    # Convert English file
    en_csv_path = docs_dir / "cdmp_questions_en.csv"
    en_json_path = public_data_dir / "cdmp_questions_en.json"
    en_count = convert_csv_to_json(str(en_csv_path), str(en_json_path))
    
    print("---")
    
    # Convert Japanese file
    ja_csv_path = docs_dir / "cdmp_questions_ja.csv"
    ja_json_path = public_data_dir / "cdmp_questions_ja.json"
    ja_count = convert_csv_to_json(str(ja_csv_path), str(ja_json_path))
    
    print("---")
    print("Conversion Summary:")
    print(f"English: {en_count} questions")
    print(f"Japanese: {ja_count} questions")
    print(f"Total: {en_count + ja_count} questions")
    print()
    print("Files created:")
    print(f"- {en_json_path}")
    print(f"- {ja_json_path}")
    
    if en_count > 0 and ja_count > 0:
        print("\n✅ Conversion completed successfully!")
    else:
        print("\n❌ Conversion failed or incomplete!")

if __name__ == "__main__":
    main()