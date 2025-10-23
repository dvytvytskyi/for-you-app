#!/bin/bash

echo "🚀 Запуск For You Real Estate..."

# Кольори
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Перевірка чи запущені Docker контейнери
if ! docker ps | grep -q for-you-real-estate-postgres; then
    echo "${YELLOW}📦 Запуск Docker контейнерів...${NC}"
    docker-compose up -d postgres redis
    sleep 3
fi

echo "${GREEN}✅ Docker контейнери запущені${NC}"

# Створення tmux сесії або використання окремих термінальних вікон
if command -v tmux &> /dev/null; then
    echo "${YELLOW}🖥️  Запуск у tmux сесії...${NC}"
    
    # Створення нової сесії
    tmux new-session -d -s for-you-real-estate
    
    # Backend у першому вікні
    tmux send-keys -t for-you-real-estate "cd backend && npm run start:dev" C-m
    
    # Admin Panel у другому вікні
    tmux split-window -h -t for-you-real-estate
    tmux send-keys -t for-you-real-estate "cd admin-panel && npm run dev" C-m
    
    # Підключення до сесії
    tmux attach-session -t for-you-real-estate
else
    echo "${YELLOW}⚠️  tmux не встановлено. Запускайте Backend та Admin Panel в окремих терміналах:${NC}"
    echo ""
    echo "  Термінал 1: cd backend && npm run start:dev"
    echo "  Термінал 2: cd admin-panel && npm run dev"
fi

