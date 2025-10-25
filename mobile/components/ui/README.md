# UI Components

## Створені компоненти:

### ✅ Button
- **Варіанти:** `primary` (біла), `outline` (з border), `dark` (темна)
- **Розміри:** 312px x 48px (або fullWidth)
- **Використання:**
```tsx
<Button
  title="Sign up"
  variant="primary"
  onPress={() => {}}
/>
```

### ✅ Input
- **Типи:** `text`, `email`, `password`
- **Розміри:** 312px x 48px (або fullWidth)
- **Особливості:** автоматична іконка eye для password
- **Використання:**
```tsx
<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  type="email"
/>
```

### ✅ Dropdown
- **Розміри:** 312px x 48px (або fullWidth)
- **Особливості:** Modal з списком опцій
- **Використання:**
```tsx
<Dropdown
  placeholder="Property Type"
  value={propertyType}
  onValueChange={setPropertyType}
  options={[
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
  ]}
/>
```

### ✅ Toggle
- **Розміри:** 312px x 32px (або fullWidth)
- **Використання:**
```tsx
<Toggle
  label="I'm Real Estate Agent"
  value={isAgent}
  onValueChange={setIsAgent}
/>
```

### ✅ Logo
- **Розміри:** `small`, `medium`, `large`
- **Теми:** `dark`, `light`
- **Використання:**
```tsx
<Logo size="large" theme="dark" />
```

---

## 📦 SVG Іконки

### Використовуються `@expo/vector-icons` (Ionicons)

Іконки які вже додані в компоненти:
- ✅ **eye-outline / eye-off-outline** - в Input (password)
- ✅ **chevron-down-outline** - в Dropdown

### Додаткові іконки для майбутнього:

Якщо потрібні **кастомні SVG**, додай їх в:
```
mobile/assets/images/icons/
```

І створи компонент:
```tsx
// components/ui/Icon.tsx
import { Svg, Path } from 'react-native-svg';

export const ChevronDownIcon = ({ size = 20, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="2" />
  </Svg>
);
```

---

## 🎨 Колірна схема

З твоїх стилів:
- **Фон input/dropdown:** `#f4f4f4`
- **Темний фон кнопки:** `#010312`
- **Білий:** `#ffffff`
- **Placeholder:** `#94A3B8`
- **Border:** `#ffffff` (0.5px для outline кнопок)

---

## 📐 Розміри

З твоїх стилів:
- **Ширина:** 312px
- **Висота кнопок/inputs:** 48px
- **Висота toggle:** 32px
- **Border radius кнопок:** 120px (rounded-full)
- **Border radius inputs:** 6px (rounded-md)

