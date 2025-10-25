# 📖 Приклади використання компонентів

## 🎨 Logo

### **Світлий логотип (білий):**
```tsx
import { Logo } from '@/components/ui';

<Logo size="large" variant="white" />   // Для темного фону
<Logo size="medium" variant="white" />
<Logo size="small" variant="white" />
```

### **Синій логотип:**
```tsx
<Logo size="large" variant="blue" />    // Для світлого фону
<Logo size="medium" variant="blue" />
<Logo size="small" variant="blue" />
```

### **Розміри:**
- `small`: 100x30 px
- `medium`: 150x45 px
- `large`: 200x60 px

---

## 🔘 Toggle (з SegmentedPicker іконками)

```tsx
import { Toggle } from '@/components/ui';
import { useState } from 'react';

export default function MyScreen() {
  const [isAgent, setIsAgent] = useState(false);

  return (
    <Toggle
      label="I'm Real Estate Agent"
      value={isAgent}
      onValueChange={setIsAgent}
    />
  );
}
```

**Іконки:**
- ❌ Вимкнено: `SegmentedPicker.svg`
- ✅ Увімкнено: `SegmentedPicker active.svg`

---

## 📦 Всі SVG іконки

### **Імпорт іконок:**

```tsx
// Picker іконки
import SegmentedPickerIcon from '@/assets/icons/SegmentedPicker.svg';
import SegmentedPickerActiveIcon from '@/assets/icons/SegmentedPicker active.svg';

// Інші іконки
import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import EyeIcon from '@/assets/icons/eye.svg';
```

### **Використання:**

```tsx
export default function MyComponent() {
  return (
    <View>
      {/* Picker в неактивному стані */}
      <SegmentedPickerIcon width={48} height={28} />
      
      {/* Picker в активному стані */}
      <SegmentedPickerActiveIcon width={48} height={28} />
      
      {/* Chevron для dropdown */}
      <ChevronDownIcon width={20} height={20} color="#64748B" />
      
      {/* Eye іконка для password */}
      <EyeIcon width={24} height={24} color="#000000" />
    </View>
  );
}
```

---

## 🖼️ Логотипи (PNG)

### **Прямий імпорт зображень:**

```tsx
import { Image } from 'react-native';

// Світлий логотип
const logoWhite = require('@/assets/images/new logo.png');

// Синій логотип
const logoBlue = require('@/assets/images/new logo blue.png');

export default function MyScreen() {
  return (
    <View>
      <Image 
        source={logoWhite} 
        style={{ width: 200, height: 60 }}
        resizeMode="contain"
      />
      
      <Image 
        source={logoBlue} 
        style={{ width: 200, height: 60 }}
        resizeMode="contain"
      />
    </View>
  );
}
```

---

## 🎨 Повний приклад Auth екрану:

```tsx
import { View, Text, ImageBackground, SafeAreaView } from 'react-native';
import { Logo, Button, Toggle } from '@/components/ui';
import { useState } from 'react';

export default function SignUpScreen() {
  const [isAgent, setIsAgent] = useState(false);

  return (
    <ImageBackground
      source={{ uri: 'https://...' }}
      className="flex-1"
    >
      <View className="flex-1 bg-black/60">
        <SafeAreaView className="flex-1 px-6 py-12">
          {/* Світлий логотип на темному фоні */}
          <Logo size="medium" variant="white" />

          <Text className="text-white text-2xl font-bold mt-8">
            Create Your Account
          </Text>

          {/* Toggle з SegmentedPicker іконками */}
          <Toggle
            label="I'm Real Estate Agent"
            value={isAgent}
            onValueChange={setIsAgent}
          />

          <Button
            title="Sign Up"
            variant="primary"
            onPress={() => {}}
          />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
```

---

## 📝 Світлий екран (з синім логотипом):

```tsx
import { View, SafeAreaView } from 'react-native';
import { Logo, Button } from '@/components/ui';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        {/* Синій логотип на світлому фоні */}
        <Logo size="small" variant="blue" />

        <Button
          title="Continue"
          variant="dark"
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
```

---

## 🎯 Коли використовувати:

### **Logo variant="white":**
- ✅ На темному фоні (intro screen)
- ✅ На фото з темним overlay
- ✅ На чорному/темно-сірому фоні

### **Logo variant="blue":**
- ✅ На білому фоні (main app)
- ✅ На світлому фоні
- ✅ У header'ах світлої теми

### **SegmentedPicker іконки:**
- ✅ Для Toggle "I'm Real Estate Agent"
- ✅ Будь-які інші перемикачі так/ні

---

**Готово! Всі твої іконки та логотипи працюють! 🎉**

