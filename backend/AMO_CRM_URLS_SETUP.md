# ✅ Правильні URL для налаштувань AMO CRM

## 📋 Два поля в налаштуваннях AMO CRM

### 1️⃣ Поле "Ссылка для перенаправления" (Redirect URI)

**Призначення:** URL, на який AMO CRM перенаправляє після OAuth авторизації

**Правильний URL:**
```
https://admin.foryou-realestate.com/api/amo-crm/callback
```

**Неправильний URL:**
```
https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

---

### 2️⃣ Друге поле (Disconnect URL або Webhook URL)

**Призначення:** Залежить від типу поля в AMO CRM

#### Варіант А: Якщо це поле для Disconnect endpoint

**Правильний URL:**
```
https://admin.foryou-realestate.com/api/amo-crm/disconnect
```

**Неправильний URL:**
```
https://foryou-realestate.com/api/v1/integrations/amo-crm/disconnect
```

**Примітка:** Disconnect endpoint викликається з мобільного додатку з JWT токеном, тому це поле може не використовуватись AMO CRM напряму.

#### Варіант Б: Якщо це поле для Webhook URL

**Правильний URL:**
```
https://admin.foryou-realestate.com/api/amo-crm/webhook
```

**Примітка:** Webhook використовується для отримання подій з AMO CRM (оновлення leads, зміна статусів тощо).

---

## ✅ Що робити

### Крок 1: Визначити призначення другого поля

Перевірте в документації AMO CRM або в інтерфейсі, що означає друге поле:
- Disconnect URL?
- Webhook URL?
- Інше призначення?

### Крок 2: Оновити URL

#### Якщо це Disconnect URL:
```
https://admin.foryou-realestate.com/api/amo-crm/disconnect
```

#### Якщо це Webhook URL:
```
https://admin.foryou-realestate.com/api/amo-crm/webhook
```

### Крок 3: Перевірка

Після оновлення:
- [ ] Redirect URI: `https://admin.foryou-realestate.com/api/amo-crm/callback`
- [ ] Друге поле: `https://admin.foryou-realestate.com/api/amo-crm/disconnect` (або `/webhook`)
- [ ] Обидва URL використовують домен `admin.foryou-realestate.com`
- [ ] Обидва URL використовують правильний шлях (`/api/amo-crm/...`)

---

## 📊 Порівняння URL

| Поле | Неправильно | Правильно |
|------|-------------|-----------|
| Redirect URI | `https://foryou-realestate.com/api/v1/integrations/amo-crm/callback` | `https://admin.foryou-realestate.com/api/amo-crm/callback` |
| Disconnect/Webhook | `https://foryou-realestate.com/api/v1/integrations/amo-crm/disconnect` | `https://admin.foryou-realestate.com/api/amo-crm/disconnect` |

---

## ⚠️ Важливо

1. **Всі URL мають використовувати домен `admin.foryou-realestate.com`** (не `foryou-realestate.com`)
2. **Всі URL мають використовувати шлях `/api/amo-crm/...`** (не `/api/v1/integrations/...`)
3. **Disconnect endpoint викликається з мобільного додатку**, тому може не використовуватись AMO CRM напряму
4. **Webhook endpoint** (якщо є) використовується для отримання подій з AMO CRM

---

## 🔍 Як визначити призначення поля

1. Подивіться на назву поля в інтерфейсі AMO CRM
2. Перевірте документацію AMO CRM
3. Якщо не впевнені - залиште пустим або використайте webhook URL

---

**Останнє оновлення:** Січень 2025
