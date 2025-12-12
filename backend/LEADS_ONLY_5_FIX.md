# 🔧 Виправлення: Повертається тільки 5 лідів

## 📋 Проблема

Мобільний додаток відображає тільки 5 лідів, незалежно від фільтрів та загальної кількості лідів в БД.

---

## 🔍 Можливі причини

### 1. Дефолтний `limit` на бекенді

**Проблема:** Бекенд може мати дефолтний `limit: 5` замість `limit: 50` або `limit: 100`.

**Перевірка:**
```typescript
// admin-panel-backend/src/routes/leads.routes.ts
const limit = parseInt(req.query.limit as string) || 50; // Перевірити дефолтне значення
```

**Виправлення:**
```typescript
const limit = Math.min(parseInt(req.query.limit as string) || 100, 100); // Дефолт 100, макс 100
```

---

### 2. Обмеження в SQL запиті

**Проблема:** Можливо, є `.limit(5)` в query builder без урахування параметра з запиту.

**Перевірка:**
```typescript
// Шукати в коді:
queryBuilder.limit(5) // ❌ Неправильно
queryBuilder.limit(limit) // ✅ Правильно
```

---

### 3. Неправильна обробка параметрів

**Проблема:** Параметр `limit` може не передаватися або не оброблятися правильно.

**Перевірка:**
```typescript
// Перевірити, чи правильно парсяться query параметри
const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
console.log('📊 Limit from request:', limit);
```

---

## ✅ Правильна реалізація

### Файл: `admin-panel-backend/src/routes/leads.routes.ts`

```typescript
router.get(
  '/',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Парсинг параметрів з правильними дефолтами
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100); // Дефолт 100, макс 100
      const status = req.query.status as 'NEW' | 'IN_PROGRESS' | 'CLOSED' | undefined;
      const pipelineId = req.query.pipelineId ? parseInt(req.query.pipelineId as string) : undefined;
      const stageId = req.query.stageId ? parseInt(req.query.stageId as string) : undefined;
      
      console.log('📊 Request params:', { page, limit, status, pipelineId, stageId });
      
      const amoCrmLeadRepository = AppDataSource.getRepository(AmoCrmLead);
      
      const queryBuilder = amoCrmLeadRepository
        .createQueryBuilder('lead')
        .leftJoinAndSelect('lead.contact', 'contact', 'contact.amo_contact_id = lead.amo_contact_id');
      
      // Додаємо фільтри
      if (pipelineId) {
        queryBuilder.andWhere('lead.pipeline_id = :pipelineId', { pipelineId });
      }
      
      if (stageId) {
        queryBuilder.andWhere('lead.status_id = :stageId', { stageId });
      } else if (status) {
        // Фільтр по mappedStatus через join з AmoCrmStage
        queryBuilder
          .leftJoin('amo_stages', 'stage', 'stage.id = lead.status_id')
          .andWhere('stage.mapped_status = :status', { status });
      }
      
      // Підрахунок загальної кількості (БЕЗ limit)
      const total = await queryBuilder.getCount();
      
      // Застосовуємо пагінацію
      queryBuilder
        .skip((page - 1) * limit)
        .take(limit) // ✅ Використовуємо параметр limit, не хардкод
        .orderBy('lead.updated_at', 'DESC');
      
      const leads = await queryBuilder.getMany();
      
      console.log('📊 Query result:', {
        total,
        requestedLimit: limit,
        returnedLeads: leads.length,
        page,
      });
      
      // Трансформація даних
      const transformedLeads = leads.map(lead => ({
        id: lead.id,
        guestName: lead.contact?.name || null,
        guestPhone: lead.contact?.phone || null,
        guestEmail: lead.contact?.email || null,
        status: lead.mappedStatus || 'NEW',
        price: lead.price || null,
        amoLeadId: lead.amo_lead_id || null,
        pipelineId: lead.pipeline_id || null,
        stageId: lead.status_id || null,
        responsibleUserId: lead.responsible_user_id || null,
        createdAt: lead.created_at.toISOString(),
        updatedAt: lead.updated_at.toISOString(),
      }));
      
      const totalPages = Math.ceil(total / limit);
      
      return res.json({
        data: transformedLeads,
        total,
        page,
        limit,
        totalPages,
      });
    } catch (error: any) {
      console.error('❌ Error in GET /api/v1/leads:', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  }
);
```

---

## 🔍 Діагностика

### 1. Перевірити логи бекенду

```bash
# Подивитися логи контейнера
docker logs <container_name> | grep "Request params"
docker logs <container_name> | grep "Query result"
```

### 2. Тестувати endpoint напряму

```bash
# Отримати токен
TOKEN=$(curl -s -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# Тестувати з limit=100
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?limit=100" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.total, .data | length'

# Тестувати з pipelineId та stageId
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?pipelineId=8696950&stageId=70457446&limit=100" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.total, .data | length'
```

### 3. Перевірити SQL запит

Додати логування SQL запиту:
```typescript
console.log('📊 SQL Query:', queryBuilder.getSql());
console.log('📊 SQL Parameters:', queryBuilder.getParameters());
```

---

## ✅ Чеклист виправлення

- [ ] Перевірити дефолтне значення `limit` (має бути 100, не 5)
- [ ] Перевірити, чи використовується параметр `limit` з запиту (не хардкод)
- [ ] Перевірити, чи правильно застосовується `.take(limit)` в query builder
- [ ] Перевірити, чи правильно рахується `total` (БЕЗ limit)
- [ ] Додати логування для діагностики
- [ ] Перевірити, чи правильно обробляються `pipelineId` та `stageId`
- [ ] Тестувати endpoint з різними значеннями `limit`

---

## 📝 Приклади правильних відповідей

### Запит без фільтрів:
```bash
GET /api/v1/leads?limit=100
```

**Очікувана відповідь:**
```json
{
  "data": [/* до 100 лідів */],
  "total": 150,
  "page": 1,
  "limit": 100,
  "totalPages": 2
}
```

### Запит з фільтрами:
```bash
GET /api/v1/leads?pipelineId=8696950&stageId=70457446&limit=100
```

**Очікувана відповідь:**
```json
{
  "data": [/* всі ліди з цієї стадії */],
  "total": 25,
  "page": 1,
  "limit": 100,
  "totalPages": 1
}
```

---

**Останнє оновлення:** Січень 2025
