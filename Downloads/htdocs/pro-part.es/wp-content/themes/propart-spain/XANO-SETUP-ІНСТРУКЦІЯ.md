# 🔧 XANO НАЛАШТУВАННЯ - Покрокова Інструкція

## 📋 ЩО ПОТРІБНО ЗРОБИТИ В XANO (10 хвилин)

---

## **КРОК 1: Відкрити Xano Workspace**

1. Відкрийте https://xano.com
2. Увійдіть в **Real Estate Management** workspace
3. У лівому меню натисніть **"API"**

---

## **КРОК 2: Створити новий API Endpoint**

1. Натисніть **"+ Add API Endpoint"** (зверху справа)
2. Заповніть:
   - **Name:** `AI Property Search`
   - **Method:** `GET`
   - **Path:** `/properties/search`
   - **Description:** `Search properties with AI-generated filters`

3. Натисніть **"Create"**

---

## **КРОК 3: Додати Input Parameters (Query Params)**

У вкладці **"Inputs"** додайте ці параметри:

### **Базові параметри:**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `town` | text | ❌ | - |
| `area` | text | ❌ | - |
| `type` | text | ❌ | - |

**Як додати:**
1. Натисніть **"+ Add Input"**
2. Name: `town`
3. Type: `text`
4. Required: ❌ (unchecked)
5. Натисніть **"Save"**

**Повторіть для `area` і `type`**

### **Параметри для спалень:**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `beds` | integer | ❌ | - |
| `beds_min` | integer | ❌ | - |
| `beds_max` | integer | ❌ | - |
| `baths` | integer | ❌ | - |

### **Параметри для ціни:**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `price_min` | integer | ❌ | - |
| `price_max` | integer | ❌ | - |

### **Параметри для features:**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `has_pool` | integer | ❌ | - |
| `has_garden` | integer | ❌ | - |
| `has_garage` | integer | ❌ | - |

### **Статус:**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `property_status` | text | ❌ | - |

---

## **КРОК 4: Налаштувати Function Stack**

Тепер в **"Function Stack"** додаємо логіку:

### **4.1. Query all records**

1. Натисніть **"+ Add Function"**
2. Виберіть **"Database Request"** → **"Query all records"**
3. Table: **`properties`**
4. Натисніть **"Save"**

### **4.2. Додати фільтри**

Під Query натисніть **"+ Add Filter"** для кожного параметра:

#### **Фільтр 1: Town**
- Field: `properties.town`
- Operator: `= (equals)`
- Value: `input.town`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 2: Area**
- Field: `properties.area`
- Operator: `= (equals)`
- Value: `input.area`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 3: Type**
- Field: `properties.type`
- Operator: `= (equals)`
- Value: `input.type`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 4: Beds (точно)**
- Field: `properties.beds`
- Operator: `= (equals)`
- Value: `input.beds`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 5: Beds Min**
- Field: `properties.beds`
- Operator: `>= (greater than or equal)`
- Value: `input.beds_min`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 6: Beds Max**
- Field: `properties.beds`
- Operator: `<= (less than or equal)`
- Value: `input.beds_max`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 7: Price Min**
- Field: `properties.price`
- Operator: `>= (greater than or equal)`
- Value: `input.price_min`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 8: Price Max**
- Field: `properties.price`
- Operator: `<= (less than or equal)`
- Value: `input.price_max`
- ✅ Check: **"Only apply if input exists"**

#### **Фільтр 9: Has Pool**
- Field: `properties.has_pool`
- Operator: `= (equals)`
- Value: `1`
- ✅ Condition: **"If input.has_pool = 1"**

#### **Фільтр 10: Has Garden**
- Field: `properties.has_garden`
- Operator: `= (equals)`
- Value: `1`
- ✅ Condition: **"If input.has_garden = 1"**

#### **Фільтр 11: Has Garage**
- Field: `properties.has_garage`
- Operator: `= (equals)`
- Value: `1`
- ✅ Condition: **"If input.has_garage = 1"**

#### **Фільтр 12: Property Status**
- Field: `properties.property_status`
- Operator: `= (equals)`
- Value: `input.property_status`
- ✅ Check: **"Only apply if input exists"**

### **4.3. Додати Join для Images**

1. Після Query, натисніть **"+ Add Function"**
2. Виберіть **"Database Request"** → **"Get related records"**
3. Налаштування:
   - From table: `properties` (результат попереднього Query)
   - Get records from: `images`
   - Where: `images.properties_id` = `properties.id`
   - Store results as: `images` (додається в кожен property)

