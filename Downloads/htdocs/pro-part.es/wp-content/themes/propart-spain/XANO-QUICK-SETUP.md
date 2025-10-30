# ⚡ Xano API - Швидке Налаштування

## 📋 Покрокова інструкція для Xano

### **Крок 1: Отримати Base URL**

1. Відкрийте ваш Xano workspace: **Real Estate Management**
2. У лівому меню натисніть **"API"**
3. Зверху справа знайдіть **"Base URL"**
4. Скопіюйте URL (виглядає як: `https://x8ki-letl-twmt.n7.xano.io/api:v1`)

---

### **Крок 2: Створити Endpoint для пошуку**

#### **2.1. Створення:**
1. В Xano, перейдіть в **API** → **Add API Endpoint**
2. Заповніть:
   - **Method:** `GET`
   - **Path:** `/properties/search`
   - **Name:** `Search Properties with AI`
   - **Description:** `AI-powered property search endpoint`

#### **2.2. Додайте Inputs (Query Parameters):**

Натисніть **"+ Add Input"** для кожного параметра:

| Name | Type | Required | Default |
|------|------|----------|---------|
| `town` | text | ❌ | - |
| `area` | text | ❌ | - |
| `type` | text | ❌ | - |
| `beds` | integer | ❌ | - |
| `beds_min` | integer | ❌ | - |
| `beds_max` | integer | ❌ | - |
| `price_min` | integer | ❌ | - |
| `price_max` | integer | ❌ | - |
| `has_pool` | integer | ❌ | - |
| `has_garden` | integer | ❌ | - |
| `has_garage` | integer | ❌ | - |
| `property_status` | text | ❌ | - |

---

### **Крок 3: Налаштувати Function Stack**

#### **3.1. Додайте Query:**

1. Натисніть **"+ Add Function"** → **"Query all records"**
2. Виберіть таблицю: **`properties`**

#### **3.2. Додайте Filters:**

Для кожного параметра додайте умовний фільтр:

**Фільтр 1: Town (Місто)**
```
IF input.town IS NOT EMPTY
  ADD FILTER: properties.town = input.town
```

**Як додати в Xano:**
1. Під Query натисніть **"+ Add Filter"**
2. В умові:
   - Field: `properties.town`
   - Operator: `=`
   - Value: `input.town`
3. Поставте галочку **"Only apply if value exists"**

**Повторіть для всіх полів:**

| Field | Operator | Value | Apply if exists |
|-------|----------|-------|-----------------|
| `properties.town` | `=` | `input.town` | ✅ |
| `properties.area` | `=` | `input.area` | ✅ |
| `properties.type` | `=` | `input.type` | ✅ |
| `properties.beds` | `=` | `input.beds` | ✅ |
| `properties.beds` | `>=` | `input.beds_min` | ✅ |
| `properties.beds` | `<=` | `input.beds_max` | ✅ |
| `properties.price` | `>=` | `input.price_min` | ✅ |
| `properties.price` | `<=` | `input.price_max` | ✅ |
| `properties.has_pool` | `=` | `input.has_pool` | ✅ |
| `properties.has_garden` | `=` | `input.has_garden` | ✅ |
| `properties.has_garage` | `=` | `input.has_garage` | ✅ |
| `properties.property_status` | `=` | `input.property_status` | ✅ |

#### **3.3. Додайте Join для Images:**

1. Після Query, натисніть **"+ Add Function"** → **"Add-on"** → **"Get related records"**
2. Налаштування:
   - From table: `properties`
   - Get records from: `images`
   - Where: `images.properties_id` = `properties.id`
   - Store as: `images` (це додасть масив зображень до кожного property)

#### **3.4. Сортування:**

1. Додайте **"+ Add Function"** → **"Sort"**
2. Sort by: `properties.listed_date`
3. Order: `DESC` (найновіші зверху)

#### **3.5. Limit (опціонально):**

1. Додайте **"+ Add Function"** → **"Limit"**
2. Limit: `50` (максимум 50 результатів)

---

### **Крок 4: Тестування в Xano**

1. У правому верхньому куті натисніть **"Run & Debug"**
2. Додайте тестові параметри:
   ```json
   {
     "town": "Marbella",
     "beds_min": 2,
     "price_max": 500000
   }
   ```
3. Натисніть **"Run"**
4. Перевірте чи повертаються результати

**Очікуваний результат:**
```json
[
  {
    "id": 1,
    "property_old_id": "ABC123",
    "town": "Marbella",
    "area": "Golden Mile",
    "type": "apartment",
    "beds": 2,
    "price": 450000,
    "currency": "EUR",
    "has_pool": 1,
    "has_garden": 0,
    "has_garage": 1,
    "images": [
      {
        "id": 1,
        "image_url": "https://..."
      }
    ]
  }
]
```

---

### **Крок 5: Оновити код WordPress**

Тепер у файлі `inc/class-gemini-ai.php` замініть URL:

**Знайдіть рядок 24:**
```php
private $xano_url = 'https://x8ki-letl-twmt.n7.xano.io/api:v1';
```

**Замініть на ваш Base URL з Xano:**
```php
private $xano_url = 'https://ВАШ-XANO-URL/api:v1';
```

**Та рядок 188 (endpoint path):**
```php
$url = $this->xano_url . '/properties/search';
```

---

### **Крок 6: Додаткові налаштування (опціонально)**

#### **6.1. Додати фільтр за Category Values:**

Якщо хочете шукати за features (sea view, beachfront):

1. В Xano endpoint додайте input:
   - Name: `features`
   - Type: `text array`

2. У Function Stack додайте:
   - **"+ Add Function"** → **"Query all records"** → **`category_values`**
   - Filter: `category_values.property_id = properties.id`
   - Filter: `category_values.value IN input.features` (only if exists)

3. В PHP коді (`class-gemini-ai.php`) оновіть метод `build_xano_query()`:

```php
// Features
$features = array();
if ($params['features']['sea_view'] === true) {
    $features[] = 'Sea View';
}
if ($params['features']['beachfront'] === true) {
    $features[] = 'Beachfront';
}
if (!empty($features)) {
    $query['features'] = $features;
}
```

#### **6.2. Додати пагінацію:**

1. В Xano endpoint додайте inputs:
   - `page` (integer, default: 1)
   - `per_page` (integer, default: 20)

2. У Function Stack:
   - Після Sort додайте **"Offset"**: `(page - 1) * per_page`
   - Додайте **"Limit"**: `per_page`

---

### **Крок 7: Фінальна перевірка**

#### **Тест 1: Xano API напряму**

Відкрийте в браузері:
```
https://ВАШ-XANO-URL/api:v1/properties/search?town=Marbella&beds_min=2
```

Має повернути JSON з результатами.

#### **Тест 2: WordPress REST API**

Використайте Postman або curl:
```bash
curl -X POST https://pro-part.es/wp-json/propart/v1/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Квартира в Марбельї 2 спальні"}'
```

Має повернути:
```json
{
  "success": true,
  "message": "Шукаю двокімнатну квартиру в Марбельї",
  "total_found": 15,
  "properties": [...]
}
```

---

## 🎯 Готово!

Тепер ваш AI асистент має:
- ✅ Зрозуміти природну мову (українська, англійська, іспанська)
- ✅ Витягти параметри пошуку
- ✅ Знайти properties в Xano
- ✅ Показати топ-5 результатів
- ✅ Красивий UI чат

---

## 📖 Корисні посилання

- [Xano Documentation](https://docs.xano.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

---

**Створено: 27 жовтня 2025**

