# 🚀 Швидкий старт

## ⚠️ **КРИТИЧНО ВАЖЛИВО**

### 🔒 **Авторизація НЕ зберігається між сесіями!**

Для захищених блоків (PLANS, PRICE & AVAILABILITY) **ЗАВЖДИ** потрібна примусова авторизація.

## 📋 **Основні команди**

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

# AI обробка документів
python process_brochure.py
python process_plans.py
python process_all_units.py
python process_location.py
```

## 📁 **Структура файлів**

```
projects/
└── MEDBLUE_MARBELLA/
    └── initial.json          # Всі дані проекту
```

## 🧹 **Очищення файлів**

```bash
# Видалити тимчасові скрипти
rm force_*_auth.py check_*.py debug_*.py analyze_*.py

# Очистити скріншоти
rm screenshots/*.png screenshots/*.html

# Видалити аналітичні файли
rm *_analysis.md *_summary.md
```

## 📖 **Детальна інструкція**

Дивіться `AUTH_INSTRUCTIONS.md` для повної інструкції з авторизації та роботи з файлами.
