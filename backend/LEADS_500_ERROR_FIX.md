# 🔧 Виправлення 500 помилки: column lead.amo_contact_id does not exist

## 🐛 Проблема

Endpoint `GET /api/v1/leads` повертає 500 помилку з повідомленням:
```json
{
  "success": false,
  "message": "column lead.amo_contact_id does not exist"
}
```

## 🔍 Причина

В query builder використовується неправильна назва колонки або неправильна таблиця. TypeORM Query Builder потребує назви колонок БД (snake_case), а не camelCase полів entity.

**Можливі причини:**
1. Endpoint використовує таблицю `leads`, але намагається звернутися до колонки `amo_contact_id`, яка є в таблиці `amo_crm_leads`
2. Endpoint використовує `AmoCrmLead` entity, але в query builder використовується неправильна назва колонки (camelCase замість snake_case)

## ✅ Рішення

### Файл: `admin-panel-backend/src/routes/leads.routes.ts`

### Крок 1: Визначте, яку entity використовує endpoint

Перевірте, яку entity використовує endpoint:

```typescript
// Варіант 1: Використовується Lead entity (таблиця 'leads')
const leadRepository = AppDataSource.getRepository(Lead);
const queryBuilder = leadRepository.createQueryBuilder('lead');

// Варіант 2: Використовується AmoCrmLead entity (таблиця 'amo_crm_leads')
const leadRepository = AppDataSource.getRepository(AmoCrmLead);
const queryBuilder = leadRepository.createQueryBuilder('lead');
```

**ВАЖЛИВО:** Endpoint має використовувати `AmoCrmLead` entity (таблиця `amo_crm_leads`), а не `Lead` entity (таблиця `leads`).

### Крок 2: Перевірте entity AmoCrmLead

Перевірте, яка назва колонки в entity:

```typescript
// admin-panel-backend/src/entities/AmoCrmLead.ts
@Entity('amo_crm_leads')
export class AmoCrmLead {
  @Column({ name: 'amo_contact_id', type: 'int', nullable: true })
  amoContactId?: number;
}
```

**Правильна назва колонки БД:** `amo_contact_id` (snake_case)
**Правильна назва таблиці:** `amo_crm_leads`

### Крок 3: Перевірте, яку entity використовує endpoint

**Якщо використовується `Lead` entity (таблиця `leads`):**

❌ **НЕПРАВИЛЬНО** - таблиця `leads` не має колонки `amo_contact_id`:
```typescript
const leadRepository = AppDataSource.getRepository(Lead); // ❌ Неправильна entity
```

✅ **ПРАВИЛЬНО** - використовуйте `AmoCrmLead` entity (таблиця `amo_crm_leads`):
```typescript
const leadRepository = AppDataSource.getRepository(AmoCrmLead); // ✅ Правильна entity
const queryBuilder = leadRepository.createQueryBuilder('lead');
```

### Крок 4: Знайдіть всі використання в query builder

У файлі `admin-panel-backend/src/routes/leads.routes.ts` знайдіть всі місця, де використовується:

- ❌ `lead.amoContactId` (camelCase - неправильно в query builder)
- ✅ `lead.amo_contact_id` (snake_case - правильно в query builder)

### Крок 5: Виправте всі використання

**Приклад 1: Join з AmoCrmContact**

```typescript
// ❌ НЕПРАВИЛЬНО
queryBuilder
  .leftJoin('amo_crm_contacts', 'contact', 'contact.id = lead.amoContactId')

// ✅ ПРАВИЛЬНО
queryBuilder
  .leftJoin('amo_crm_contacts', 'contact', 'contact.id = lead.amo_contact_id')
```

**Приклад 2: Where умова**

```typescript
// ❌ НЕПРАВИЛЬНО
queryBuilder.andWhere('lead.amoContactId = :contactId', { contactId });

// ✅ ПРАВИЛЬНО
queryBuilder.andWhere('lead.amo_contact_id = :contactId', { contactId });
```

**Приклад 3: Select поля**

```typescript
// ❌ НЕПРАВИЛЬНО
queryBuilder.select([
  'lead.id',
  'lead.amoContactId',
  'contact.name',
]);

// ✅ ПРАВИЛЬНО
queryBuilder.select([
  'lead.id',
  'lead.amo_contact_id',
  'contact.name',
]);
```

### Крок 6: Перевірте всі інші колонки

Переконайтеся, що всі колонки використовуються в snake_case:

