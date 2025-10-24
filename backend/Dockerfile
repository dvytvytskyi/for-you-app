# Базовий образ
FROM node:20-alpine AS base

# Встановлення залежностей для native модулів
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Копіюємо package файли
COPY package*.json ./

# Build stage
FROM base AS build

# Встановлюємо всі залежності (включно з dev)
RUN npm ci

# Копіюємо вихідний код
COPY . .

# Будуємо проект
RUN npm run build

# Production stage
FROM base AS production

# Встановлюємо тільки production залежності
RUN npm ci --only=production

# Копіюємо зібраний код з build stage
COPY --from=build /app/dist ./dist

# Відкриваємо порт
EXPOSE 3000

# Запускаємо додаток
CMD ["node", "dist/main.js"]

# Development stage
FROM base AS development

# Встановлюємо всі залежності
RUN npm ci

# Копіюємо вихідний код
COPY . .

# Відкриваємо порт
EXPOSE 3000

# Запускаємо в dev режимі
CMD ["npm", "run", "start:dev"]

