#!/usr/bin/env python3
import json
import csv
import os

def parse_csv_row(row):
    """Parse a single CSV row into question format"""
    try:
        question_id = int(row['number'])
        correct_index = int(row['correct']) - 1  # Convert from 1-based to 0-based
        
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
        
        return question
        
    except Exception as e:
        print(f"Error parsing question {row.get('number', 'unknown')}: {e}")
        return None

def convert_csv_sample():
    """Convert first 50 questions to test the system"""
    
    # English sample questions (first 10 for testing)
    en_questions = [
        {
            "id": 1,
            "text": "One of the goals of the Data Storage and Operations knowledge area is",
            "options": [
                {"id": 11, "text": "To identify data storage and processing requirements", "explanation": "Identifying data storage and processing requirements is a key aspect of the Data Storage and Operations knowledge area. Understanding the storage needs and processing requirements of data assets is essential for designing efficient and effective data storage solutions."},
                {"id": 12, "text": "To ensure ROI on data technology assets", "explanation": "Ensuring ROI on data technology assets is more aligned with the Data Governance and Compliance knowledge area rather than Data Storage and Operations. While optimizing technology investments is important, the primary goal of this knowledge area is not specifically focused on ROI."},
                {"id": 13, "text": "To provide data securely, with regulatory compliance, in the format and timeframe needed.", "explanation": "Providing data securely, with regulatory compliance, in the format and timeframe needed is more related to Data Security and Privacy rather than Data Storage and Operations. While data security and compliance are important aspects of data storage, the primary goal of this knowledge area is not solely focused on security and compliance."},
                {"id": 14, "text": "To drive data management technology", "explanation": "Driving data management technology is not a specific goal of the Data Storage and Operations knowledge area. While technology plays a crucial role in data storage and operations, the primary focus is on managing data assets effectively and efficiently."},
                {"id": 15, "text": "To ensure the integrity of data assets", "explanation": "Ensuring the integrity of data assets is a key goal of the Data Storage and Operations knowledge area. This involves maintaining the accuracy, consistency, and reliability of data throughout its lifecycle to support decision-making and business operations."}
            ],
            "correctIndex": 4,
            "explanations": [
                "Identifying data storage and processing requirements is a key aspect of the Data Storage and Operations knowledge area. Understanding the storage needs and processing requirements of data assets is essential for designing efficient and effective data storage solutions.",
                "Ensuring ROI on data technology assets is more aligned with the Data Governance and Compliance knowledge area rather than Data Storage and Operations. While optimizing technology investments is important, the primary goal of this knowledge area is not specifically focused on ROI.",
                "Providing data securely, with regulatory compliance, in the format and timeframe needed is more related to Data Security and Privacy rather than Data Storage and Operations. While data security and compliance are important aspects of data storage, the primary goal of this knowledge area is not solely focused on security and compliance.",
                "Driving data management technology is not a specific goal of the Data Storage and Operations knowledge area. While technology plays a crucial role in data storage and operations, the primary focus is on managing data assets effectively and efficiently.",
                "Ensuring the integrity of data assets is a key goal of the Data Storage and Operations knowledge area. This involves maintaining the accuracy, consistency, and reliability of data throughout its lifecycle to support decision-making and business operations."
            ],
            "domain": "6 Data Storage and Operations"
        }
    ]
    
    # Create sample JSON for immediate testing (expanding to 200 questions for practice set 1)
    sample_questions = []
    for i in range(1, 201):  # Practice set 1: questions 1-200
        question = {
            "id": i,
            "text": f"Sample question {i} for practice set 1",
            "options": [
                {"id": i*10+1, "text": f"Option A for question {i}", "explanation": f"Explanation for option A of question {i}"},
                {"id": i*10+2, "text": f"Option B for question {i}", "explanation": f"Explanation for option B of question {i}"},
                {"id": i*10+3, "text": f"Option C for question {i}", "explanation": f"Explanation for option C of question {i}"},
                {"id": i*10+4, "text": f"Option D for question {i}", "explanation": f"Explanation for option D of question {i}"},
                {"id": i*10+5, "text": f"Option E for question {i}", "explanation": f"Explanation for option E of question {i}"}
            ],
            "correctIndex": (i % 5),  # Distribute correct answers
            "explanations": [
                f"Explanation for option A of question {i}",
                f"Explanation for option B of question {i}", 
                f"Explanation for option C of question {i}",
                f"Explanation for option D of question {i}",
                f"Explanation for option E of question {i}"
            ],
            "domain": f"Domain {((i-1) % 14) + 1}"
        }
        sample_questions.append(question)
    
    # Extend to 799 questions total
    for i in range(201, 800):
        question = {
            "id": i,
            "text": f"Sample question {i}",
            "options": [
                {"id": i*10+1, "text": f"Option A for question {i}", "explanation": f"Explanation for option A of question {i}"},
                {"id": i*10+2, "text": f"Option B for question {i}", "explanation": f"Explanation for option B of question {i}"},
                {"id": i*10+3, "text": f"Option C for question {i}", "explanation": f"Explanation for option C of question {i}"},
                {"id": i*10+4, "text": f"Option D for question {i}", "explanation": f"Explanation for option D of question {i}"},
                {"id": i*10+5, "text": f"Option E for question {i}", "explanation": f"Explanation for option E of question {i}"}
            ],
            "correctIndex": (i % 5),
            "explanations": [
                f"Explanation for option A of question {i}",
                f"Explanation for option B of question {i}",
                f"Explanation for option C of question {i}",
                f"Explanation for option D of question {i}",
                f"Explanation for option E of question {i}"
            ],
            "domain": f"Domain {((i-1) % 14) + 1}"
        }
        sample_questions.append(question)
    
    # Create JSON data structure
    json_data = {
        "questions": sample_questions
    }
    
    # Write English JSON
    en_path = "public/data/cdmp_questions_en.json"
    os.makedirs(os.path.dirname(en_path), exist_ok=True)
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    # Create Japanese version (same structure, translated text)
    ja_questions = []
    for q in sample_questions:
        ja_question = {
            "id": q["id"],
            "text": f"サンプル問題 {q['id']}",
            "options": [
                {"id": opt["id"], "text": f"選択肢 {chr(65+i)} 問題 {q['id']}", "explanation": f"問題 {q['id']} の選択肢 {chr(65+i)} の説明"}
                for i, opt in enumerate(q["options"])
            ],
            "correctIndex": q["correctIndex"],
            "explanations": [f"問題 {q['id']} の選択肢 {chr(65+i)} の説明" for i in range(5)],
            "domain": f"ドメイン {((q['id']-1) % 14) + 1}"
        }
        ja_questions.append(ja_question)
    
    ja_json_data = {
        "questions": ja_questions
    }
    
    # Write Japanese JSON
    ja_path = "public/data/cdmp_questions_ja.json"
    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_json_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Created sample JSON files:")
    print(f"English: {en_path} ({len(sample_questions)} questions)")
    print(f"Japanese: {ja_path} ({len(ja_questions)} questions)")
    print(f"Each file contains {len(sample_questions)} questions with proper structure")
    print("\nPractice sets:")
    print("Set 1: Questions 1-200")
    print("Set 2: Questions 201-400") 
    print("Set 3: Questions 401-600")
    print("Set 4: Questions 601-799")

if __name__ == "__main__":
    convert_csv_sample()