- ✅ `lead.status_id` (не `lead.statusId`)
- ✅ `lead.updated_at` (не `lead.updatedAt`)
- ✅ `lead.created_at` (не `lead.createdAt`)
- ✅ `lead.amo_lead_id` (не `lead.amoLeadId`)
- ✅ `lead.amo_contact_id` (не `lead.amoContactId`)
- ✅ `lead.responsible_user_id` (не `lead.responsibleUserId`)

## 📋 Чеклист виправлення

- [ ] Відкрити файл `admin-panel-backend/src/routes/leads.routes.ts`
- [ ] **Перевірити, яку entity використовує endpoint** (`Lead` чи `AmoCrmLead`)
- [ ] **Якщо використовується `Lead` entity - замінити на `AmoCrmLead`**
- [ ] Знайти всі використання `amoContactId` або `amo_contact_id` в query builder
- [ ] Замінити на `amo_contact_id` (snake_case) в query builder
- [ ] Перевірити всі інші колонки (status_id, updated_at, created_at, тощо)
- [ ] Перевірити join'и з іншими таблицями (використовувати snake_case)
- [ ] Перевірити where умови (використовувати snake_case)
- [ ] Перевірити select поля (використовувати snake_case)
- [ ] Перевірити orderBy (використовувати snake_case)
- [ ] Перезапустити backend
- [ ] Протестувати endpoint `GET /api/v1/leads`

## 🧪 Тестування

Після виправлення протестуйте:

```bash
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Очікуваний результат:**
```json
{
  "data": [...],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

## ⚠️ Важливо

1. **Query Builder використовує назви колонок БД** (snake_case), не поля entity (camelCase)
2. **Entity методи автоматично маплять** camelCase → snake_case, але query builder - ні
3. **Перевірте всі join'и** - вони також мають використовувати snake_case
4. **Перевірте всі where умови** - вони також мають використовувати snake_case

## 📝 Приклад правильного коду

```typescript
import { AmoCrmLead } from '../entities/AmoCrmLead'; // ✅ Використовуємо AmoCrmLead
import { AmoCrmContact } from '../entities/AmoCrmContact';
import { AmoCrmStage } from '../entities/AmoCrmStage';

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // ✅ ПРАВИЛЬНО: використовуємо AmoCrmLead entity (таблиця amo_crm_leads)
    const amoCrmLeadRepository = AppDataSource.getRepository(AmoCrmLead);
    const queryBuilder = amoCrmLeadRepository.createQueryBuilder('lead');
    
    // ✅ ПРАВИЛЬНО: використовуємо snake_case назви колонок
    queryBuilder
      .leftJoin('amo_crm_contacts', 'contact', 'contact.id = lead.amo_contact_id') // ✅ snake_case
      .leftJoin('amo_crm_stages', 'stage', 'stage.id = lead.status_id') // ✅ snake_case
      .select([
        'lead.id',
        'lead.amo_lead_id',      // ✅ snake_case
        'lead.amo_contact_id',   // ✅ snake_case
        'lead.status_id',        // ✅ snake_case
        'lead.updated_at',       // ✅ snake_case
        'lead.created_at',       // ✅ snake_case
        'contact.name',
        'contact.phone',
        'contact.email',
        'stage.mappedStatus',
      ])
      .where('lead.status_id IN (:...statusIds)', { statusIds: [1, 2, 3] }) // ✅ snake_case
      .orderBy('lead.updated_at', 'DESC'); // ✅ snake_case
    
    const leads = await queryBuilder.getMany();
    
    // Трансформація даних...
    const transformedLeads = leads.map((lead) => ({
      id: lead.id,
      guestName: lead.guestName || contact?.name || null,
      guestPhone: lead.guestPhone || contact?.phone || null,
      guestEmail: lead.guestEmail || contact?.email || null,
      status: stage?.mappedStatus || 'NEW',
      price: lead.price || null,
      amoLeadId: lead.amoLeadId || null,
      responsibleUserId: lead.responsibleUserId || null,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    }));
    
    return res.json({ 
      data: transformedLeads, 
      total: transformedLeads.length, 
      page: 1, 
      limit: 100, 
      totalPages: 1 
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch leads',
    });
  }
});
```

## 🔍 Додаткова перевірка

Якщо помилка все ще є, перевірте:

1. **Чи існує таблиця `amo_crm_leads` в БД?**
2. **Чи існує колонка `amo_contact_id` в таблиці `amo_crm_leads`?**
3. **Чи правильно імпортована entity `AmoCrmLead`?**

Можна перевірити через SQL:
```sql
-- Перевірка структури таблиці
\d amo_crm_leads

-- Або
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'amo_crm_leads';
```

---

**Останнє оновлення:** Січень 2025

