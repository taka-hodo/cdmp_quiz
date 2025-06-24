#!/usr/bin/env python3
import csv
import json
import os
import sys

def convert_csv_to_json(csv_path, json_path):
    """Convert CSV file to JSON format with proper question structure"""
    print(f"Converting {csv_path} to {json_path}...")
    
    questions = []
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as csvfile:
            # Read CSV data
            csv_data = csvfile.read()
            print(f"CSV file size: {len(csv_data)} characters")
            
            csvfile.seek(0)  # Reset file pointer
            reader = csv.DictReader(csvfile)
            
            for row_num, row in enumerate(reader, 1):
                try:
                    # Parse required fields
                    question_id = int(row['number'])
                    correct = int(row['correct'])
                    
                    # Validate required fields
                    if not row['question'] or not question_id or not correct:
                        print(f"Skipping row {row_num}: Missing required fields")
                        continue
                    
                    if correct < 1 or correct > 5:
                        print(f"Skipping row {row_num}: Invalid correct index {correct}")
                        continue
                    
                    # Extract choices and explanations
                    choices = [
                        row.get('choice_1', ''),
                        row.get('choice_2', ''),
                        row.get('choice_3', ''),
                        row.get('choice_4', ''),
                        row.get('choice_5', '')
                    ]
                    
                    explanations = [
                        row.get('explanation_1', ''),
                        row.get('explanation_2', ''),
                        row.get('explanation_3', ''),
                        row.get('explanation_4', ''),
                        row.get('explanation_5', '')
                    ]
                    
                    # Check if all choices and explanations exist
                    if any(not choice.strip() for choice in choices):
                        print(f"Skipping row {row_num}: Missing choices")
                        continue
                    
                    if any(not explanation.strip() for explanation in explanations):
                        print(f"Skipping row {row_num}: Missing explanations")
                        continue
                    
                    # Create options structure
                    options = []
                    for i, (choice, explanation) in enumerate(zip(choices, explanations)):
                        options.append({
                            "id": question_id * 10 + i + 1,
                            "text": choice.strip(),
                            "explanation": explanation.strip()
                        })
                    
                    # Create question structure
                    question = {
                        "id": question_id,
                        "text": row['question'].strip(),
                        "options": options,
                        "correctIndex": correct - 1,
                        "explanations": [exp.strip() for exp in explanations],
                        "domain": row.get('domain', 'Unknown').strip()
                    }
                    
                    questions.append(question)
                    
                except (ValueError, KeyError) as e:
                    print(f"Error parsing row {row_num}: {e}")
                    continue
        
        print(f"Successfully parsed {len(questions)} questions")
        
        # Create JSON structure
        json_data = {
            "questions": questions
        }
        
        # Write JSON file
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        with open(json_path, 'w', encoding='utf-8') as jsonfile:
            json.dump(json_data, jsonfile, indent=2, ensure_ascii=False)
        
        print(f"JSON file written to {json_path}")
        file_size = os.path.getsize(json_path)
        print(f"File size: {file_size} bytes")
        
        return len(questions)
        
    except Exception as e:
        print(f"Error converting {csv_path}: {e}")
        return 0

def main():
    # Define paths
    base_dir = os.path.dirname(__file__)
    docs_dir = os.path.join(base_dir, '..', 'docs')
    public_data_dir = os.path.join(base_dir, 'public', 'data')
    
    print("Starting CSV to JSON conversion...")
    
    # Convert English file
    en_csv_path = os.path.join(docs_dir, 'cdmp_questions_en.csv')
    en_json_path = os.path.join(public_data_dir, 'cdmp_questions_en.json')
    en_count = convert_csv_to_json(en_csv_path, en_json_path)
    
    print('---')
    
    # Convert Japanese file
    ja_csv_path = os.path.join(docs_dir, 'cdmp_questions_ja.csv')
    ja_json_path = os.path.join(public_data_dir, 'cdmp_questions_ja.json')
    ja_count = convert_csv_to_json(ja_csv_path, ja_json_path)
    
    print('---')
    print('Conversion complete!')
    print(f'English: {en_count} questions')
    print(f'Japanese: {ja_count} questions')
    print('')
    print('Files created:')
    print(f'- {en_json_path}')
    print(f'- {ja_json_path}')

if __name__ == '__main__':
    main()