#!/bin/bash

# Кольори для виводу
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="https://admin.foryou-realestate.com/api"
ADMIN_EMAIL="admin@foryou-realestate.com"
ADMIN_PASSWORD="Admin123!"

# Можна передати user ID як аргумент
USER_ID="${1:-77500209-24c8-4985-8574-ae94c6583566}"

echo -e "${BLUE}🧪 Тестування системи нотифікацій${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Крок 1: Отримати admin token
echo -e "${YELLOW}🔐 Крок 1: Отримую admin token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('data', {}).get('token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ] || [ ${#TOKEN} -lt 20 ]; then
  echo -e "${RED}❌ Помилка отримання token${NC}"
  echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Token отримано: ${TOKEN:0:50}...${NC}"
echo ""

# Крок 2: Перевірити валідність token
echo -e "${YELLOW}🔍 Крок 2: Перевіряю валідність token...${NC}"
ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

USER_ROLE=$(echo "$ME_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('data', {}).get('role', ''))" 2>/dev/null)

if [ "$USER_ROLE" = "ADMIN" ]; then
  echo -e "${GREEN}✅ Token валідний, роль: ADMIN${NC}"
else
  echo -e "${RED}❌ Token невалідний або роль не ADMIN${NC}"
  echo "$ME_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
  exit 1
fi
echo ""

# Крок 3: Відправити тестове сповіщення
echo -e "${YELLOW}📤 Крок 3: Відправляю тестове сповіщення...${NC}"
echo -e "${BLUE}   User ID: $USER_ID${NC}"

NOTIFICATION_RESPONSE=$(curl -s -X POST "$BASE_URL/notifications/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userIds\": [\"$USER_ID\"],
    \"type\": \"system\",
    \"title\": \"Test Notification\",
    \"body\": \"This is a test notification from admin panel\",
    \"data\": {
      \"test\": true,
      \"timestamp\": $(date +%s),
      \"source\": \"test-script\"
    }
  }")

echo "$NOTIFICATION_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$NOTIFICATION_RESPONSE"
echo ""

SUCCESS=$(echo "$NOTIFICATION_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('success', False))" 2>/dev/null)
SENT_TO=$(echo "$NOTIFICATION_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('data', {}).get('sentTo', 0))" 2>/dev/null)

if [ "$SUCCESS" = "True" ]; then
  echo -e "${GREEN}✅ Сповіщення успішно відправлено!${NC}"
  echo -e "${GREEN}   Відправлено до: $SENT_TO користувачів${NC}"
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}🎉 Тест пройдено успішно!${NC}"
  echo ""
  echo -e "${YELLOW}💡 Примітки:${NC}"
  echo -e "   • Сповіщення збережено в notification_history"
  echo -e "   • Для реальної відправки на пристрій потрібен Expo Push Token"
  echo -e "   • Перевірте логи backend для деталей відправки"
else
  echo -e "${RED}❌ Помилка відправки сповіщення${NC}"
  exit 1
fi
