# 📋 Шаблон структури JSON для полігонів районів

## Формат даних

Використовуємо стандарт **GeoJSON FeatureCollection**

---

## 🎯 Структура для кожного рівня

### Базовий формат (для всіх файлів):

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "унікальний-id",
      "properties": {
        "name": "Назва району/міста",
        "name_en": "English Name",
        "name_es": "Nombre Español",
        "type": "region|city|district|neighborhood",
        "level": 1,
        "parent": "назва-батьківського-елемента",
        "slug": "url-slug"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [longitude, latitude],
            [longitude, latitude],
            [longitude, latitude],
            [longitude, latitude]
          ]
        ]
      }
    }
  ]
}
```

---

## 📁 Структура файлів

### Рівень 1: `level-1-region.json`
**Costa del Sol (загальний регіон)**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "costa-del-sol",
      "properties": {
        "name": "Costa del Sol",
        "name_en": "Costa del Sol",
        "name_es": "Costa del Sol",
        "type": "region",
        "level": 1,
        "parent": null,
        "slug": "costa-del-sol"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.3, 36.3],
          [-4.3, 36.3],
          [-4.3, 36.8],
          [-5.3, 36.8],
          [-5.3, 36.3]
        ]]
      }
    }
  ]
}
```

---

### Рівень 2: `level-2-cities.json`
**Міста (Marbella, Estepona, тощо)**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "marbella",
      "properties": {
        "name": "Marbella",
        "name_en": "Marbella",
        "name_es": "Marbella",
        "type": "city",
        "level": 2,
        "parent": "costa-del-sol",
        "slug": "marbella"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.0, 36.48],
          [-4.82, 36.48],
          [-4.82, 36.58],
          [-5.0, 36.58],
          [-5.0, 36.48]
        ]]
      }
    },
    {
      "type": "Feature",
      "id": "estepona",
      "properties": {
        "name": "Estepona",
        "type": "city",
        "level": 2,
        "parent": "costa-del-sol"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      }
    }
  ]
}
```

---

### Рівень 3: `level-3-districts.json`
**Райони (Puerto Banús, Nueva Andalucía, тощо)**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "puerto-banus",
      "properties": {
        "name": "Puerto Banús",
        "name_en": "Puerto Banus",
        "name_es": "Puerto Banús",
        "type": "district",
        "level": 3,
        "parent": "marbella",
        "slug": "puerto-banus"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-4.95, 36.485],
          [-4.92, 36.485],
          [-4.92, 36.505],
          [-4.95, 36.505],
          [-4.95, 36.485]
        ]]
      }
    }
  ]
}
```

---

### Рівень 4 (опціонально): `level-4-neighborhoods.json`
**Мікрорайони (Cortijo Blanco, Linda Vista, тощо)**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "cortijo-blanco",
      "properties": {
        "name": "Cortijo Blanco",
        "type": "neighborhood",
        "level": 4,
        "parent": "san-pedro-alcantara",
        "parent_city": "marbella"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      }
    }
  ]
}
```

---

## 🔑 Обов'язкові поля

### Properties (мінімум):
- `name` - назва (обов'язково)
- `type` - тип (region/city/district/neighborhood)
- `level` - рівень (1/2/3/4)
- `parent` - батьківський елемент

### Geometry:
- `type` - тип геометрії (Polygon або MultiPolygon)
- `coordinates` - масив координат [longitude, latitude]

---

## 📝 Важливі примітки

### 1. Координати
- Формат: `[longitude, latitude]` (НЕ навпаки!)
- Longitude (довгота) = -5.0 до -4.0 для Costa del Sol
- Latitude (широта) = 36.3 до 36.8 для Costa del Sol
- **Полігон має бути замкнутим** (перша і остання точка однакові)

### 2. ID
- Унікальний для кожного feature
- Краще використовувати slug (наприклад: "puerto-banus")

### 3. MultiPolygon
Якщо район складається з декількох окремих частин:

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]]
    ],
    [
      [[lon4, lat4], [lon5, lat5], [lon6, lat6], [lon4, lat4]]
    ]
  ]
}
```

---

## 🎨 Якщо дані з Idealista

### Формат Idealista (приклад):
```json
{
  "zones": [
    {
      "id": "0-EU-ES-29-067-001",
      "name": "Puerto Banús",
      "path": [[36.485, -4.95], [36.485, -4.92], ...]
    }
  ]
}
```

### Конвертація:
1. `zones` → `features`
2. `path` → `geometry.coordinates`
3. **ВАЖЛИВО:** Idealista використовує `[lat, lon]`, а GeoJSON — `[lon, lat]`
4. Потрібно перевернути координати!

---

## ✅ Checklist перед заповненням

- [ ] Всі полігони замкнуті (перша = остання точка)
- [ ] Координати в правильному порядку [lon, lat]
- [ ] Всі features мають унікальний id
- [ ] Parent посилається на існуючий елемент
- [ ] Level відповідає ієрархії
- [ ] JSON валідний (можна перевірити на jsonlint.com)

---

## 🚀 Після заповнення

1. Збережіть файли в `data/geojson/`
2. Перевірте JSON на помилки
3. Система автоматично підхопить дані
4. Перезавантажте сторінку карти
5. Натисніть кнопку "Neighborhoods"

---

## 🔧 Інструменти для роботи

- **Перевірка JSON:** https://jsonlint.com/
- **Перегляд GeoJSON:** https://geojson.io/
- **Конвертація координат:** онлайн калькулятори lat/lon

---

**Готово до заповнення!** 📝

