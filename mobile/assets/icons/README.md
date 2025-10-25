# 📦 SVG Іконки

## ✅ Готово! Тепер можеш просто додавати `.svg` файли в цю папку!

---

## 📁 Структура:

```
assets/icons/
├── chevron-down.svg    ✅ Приклад
├── eye.svg             ✅ Приклад
├── твоя-іконка.svg     👈 Додавай сюди!
└── README.md
```

---

## 🎯 Як використовувати:

### **1. Додай SVG файл в цю папку**

Просто скопіюй `.svg` файл в `assets/icons/`

### **2. Імпортуй і використовуй як компонент**

```tsx
import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import EyeIcon from '@/assets/icons/eye.svg';

// В компоненті:
export default function MyComponent() {
  return (
    <View>
      <ChevronDownIcon width={20} height={20} color="#64748B" />
      <EyeIcon width={24} height={24} color="#000000" />
    </View>
  );
}
```

### **3. Props які можеш передавати:**

```tsx
<YourIcon 
  width={24}           // Ширина
  height={24}          // Висота
  color="#000000"      // Колір (якщо SVG використовує currentColor)
  fill="#FF0000"       // Колір заливки
  stroke="#00FF00"     // Колір обводки
/>
```

---

## 🎨 Вимоги до SVG:

### ✅ **Правильний SVG:**

```xml
<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="..." stroke="currentColor" />
</svg>
```

### ⚠️ **Важливо:**

1. Використовуй `currentColor` замість конкретних кольорів  
   ✅ `stroke="currentColor"`  
   ❌ `stroke="#000000"`

2. Видали зайві атрибути (`id`, `class`, стилі)

3. Оптимізуй SVG через [SVGOMG](https://jakearchibald.github.io/svgomg/)

---

## 🔄 Після додавання нового SVG:

1. **Збережи файл** в `assets/icons/`
2. **Перезапусти Metro Bundler:**
   ```bash
   # Натисни Ctrl+C в терміналі і запусти знову:
   npx expo start --clear
   ```
3. **Використовуй!**

---

## 📦 Альтернатива: Expo Vector Icons

Якщо не хочеш додавати SVG файли, використовуй готову бібліотеку:

```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="chevron-down" size={20} color="#64748B" />
```

**Доступні набори:**
- Ionicons
- MaterialIcons
- FontAwesome
- Feather
- та інші...

Перегляд усіх іконок: https://icons.expo.fyi/

---

## 🎯 Приклади використання:

### **В Button компоненті:**

```tsx
import ArrowIcon from '@/assets/icons/arrow-right.svg';

<Pressable>
  <Text>Далі</Text>
  <ArrowIcon width={16} height={16} color="#FFF" />
</Pressable>
```

### **В Input компоненті:**

```tsx
import SearchIcon from '@/assets/icons/search.svg';

<View>
  <SearchIcon width={20} height={20} color="#94A3B8" />
  <TextInput placeholder="Пошук..." />
</View>
```

---

**Готово! Тепер просто додавай SVG файли і використовуй! 🎉**

