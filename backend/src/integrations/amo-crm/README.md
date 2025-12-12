# AMO CRM Integration

## 📋 Налаштування

### 1. Отримані дані з AMO CRM:

```env
AMO_DOMAIN=reforyou.amocrm.ru
AMO_CLIENT_ID=2912780f-a1e4-4d5d-a069-ee01422d8bef
AMO_CLIENT_SECRET=VfzqqKrfDD78ROmXTMUJkPAauTrYYNHQBAsWaLSYxQNvcQSB9i3xBFVTlcBifumd
AMO_ACCOUNT_ID=31920194
AMO_API_DOMAIN=api-b.amocrm.ru
```

### 2. OAuth2 Flow (перша авторизація):

Код авторизації діє **20 хвилин**! Використовуй його швидко:

```
def502000ecc9442c7090c405fbc2a88b2fe430e75218b35aaa3bd31f226d6f19811227b4da26eb2e47d0a94f6a6078de252a0005b1b6e3c2a080d6a3f7a766d66c23de4186ad09a742b609129823d11e203374d7e1bd266aaad41f3d4b705b57a39f7813d49379672435bb547215e1cc8279fbe86726b766379625e75a4475058362c3f5ebf972195e3cf2f06f6fb47dfeff2e209a04d5c5c556962089d449b28b75bf8872ede4e2c7da8af48372f4cb162cdc8553b9c326c7c40e006c608c5da45cc0908a70a459842d066f168648cd400afc5b7db6b67c5d61936ef98305ae8ec3cd5c4270b077f1ff1de644593b4040115d62a27c4b5402502bc11a13fdb356bf8ca8c8f07f33e9ad04a3b99873c87d1ef516006b4f5fa1ae32c7a456199424a155b74b8da5e4e10cec7e6c79f8ae16018c795d7a957a6fd9dae24855e534cabd87110806f31b96a446ed4130d33e2ab3e02979b38024fdcc71f7da7690d16adcecf1143256462b1e53c554956422c2b8757eab26bc1328d008ddcdc58c4fed4e3f3c4e70da64f87dc390a743fb6f693fdbd862809eeac4ef8d0aa879440eae89bbd2a4dd934435c3666c688d927c6fb5901635df81989698c17ae080a27c8e7aa0a939a0b0739270749c0edd8db3461da653c06bca57ad91508fdaa3ee40360103b7c1ffb167a4d23e0e664252bf7e3e5c23201a0d35d8df02d91de1d87cfe5f500da302fc53f577fbc
```

#### Обмін коду на токени:

```bash
GET http://localhost:3000/api/integrations/amo-crm/callback?code=AUTHORIZATION_CODE
```

Це збереже `access_token` та `refresh_token` в БД і автоматично оновлюватиме їх.

---

## 🔄 Двостороння синхронізація

### 1️⃣ **Наша система → AMO CRM:**

- **При створенні Lead** в `POST /leads` → автоматично створюється в AMO CRM
- **При оновленні статусу** Lead → автоматично оновлюється в AMO CRM
- Зберігається `amoLeadId` для синхронізації

### 2️⃣ **AMO CRM → Наша система:**

Webhook URL (налаштувати в AMO CRM):
```
POST http://localhost:3000/api/integrations/amo-crm/webhook
```

або для production:
```
POST https://your-domain.com/api/integrations/amo-crm/webhook
```

#### Події, які обробляються:
- `leads.status` - зміна статусу лідa
- `leads.update` - оновлення ліда
- `leads.add` - новий лід

---

## 🧪 Тестування

### 1. Перевірка підключення:
```bash
GET http://localhost:3000/api/integrations/amo-crm/test
```

### 2. Створення Lead з синхронізацією:
```bash
POST http://localhost:3000/api/leads
Content-Type: application/json

{
  "propertyId": "uuid-property-id",
  "guestName": "John Doe",
  "guestPhone": "+971501234567",
  "guestEmail": "john@example.com",
  "contactMethod": "PHONE",
  "contactTime": "ANY_TIME",
  "comment": "Test lead for AMO CRM sync"
}
```

Після створення Lead в базі буде поле `amoLeadId` - це ID ліда в AMO CRM.

### 3. Перевірка в AMO CRM:
- Зайти в AMO CRM → Сделки (Leads)
- Знайти новий лід з назвою "Lead #[ID] - [Property Title]"
- Перевірити заповнені поля (телефон, email, ціна)

---

## 📦 Структура модуля

```
src/integrations/amo-crm/
├── amo-crm.module.ts          # Module definition
├── amo-crm.service.ts         # API client + OAuth2
├── amo-crm.controller.ts      # Callback & Webhook endpoints
├── dto/
│   └── amo-webhook.dto.ts     # Webhook payload validation
├── interfaces/
│   └── amo-crm.interface.ts   # TypeScript interfaces
└── README.md                  # Ця документація
```

---

## 🔐 Безпека

- **Токени зберігаються в БД** (таблиця `amo_tokens`)
- **Автоматичне оновлення** через `refresh_token`
- **Expire check:** перевіряється за 5 хвилин до закінчення токену
- Помилки синхронізації **не блокують** створення Lead

---

## 🛠️ Налаштування Webhook в AMO CRM

1. Зайти в AMO CRM → **Налаштування** → **API**
2. Знайти свою інтеграцію "For You Real Estate CRM"
3. Додати Webhook URL: `https://your-domain.com/api/integrations/amo-crm/webhook`
4. Вибрати події:
   - ✅ Сделки: Додавання, Оновлення, Зміна статусу
5. Зберегти

---

## 📝 TODO (Майбутні покращення):

- [ ] Двостороння синхронізація статусів (mapping Lead Status ↔ AMO Pipeline/Status)
- [ ] Sync контактів (створення Contact в AMO перед створенням Lead)
- [ ] Обробка Webhook подій (оновлення нашого Lead при зміні в AMO)
- [ ] Custom Fields mapping (configurable)
- [ ] Bulk sync (масова синхронізація існуючих leads)
- [ ] Retry mechanism для failed syncs
- [ ] Sync queue (через Bull/Redis)