### **4.4. Сортування**

1. Натисніть **"+ Add Function"**
2. Виберіть **"Data Manipulation"** → **"Sort"**
3. Sort by: `properties.listed_date`
4. Order: `DESC` (новіші зверху)

### **4.5. Limit (опціонально)**

1. Натисніть **"+ Add Function"**
2. Виберіть **"Data Manipulation"** → **"Limit"**
3. Limit: `100` (макс 100 результатів)

---

## **КРОК 5: Тестування в Xano**

1. У правому верхньому куті натисніть **"Run & Debug"**
2. Введіть тестові параметри:
```json
{
  "town": "Marbella",
  "beds_min": 2,
  "price_max": 500000
}
```
3. Натисніть **"Run"**
4. Перевірте результат - має повернути масив з properties

**Очікуваний результат:**
```json
[
  {
    "id": 1,
    "town": "Marbella",
    "type": "apartment",
    "beds": 2,
    "price": 285000,
    "has_pool": 1,
    "images": [
      {
        "id": 1,
        "image_url": "..."
      }
    ]
  }
]
```

---

## **КРОК 6: Скопіювати API URL**

1. Зверху натисніть **"API"** → **"Settings"**
2. Скопіюйте **Base URL** (виглядає як `https://x8ki-letl-twmt.n7.xano.io/api:v1`)
3. Збережіть - він нам потрібен!

---

## **КРОК 7: Оновити WordPress код**

Відкрийте файл:
```
wp-content/themes/propart-spain/inc/class-gemini-ai.php
```

**Знайдіть рядок 26** і замініть:
```php
private $xano_url = 'http://localhost:8000/wp-content/themes/propart-spain';
```

**На ваш реальний Xano URL:**
```php
private $xano_url = 'https://ВАШ-XANO-URL.xano.io/api:v1';
```

**Знайдіть рядок 302** і замініть:
```php
$url = $this->xano_url . '/mock-xano-api.php';
```

**На:**
```php
$url = $this->xano_url . '/properties/search';
```

---

## **КРОК 8: Завантажити на сервер**

```bash
# Завантажити оновлені файли
cd /Users/vytvytskyi/Downloads/htdocs/pro-part.es/wp-content/themes/propart-spain

scp -r inc/class-gemini-ai.php root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/inc/

scp -r js/ai-search.js root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/js/

scp -r css/ai-search.css root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/css/

scp functions.php root@188.245.228.175:/home/pro-part/htdocs/pro-part.es/wp-content/themes/propart-spain/
```

---

## **КРОК 9: Тестування на живому сайті**

1. Відкрийте https://pro-part.es
2. Натисніть кнопку **🤖 AI Пошук**
3. Введіть запит: "Квартира 2 спальні в Марбельї"
4. Має відобразити реальні результати з вашої БД!

---

## 📝 **ШВИДКИЙ ЧЕКЛИСТ:**

- [ ] Створено endpoint `/properties/search` в Xano
- [ ] Додано 14 input parameters
- [ ] Налаштовано Query all records
- [ ] Додано 12 фільтрів
- [ ] Додано Join для images
- [ ] Додано Sort by listed_date
- [ ] Протестовано в Xano (Run & Debug)
- [ ] Скопійовано Base URL
- [ ] Оновлено class-gemini-ai.php (рядок 26 і 302)
- [ ] Завантажено файли на сервер
- [ ] Протестовано на сайті

---

## 🐛 **Troubleshooting:**

### **Xano повертає порожній масив []**
- Перевірте чи є дані в таблиці `properties`
- Спробуйте без фільтрів (видаліть тестові параметри)
- Перевірте чи правильні назви полів

### **"Xano API Error"**
- Перевірте Base URL (має закінчуватись на `/api:v1`)
- Перевірте чи endpoint опублікований (Published)
- Перевірте CORS налаштування в Xano

### **Images не повертаються**
- Перевірте Join налаштування
- Перевірте чи `images.properties_id` = `properties.id`
- Перевірте чи є зображення в таблиці `images`

---

## 💡 **Корисні поради:**

1. **Тестуйте кожен фільтр окремо** в Xano Run & Debug
2. **Додайте логування** - в Xano можна додати "Console log" в Function Stack
3. **Перевірте індекси** - для швидкості додайте індекси на `town`, `type`, `beds`, `price`
4. **Оптимізуйте Join** - якщо багато зображень, можна обмежити кількість

---

**Час виконання: ~10 хвилин**  
**Складність: 🟢 Легко (просто багато кліків)**

**Готові? Починаймо! 🚀**

