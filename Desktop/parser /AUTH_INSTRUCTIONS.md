# 🔐 Інструкція з авторизації та роботи з файлами

## ✅ Перевірений алгоритм авторизації

### 🎯 **КЛЮЧОВЕ ПРАВИЛО**: Авторизація НЕ зберігається між сесіями!

Для доступу до захищених блоків (PLANS, PRICE & AVAILABILITY) **ЗАВЖДИ** потрібна примусова авторизація:

### 📋 **Покроковий алгоритм:**

1. **Перехід на сторінку проекту**
2. **Клік на захищену вкладку** (PLANS або PRICE & AVAILABILITY)
3. **Примусова авторизація через GO TO AGENTS AREA**
4. **Заповнення форми авторизації**
5. **Клік на LOGIN**
6. **Повернення на сторінку проекту та повторний клік на вкладку**

### 💻 **Код для реалізації:**

```python
# 1. Перехід на сторінку проекту
driver.get(project_url)
time.sleep(5)

# 2. Клік на захищену вкладку
tab = driver.find_element("xpath", "//a[contains(text(), 'TAB_NAME')]")
driver.execute_script("arguments[0].click();", tab)
time.sleep(3)

# 3. Примусова авторизація
agents_button = driver.find_element("xpath", "//button[contains(text(), 'GO TO AGENTS AREA')]")
driver.execute_script("arguments[0].click();", agents_button)
time.sleep(3)

# 4. Заповнення форми
username_field = driver.find_element("xpath", "//input[@id='login_usuario']")
username_field.clear()
username_field.send_keys(Config.LOGIN_EMAIL)
password_field = driver.find_element("xpath", "//input[@id='login_contrasena']")
password_field.clear()
password_field.send_keys(Config.LOGIN_PASSWORD)

# 5. Клік на LOGIN
login_button = driver.find_element("xpath", "//input[@type='submit' and @value='LOGIN']")
driver.execute_script("arguments[0].click();", login_button)
time.sleep(8)

# 6. Повернення та повторний клік
driver.get(project_url)
time.sleep(5)
tab = driver.find_element("xpath", "//a[contains(text(), 'TAB_NAME')]")
driver.execute_script("arguments[0].click();", tab)
time.sleep(5)
```

## 🎯 **Результати успішної авторизації**

### ✅ **Плани (PLANS):**
- **145 зображень планів** (замість 1 без авторизації)
- **160 посилань планів** (замість 1 без авторизації)
- **18 контейнерів планів** (замість 3 без авторизації)
- **Повний доступ** до всіх порталів (MASTER PLAN, PORTAL 1-17)

### ✅ **Таблиця цін (PRICE & AVAILABILITY):**
- **4 квартири** з детальною інформацією
- **Повний доступ** до таблиці `tabla_precios`
- **Детальні дані** про кожну квартиру

## ⚠️ **КРИТИЧНО ВАЖЛИВІ МОМЕНТИ**

### 🔒 **Авторизація:**
- ❌ **НЕ зберігається** між сесіями
- ✅ **Потрібна примусова авторизація** для кожного захищеного блоку
- ✅ **Використовувати** `driver.execute_script()` для кліків
- ✅ **Завжди повертатися** на сторінку проекту після авторизації

### 📁 **Робота з файлами:**
- ✅ **Всі дані зберігаються** в `projects/PROJECT_NAME/initial.json`
- ✅ **НЕ створювати окремі файли** для metadata
- ✅ **Очищати тимчасові файли** після використання
- ✅ **Використовувати скріншоти** для діагностики

### 🧹 **Очищення файлів:**
```bash
# Видалити тимчасові скрипти
rm force_*_auth.py
rm check_*.py
rm debug_*.py
rm analyze_*.py

# Очистити скріншоти
rm screenshots/*.png screenshots/*.html

# Видалити аналітичні файли
rm *_analysis.md
rm *_summary.md
```

## 📋 **Команди для парсингу**

### Основні команди:
- `python main.py general` - Парсинг загальної інформації
- `python main.py media` - Парсинг медіа файлів (renders, pictures, videos)
- `python main.py price` - Парсинг цін та доступності
- `python main.py plans` - Парсинг планів
- `python main.py quality` - Парсинг специфікацій якості
- `python main.py brochure` - Парсинг брошури
- `python main.py location` - Парсинг локації

### AI обробка документів:
- `python process_brochure.py` - AI обробка брошури та створення structured.json
- `python process_plans.py` - AI обробка планів та створення адаптивної структури
- `python process_all_units.py` - AI обробка всіх юнітів з правильною ідентифікацією Bloque
- `python process_location.py` - AI обробка Location з витягуванням координат та аналізом близьких об'єктів

```bash
# Парсинг планів (з примусовою авторизацією)
python main.py plans

# Парсинг цін та доступності (з примусовою авторизацією)
python main.py price

# Парсинг quality specifications (з примусовою авторизацією)
python main.py quality

# Парсинг brochure (з примусовою авторизацією)
python main.py brochure

# Парсинг location (Google Maps карта)
python main.py location

# Парсинг загальної інформації
python main.py general

# Парсинг медіа файлів
python main.py media
```

## 🔍 **Діагностика проблем**

### ❌ **Якщо контент не знайдено:**
1. Перевірити чи виконана примусова авторизація
2. Перевірити скріншоти в папці `screenshots/`
3. Створити діагностичний скрипт з примусовою авторизацією

### ✅ **Створення діагностичного скрипта:**
```python
#!/usr/bin/env python3
"""
Діагностичний скрипт для примусової авторизації
"""

import time
from auth_manager import AuthManager
from config import Config

def force_auth_diagnostic():
    auth_manager = AuthManager()
    try:
        auth_manager.setup_driver()
        # ... код примусової авторизації ...
    finally:
        auth_manager.close()

if __name__ == "__main__":
    force_auth_diagnostic()
```

## 📊 **Структура даних**

### 📁 **Файлова структура:**
```
projects/
└── MEDBLUE_MARBELLA/
    └── initial.json          # Всі дані проекту
        ├── general_info      # Загальна інформація
        ├── media            # Медіа файли
        ├── price_availability # Ціни та доступність
        └── plans            # Плани проекту
```

### 🔄 **Оновлення даних:**
- Всі дані автоматично додаються до `initial.json`
- Старі дані перезаписуються
- Можна парсити окремі блоки незалежно

## 🎯 **Висновок**

**Головне правило**: Завжди використовувати примусову авторизацію для захищених блоків, оскільки звичайна авторизація не дає доступу до контенту на сторінці проекту.
