#!/usr/bin/env python3
"""
AI обробка планів та створення адаптивної структури
"""

import json
import os
import requests
from ai_processor_download import AIProcessor
from datetime import datetime

def filter_unique_plans(plans_images):
    """
    Фільтрує плани для вибору тільки унікальних з planos_div
    """
    unique_plans = []
    seen_urls = set()
    
    for plan in plans_images:
        url = plan.get("src", "")
        location = plan.get("location", "")
        
        # Пропускаємо плани без URL
        if not url:
            continue
            
        # Фільтруємо тільки плани з planos_div (основні плани)
        if location != "planos_div":
            continue
            
        # Якщо URL вже бачили, пропускаємо
        if url in seen_urls:
            continue
            
        # Додаємо до унікальних
        seen_urls.add(url)
        unique_plans.append(plan)
    
    return unique_plans

def process_plans():
    """AI обробка планів"""
    
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
    
    # Отримуємо плани
    plans_data = initial_data.get("plans", {})
    all_plans_images = plans_data.get("plans_images", [])
    
    print(f"📐 Знайдено {len(all_plans_images)} зображень планів")
    
    # Фільтруємо унікальні плани
    unique_plans_images = filter_unique_plans(all_plans_images)
    
    print(f"🔍 Після фільтрації: {len(unique_plans_images)} унікальних планів")
    
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
    
    # Додаємо секцію для plans аналізу
    full_info["plans_analysis"] = {
        "total_plans_original": len(all_plans_images),
        "total_plans_unique": len(unique_plans_images),
        "plans_processed": 0,
        "plans_failed": 0,
        "plans_by_type": {},
        "structured_data": [],
        "summary": {}
    }
    
    # Обробляємо кожен унікальний план
    for i, plan in enumerate(unique_plans_images):
        try:
            image_url = plan.get("src", "")
            plan_index = plan.get("index", i)
            
            if not image_url:
                print(f"❌ План {i+1}: відсутній URL")
                full_info["plans_analysis"]["plans_failed"] += 1
                continue
            
            print(f"🔍 Обробка плану {i+1}/{len(unique_plans_images)} (індекс: {plan_index})")
            
            # Аналізуємо план через AI
            structured_data = ai_processor.analyze_plans(image_url, plan_index)
            
            if structured_data:
                # Додаємо метадані з initial.json
                structured_data["plan_metadata"].update({
                    "alt": plan.get("alt", ""),
                    "title": plan.get("title", ""),
                    "location": plan.get("location", ""),
                    "filename": plan.get("filename", ""),
                    "is_unique": True
                })
                
                full_info["plans_analysis"]["structured_data"].append(structured_data)
                full_info["plans_analysis"]["plans_processed"] += 1
                
                # Групуємо плани за типом
                plan_type = structured_data.get("plan_type", "other")
                if plan_type not in full_info["plans_analysis"]["plans_by_type"]:
                    full_info["plans_analysis"]["plans_by_type"][plan_type] = []
                full_info["plans_analysis"]["plans_by_type"][plan_type].append(plan_index)
                
                print(f"✅ План {i+1} успішно оброблено (тип: {plan_type})")
            else:
                print(f"❌ План {i+1} не вдалося обробити")
                full_info["plans_analysis"]["plans_failed"] += 1
                
        except Exception as e:
            print(f"❌ Помилка обробки плану {i+1}: {str(e)}")
            full_info["plans_analysis"]["plans_failed"] += 1
    
    # Створюємо загальний аналіз
    print("📊 Створення загального аналізу планів...")
    
    # Аналізуємо всі структуровані дані разом
    all_structured_data = full_info["plans_analysis"]["structured_data"]
    
    if all_structured_data:
        # Створюємо загальний аналіз через AI
        try:
            # Підготовка даних для аналізу
            analysis_data = {
                "total_plans": len(all_structured_data),
                "plans_by_type": full_info["plans_analysis"]["plans_by_type"],
                "sample_plans": all_structured_data[:5]  # Перші 5 планів для аналізу
            }
            
            # URL для аналізу
            url = f"{ai_processor.base_url}/{ai_processor.model}:generateContent?key={API_KEY}"
            
            # Промпт для загального аналізу
            prompt = f"""
            Analyze all architectural plans and create a comprehensive summary:
            
            {json.dumps(analysis_data, indent=2)}
            
            Please create a summary in JSON format:
            
            {{
                "project_overview": {{
                    "total_plans": "number",
                    "plan_types_distribution": {{
                        "community_master_plan": "number",
                        "apartment_unit_plan": "number",
                        "apartment_floor_plan": "number",
                        "other": "number"
                    }},
                    "total_apartments": "number (sum of all units in apartment plans)",
                    "total_amenities": "number (unique amenities across all plans)"
                }},
                "community_analysis": {{
                    "master_plans": "number",
                    "building_blocks": "number (if visible in master plans)",
                    "community_amenities": ["string (from master plans)"],
                    "landscaping_features": ["string"],
                    "access_points": ["string"]
                }},
                "apartment_analysis": {{
                    "unit_types": ["string (e.g., '2-bedroom', '3-bedroom')"],
                    "area_ranges": ["string (e.g., '100-150m2', '150-200m2')"],
                    "common_features": ["string (e.g., 'balcony', 'terrace')"],
                    "room_distribution": {{
                        "bedrooms": ["string"],
                        "bathrooms": ["string"],
                        "living_areas": ["string"]
                    }}
                }},
                "technical_analysis": {{
                    "plan_quality": "string (overall quality assessment)",
                    "detail_level": "string (overall detail level)",
                    "completeness": "string (overall completeness)",
                    "measurement_consistency": "string (are measurements consistent across plans)"
                }},
                "marketing_analysis": {{
                    "key_selling_points": ["string"],
                    "target_audience": "string",
                    "unique_features": ["string"],
                    "plan_purpose": "string (primary purpose of the plans)"
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
                        full_info["plans_analysis"]["summary"] = summary_data
                        print("✅ Загальний аналіз планів створено")
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
        print(f"📊 Статистика планів:")
        print(f"   - Всього планів (оригінал): {full_info['plans_analysis']['total_plans_original']}")
        print(f"   - Унікальних планів: {full_info['plans_analysis']['total_plans_unique']}")
        print(f"   - Оброблено: {full_info['plans_analysis']['plans_processed']}")
        print(f"   - Помилок: {full_info['plans_analysis']['plans_failed']}")
        print(f"   - Типи планів: {list(full_info['plans_analysis']['plans_by_type'].keys())}")
        
    except Exception as e:
        print(f"❌ Помилка збереження full_info.json: {str(e)}")

if __name__ == "__main__":
    process_plans()
