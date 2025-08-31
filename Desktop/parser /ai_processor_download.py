#!/usr/bin/env python3
"""
AI Processor для обробки PDF документів через Google AI Studio API (з завантаженням)
"""

import requests
import json
import time
import os
import base64
from typing import Dict, List, Any, Optional

class AIProcessor:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-1.5-flash"
        
    def download_pdf(self, pdf_url: str) -> Optional[bytes]:
        """
        Завантажує PDF файл
        """
        try:
            print(f"📥 Завантаження PDF: {pdf_url}")
            response = requests.get(pdf_url, timeout=30)
            
            if response.status_code == 200:
                print(f"✅ PDF завантажено: {len(response.content)} байт")
                return response.content
            else:
                print(f"❌ Помилка завантаження PDF: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Помилка завантаження PDF: {str(e)}")
            return None
    
    def extract_text_from_pdf(self, pdf_url: str) -> Optional[str]:
        """
        Витягує текст з PDF через Google AI Studio API
        """
        try:
            # Завантажуємо PDF
            pdf_content = self.download_pdf(pdf_url)
            if not pdf_content:
                return None
            
            # Кодуємо PDF в base64
            pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
            
            # URL для Google AI Studio API
            url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
            
            # Промпт для витягування тексту з PDF
            prompt = """
            Please extract all text content from this PDF document.
            
            Extract the following information:
            1. All text content
            2. Headers and sections
            3. Lists and specifications
            4. Technical details
            5. Material specifications
            6. Brand names and products
            7. Measurements and dimensions
            8. Any other relevant information
            
            Return the extracted information in a structured format.
            """
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            },
                            {
                                "inline_data": {
                                    "mime_type": "application/pdf",
                                    "data": pdf_base64
                                }
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
                    return content
                else:
                    print(f"❌ Не вдалося отримати контент з API: {result}")
                    return None
            else:
                print(f"❌ Помилка API запиту: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Помилка витягування тексту з PDF: {str(e)}")
            return None
    
    def clean_json_content(self, content: str) -> str:
        """
        Очищує JSON контент від markdown форматування
        """
        clean_content = content.strip()
        
        # Видаляємо markdown коди
        if clean_content.startswith("```json"):
            clean_content = clean_content[7:]
        elif clean_content.startswith("```"):
            clean_content = clean_content[3:]
            
        if clean_content.endswith("```"):
            clean_content = clean_content[:-3]
            
        return clean_content.strip()
    
    def analyze_quality_specifications(self, pdf_url: str) -> Optional[Dict[str, Any]]:
        """
        Аналізує Quality Specifications PDF та структурує дані
        """
        try:
            # Витягуємо текст з PDF
            raw_text = self.extract_text_from_pdf(pdf_url)
            if not raw_text:
                return None
            
            # URL для аналізу структурованих даних
            url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
            
            # Промпт для структурування даних
            prompt = f"""
            Analyze this Quality Specifications document and extract structured information:
            
            {raw_text}
            
            Please extract and structure the following information in JSON format:
            
            {{
                "document_type": "quality_specifications",
                "materials": {{
                    "floors": [
                        {{
                            "room": "string",
                            "material": "string",
                            "brand": "string",
                            "specifications": "string"
                        }}
                    ],
                    "walls": [
                        {{
                            "room": "string",
                            "material": "string",
                            "brand": "string",
                            "specifications": "string"
                        }}
                    ],
                    "ceilings": [
                        {{
                            "room": "string",
                            "material": "string",
                            "brand": "string",
                            "specifications": "string"
                        }}
                    ]
                }},
                "bathrooms": [
                    {{
                        "type": "string",
                        "fixtures": [
                            {{
                                "item": "string",
                                "brand": "string",
                                "model": "string",
                                "specifications": "string"
                            }}
                        ],
                        "tiles": {{
                            "material": "string",
                            "brand": "string",
                            "specifications": "string"
                        }}
                    }}
                ],
                "kitchen": {{
                    "cabinets": {{
                        "brand": "string",
                        "material": "string",
                        "specifications": "string"
                    }},
                    "appliances": [
                        {{
                            "type": "string",
                            "brand": "string",
                            "model": "string",
                            "specifications": "string"
                        }}
                    ],
                    "countertop": {{
                        "material": "string",
                        "brand": "string",
                        "specifications": "string"
                    }}
                }},
                "systems": {{
                    "heating": {{
                        "type": "string",
                        "brand": "string",
                        "specifications": "string"
                    }},
                    "cooling": {{
                        "type": "string",
                        "brand": "string",
                        "specifications": "string"
                    }},
                    "electrical": {{
                        "brands": ["string"],
                        "specifications": "string"
                    }}
                }},
                "security": {{
                    "intercom": {{
                        "brand": "string",
                        "specifications": "string"
                    }},
                    "access_control": {{
                        "type": "string",
                        "specifications": "string"
                    }}
                }},
                "summary": {{
                    "total_materials": "number",
                    "luxury_brands": ["string"],
                    "key_features": ["string"]
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
                    
                    # Очищуємо та парсимо JSON
                    try:
                        clean_content = self.clean_json_content(content)
                        structured_data = json.loads(clean_content)
                        return structured_data
                    except json.JSONDecodeError as e:
                        print(f"❌ Помилка парсингу JSON: {e}")
                        print(f"   Контент: {content[:200]}...")
                        return None
                else:
                    print(f"❌ Не вдалося отримати структуровані дані: {result}")
                    return None
            else:
                print(f"❌ Помилка API запиту для структурування: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Помилка аналізу Quality Specifications: {str(e)}")
            return None
    
    def analyze_brochure(self, pdf_url: str) -> Optional[Dict[str, Any]]:
        """
        Аналізує Brochure PDF та структурує дані
        """
        try:
            # Витягуємо текст з PDF
            raw_text = self.extract_text_from_pdf(pdf_url)
            if not raw_text:
                return None
            
            # URL для аналізу структурованих даних
            url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
            
            # Промпт для структурування даних брошури
            prompt = f"""
            Analyze this Brochure document and extract structured information:
            
            {raw_text}
            
            Please extract and structure the following information in JSON format:
            
            {{
                "document_type": "brochure",
                "project_overview": {{
                    "name": "string",
                    "location": "string",
                    "developer": "string",
                    "status": "string",
                    "description": "string"
                }},
                "apartment_types": [
                    {{
                        "type": "string",
                        "bedrooms": "number",
                        "bathrooms": "number",
                        "area": "string",
                        "features": ["string"],
                        "price_range": "string"
                    }}
                ],
                "amenities": {{
                    "wellness": ["string"],
                    "sports": ["string"],
                    "leisure": ["string"],
                    "services": ["string"]
                }},
                "location_details": {{
                    "area": "string",
                    "distance_to_beach": "string",
                    "distance_to_center": "string",
                    "nearby_attractions": ["string"]
                }},
                "technical_features": {{
                    "construction_materials": ["string"],
                    "energy_efficiency": "string",
                    "smart_home_features": ["string"]
                }},
                "summary": {{
                    "key_selling_points": ["string"],
                    "target_audience": "string",
                    "unique_features": ["string"]
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
                    
                    # Очищуємо та парсимо JSON
                    try:
                        clean_content = self.clean_json_content(content)
                        structured_data = json.loads(clean_content)
                        return structured_data
                    except json.JSONDecodeError as e:
                        print(f"❌ Помилка парсингу JSON: {e}")
                        print(f"   Контент: {content[:200]}...")
                        return None
                else:
                    print(f"❌ Не вдалося отримати структуровані дані: {result}")
                    return None
            else:
                print(f"❌ Помилка API запиту для структурування: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Помилка аналізу Brochure: {str(e)}")
            return None

    def analyze_plans(self, image_url: str, plan_index: int) -> Optional[Dict[str, Any]]:
        """
        Аналізує зображення плану та визначає його тип та структуру
        """
        try:
            # Завантажуємо зображення
            print(f"📥 Завантаження зображення плану...")
            response = requests.get(image_url, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Помилка завантаження зображення: {response.status_code}")
                return None
            
            # Кодуємо зображення в base64
            import base64
            image_base64 = base64.b64encode(response.content).decode('utf-8')
            
            # URL для Google AI Studio API
            url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
            
            # Промпт для аналізу плану
            prompt = f"""
            Analyze this architectural plan image and determine its type and structure.
            
            Please analyze the image and provide information in JSON format:
            
            {{
                "plan_type": "string (community_master_plan | apartment_floor_plan | apartment_unit_plan | site_plan | elevation_plan | section_plan | detail_plan | other)",
                "plan_scale": "string (if visible)",
                "plan_orientation": "string (north, south, east, west, or not_visible)",
                "plan_level": "string (ground_floor, first_floor, second_floor, etc. or not_specified)",
                "plan_area": "string (if visible, e.g., '150m2', '2000sqft')",
                "plan_units": {{
                    "total_units": "number (if visible)",
                    "unit_types": ["string (e.g., '2-bedroom', '3-bedroom', 'penthouse')"],
                    "unit_numbers": ["string (if visible)"]
                }},
                "plan_features": {{
                    "rooms": ["string (e.g., 'bedroom', 'bathroom', 'kitchen', 'living_room')"],
                    "amenities": ["string (e.g., 'pool', 'garden', 'parking', 'elevator')"],
                    "access_points": ["string (e.g., 'main_entrance', 'service_entrance', 'balcony')"],
                    "technical_spaces": ["string (e.g., 'technical_room', 'storage', 'utility')"]
                }},
                "plan_annotations": {{
                    "text_labels": ["string (any text visible on the plan)"],
                    "dimensions": ["string (any measurements visible)"],
                    "symbols": ["string (any symbols or icons visible)"]
                }},
                "plan_quality": {{
                    "clarity": "string (high | medium | low)",
                    "detail_level": "string (detailed | general | schematic)",
                    "completeness": "string (complete | partial | overview)"
                }},
                "plan_description": "string (comprehensive description of what the plan shows)",
                "plan_purpose": "string (what this plan is used for, e.g., 'construction', 'marketing', 'permit')"
            }}
            
            Return only the JSON structure, no additional text.
            """
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            },
                            {
                                "inline_data": {
                                    "mime_type": "image/jpeg",
                                    "data": image_base64
                                }
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
                    
                    # Очищуємо та парсимо JSON
                    try:
                        clean_content = self.clean_json_content(content)
                        structured_data = json.loads(clean_content)
                        
                        # Додаємо метадані
                        structured_data["plan_metadata"] = {
                            "index": plan_index,
                            "url": image_url,
                            "file_size": len(response.content),
                            "mime_type": "image/jpeg"
                        }
                        
                        return structured_data
                    except json.JSONDecodeError as e:
                        print(f"❌ Помилка парсингу JSON: {e}")
                        print(f"   Контент: {content[:200]}...")
                        return None
                else:
                    print(f"❌ Не вдалося отримати аналіз: {result}")
                    return None
            else:
                print(f"❌ Помилка API запиту: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Помилка аналізу зображення плану: {str(e)}")
            return None
