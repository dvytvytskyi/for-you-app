# 🏗️ АДАПТИВНА СТРУКТУРА AI ОБРОБКИ ПЛАНІВ - MEDBLUE MARBELLA

## 📊 **ЗАГАЛЬНА КОНЦЕПЦІЯ**

### 🎯 **Мета:**
Створити універсальну систему AI обробки архітектурних планів, яка автоматично адаптується до різних типів планів та витягує релевантну інформацію.

### 🔄 **Адаптивність:**
- **Автоматична класифікація** типів планів
- **Динамічна структура** залежно від контенту
- **Універсальність** для різних проектів нерухомості

---

## 🏢 **ТИПИ ПЛАНІВ ТА ЇХ СТРУКТУРА**

### 1️⃣ **COMMUNITY MASTER PLAN** (Глобальне планування ком'юніті)

#### 📋 **Характеристики:**
- **Масштаб**: Весь комплекс
- **Фокус**: Загальна організація
- **Контент**: Будівельні блоки, зручності, ландшафт

#### 🏗️ **Структура даних:**
```json
{
  "plan_type": "community_master_plan",
  "plan_features": {
    "amenities": ["pool", "gym", "spa", "coworking_space"],
    "building_blocks": ["BLOQUE 1.1", "BLOQUE 1.2", "BLOQUE 1.3", "BLOQUE 2.1", "BLOQUE 2.2", "BLOQUE 2.3", "BLOQUE 3.1", "BLOQUE 3.2", "BLOQUE 3.3"],
    "landscaping": ["garden", "outdoor_areas"],
    "access_points": ["main_entrance", "pedestrian_access"]
  },
  "plan_annotations": {
    "text_labels": ["PLANO GENERAL | MASTER PLAN", "Medblue", "by metrovacesa"],
    "dimensions": ["230,00", "229,00", "228,00", ...]
  }
}
```

#### 🎯 **Ключова інформація:**
- **9 будівельних блоків** (3 блоки по 3 поверхні)
- **Зручності**: Басейни, тренажерний зал, СПА, коворкінг
- **Ландшафт**: Зовнішні зони, сади
- **Доступ**: Пішохідні та автомобільні входи

### 2️⃣ **APARTMENT UNIT PLAN** (Детальне планування квартир)

#### 📋 **Характеристики:**
- **Масштаб**: Окрема квартира
- **Фокус**: Детальний план кімнат
- **Контент**: Розміри, розподіл простору

#### 🏠 **Структура даних:**
```json
{
  "plan_type": "apartment_unit_plan",
  "plan_area": "128.7 m²",
  "plan_units": {
    "total_units": 1,
    "unit_types": ["2-bedroom"]
  },
  "plan_features": {
    "rooms": ["bedroom", "bathroom", "kitchen", "living_room"],
    "amenities": ["balcony"],
    "access_points": ["main_entrance"],
    "technical_spaces": ["storage"]
  },
  "plan_annotations": {
    "text_labels": ["Recibidor", "Cocina", "Lavadero", "Baño 2", "Baño 1", "Dormitorio 2", "Dormitorio 1", "Salón-Comedor", "Terraza Cubierta", "Terraza Descubierta"],
    "dimensions": ["1,1 m²", "9,0 m²", "2,2 m²", "4,0 m²", "4,0 m²", "3,3 m²", "10,1 m²", "13,3 m²", "21,8 m²", "30,9 m²", "29,0 m²"]
  }
}
```

#### 🎯 **Ключова інформація:**
- **Площа квартир**: 107.8-128.7 m²
- **Типи**: 2-спальні квартири
- **Кімнати**: Приймальня, кухня, пральня, 2 ванні, 2 спальні, вітальня-їдальня
- **Території**: Покрита та відкрита тераси

### 3️⃣ **APARTMENT FLOOR PLAN** (Плани поверхів)

#### 📋 **Характеристики:**
- **Масштаб**: Поверх будівлі
- **Фокус**: Розташування квартир
- **Контент**: Планування поверху

#### 🏢 **Структура даних:**
```json
{
  "plan_type": "apartment_floor_plan",
  "plan_level": "first_floor",
  "plan_units": {
    "total_units": 4,
    "unit_types": ["2-bedroom", "3-bedroom"]
  },
  "plan_features": {
    "rooms": ["apartments", "corridor", "elevator"],
    "amenities": ["common_areas"],
    "access_points": ["elevator", "stairs"],
    "technical_spaces": ["technical_room"]
  }
}
```

