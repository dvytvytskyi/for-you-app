# 🤖 AI Property Search - Інструкція з налаштування

## ✅ Що вже встановлено

Ваш AI асистент для пошуку нерухомості вже **повністю готовий**! 🎉

**Встановлені компоненти:**
- ✅ Gemini AI клас (`inc/class-gemini-ai.php`)
- ✅ WordPress REST API endpoint (`/wp-json/propart/v1/ai-search`)
- ✅ JavaScript UI (`js/ai-search.js`)
- ✅ CSS стилі (`css/ai-search.css`)
- ✅ Google Gemini API ключ підключено

---

## 🔧 Що потрібно зробити

### **Крок 1: Вказати URL вашого Xano API**

Відкрийте файл:
```
wp-content/themes/propart-spain/inc/class-gemini-ai.php
```

Знайдіть рядок **24** і замініть:
```php
private $xano_url = 'https://x8ki-letl-twmt.n7.xano.io/api:v1'; // ЗАМІНІТЬ на ваш Xano API URL
```

На ваш реальний Xano URL. Його можна знайти в Xano:
1. Відкрийте ваш workspace в Xano
2. Перейдіть в розділ **"API"**
3. Скопіюйте **Base URL** (наприклад: `https://x8ki-letl-twmt.n7.xano.io/api:v1`)

---

### **Крок 2: Створити Xano Endpoint для пошуку**

У вашому Xano потрібно створити **GET endpoint** для пошуку properties.

#### **2.1. Створіть новий API Endpoint:**
- **Method:** GET
- **Path:** `/properties`
- **Name:** `Get Properties with Filters`

#### **2.2. Додайте Query Parameters:**

В Xano API endpoint додайте ці параметри (всі опціональні):

| Parameter | Type | Description |
|-----------|------|-------------|
| `town` | text | Місто (Marbella, Estepona, etc.) |
| `area` | text | Район/урбанізація |
| `type` | text | Тип (apartment, villa, house) |
| `beds` | integer | Точна кількість спалень |
| `beds_min` | integer | Мінімум спалень |
| `beds_max` | integer | Максимум спалень |
| `price_min` | integer | Мінімальна ціна |
| `price_max` | integer | Максимальна ціна |
| `has_pool` | integer | Наявність басейну (1/0) |
| `has_garden` | integer | Наявність саду (1/0) |
| `has_garage` | integer | Наявність гаражу (1/0) |
| `property_status` | text | Статус (secondary/rental) |

#### **2.3. Налаштуйте Filter Logic:**

В Xano Function Stack додайте **Query all records** з таблиці `properties` та застосуйте фільтри:

```
IF town IS NOT EMPTY:
  WHERE properties.town = town

IF area IS NOT EMPTY:
  WHERE properties.area = area

IF type IS NOT EMPTY:
  WHERE properties.type = type

IF beds IS NOT EMPTY:
  WHERE properties.beds = beds

IF beds_min IS NOT EMPTY:
  WHERE properties.beds >= beds_min

IF beds_max IS NOT EMPTY:
  WHERE properties.beds <= beds_max

IF price_min IS NOT EMPTY:
  WHERE properties.price >= price_min

IF price_max IS NOT EMPTY:
  WHERE properties.price <= price_max

IF has_pool = 1:
  WHERE properties.has_pool = 1

IF has_garden = 1:
  WHERE properties.has_garden = 1

IF has_garage = 1:
  WHERE properties.has_garage = 1

IF property_status IS NOT EMPTY:
  WHERE properties.property_status = property_status
```

#### **2.4. Додайте Join для зображень:**

Щоб повертати зображення разом з properties, додайте в Xano:
- **Add-on:** Join `images` table
- **Type:** Left Join
- **Match:** `properties.id = images.properties_id`

---

### **Крок 3: Завантажити файли на сервер**

Завантажте ці нові файли на ваш сервер:

