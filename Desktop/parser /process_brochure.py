#!/usr/bin/env python3
"""
Обробка Brochure через AI та оновлення full_info.json
"""

import json
import os
import requests
from ai_processor_download import AIProcessor
from datetime import datetime

def process_brochure():
    """Обробка Brochure через AI"""
    
    # API ключ Google AI Studio
    API_KEY = "AIzaSyC0oK7s9qOjZW-Jv9YGCmQlwBkr8K-xMzY"
    
    # Створюємо AI процесор
    ai_processor = AIProcessor(API_KEY)
    
    # Шлях до initial.json
    initial_json_path = "projects/MEDBLUE_MARBELLA/initial.json"
    
    # Завантажуємо дані з initial.json
    try:
        with open(initial_json_path, 'r', encoding='utf-8') as f:
            initial_data = json.load(f)
    except Exception as e:
        print(f"❌ Помилка завантаження initial.json: {str(e)}")
        return
    
    # Отримуємо Brochure дані
    brochure_data = initial_data.get("brochure", {})
    brochure_documents = brochure_data.get("brochure_documents", [])
    
    print(f"📄 Знайдено {len(brochure_documents)} Brochure документів")
    
    # Завантажуємо існуючий full_info.json або створюємо новий
    full_info_path = "projects/MEDBLUE_MARBELLA/full_info.json"
    
    if os.path.exists(full_info_path):
        try:
            with open(full_info_path, 'r', encoding='utf-8') as f:
                full_info = json.load(f)
        except Exception as e:
            print(f"❌ Помилка завантаження full_info.json: {str(e)}")
            return
    else:
        full_info = {
            "project_name": initial_data.get("project_name", "MEDBLUE MARBELLA"),
            "url": initial_data.get("url", ""),
            "processed_at": datetime.now().isoformat()
        }
    
    # Додаємо секцію для brochure аналізу
    full_info["brochure_analysis"] = {
        "documents_processed": 0,
        "documents_failed": 0,
        "structured_data": [],
        "summary": {}
    }
    
    # Обробляємо кожен PDF документ
    for i, doc in enumerate(brochure_documents):
        try:
            pdf_url = doc.get("src", "")
            doc_text = doc.get("text", "")
            
            if not pdf_url:
                print(f"❌ Документ {i+1}: відсутній URL")
                full_info["brochure_analysis"]["documents_failed"] += 1
                continue
            
            print(f"🔍 Обробка документа {i+1}: {doc_text}")
            print(f"   URL: {pdf_url}")
            
            # Аналізуємо документ через AI
            structured_data = ai_processor.analyze_brochure(pdf_url)
            
            if structured_data:
                # Додаємо метадані документа
                structured_data["document_metadata"] = {
                    "index": doc.get("index", i),
                    "text": doc_text,
                    "url": pdf_url,
                    "file_type": doc.get("file_type", "PDF"),
                    "location": doc.get("location", ""),
                    "type": doc.get("type", "embed")
                }
                
                full_info["brochure_analysis"]["structured_data"].append(structured_data)
                full_info["brochure_analysis"]["documents_processed"] += 1
                
                print(f"✅ Документ {i+1} успішно оброблено")
            else:
                print(f"❌ Документ {i+1} не вдалося обробити")
                full_info["brochure_analysis"]["documents_failed"] += 1
                
        except Exception as e:
            print(f"❌ Помилка обробки документа {i+1}: {str(e)}")
            full_info["brochure_analysis"]["documents_failed"] += 1
    
    # Створюємо загальний аналіз
    print("📊 Створення загального аналізу brochure...")
    
    # Аналізуємо всі структуровані дані разом
    all_structured_data = full_info["brochure_analysis"]["structured_data"]
    
    if all_structured_data:
        # Створюємо загальний аналіз через AI
        try:
            # Підготовка даних для аналізу
            analysis_data = {
                "total_documents": len(all_structured_data),
                "documents": all_structured_data
            }
            
            # URL для аналізу
            url = f"{ai_processor.base_url}/{ai_processor.model}:generateContent?key={API_KEY}"
            
            # Промпт для загального аналізу
            prompt = f"""
            Analyze all Brochure documents and create a comprehensive summary:
            
            {json.dumps(analysis_data, indent=2)}
            
            Please create a summary in JSON format:
            
            {{
                "project_overview": {{
                    "name": "string",
                    "location": "string",
                    "developer": "string",
                    "status": "string",
                    "description": "string"
                }},
                "apartment_types_summary": {{
                    "total_types": "number",
                    "bedroom_options": ["string"],
                    "area_ranges": ["string"],
                    "price_ranges": ["string"]
                }},
                "amenities_summary": {{
                    "wellness_features": ["string"],
                    "sports_facilities": ["string"],
                    "leisure_areas": ["string"],
                    "services": ["string"]
                }},
                "location_highlights": {{
                    "area": "string",
                    "distance_to_beach": "string",
                    "distance_to_center": "string",
                    "nearby_attractions": ["string"]
                }},
                "technical_highlights": {{
                    "construction_materials": ["string"],
                    "energy_efficiency": "string",
                    "smart_home_features": ["string"]
                }},
                "marketing_summary": {{
                    "key_selling_points": ["string"],
                    "target_audience": "string",
                    "unique_features": ["string"],
                    "luxury_level": "string"
                }}
            }}
            
            Return only the JSON structure, no additional text.
            """
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if "candidates" in result and len(result["candidates"]) > 0:
                    content = result["candidates"][0]["content"]["parts"][0]["text"]
                    
                    try:
                        # Очищуємо JSON
                        clean_content = ai_processor.clean_json_content(content)
                        summary_data = json.loads(clean_content)
                        full_info["brochure_analysis"]["summary"] = summary_data
                        print("✅ Загальний аналіз brochure створено")
                    except json.JSONDecodeError as e:
                        print(f"❌ Помилка парсингу JSON для загального аналізу: {e}")
                        print(f"   Контент: {content[:200]}...")
                else:
                    print(f"❌ Не вдалося створити загальний аналіз: {result}")
            else:
                print(f"❌ Помилка API запиту для загального аналізу: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Помилка створення загального аналізу: {str(e)}")
    
    # Оновлюємо timestamp
    full_info["processed_at"] = datetime.now().isoformat()
    
    # Зберігаємо full_info.json
    try:
        with open(full_info_path, 'w', encoding='utf-8') as f:
            json.dump(full_info, f, ensure_ascii=False, indent=2)
        
        print(f"💾 full_info.json оновлено: {full_info_path}")
        print(f"📊 Статистика brochure:")
        print(f"   - Оброблено документів: {full_info['brochure_analysis']['documents_processed']}")
        print(f"   - Помилок: {full_info['brochure_analysis']['documents_failed']}")
        print(f"   - Структурованих даних: {len(full_info['brochure_analysis']['structured_data'])}")
        
    except Exception as e:
        print(f"❌ Помилка збереження full_info.json: {str(e)}")

if __name__ == "__main__":
    process_brochure()
