# ✅ CRM використовує тільки Admin Panel Backend

## 📋 Зміни

Мобільний додаток тепер використовує **тільки admin-panel-backend** для всіх CRM функцій.

### Видалено:
- ❌ Використання main backend для leads
- ❌ Fallback логіка між backends
- ❌ `mainBackendClient` з `mobile/api/leads.ts`
- ❌ `mainBackendClient` з `mobile/api/crm-stats.ts`

### Використовується:
- ✅ `backendApiClient` з URL `https://admin.foryou-realestate.com/api/v1`
- ✅ Тільки admin-panel-backend для всіх CRM операцій

---

## 📝 Оновлені файли

### 1. `mobile/api/leads.ts`

**Було:**
- Використовував `mainBackendClient` з fallback на admin-panel-backend
- Складна логіка перемикання між backends

**Стало:**
- Використовує тільки `backendApiClient` (admin-panel-backend)
- Простий код без fallback логіки

```typescript
export const leadsApi = {
  async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
    const response = await backendApiClient.get<LeadsResponse>('/leads', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Lead> {
    const response = await backendApiClient.get<Lead>(`/leads/${id}`);
    return response.data;
  },
};
```

### 2. `mobile/api/crm-stats.ts`

**Було:**
- Використовував `mainBackendClient` для analytics

**Стало:**
- Використовує `backendApiClient` (admin-panel-backend)
- Fallback на розрахунок через leads API залишився

```typescript
async getMyStats(): Promise<CrmStats> {
  try {
    const response = await backendApiClient.get<CrmStats>('/analytics/my-stats');
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return this.calculateStatsFromLeads();
    }
    throw error;
  }
}
```

---

## 🎯 Endpoints на Admin Panel Backend

Для роботи CRM потрібні наступні endpoints:

### Обов'язкові:
- ✅ `GET /api/v1/leads` - список leads
- ✅ `GET /api/v1/leads/:id` - деталі lead

### Опціональні:
- `GET /api/v1/analytics/my-stats` - статистика (якщо немає - розраховується на клієнті)

---

## ✅ Перевірка

1. **Перевірте, чи endpoint існує:**
   ```bash
   curl -X GET "https://admin.foryou-realestate.com/api/v1/leads" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Перевірте мобільний додаток:**
   - Відкрийте екран CRM
   - Перевірте консоль - має бути запит до `admin.foryou-realestate.com/api/v1/leads`
   - Не має бути запитів до `foryou-realestate.com`

---

## 📊 Архітектура

```
Mobile App (CRM)
    ↓
Admin Panel Backend (https://admin.foryou-realestate.com/api/v1)
    ↓
    - GET /api/v1/leads
    - GET /api/v1/leads/:id
    - GET /api/v1/analytics/my-stats (опціонально)
```

**Main Backend більше не використовується для CRM!**

---

**Останнє оновлення:** Січень 2025