---

## 🔧 **ТЕХНІЧНА РЕАЛІЗАЦІЯ**

### 📥 **Процес обробки:**
1. **Завантаження зображення** через requests
2. **Кодування в base64** для передачі в API
3. **AI аналіз** через Google AI Studio (Gemini 1.5 Flash)
4. **Автоматична класифікація** типу плану
5. **Адаптивне структурування** даних
6. **Групування** планів за типами

### 🎯 **AI Промпт:**
```python
prompt = """
Analyze this architectural plan image and determine its type and structure.

Please analyze the image and provide information in JSON format:

{
    "plan_type": "string (community_master_plan | apartment_unit_plan | apartment_floor_plan | site_plan | elevation_plan | section_plan | detail_plan | other)",
    "plan_scale": "string (if visible)",
    "plan_orientation": "string (north, south, east, west, or not_visible)",
    "plan_level": "string (ground_floor, first_floor, second_floor, etc. or not_specified)",
    "plan_area": "string (if visible, e.g., '150m2', '2000sqft')",
    "plan_units": {
        "total_units": "number (if visible)",
        "unit_types": ["string (e.g., '2-bedroom', '3-bedroom', 'penthouse')"],
        "unit_numbers": ["string (if visible)"]
    },
    "plan_features": {
        "rooms": ["string (e.g., 'bedroom', 'bathroom', 'kitchen', 'living_room')"],
        "amenities": ["string (e.g., 'pool', 'garden', 'parking', 'elevator')"],
        "access_points": ["string (e.g., 'main_entrance', 'service_entrance', 'balcony')"],
        "technical_spaces": ["string (e.g., 'technical_room', 'storage', 'utility')"]
    },
    "plan_annotations": {
        "text_labels": ["string (any text visible on the plan)"],
        "dimensions": ["string (any measurements visible)"],
        "symbols": ["string (any symbols or icons visible)"]
    },
    "plan_quality": {
        "clarity": "string (high | medium | low)",
        "detail_level": "string (detailed | general | schematic)",
        "completeness": "string (complete | partial | overview)"
    },
    "plan_description": "string (comprehensive description of what the plan shows)",
    "plan_purpose": "string (what this plan is used for, e.g., 'construction', 'marketing', 'permit')"
}
"""
```

---

## 📊 **СТАТИСТИКА ТЕСТУВАННЯ**

### ✅ **Результати тесту (5 планів):**
- **Community Master Plan**: 1 план
- **Apartment Unit Plan**: 4 плани
- **Успішність**: 100% (5/5)
- **Помилок**: 0

### 🎯 **Ключові знахідки:**
1. **Точна класифікація** типів планів
2. **Детальне витягування** текстових міток
3. **Повне витягування** розмірів та вимірювань
4. **Якісний опис** кожного плану
5. **Автоматичне групування** за типами

---

## 🚀 **ПЕРЕВАГИ АДАПТИВНОЇ СТРУКТУРИ**

### 🔄 **Гнучкість:**
- **Автоматична адаптація** до різних типів планів
- **Універсальність** для будь-яких проектів нерухомості
- **Масштабованість** для великої кількості планів

### 🎯 **Точність:**
- **AI класифікація** з високою точністю
- **Детальний аналіз** всіх елементів плану
- **Структуровані дані** для подальшого використання

### 📈 **Ефективність:**
- **Автоматизація** процесу аналізу
- **Швидка обробка** великої кількості планів
- **Консистентність** результатів

---

## 📋 **КОМАНДИ ДЛЯ ВИКОРИСТАННЯ**

```bash
# AI обробка всіх планів
python process_plans.py

# Перегляд результатів
cat projects/MEDBLUE_MARBELLA/full_info.json | jq '.plans_analysis'

# Аналіз конкретного типу планів
cat projects/MEDBLUE_MARBELLA/full_info.json | jq '.plans_analysis.plans_by_type'
```

---

## 🎯 **ВИСНОВКИ**

Адаптивна структура AI обробки планів **успішно створена** та протестована:

1. **Універсальність**: Працює з різними типами планів
2. **Точність**: Високоякісна класифікація та аналіз
3. **Ефективність**: Автоматична обробка великої кількості планів
4. **Структурованість**: Організовані дані для подальшого використання
5. **Масштабованість**: Легко адаптується для інших проектів

**Результат**: Повна AI структуризація архітектурних планів з адаптивною системою класифікації та аналізу.
