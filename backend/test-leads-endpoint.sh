#!/bin/bash

# Тестовий скрипт для перевірки endpoint /api/v1/leads на admin-panel-backend

BASE_URL="https://admin.foryou-realestate.com/api"
EMAIL="admin@foryou-realestate.com"
PASSWORD="Admin123!"

echo "🧪 Тестування endpoint /api/v1/leads"
echo "=================================="
echo ""

# 1. Авторизація та отримання токену
echo "1️⃣ Авторизація..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('token', '') or data.get('token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Помилка авторизації"
  echo "Відповідь: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Токен отримано: ${TOKEN:0:20}..."
echo ""

# 2. Тест: Отримати список leads
echo "2️⃣ Тест: GET /api/v1/leads"
LEADS_RESPONSE=$(curl -s -X GET "$BASE_URL/v1/leads?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Відповідь:"
echo "$LEADS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LEADS_RESPONSE"
echo ""

# Перевірка статусу
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/v1/leads?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Endpoint працює (HTTP $HTTP_STATUS)"
else
  echo "❌ Endpoint повернув помилку (HTTP $HTTP_STATUS)"
fi
echo ""

# 3. Тест: Фільтрація по статусу
echo "3️⃣ Тест: GET /api/v1/leads?status=NEW"
STATUS_RESPONSE=$(curl -s -X GET "$BASE_URL/v1/leads?status=NEW&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Відповідь:"
echo "$STATUS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATUS_RESPONSE"
echo ""

# 4. Тест: Отримати конкретний lead (якщо є)
echo "4️⃣ Тест: GET /api/v1/leads/:id"
# Спочатку отримуємо ID першого lead
FIRST_LEAD_ID=$(echo "$LEADS_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); leads = data.get('data', []); print(leads[0]['id'] if leads else '')" 2>/dev/null)

if [ -n "$FIRST_LEAD_ID" ]; then
  LEAD_DETAIL_RESPONSE=$(curl -s -X GET "$BASE_URL/v1/leads/$FIRST_LEAD_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
  
  echo "Відповідь для lead $FIRST_LEAD_ID:"
  echo "$LEAD_DETAIL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LEAD_DETAIL_RESPONSE"
else
  echo "⚠️ Немає leads для тестування деталей"
fi
echo ""

# 5. Тест: Без авторизації (має повернути 401)
echo "5️⃣ Тест: GET /api/v1/leads без токену (має повернути 401)"
UNAUTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/v1/leads" \
  -H "Content-Type: application/json")

UNAUTH_STATUS=$(echo "$UNAUTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
if [ "$UNAUTH_STATUS" = "401" ]; then
  echo "✅ Авторизація працює правильно (HTTP 401)"
else
  echo "⚠️ Очікувалось HTTP 401, отримано HTTP $UNAUTH_STATUS"
fi
echo ""

echo "=================================="
echo "✅ Тестування завершено"