```bash
# З вашого локального комп'ютера:
cd /Users/vytvytskyi/Downloads/htdocs/pro-part.es/wp-content/themes/propart-spain

# Завантажити через SFTP або scp:
scp -r inc/class-gemini-ai.php root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/inc/
scp -r js/ai-search.js root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/js/
scp -r css/ai-search.css root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/css/
```

Або використайте FileZilla/другий SFTP клієнт.

---

### **Крок 4: Оновити functions.php на сервері**

Файл `functions.php` вже оновлено локально. Завантажте його:

```bash
scp functions.php root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/
```

---

## 🧪 Тестування

### **1. Перевірте чи працює REST API:**

Відкрийте в браузері:
```
https://pro-part.es/wp-json/propart/v1/ai-search
```

Має повернути помилку методу (це нормально, бо потрібен POST запит).

### **2. Перевірте UI:**

1. Відкрийте ваш сайт: `https://pro-part.es`
2. У правому нижньому куті має з'явитись **фіолетова кнопка "AI Пошук"** 🤖
3. Натисніть на неї
4. Має відкритись модальне вікно з чатом

### **3. Протестуйте пошук:**

Введіть запит, наприклад:
- *"Квартира в Марбельї 2 спальні до 300 тисяч"*
- *"Villa with pool in Estepona"*
- *"Оренда 3 спальні"*

AI має:
1. ✅ Зрозуміти ваш запит
2. ✅ Повернути топ-5 результатів
3. ✅ Показати картки з об'єктами

---

## 🐛 Якщо щось не працює

### **Проблема 1: Кнопка не з'являється**

**Рішення:**
```bash
# Очистіть кеш WordPress:
ssh root@188.245.228.175
cd /home/pro-part/htdocs/pro-part.es
wp cache flush
```

### **Проблема 2: "Вибачте, виникла помилка"**

**Рішення:**
1. Перевірте Xano URL в `class-gemini-ai.php` (рядок 24)
2. Перевірте чи створено endpoint `/properties` в Xano
3. Увімкніть WordPress Debug для деталей:
   ```php
   // В wp-config.php:
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```
4. Перегляньте лог: `/wp-content/debug.log`

### **Проблема 3: Gemini API помилка**

**Рішення:**
- Перевірте чи правильний API ключ в `class-gemini-ai.php` (рядок 20)
- Переконайтесь що в Google AI Studio є квота (60 запитів/хвилину безкоштовно)

---

## 📊 Як це працює

```
Користувач → Вводить запит
     ↓
JavaScript → Відправляє на /wp-json/propart/v1/ai-search
     ↓
PHP Endpoint → Ініціалізує Gemini_AI_Search клас
     ↓
Gemini API → Аналізує запит, повертає параметри
     ↓
Xano API → Шукає properties за параметрами
     ↓
JavaScript → Відображає результати в чаті
```

---

## 🎨 Кастомізація

### **Змінити кольори кнопки:**

В `css/ai-search.css` (рядок 16):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Змініть на ваш градієнт */
```

### **Змінити текст привітання:**

В `js/ai-search.js` (рядок 60):
```javascript
<p>Привіт! 👋 Я допоможу знайти ідеальну нерухомість.</p>
```

### **Змінити приклади запитів:**

В `js/ai-search.js` (рядок 62-67):
```javascript
<li>"Квартира в Марбельї 2 спальні до 300 тисяч"</li>
<li>"Villa with pool in Estepona"</li>
```

---

## 💡 Додаткові можливості (для майбутнього)

- 🗣️ Голосовий пошук
- 📧 Email з результатами
- 💾 Збереження історії пошуку
- 🔔 Сповіщення про нові об'єкти
- 🗺️ Показати на карті
- 📊 Порівняння об'єктів

---

## 📞 Підтримка

Якщо виникнуть питання:
1. Перегляньте `/wp-content/debug.log`
2. Перевірте Network tab в DevTools браузера
3. Перевірте чи працює Xano API в їх панелі

---

**Створено: 27 жовтня 2025**  
**Версія: 1.0 MVP**  
**AI: Google Gemini Pro**

