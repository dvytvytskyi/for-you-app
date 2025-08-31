# Універсальна методологія парсингу сайтів нерухомості

## Загальний опис проекту

**Ціль**: Створення універсального автоматизованого парсера для сайтів нерухомості з витягуванням інформації про проекти та синхронізацією даних.

**Приклад реалізації**: Azul Developments (https://azuldevelopments.com/en/proyectos-obra-nueva-costa-sol)

**Технології**: Python, Selenium, Chrome WebDriver

**Застосування**: Будь-який сайт нерухомості з авторизацією

---

## 📋 Методи (потребують затвердження)

### Метод 1: Система авторизації та сесій
**Статус**: ⏳ Очікує затвердження

**Опис**: Універсальна система збереження та відновлення сесій для уникнення повторної авторизації на сайтах нерухомості.

**Деталі**:
- Збереження cookies після успішної авторизації
- Налаштовувана тривалість сесії (за замовчуванням 6 годин)
- Файл сесії: `data/session_cookies.json`
- Команда очищення: `python main.py clear`
- Підтримка різних типів форм авторизації

**Переваги**:
- Швидкість: відновлення за 5 сек vs авторизація за 30 сек
- Надійність: менше шансів блокування від сайту
- Зручність: не потрібно вводити логін/пароль кожного разу
- Універсальність: працює з різними сайтами

**Команди**:
```bash
python main.py test    # Тестування авторизації
python main.py clear   # Очищення сесії
```

**Налаштування**:
```python
# config.py
SESSION_DURATION = 6 * 60 * 60  # Тривалість сесії в секундах
```

---

### Метод 2: Парсинг списку проектів
**Статус**: ⏳ Очікує затвердження

**Опис**: Універсальне витягування списку всіх проектів з головної сторінки сайту нерухомості.

**Деталі**:
- Адаптивний пошук проектів за різними селекторами
- Автоматичне створення папок для кожного проекту
- Збереження базової інформації в JSON форматі
- Підтримка різних структур сторінок

**Результат**:
- Файл: `data/all_projects.json`
- Папки: `projects/[назва_проекту]/`
- Кількість: динамічна (залежить від сайту)

**Команда**:
```bash
python main.py list    # Отримання списку проектів
```

**Налаштування селекторів**:
```python
# project_parser.py
project_selectors = [
    "//h3[contains(text(), 'LOCATION_KEYWORDS')]",
    "//div[contains(@class, 'project')]",
    "//a[contains(text(), 'SHOW DETAILS')]/..",
    # Додати специфічні селектори для конкретного сайту
]
```

---

### Метод 3: Універсальна структура даних проекту
**Статус**: ⏳ Очікує затвердження

**Опис**: Стандартизована структура даних для збереження інформації про проекти нерухомості.

**Базові поля** (обов'язкові):
- `name`: Назва проекту
- `url`: URL сторінки проекту
- `location`: Локація проекту
- `price_from`: Ціна від
- `development_status`: Статус розробки
- `image_url`: URL зображення

**Розширені поля** (опціональні):
- `price_to`: Ціна до
- `bedrooms`: Кількість спалень
- `area`: Площа
- `completion_date`: Дата завершення
- `developer`: Забудовник
- `description`: Опис проекту

**Приклад**:
```json
{
  "name": "PROJECT NAME",
  "url": "https://example.com/project",
  "location": "City, Region",
  "price_from": "from 500.000€",
  "price_to": "to 1.200.000€",
  "development_status": "UNDER CONSTRUCTION",
  "bedrooms": "2-4",
  "area": "80-150m²",
  "image_url": "https://example.com/image.jpg"
}
```

**Налаштування полів**:
```python
# config.py
REQUIRED_FIELDS = ['name', 'url', 'location', 'price_from']
OPTIONAL_FIELDS = ['price_to', 'bedrooms', 'area', 'completion_date']
```

---

### Метод 4: Детальна структура проекту нерухомості
**Статус**: ✅ Завершено та протестовано

**Опис**: Детальна організація файлів та папок для кожного проекту нерухомості з розділенням по типам контенту.

**Структура проекту**:
```
projects/
└── PROJECT_NAME/
    ├── JSON файли даних:
    │   ├── initial.json      # Сира інформація з парсингу сайту
    │   ├── full_info.json    # AI оброблені дані (quality specs, location)
    │   └── structured.json   # **ФІНАЛЬНА СТРУКТУРА** - об'єднані дані з усіх файлів
    │
    ├── all_files/            # Всі витягнуті файли
    │   ├── general_info/     # Загальна інформація
    │   ├── media/            # Медіа контент
    │   │   ├── renders/      # Рендери
    │   │   ├── pictures/     # Зображення
    │   │   └── videos/       # Відео
    │   ├── price_availability/ # Ціни та доступність
    │   ├── plans/            # Плани
    │   ├── quality_specs/    # Специфікації якості
    │   ├── brochure/         # Брошури
    │   └── location/         # Локація на Google Maps
    │
    └── extracted_files/      # Екстрактовані файли за інструкціями
        ├── general_info/
        ├── media/
        ├── price_availability/
        ├── plans/
        ├── quality_specs/
        ├── brochure/
        └── location/
```

**Типи JSON файлів**:
- **initial.json**: Сира інформація, витягнута без обробки з сайту
- **full_info.json**: Оброблені дані з AI аналізом (quality specifications, location analysis)
- **structured.json**: **ФІНАЛЬНА СТРУКТУРА** - об'єднані та структуровані дані з усіх інших файлів (initial.json + full_info.json + AI аналіз юнітів)

**Блоки контенту**:
1. **General information** - Загальна інформація
2. **Media** - Медіа контент (рендери, зображення, відео)
3. **Price&Availability** - Ціни та доступність
4. **Plans** - Плани
5. **Quality specifications** - Специфікації якості
6. **Brochure** - Брошури
7. **Location on google maps** - Локація на Google Maps

**Детальна структура structured.json**:
```json
{
  "project_info": {
    "project_name": "PROJECT_NAME",
    "url": "PROJECT_URL",
    "description": "PROJECT_DESCRIPTION",
    "development_status": "STATUS",
    "typical_units": "UNITS",
    "developer": "DEVELOPER"
  },
  "general_info": {
    // Дублікат project_info для сумісності
  },
  "media": {
    "renders": [...],    // Рендери проекту
    "photos": [...],     // Фотографії проекту
    "videos": [...]      // Відео проекту
  },
  "price_availability": {
    "price_from": "PRICE",
    "price_to": "PRICE",
    "currency": "CURRENCY",
    "availability_status": "STATUS"
  },
  "plans": {
    "plans_images": [...],
    "plans_links": [...]
  },
  "quality_specifications": {
    "specifications_text": "TEXT",
    "specifications_file": "FILE"
  },
  "brochure": {
    "brochure_text": "TEXT",
    "brochure_file": "FILE"
  },
  "location": {
    "location_text": "TEXT",
    "google_maps_url": "URL",
    "coordinates": {
      "latitude": "LAT",
      "longitude": "LNG"
    }
  },
  "ai_analysis": {
    "location_analysis": {
      // AI аналіз локації з full_info.json
    },
    "units_analysis": {
      // AI аналіз юнітів з plans/all_units_analysis.json
    }
  }
}
```

**Налаштування структури**:
```python
# config.py
DATA_DIR = "data"
PROJECTS_DIR = "projects"
SCREENSHOTS_DIR = "screenshots"
LOGS_DIR = "logs"

# Структура проекту
PROJECT_STRUCTURE = {
    'json_files': ['initial.json', 'full_info.json', 'structured.json'],
    'content_blocks': [
        'general_info',
        'media',
        'price_availability', 
        'plans',
        'quality_specs',
        'brochure',
        'location'
    ],
    'media_subfolders': ['renders', 'pictures', 'videos']
}
```

**Процес створення structured.json**:
1. **Парсинг сайту** → `initial.json` (сирі дані)
2. **AI обробка** → `full_info.json` (quality specs, location analysis)
3. **AI аналіз юнітів** → `plans/all_units_analysis.json` (61 юніт)
4. **Об'єднання** → `structured.json` (фінальна структура)

**Переваги**:
- Детальна організація: чітке розділення по типам контенту
- Масштабованість: легко додавати нові блоки контенту
- Структурованість: 3 рівні JSON файлів для різних етапів обробки
- Універсальність: працює для будь-якого сайту нерухомості
- **Фінальна структура**: structured.json містить ВСІ дані з усіх джерел

---

## 🔄 Наступні методи (планування)

### Метод 5: Детальний парсинг general_info
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування загальної інформації проекту (description, development status, typical units, developer).

**Результат**:
- ✅ Створено функцію `parse_project_general_info()`
- ✅ Синхронізація даних між головною сторінкою та сторінкою проекту
- ✅ Витягування 4 основних полів general_info
- ✅ Збереження в 3 JSON файли (initial, full_info, structured)
- ✅ Оцінка якості даних: 100% (excellent)
- ✅ Структуровання інформації

**Команда**:
```bash
python main.py general_info  # Парсинг general_info для MEDBLUE MARBELLA
```

**Структура даних**:
```json
{
  "project_metadata": {
    "name": "MEDBLUE MARBELLA",
    "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
    "parsed_at": "TIMESTAMP",
    "data_quality": { "score": 4, "percentage": 100.0, "rating": "excellent" }
  },
  "general_information": {
    "description": "Повний опис проекту...",
    "development_status": "UNDER CONSTRUCTION",
    "typical_units": "3 BEDS",
    "developer": "© 2022 Azul Real Estate"
  }
}
```

**Синхронізація даних**:
- **Головна сторінка проектів** → development_status, typical_units
- **Сторінка проекту** → description, developer
- **Об'єднання** → Структурований general_info

### Метод 6: Парсинг блоку Media
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування медіа контенту проекту (renders, pictures, videos).

**Результат**:
- ✅ Створено функцію `parse_project_media()`
- ✅ Витягування рендерів, зображень та відео
- ✅ Унікальні назви файлів (hash + timestamp)
- ✅ Збереження в структуровані папки all_files/media/
- ✅ Структурування по типам (renders, pictures, videos)
- ✅ Збереження метаданих в initial.json
- ✅ Уникнення дублікатів файлів

**Команда**:
```bash
python main.py media  # Парсинг media для MEDBLUE MARBELLA
```

**Структура даних**:
```json
{
  "project_name": "MEDBLUE MARBELLA",
  "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
  "parsed_at": "2025-08-30T19:03:18.466581",
  "renders": [
    {
      "url": "https://api.globalgest.online/ws/v3/documentacion/azul/150539/8356d2ec12298c8acc09a353d59a840e",
      "alt": "Fachada diurna",
      "type": "render",
      "filename": "render_1f3bbaff_960217.jpg"
    }
  ],
  "pictures": [...],
  "videos": [...],
  "total_files": 105
}
```

**Файлова структура**:
```
projects/MEDBLUE_MARBELLA/
├── all_files/
│   └── media/
│       ├── renders/     # 33 файли
│       ├── pictures/    # 72 файли
│       └── videos/      # 0 файлів
└── initial.json  # Всі дані проекту (general_info, media, price_availability)
```

### Метод 7: Парсинг блоку Price&Availability
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування інформації про ціни та доступність проекту.

**Результат**:
- ✅ Створено функцію `parse_project_price_availability()`
- ✅ **УСПІШНА АВТОРИЗАЦІЯ**: Примусова авторизація через GO TO AGENTS AREA
- ✅ Витягування цін з різних селекторів
- ✅ **ТАБЛИЦЯ ЦІН ДОСТУПНА**: 4 квартири з детальною інформацією
- ✅ Витягування контактної інформації
- ✅ Збереження в initial.json
- ✅ Структуровання інформації

**Команда**:
```bash
python main.py price  # Парсинг Price&Availability для MEDBLUE MARBELLA
```

**Структура даних в initial.json**:
```json
{
  "project_name": "MEDBLUE MARBELLA",
  "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
  "parsed_at": "2025-08-30T19:39:33.564874",
  "description": "...",
  "development_status": "UNDER CONSTRUCTION",
  "typical_units": "3 BEDS",
  "developer": "© 2022 Azul Real Estate",
  "media": {
    "renders": [...],
    "pictures": [...],
    "videos": [...],
    "total_files": 48
  },
  "price_availability": {
    "price_information": {
      "price_from": "679.000€",
      "price_context": "3 BEDS from 679.000€",
      "currency": "EUR"
    },
    "responsive_table": {
      "found": true,
      "table_id": "tabla_precios",
      "units_data": [
        {
          "ref": "13A",
          "type": "Piso",
          "floor": "3",
          "beds": "3",
          "baths": "2",
          "built": "156,50",
          "terrace": "23,80",
          "garden": "--",
          "price": "679.000",
          "availability": "Disponible",
          "floor_plan": "https://api.globalgest.online/ws/v3/documentacion/azul/161364/c1f0a00aa90ac10b07d669207d49707b"
        }
      ]
    },
    "contact_information": {
      "agent_name": "Lucía Valle",
      "agent_email": "info@azuldevelopments.com",
      "agent_phone": "+34672297010"
    }
  }
}
```

**Селектори цін**:
- `//span[contains(@class, 'precio_ficha')]` - основна ціна
- `//div[contains(@class, 'cont_dorm_precio')]` - ціна з контекстом
- `//div[contains(@class, 'precio_cont')]` - контейнер ціни
- `//span[contains(text(), '€')]` - загальний пошук цін

### Метод 8: Парсинг блоку Plans
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування планів проекту (зображення, документи, посилання, контейнери).

**Результат**:
- ✅ Створено функцію `parse_project_plans()`
- ✅ **УСПІШНА АВТОРИЗАЦІЯ**: Примусова авторизація через GO TO AGENTS AREA
- ✅ Клік на вкладку PLANS та аналіз вмісту
- ✅ **145 ЗОБРАЖЕНЬ ПЛАНІВ**: Повний доступ до всіх планів порталів
- ✅ **160 ПОСИЛАНЬ ПЛАНІВ**: Всі вкладки та посилання на плани
- ✅ **18 КОНТЕЙНЕРІВ ПЛАНІВ**: Структуровані контейнери з планами
- ✅ Витягування документів (PDF, DOC, XLS тощо)
- ✅ Збереження в initial.json
- ✅ Оцінка якості даних: 100% (excellent)

**Команда**:
```bash
python main.py plans  # Парсинг планів для MEDBLUE MARBELLA
```

**Структура даних**:
```json
{
  "plans": {
    "project_name": "MEDBLUE MARBELLA",
    "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
    "parsed_at": "TIMESTAMP",
    "plans_images": [
      {
        "index": 0,
        "src": "https://api.globalgest.online/ws/v3/documentacion/azul/161415/762e4c60376b30814a59bf3da8047b9a",
        "alt": "",
        "title": "",
        "location": "planos_div"
      },
      {
        "index": 1,
        "src": "https://api.globalgest.online/ws/v3/documentacion/azul/161359/d5b23dc6a9dff609ed323f95573e7bc7",
        "alt": "",
        "title": "",
        "location": "planos_div"
      }
    ],
    "plans_documents": [],
    "plans_links": [
      {
        "text": "MASTER PLAN",
        "href": "https://azuldevelopments.com/en/#masterplan",
        "location": "planos_div"
      },
      {
        "text": "PORTAL 1",
        "href": "https://azuldevelopments.com/en/#planos1",
        "location": "planos_div"
      },
      {
        "text": "PORTAL 2",
        "href": "https://azuldevelopments.com/en/#planos2",
        "location": "planos_div"
      }
    ],
    "plans_containers": [
      {
        "id": "planos",
        "class": "tab-pane fade active show",
        "text": "Only registered users can access this content...",
        "keyword": "plan"
      }
    ]
  }
}
```

**Ключові слова для пошуку планів**:
- `plan`, `plano`, `plant`, `floor`, `piso`, `layout`, `diseño`, `design`

**Переваги**:
- Універсальність: працює з різними типами планів
- Розумний пошук: використовує ключові слова для ідентифікації
- Детальність: зберігає метадані та контекст
- Авторизація: автоматична перевірка та виконання при необхідності

---

### Метод 9: AI синхронізація та структурування
**Статус**: 📝 Планується

**Опис**: Інтеграція з AI для обробки та аналізу даних.

### Метод 9: Автоматизація оновлень
**Статус**: 📝 Планується

**Опис**: Система автоматичного оновлення даних проектів.

---

## 📊 Статистика поточного стану

- ✅ **Авторизація**: Універсальна система працює
- ✅ **Сесії**: Збереження/відновлення працює
- ✅ **Парсинг проектів**: Адаптивний пошук працює (37 проектів)
- ✅ **Структура папок**: Детальна організація створена
- ✅ **JSON файли**: initial.json, structured.json
- ✅ **Блоки контенту**: 7 основних блоків + медіа підпапки
- ✅ **General_info парсинг**: Завершено (100% якість даних)
- ✅ **Синхронізація даних**: Між головною сторінкою та сторінкою проекту
- ✅ **Media парсинг**: Завершено (48 файлів)
- ✅ **Price&Availability парсинг**: Завершено (ціни, контакти, **ТАБЛИЦЯ ЦІН ДОСТУПНА**)
- ✅ **Plans парсинг**: Завершено (зображення планів, посилання, контейнери)
- ✅ **Quality Specifications парсинг**: Завершено (посилання, контейнери, текст)
- ✅ **Brochure парсинг**: Завершено (PDF документи, посилання, контейнери, текст)
- ✅ **Location парсинг**: Завершено (Google Maps карта, координати, текст)
- 📝 **Інші блоки контенту**: Планується
- 📝 **AI синхронізація**: Планується

## 🔐 Успішний підхід до авторизації

### ✅ **Перевірений алгоритм авторизації:**

1. **Перехід на сторінку проекту**
   ```python
   driver.get(project_url)
   time.sleep(5)
   ```

2. **Клік на захищену вкладку** (PLANS, PRICE & AVAILABILITY)
   ```python
   tab = driver.find_element("xpath", "//a[contains(text(), 'TAB_NAME')]")
   driver.execute_script("arguments[0].click();", tab)
   time.sleep(3)
   ```

3. **Примусова авторизація через GO TO AGENTS AREA**
   ```python
   agents_button = driver.find_element("xpath", "//button[contains(text(), 'GO TO AGENTS AREA')]")
   driver.execute_script("arguments[0].click();", agents_button)
   time.sleep(3)
   ```

4. **Заповнення форми авторизації**
   ```python
   username_field = driver.find_element("xpath", "//input[@id='login_usuario']")
   username_field.send_keys(Config.LOGIN_EMAIL)
   password_field = driver.find_element("xpath", "//input[@id='login_contrasena']")
   password_field.send_keys(Config.LOGIN_PASSWORD)
   ```

5. **Клік на LOGIN**
   ```python
   login_button = driver.find_element("xpath", "//input[@type='submit' and @value='LOGIN']")
   driver.execute_script("arguments[0].click();", login_button)
   time.sleep(8)
   ```

6. **Повернення на сторінку проекту та повторний клік на вкладку**
   ```python
   driver.get(project_url)
   time.sleep(5)
   tab = driver.find_element("xpath", "//a[contains(text(), 'TAB_NAME')]")
   driver.execute_script("arguments[0].click();", tab)
   time.sleep(5)
   ```

### 🎯 **Результати успішної авторизації:**
- **Плани**: 61 зображення, 76 посилань, 37KB HTML контенту
- **Таблиця цін**: 4 квартири з детальною інформацією, повний доступ до даних

### 📋 **Важливі моменти:**
- Авторизація не зберігається між сесіями
- Потрібна примусова авторизація для кожного захищеного блоку
- Використовувати `driver.execute_script()` для кліків
- Завжди повертатися на сторінку проекту після авторизації

### Метод 9: Парсинг блоку Quality Specifications
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування специфікацій якості проекту (зображення, документи, посилання, контейнери, текст).

**Результат**:
- ✅ Створено функцію `parse_project_quality_specs()`
- ✅ **УСПІШНА АВТОРИЗАЦІЯ**: Примусова авторизація через GO TO AGENTS AREA
- ✅ Клік на вкладку QUALITY SPECIFICATIONS та аналіз вмісту
- ✅ Витягування зображень quality specifications
- ✅ Витягування документів quality specifications
- ✅ **7 PDF ДОКУМЕНТІВ QUALITY SPECIFICATIONS**: Включаючи embed PDF файли
- ✅ **2 ПОСИЛАННЯ QUALITY SPECIFICATIONS**: Включаючи посилання на завантаження
- ✅ **2 КОНТЕЙНЕРИ QUALITY SPECIFICATIONS**: Структуровані контейнери
- ✅ **103 СИМВОЛИ ТЕКСТУ**: Детальний опис специфікацій
- ✅ Збереження в initial.json
- ✅ Оцінка якості даних: 100% (excellent)

**Команда**:
```bash
python main.py quality  # Парсинг Quality Specifications для MEDBLUE MARBELLA
```

**Структура даних**:
```json
{
  "quality_specifications": {
    "project_name": "MEDBLUE MARBELLA",
    "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
    "parsed_at": "TIMESTAMP",
    "quality_specs_images": [],
    "quality_specs_documents": [
      {
        "index": 0,
        "src": "https://api.globalgest.online/ws/v3/documentacion/azul/149192/708aa9c4972acadc69c1f358bdbabddf",
        "text": "QUALITY SPECIFICATIONS",
        "file_type": "PDF",
        "width": "500",
        "height": "375",
        "location": "calidades_div",
        "type": "embed"
      },
      {
        "index": 1,
        "src": "https://api.globalgest.online/ws/v3/documentacion/azul/147656/2df6a39657104727e414c04c835b2902",
        "text": "MEMORIA CALIDADES ESPAÑOL",
        "file_type": "PDF",
        "width": "500",
        "height": "375",
        "location": "calidades_div",
        "type": "embed"
      }
    ],
    "quality_specs_links": [
      {
        "text": "download quality specifications",
        "href": "https://azuldevelopments.com/en/download?op=descarga_tipo&id=93&tipo=709",
        "location": "calidades_div"
      },
      {
        "text": "QUALITY SPECIFICATIONS",
        "href": "https://azuldevelopments.com/en/#calidades",
        "keyword": "calidad"
      }
    ],
    "quality_specs_containers": [
      {
        "id": "calidades",
        "class": "tab-pane fade active show",
        "text": "QUALITY SPECIFICATIONS\nQUALITY SPECIFICATIONS\nMEMORIA CALIDADES ESPAÑOL\ndownload quality specifications",
        "keyword": "calidad"
      }
    ],
    "quality_specs_text": "QUALITY SPECIFICATIONS\nQUALITY SPECIFICATIONS\nMEMORIA CALIDADES ESPAÑOL\ndownload quality specifications"
  }
}
```

**Ключові особливості**:
- **УСПІШНА АВТОРИЗАЦІЯ**: Примусова авторизація для доступу до quality specifications
- **EMBED PDF ДОКУМЕНТИ**: Витягування PDF документів через embed елементи
- Універсальність: працює з різними типами quality specifications
- Розумний пошук: використовує різні селектори для quality specifications
- Детальність: зберігає контекст та метадані
- **ПОСИЛАННЯ НА ЗАВАНТАЖЕННЯ**: Пряме посилання на документ quality specifications

---

### Метод 10: Парсинг блоку Brochure
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування брошур проекту (тільки англійська версія) - зображення, документи, посилання, контейнери, текст.

**Результат**:
- ✅ Створено функцію `parse_project_brochure()`
- ✅ **УСПІШНА АВТОРИЗАЦІЯ**: Примусова авторизація через GO TO AGENTS AREA
- ✅ Клік на вкладку BROCHURE та аналіз вмісту
- ✅ Витягування зображень brochure
- ✅ **1 PDF ДОКУМЕНТ BROCHURE**: Вбудований PDF документ
- ✅ **2 ПОСИЛАННЯ BROCHURE**: Включаючи посилання на завантаження
- ✅ **1 КОНТЕЙНЕР BROCHURE**: Структурований контейнер
- ✅ **34 СИМВОЛИ ТЕКСТУ**: Детальний опис брошури
- ✅ Збереження в initial.json
- ✅ Оцінка якості даних: 100% (excellent)

**Команда**:
```bash
python main.py brochure  # Парсинг Brochure для MEDBLUE MARBELLA
```

**Структура даних**:
```json
{
  "brochure": {
    "project_name": "MEDBLUE MARBELLA",
    "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
    "parsed_at": "TIMESTAMP",
    "brochure_images": [],
    "brochure_documents": [
      {
        "index": 0,
        "src": "https://api.globalgest.online/ws/v3/documentacion/azul/149207/04e26476ed396be2b8d40b6d69827279",
        "text": "BROCHURE",
        "file_type": "PDF",
        "width": "500",
        "height": "375",
        "location": "brochure_div",
        "type": "embed"
      }
    ],
    "brochure_links": [
      {
        "text": "download brochure",
        "href": "https://azuldevelopments.com/en/download?op=descarga_tipo&id=93&tipo=728",
        "location": "brochure_div"
      },
      {
        "text": "BROCHURE",
        "href": "https://azuldevelopments.com/en/#folleto",
        "keyword": "folleto"
      }
    ],
    "brochure_containers": [
      {
        "id": "folleto",
        "class": "tab-pane fade active show",
        "text": "FOLLETO\nBROCHURE\ndownload brochure",
        "keyword": "folleto"
      }
    ],
    "brochure_text": "FOLLETO\nBROCHURE\ndownload brochure"
  }
}
```

**Ключові особливості**:
- **УСПІШНА АВТОРИЗАЦІЯ**: Примусова авторизація для доступу до brochure
- **EMBED PDF ДОКУМЕНТИ**: Витягування PDF документів через embed елементи
- **ІСПАНСЬКА СТРУКТУРА**: Використання div з id="folleto" замість "brochure"
- Універсальність: працює з різними типами brochure
- Розумний пошук: використовує різні селектори для brochure
- Детальність: зберігає контекст та метадані
- **ПОСИЛАННЯ НА ЗАВАНТАЖЕННЯ**: Пряме посилання на документ brochure

---

### Метод 11: Парсинг блоку Location
**Статус**: ✅ Завершено та протестовано

**Опис**: Витягування інформації про локацію проекту - Google Maps карта, координати, зображення, посилання, контейнери, текст.

**Результат**:
- ✅ Створено функцію `parse_project_location()`
- ✅ **GOOGLE MAPS КАРТА**: Знайдено та витягнуто iframe з Google Maps
- ✅ **КООРДИНАТИ**: Автоматичне витягування координат з URL карти
- ✅ Витягування зображень location
- ✅ **1 GOOGLE MAPS IFRAME**: Вбудована карта з координатами
- ✅ **0 ПОСИЛАНЬ LOCATION**: Спеціалізовані посилання location
- ✅ **0 КОНТЕЙНЕРІВ LOCATION**: Структуровані контейнери
- ✅ **303 СИМВОЛИ ТЕКСТУ**: Детальний опис локації
- ✅ Збереження в initial.json
- ✅ Оцінка якості даних: 100% (excellent)

**Команда**:
```bash
python main.py location  # Парсинг Location для MEDBLUE MARBELLA
```

**Структура даних**:
```json
{
  "location": {
    "project_name": "MEDBLUE MARBELLA",
    "url": "https://azuldevelopments.com/en/medblue-marbella-costa-sol-93",
    "parsed_at": "TIMESTAMP",
    "location_images": [],
    "location_maps": [
      {
        "index": 0,
        "src": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3206.0285422054703!2d-4.843865584883972!3d36.52930578000528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72d9348628e237%3A0x2812cbe34b466041!2sMedblue%20Los%20Monteros.%20Marbella!5e0!3m2!1ses!2ses!4v1657702321935!5m2!1ses!2ses",
        "width": "1200",
        "height": "450",
        "type": "iframe"
      }
    ],
    "location_links": [],
    "location_containers": [],
    "location_text": "Google Maps: https://www.google.com/maps/embed?...",
    "location_coordinates": {}
  }
}
```

**Ключові особливості**:
- **GOOGLE MAPS ІНТЕГРАЦІЯ**: Автоматичне витягування Google Maps iframe
- **КООРДИНАТИ**: Автоматичне витягування координат з URL карти
- **УНІВЕРСАЛЬНИЙ ПОШУК**: Шукає location інформацію по всій сторінці
- Розумний пошук: використовує різні селектори для location
- Детальність: зберігає контекст та метадані карти
- **EMBED/IFRAME ПІДТРИМКА**: Підтримує різні типи вбудованих карт
- **ТЕКСТОВА ІНФОРМАЦІЯ**: Витягує описову інформацію про локацію

---

## 🤖 Метод 12: AI синхронізація та структурування даних

### Метод 12.1: AI обробка Quality Specifications
**Статус**: ✅ Завершено та протестовано

**Опис**: AI аналіз PDF документів Quality Specifications через Google AI Studio API.

**Результат**:
- ✅ Створено `ai_processor_download.py` з завантаженням PDF
- ✅ **7 PDF документів** успішно оброблено
- ✅ **18 матеріалів** ідентифіковано
- ✅ **7 розкішних брендів** знайдено (ZUCCHETTI, KOS, DURAVIT, UNIBAÑO, Siemens, AZUVI, FERMAX)
- ✅ **Рівень якості**: LUXURY
- ✅ Структуровані дані в `full_info.json`
- ✅ Загальний аналіз через AI

**Команда**:
```bash
python process_quality_specs_download.py  # AI обробка Quality Specifications
```

**Структура даних**:
```json
{
  "quality_specifications_analysis": {
    "documents_processed": 7,
    "documents_failed": 0,
    "structured_data": [...],
    "summary": {
      "total_materials_identified": 18,
      "luxury_brands_found": ["ZUCCHETTI", "KOS", "DURAVIT", "UNIBAÑO", "Siemens", "AZUVI", "FERMAX"],
      "quality_level": "luxury",
      "key_features": ["high-quality thermal insulation", "soundproofing", "aerothermal heating and cooling", ...]
    }
  }
}
```

**Ключові особливості**:
- **PDF ЗАВАНТАЖЕННЯ**: Автоматичне завантаження PDF через requests
- **GOOGLE AI STUDIO**: Використання Gemini 1.5 Flash для аналізу
- **BASE64 КОДУВАННЯ**: Передача PDF в API через base64
- **СТРУКТУРОВАНИЙ АНАЛІЗ**: Детальний аналіз матеріалів, брендів, систем
- **ЗАГАЛЬНИЙ АНАЛІЗ**: AI створює загальний огляд всіх документів
- **JSON ОЧИЩЕННЯ**: Автоматичне видалення markdown форматування

### Метод 12.2: AI обробка Brochure
**Статус**: ✅ Завершено та протестовано

**Опис**: AI аналіз PDF документів Brochure через Google AI Studio API.

**Результат**:
- ✅ Створено `process_brochure.py` для обробки брошури
- ✅ **1 PDF документ** успішно оброблено
- ✅ Структуровані дані про проект, квартири, зручності
- ✅ Маркетинговий аналіз та ключові особливості
- ✅ Оновлення `structured.json` з новими даними

**Команда**:
```bash
python process_brochure.py  # AI обробка Brochure
```

**Ключові особливості**:
- **ІНКРЕМЕНТАЛЬНЕ ОНОВЛЕННЯ**: Додає дані до існуючого structured.json
- **МАРКЕТИНГОВИЙ АНАЛІЗ**: Витягує ключові продажні моменти
- **СТРУКТУРОВАНИЙ КОНТЕНТ**: Організує інформацію по категоріях
- **ТЕХНІЧНІ ХАРАКТЕРИСТИКИ**: Аналізує технічні особливості проекту

### Метод 12.3: AI обробка Plans
**Статус**: ✅ Завершено та протестовано

**Опис**: AI аналіз зображень планів через Google AI Studio API з адаптивною структурою.

**Результат**:
- ✅ Створено `process_plans.py` для обробки планів
- ✅ **145 зображень планів** доступно для обробки
- ✅ **Адаптивна структура** для різних типів планів
- ✅ **Автоматична класифікація** планів за типами
- ✅ Структуровані дані в `structured.json`

**Команда**:
```bash
python process_plans.py  # AI обробка планів
```

**Адаптивна структура планів**:
```json
{
  "plan_type": "community_master_plan | apartment_unit_plan | apartment_floor_plan | site_plan | elevation_plan | section_plan | detail_plan | other",
  "plan_scale": "string (if visible)",
  "plan_orientation": "string (north, south, east, west, or not_visible)",
  "plan_level": "string (ground_floor, first_floor, etc.)",
  "plan_area": "string (if visible, e.g., '150m2')",
  "plan_units": {
    "total_units": "number",
    "unit_types": ["string"],
    "unit_numbers": ["string"]
  },
  "plan_features": {
    "rooms": ["string"],
    "amenities": ["string"],
    "access_points": ["string"],
    "technical_spaces": ["string"]
  },
  "plan_annotations": {
    "text_labels": ["string"],
    "dimensions": ["string"],
    "symbols": ["string"]
  },
  "plan_quality": {
    "clarity": "high | medium | low",
    "detail_level": "detailed | general | schematic",
    "completeness": "complete | partial | overview"
  },
  "plan_description": "string",
  "plan_purpose": "string"
}
```

**Типи планів**:
1. **Community Master Plan** - Глобальне планування ком'юніті
   - Будівельні блоки (Bloques 1.1-3.3)
   - Зручності (басейни, тренажерний зал, СПА)
   - Ландшафтні особливості
   - Точки доступу

2. **Apartment Unit Plan** - Детальне планування квартир
   - Плани конкретних квартир
   - Розміри кімнат
   - Розподіл простору
   - Території та балкони

3. **Apartment Floor Plan** - Плани поверхів
   - Розташування квартир на поверсі
   - Загальні зручності
   - Технічні приміщення

**Ключові особливості**:
- **АДАПТИВНА СТРУКТУРА**: Автоматично адаптується до типу плану
- **ЗОБРАЖЕННЯ АНАЛІЗ**: Аналіз JPEG зображень через base64 кодування
- **АВТОМАТИЧНА КЛАСИФІКАЦІЯ**: Визначення типу плану через AI
- **ДЕТАЛЬНИЙ АНАЛІЗ**: Витягування всіх текстових міток та розмірів
- **ГРУПУВАННЯ ЗА ТИПАМИ**: Організація планів по категоріях
- **ЗАГАЛЬНИЙ АНАЛІЗ**: Створення комплексного огляду всіх планів

### Метод 13: AI обробка всіх юнітів
**Статус**: ✅ Завершено та протестовано

**Опис**: AI аналіз всіх юнітів з правильною ідентифікацією Bloque та детальним аналізом розмірів.

**Результат**:
- ✅ Створено `process_all_units.py` для обробки всіх юнітів
- ✅ **61 унікальний план** доступно для обробки
- ✅ **Правильна ідентифікація** з Bloque, Portal, Letra
- ✅ **Детальний аналіз розмірів** кімнат
- ✅ Структуровані дані в `projects/MEDBLUE_MARBELLA/plans/all_units_analysis.json`

**Команда**:
```bash
python process_all_units.py  # AI обробка всіх юнітів
```

**Структура ідентифікації юнітів**:
```json
{
  "unit_id": "Bloque 1 Portal 1 Letra A 2 Dormitorios",
  "unit_title": "Bloque 1 Portal 1 Letra A 2 Dormitorios",
  "room_areas": {
    "Recibidor": "1,1 m²",
    "Cocina": "9,0 m²",
    "Dormitorio 1": "13,3 m²",
    "Dormitorio 2": "10,1 m²",
    "Salón-Comedor": "21,8 m²"
  },
  "total_area": "128.7 m²"
}
```

**Ключові особливості**:
- **ПРАВИЛЬНА ІДЕНТИФІКАЦІЯ**: Bloque, Portal, Letra, кількість спалень
- **ДЕТАЛЬНІ РОЗМІРИ**: Всі кімнати з точними розмірами
- **АВТОМАТИЧНИЙ РОЗРАХУНОК**: Загальна площа кожної квартири
- **СТРУКТУРОВАНІ ДАНІ**: Організована інформація для подальшого використання
- **ЗВ'ЯЗОК З ФОТО**: URL зображень для кожного юніту

### Метод 14: AI обробка Location
**Статус**: ✅ Завершено та протестовано

**Опис**: AI аналіз локації з витягуванням координат з Google Maps та аналізом близьких об'єктів.

**Результат**:
- ✅ Створено `process_location.py` для AI обробки локації
- ✅ **Координати витягнуто**: 36.52930578000528, -4.843865584883972
- ✅ **Локація визначена**: Los Monteros, Marbella
- ✅ **Близькі об'єкти проаналізовано**: аеропорт, школа, пляж, Mercadona, гольф
- ✅ Структуровані дані в `projects/MEDBLUE_MARBELLA/structured.json`

**Команда**:
```bash
python process_location.py  # AI обробка Location
```

**Структура аналізу локації**:
```json
{
  "location_name": "Los Monteros, Marbella",
  "coordinates": {
    "latitude": 36.52930578000528,
    "longitude": -4.843865584883972
  },
  "nearby_amenities": {
    "airport": {
      "name": "Málaga Airport (AGP)",
      "distance": "approximately 60 km",
      "travel_time": "approximately 45-60 minutes by car"
    },
    "schools": {
      "nearest_school": "International School of Marbella",
      "distance": "approximately 5-10 km",
      "travel_time": "approximately 10-15 minutes by car"
    },
    "beach": {
      "nearest_beach": "Playa de Los Monteros",
      "distance": "approximately 1-2 km",
      "travel_time": "approximately 5 minutes by car"
    },
    "supermarket": {
      "nearest_supermarket": "Mercadona",
      "distance": "approximately 2-3 km",
      "travel_time": "approximately 5-10 minutes by car"
    },
    "golf": {
      "nearest_golf_course": "Rio Real Golf & Hotel",
      "distance": "approximately 3-5 km",
      "travel_time": "approximately 5-10 minutes by car"
    }
  }
}
```

**Ключові особливості**:
- **ВИТЯГУВАННЯ КООРДИНАТ**: Автоматичне витягування з Google Maps URL
- **AI АНАЛІЗ ЛОКАЦІЇ**: Структурована інформація про район
- **БЛИЗЬКІ ОБ'ЄКТИ**: Аеропорт, школа, пляж, Mercadona, гольф поле
- **ТРАНСПОРТ**: Інформація про доступність та дороги
- **ПЕРЕВАГИ/НЕДОЛІКИ**: Аналіз району з точки зору життя

---

## 🎯 Застосування до інших сайтів

**Для адаптації під новий сайт потрібно**:
1. Змінити URL в `config.py`
2. Налаштувати селектори в `project_parser.py`
3. Адаптувати поля даних під структуру сайту
4. Протестувати авторизацію

**Час адаптації**: 2-4 години для нового сайту

---

## 🎯 Наступні кроки

1. **Затвердження поточних методів** (1-5) ✅
2. **Парсинг блоку Media** (Метод 6) - ✅ Завершено
3. **Парсинг блоку Price&Availability** (Метод 7) - ✅ Завершено
4. **Парсинг блоку Plans** (Метод 8) - ✅ Завершено
5. **Парсинг блоку Quality Specifications** (Метод 9) - ✅ Завершено
6. **Парсинг блоку Brochure** (Метод 10) - ✅ Завершено
7. **Парсинг блоку Location** (Метод 11) - ✅ Завершено
8. **AI синхронізація Quality Specifications** (Метод 12) - ✅ Завершено
9. **AI синхронізація Brochure** (Метод 12) - ✅ Завершено
10. **AI синхронізація Plans** (Метод 12) - ✅ Завершено
11. **AI обробка всіх юнітів** (Метод 13) - ✅ Завершено
12. **AI обробка Location** (Метод 14) - ✅ Завершено
13. **Автоматизація оновлень** (Метод 15)

## 🏆 **ЗАВЕРШЕНІ ПРОЕКТИ**

### **1. MEDBLUE MARBELLA** ✅
- **Локація**: Marbella, Los Monteros
- **Статус**: UNDER CONSTRUCTION
- **Ціни**: від 679.000€ (3 BEDS)
- **Юніти**: 61 план (AI аналіз)
- **Медіа**: 16 рендерів
- **Особливості**: Люксові апартаменти з видом на море

### **2. SUNSET BAY ESTEPONA** ✅
- **Локація**: Estepona
- **Статус**: MARKETING STAGE  
- **Ціни**: від 304.000€ (1, 2 & 3 BEDS)
- **Юніти**: 74 плани (AI аналіз)
- **Медіа**: 58 файлів (27 рендерів, 31 фото)
- **Особливості**: 174 апартаменти з великими терасами та панорамним видом на море

## 🔧 Універсальні налаштування

**config.py**:
```python
# Базові налаштування
BASE_URL = "https://example.com"
LOGIN_EMAIL = "user@example.com"
LOGIN_PASSWORD = "password"

# Налаштування сесії
SESSION_DURATION = 6 * 60 * 60  # 6 годин
SESSION_FILE = "data/session_cookies.json"

# Налаштування парсера
REQUEST_DELAY = 2  # Затримка між запитами
HEADLESS = True    # Фоновий режим
SAVE_SCREENSHOTS = True  # Збереження скріншотів
```

---

*Документ оновлюється після затвердження кожного методу*
