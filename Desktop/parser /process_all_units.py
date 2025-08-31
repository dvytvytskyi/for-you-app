#!/usr/bin/env python3
"""
Фінальна обробка всіх юнітів з правильною ідентифікацією Bloque
"""

import json
import os
import requests
from ai_processor_download import AIProcessor
from datetime import datetime

def analyze_unit_identification(text_labels):
    """
    Аналізує текст для ідентифікації юніту з Bloque
    """
    unit_id = "UNKNOWN"
    unit_title = ""
    room_areas = {}
    total_area = ""
    
    # Шукаємо заголовок юніту з Bloque
    for text in text_labels:
        text_lower = text.lower()
        
        # Шукаємо ідентифікацію типу "Bloque X Portal Y Letra Z"
        if "bloque" in text_lower and "portal" in text_lower and "letra" in text_lower:
            unit_id = text.strip()
            unit_title = text.strip()
            break
        elif "bloque" in text_lower and "portal" in text_lower:
            unit_id = text.strip()
            unit_title = text.strip()
            break
        elif "portal" in text_lower and "letra" in text_lower:
            unit_id = text.strip()
            unit_title = text.strip()
            break
    
    # Якщо не знайшли заголовок, створюємо на основі кімнат
    if unit_id == "UNKNOWN":
        # Шукаємо кількість спалень
        dormitorios = [text for text in text_labels if "dormitorio" in text.lower()]
        if dormitorios:
            num_dormitorios = len(dormitorios)
            unit_id = f"2 Dormitorios" if num_dormitorios == 2 else f"{num_dormitorios} Dormitorios"
            unit_title = unit_id
    
    # Шукаємо розміри кімнат
    room_names = []
    room_sizes = []
    
    # Збираємо назви кімнат
    for text in text_labels:
        text_lower = text.lower()
        if any(room in text_lower for room in ["recibidor", "cocina", "lavadero", "baño", "dormitorio", "salón", "terraza", "distribuidor"]):
            room_names.append(text.strip())
    
    # Збираємо розміри
    for text in text_labels:
        if "m²" in text:
            room_sizes.append(text.strip())
    
    # З'єднуємо назви кімнат з розмірами
    for i, room_name in enumerate(room_names):
        if i < len(room_sizes):
            room_areas[room_name] = room_sizes[i]
    
    # Шукаємо загальну площу (найбільше число з m²)
    max_area = 0
    for text in text_labels:
        if "m²" in text:
            try:
                import re
                area_match = re.search(r'(\d+[.,]?\d*)\s*m²', text, re.IGNORECASE)
                if area_match:
                    area_value = float(area_match.group(1).replace(',', '.'))
                    if area_value > max_area and area_value > 50:  # Загальна площа зазвичай >50m²
                        max_area = area_value
                        total_area = text.strip()
            except:
                pass
    
    # Якщо не знайшли загальну площу, сумуємо всі розміри
    if not total_area and room_sizes:
        try:
            total_sum = 0
            for size_text in room_sizes:
                area_match = re.search(r'(\d+[.,]?\d*)', size_text)
                if area_match:
                    total_sum += float(area_match.group(1).replace(',', '.'))
            total_area = f"{total_sum:.1f} m²"
        except:
            pass
    
    return {
        "unit_id": unit_id,
        "unit_title": unit_title,
        "room_areas": room_areas,
        "total_area": total_area
    }

def process_all_units():
    """Обробка всіх юнітів"""
    
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
    plans_images = plans_data.get("plans_images", [])
    
    # Фільтруємо тільки плани з planos_div
    unit_plans = []
    for plan in plans_images:
        if plan.get("location") == "planos_div":
            unit_plans.append(plan)
    
    print(f"📐 Знайдено {len(unit_plans)} планів юнітів")
    
    # Створюємо папку plans якщо не існує
    plans_dir = "projects/MEDBLUE_MARBELLA/plans"
    os.makedirs(plans_dir, exist_ok=True)
    
    # Обробляємо всі юніти
    units_analysis = []
    
    for i, plan in enumerate(unit_plans):
        try:
            image_url = plan.get("src", "")
            plan_index = plan.get("index", i)
            
            if not image_url:
                print(f"❌ План {i+1}: відсутній URL")
                continue
            
            print(f"🔍 Обробка юніту {i+1}/{len(unit_plans)} (індекс: {plan_index})")
            
            # Аналізуємо план через AI для отримання тексту
            structured_data = ai_processor.analyze_plans(image_url, plan_index)
            
            if structured_data:
                # Отримуємо текст з анотацій
                text_labels = structured_data.get("plan_annotations", {}).get("text_labels", [])
                dimensions = structured_data.get("plan_annotations", {}).get("dimensions", [])
                
                # Аналізуємо текст для ідентифікації юніту
                unit_identification = analyze_unit_identification(text_labels)
                
                # Створюємо структуру для конкретного юніту
                unit_data = {
                    "unit_id": unit_identification.get("unit_id", f"UNIT_{plan_index:03d}"),
                    "unit_identification": unit_identification,
                    "plan_index": plan_index,
                    "image_url": image_url,
                    "analysis_timestamp": datetime.now().isoformat(),
                    "unit_type": structured_data.get("plan_type", "unknown"),
                    "text_analysis": {
                        "all_text_labels": text_labels,
                        "dimensions_text": dimensions,
                        "unit_title": unit_identification.get("unit_title", ""),
                        "room_areas": unit_identification.get("room_areas", {}),
                        "total_area": unit_identification.get("total_area", "")
                    }
                }
                
                units_analysis.append(unit_data)
                print(f"✅ Юніт {i+1} успішно оброблено")
                print(f"   ID: {unit_data['unit_id']}")
                print(f"   Тип: {unit_data['unit_type']}")
                print(f"   Площа: {unit_data['text_analysis']['total_area']}")
            else:
                print(f"❌ Юніт {i+1} не вдалося обробити")
                
        except Exception as e:
            print(f"❌ Помилка обробки юніту {i+1}: {str(e)}")
    
    # Створюємо загальну структуру
    analysis_result = {
        "project_name": "MEDBLUE MARBELLA",
        "analysis_date": datetime.now().isoformat(),
        "total_units_available": len(unit_plans),
        "units_analyzed": len(units_analysis),
        "units_data": units_analysis,
        "analysis_summary": {
            "unit_types_found": list(set([unit["unit_type"] for unit in units_analysis])),
            "unit_identifications": [unit["unit_id"] for unit in units_analysis],
            "total_areas_identified": len([unit for unit in units_analysis if unit["text_analysis"]["total_area"]])
        }
    }
    
    # Зберігаємо результат
    output_path = os.path.join(plans_dir, "all_units_analysis.json")
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(analysis_result, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Результат збережено: {output_path}")
        print(f"📊 Статистика:")
        print(f"   - Оброблено юнітів: {len(units_analysis)}")
        print(f"   - Типи юнітів: {analysis_result['analysis_summary']['unit_types_found']}")
        print(f"   - Площі знайдено: {analysis_result['analysis_summary']['total_areas_identified']}")
        
    except Exception as e:
        print(f"❌ Помилка збереження: {str(e)}")

if __name__ == "__main__":
    process_all_units()
