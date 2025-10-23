#!/bin/bash

echo "🚀 Налаштування проекту For You Real Estate..."

# Кольори для виводу
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Перевірка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не встановлено. Будь ласка, встановіть Docker Desktop."
    exit 1
fi

echo "${GREEN}✅ Docker знайдено${NC}"

# Запуск Docker контейнерів
echo "${YELLOW}📦 Запуск Docker контейнерів...${NC}"
docker-compose up -d postgres redis

# Очікування запуску PostgreSQL
echo "${YELLOW}⏳ Очікування запуску PostgreSQL...${NC}"
sleep 5

# Backend
echo "${YELLOW}🔧 Налаштування Backend...${NC}"
cd backend

if [ ! -f .env ]; then
    echo "${YELLOW}📝 Створення .env файлу...${NC}"
    cp .env.example .env
fi

echo "${YELLOW}📦 Встановлення залежностей Backend...${NC}"
npm install

cd ..

# Admin Panel
echo "${YELLOW}🎨 Налаштування Admin Panel...${NC}"
cd admin-panel

if [ ! -f .env ]; then
    echo "${YELLOW}📝 Створення .env файлу...${NC}"
    cp .env.example .env
fi

echo "${YELLOW}📦 Встановлення залежностей Admin Panel...${NC}"
npm install

cd ..

echo ""
echo "${GREEN}✅ Налаштування завершено!${NC}"
echo ""
echo "Для запуску проекту виконайте:"
echo "  Backend:      cd backend && npm run start:dev"
echo "  Admin Panel:  cd admin-panel && npm run dev"
echo ""
echo "Або використайте:"
echo "  ./scripts/start.sh"

