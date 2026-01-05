# Mobile App: CRM Integration Guide

This document describes how the mobile application should interact with the CRM (leads, pipelines, stages) API.

## 🔑 Authentication
All CRM requests must include a valid JWT token in the Authorization header.

```
Authorization: Bearer <your_access_token>
```

## 📊 Endpoints

### 1. Get Pipelines & Stages
Retreives the CRM structure (funnels and their statuses).

**URL:** `GET /api/v1/amo-crm/pipelines`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 8696950,
      "name": "Sales Funnel",
      "stages": [
        { "id": 70457446, "name": "New Lead", "color": "#ffcc00" },
        { "id": 70697150, "name": "Qualification", "color": "#0099ff" }
      ]
    }
  ]
}
```

> [!NOTE]
> Even if a broker hasn't linked their personal AmoCRM account, this endpoint will return the global system funnels.

### 2. Get Leads (Filtered)
Retrieves the list of leads. For BROKER accounts, the system automatically filters results to show ONLY leads assigned to that specific broker.

**URL:** `GET /api/v1/leads`

**Query Parameters:**
- `page` (optional): Default 1
- `limit` (optional): Default 100 (max 100 per request)
- `pipelineId` (optional): Filter by AmoCRM pipeline ID.
- `stageId` (optional): Filter by AmoCRM stage ID (status).

**Security:**
- If a user has `role: BROKER`, the backend maps their account to their AmoCRM ID.
- If the broker is NOT linked to an AmoCRM user, they will receive an empty list `[]`.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-from-db",
      "guestName": "John Doe",
      "guestPhone": "+971...",
      "status": "NEW",
      "price": 500000,
      "pipelineId": 8696950,
      "stageId": 70457446,
      "responsibleUserId": 10688694,
      "createdAt": "2025-12-20T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 100,
  "totalPages": 1
}
```

### 3. Get Single Lead
Retrieves detailed information about a specific lead.

**URL:** `GET /api/v1/leads/:id`

**Security Check:** If a broker tries to access a lead assigned to someone else, they will receive a 403 Forbidden error.

## 🛠 Required Logic for Frontend

1.  **Check Link Status**: Use `GET /api/v1/auth/me` to check if `amoCrmUserId` is present.
2.  **If null and user is BROKER**: Inform the user that their account is not linked to CRM.
3.  **Handle Empty States**: If `GET /api/v1/leads` returns empty data, show a "No leads assigned" message.
4.  **No ID Passing Needed**: The frontend does NOT need to pass a `brokerId` to the leads endpoint to see "my leads". The backend automatically detects the broker from the token.

---

> [!IMPORTANT]
> To test this functionality, use the broker account `dvytvytskiy@gmail.com`. This account is linked to AmoCRM user "Dima" (ID: 10688694). Any leads assigned to "Dima" in AmoCRM will appear for this user in the app.
