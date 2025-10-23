# 🤝 Посібник для контриб'юторів

Дякуємо за ваш інтерес до проекту **For You Real Estate**!

## 📋 Зміст

- [Початок роботи](#початок-роботи)
- [Структура гілок](#структура-гілок)
- [Стиль коду](#стиль-коду)
- [Комміти](#комміти)
- [Pull Requests](#pull-requests)

## 🚀 Початок роботи

1. **Fork репозиторію**
2. **Клонуйте ваш fork:**
   ```bash
   git clone https://github.com/your-username/for-you-real-estate.git
   cd for-you-real-estate
   ```

3. **Додайте upstream:**
   ```bash
   git remote add upstream https://github.com/original/for-you-real-estate.git
   ```

4. **Встановіть залежності:**
   ```bash
   ./scripts/setup.sh
   ```

## 🌳 Структура гілок

- `main` — стабільна версія для production
- `develop` — основна гілка розробки
- `feature/назва-фічі` — нові функції
- `bugfix/назва-багу` — виправлення помилок
- `hotfix/назва` — термінові виправлення для production

### Створення нової гілки

```bash
# Для нової функції
git checkout develop
git pull upstream develop
git checkout -b feature/my-new-feature

# Для виправлення бага
git checkout -b bugfix/fix-something
```

## 💅 Стиль коду

### Backend (TypeScript/NestJS)

- Використовуйте **ESLint** та **Prettier**
- Слідуйте принципам **SOLID**
- Пишіть **типізований** код
- Додавайте **JSDoc коментарі** для публічних методів

```typescript
/**
 * Створює нового користувача
 * @param createUserDto - DTO для створення користувача
 * @returns Створений користувач
 */
async createUser(createUserDto: CreateUserDto): Promise<User> {
  // implementation
}
```

### Frontend (React/Next.js)

- Використовуйте **функціональні компоненти** з hooks
- Назви компонентів в **PascalCase**
- Props в **camelCase**
- CSS класи в **kebab-case**

```tsx
interface UserCardProps {
  userName: string;
  userRole: UserRole;
}

export function UserCard({ userName, userRole }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{userName}</h3>
      <span>{userRole}</span>
    </div>
  );
}
```

## 📝 Комміти

Використовуйте [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Типи коммітів:

- `feat:` — нова функціональність
- `fix:` — виправлення бага
- `docs:` — зміни в документації
- `style:` — форматування коду (без змін логіки)
- `refactor:` — рефакторинг коду
- `test:` — додавання тестів
- `chore:` — інші зміни (build, CI/CD)

### Приклади:

```bash
feat(users): додати можливість фільтрації користувачів по ролі

fix(properties): виправити помилку при завантаженні зображень

docs(readme): оновити інструкції по встановленню
```

## 🔍 Pull Requests

1. **Переконайтеся, що код працює:**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

2. **Оновіть вашу гілку:**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/my-feature
   git rebase develop
   ```

3. **Push ваших змін:**
   ```bash
   git push origin feature/my-feature
   ```

4. **Створіть Pull Request** на GitHub

### Шаблон PR:

```markdown
## 📋 Опис

Короткий опис змін...

## 🎯 Тип змін

- [ ] Нова функція
- [ ] Виправлення бага
- [ ] Оновлення документації
- [ ] Рефакторинг
- [ ] Інше

## ✅ Чеклист

- [ ] Код відповідає стилю проекту
- [ ] Додано/оновлено тести
- [ ] Всі тести проходять
- [ ] Оновлено документацію
- [ ] Немає конфліктів з develop
```

## 🧪 Тестування

Перед створенням PR переконайтеся:

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Admin Panel
cd admin-panel
npm run type-check
npm run lint
```

## 📞 Питання?

Якщо у вас є питання, створіть Issue або зв'яжіться з командою.

---

**Дякуємо за ваш внесок! 🎉**

