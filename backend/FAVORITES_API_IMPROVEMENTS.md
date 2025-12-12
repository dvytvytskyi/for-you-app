# Покращення Favorites API для синхронізації з мобільним додатком

## Поточна ситуація

Бекенд має базовий API для favorites, але відповіді не відповідають формату, який очікує мобільний додаток. Мобільний додаток очікує формат `{ success: true, data: ... }`.

## Що потрібно зробити на бекенді

### 1. Створити DTO для відповідей Favorites API

**Файл:** `backend/src/properties/dto/favorites-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { PropertyResponseDto } from './property-response.dto';

// Відповідь для GET /favorites - список улюблених properties
export class FavoritesListResponseDto {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty({ type: [PropertyResponseDto] })
  data: PropertyResponseDto[];
}

// Відповідь для POST /favorites/:propertyId - додавання в улюблені
export class AddFavoriteResponseDto {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty()
  data: {
    message: string;
    propertyId: string;
  };
}

// Відповідь для DELETE /favorites/:propertyId - видалення з улюблених
export class RemoveFavoriteResponseDto {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty()
  data: {
    message: string;
    propertyId: string;
  };
}

// Відповідь для перевірки статусу favorite
export class FavoriteStatusResponseDto {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty()
  data: {
    isFavorite: boolean;
    propertyId: string;
  };
}
```

### 2. Оновити FavoritesService для повернення правильного формату

**Файл:** `backend/src/properties/favorites.service.ts`

**Зміни:**

1. **Оновити метод `getUserFavorites`:**
   - Замість `Promise<Property[]>` повертати `Promise<FavoritesListResponseDto>`
   - Обгорнути результат у формат `{ success: true, data: properties }`
   - Додати всі необхідні relations для Property (city, area, country, photos, developer, тощо)

2. **Оновити метод `addToFavorites`:**
   - Замість `Promise<{ message: string }>` повертати `Promise<AddFavoriteResponseDto>`
   - Обгорнути результат у формат `{ success: true, data: { message, propertyId } }`
   - Зробити ідемпотентним (якщо вже є в favorites - не кидати помилку, а повернути success)

3. **Оновити метод `removeFromFavorites`:**
   - Замість `Promise<{ message: string }>` повертати `Promise<RemoveFavoriteResponseDto>`
   - Обгорнути результат у формат `{ success: true, data: { message, propertyId } }`
   - Зробити ідемпотентним (якщо немає в favorites - не кидати помилку, а повернути success)

4. **Додати новий метод `getFavoriteIds`:**
   - Повертати тільки масив ID улюблених properties (для швидкої синхронізації)
   - Формат: `{ success: true, data: { favoriteIds: string[] } }`

5. **Додати новий метод `syncFavorites`:**
   - Приймає масив ID properties, які мають бути в favorites
   - Видаляє ті, яких немає в масиві
   - Додає нові з масиву
   - Повертає оновлений список

### 3. Оновити FavoritesController для використання DTO

**Файл:** `backend/src/properties/favorites.controller.ts`

**Зміни:**

1. **Додати імпорти DTO:**
```typescript
import { 
  FavoritesListResponseDto, 
  AddFavoriteResponseDto, 
  RemoveFavoriteResponseDto,
  FavoriteStatusResponseDto 
} from './dto/favorites-response.dto';
```

2. **Оновити метод `getUserFavorites`:**
   - Додати `@ApiResponse({ status: 200, type: FavoritesListResponseDto })`
   - Змінити тип повернення на `Promise<FavoritesListResponseDto>`

3. **Оновити метод `addToFavorites`:**
   - Додати `@ApiResponse({ status: 201, type: AddFavoriteResponseDto })`
   - Змінити тип повернення на `Promise<AddFavoriteResponseDto>`
   - Змінити статус код на 201 (Created)

4. **Оновити метод `removeFromFavorites`:**
   - Додати `@ApiResponse({ status: 200, type: RemoveFavoriteResponseDto })`
   - Змінити тип повернення на `Promise<RemoveFavoriteResponseDto>`

5. **Додати новий endpoint `GET /favorites/ids`:**
   - Повертає тільки масив ID
   - Швидший варіант для синхронізації

6. **Додати новий endpoint `GET /favorites/:propertyId/status`:**
   - Перевірка, чи property є в favorites
   - Повертає `{ success: true, data: { isFavorite: boolean, propertyId: string } }`

7. **Додати новий endpoint `POST /favorites/sync` (опціонально):**
   - Приймає body: `{ favoriteIds: string[] }`
   - Синхронізує favorites з наданим списком

### 4. Додати необхідні relations в getUserFavorites

**Важливо:** Переконатися, що `getUserFavorites` завантажує всі необхідні дані для Property:

```typescript
const favorites = await this.favoriteRepository.find({
  where: { userId },
  relations: [
    'property',
    'property.images',
    'property.developer',
    'property.city',
    'property.country',
    'property.area',
    'property.amenities',
    'property.paymentPlans',
  ],
});
```

### 5. Приклад оновленого коду

#### Оновлений FavoritesService:

```typescript
async getUserFavorites(userId: string): Promise<FavoritesListResponseDto> {
  const favorites = await this.favoriteRepository.find({
    where: { userId },
    relations: [
      'property',
      'property.images',
      'property.developer',
      'property.city',
      'property.country',
      // додати всі необхідні relations
    ],
    order: {
      createdAt: 'DESC', // нові спочатку
    },
  });

  const properties = favorites.map((fav) => fav.property);

  return {
    success: true,
    data: properties,
  };
}

async addToFavorites(userId: string, propertyId: string): Promise<AddFavoriteResponseDto> {
  // Check if property exists
  const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
  if (!property) {
    throw new NotFoundException(`Property with ID ${propertyId} not found`);
  }

  // Check if already in favorites
  const existing = await this.favoriteRepository.findOne({
    where: { userId, propertyId },
  });

  // Ідемпотентність - якщо вже є, просто повертаємо success
  if (existing) {
    return {
      success: true,
      data: {
        message: 'Property already in favorites',
        propertyId,
      },
    };
  }

  // Add to favorites
  const favorite = this.favoriteRepository.create({ userId, propertyId });
  await this.favoriteRepository.save(favorite);

  return {
    success: true,
    data: {
      message: 'Property added to favorites',
      propertyId,
    },
  };
}

async removeFromFavorites(userId: string, propertyId: string): Promise<RemoveFavoriteResponseDto> {
  const favorite = await this.favoriteRepository.findOne({
    where: { userId, propertyId },
  });

  // Ідемпотентність - якщо немає, просто повертаємо success
  if (!favorite) {
    return {
      success: true,
      data: {
        message: 'Property was not in favorites',
        propertyId,
      },
    };
  }

  await this.favoriteRepository.remove(favorite);

  return {
    success: true,
    data: {
      message: 'Property removed from favorites',
      propertyId,
    },
  };
}

async getFavoriteIds(userId: string): Promise<{ success: boolean; data: { favoriteIds: string[] } }> {
  const favorites = await this.favoriteRepository.find({
    where: { userId },
    select: ['propertyId'],
  });

  const favoriteIds = favorites.map((fav) => fav.propertyId);

  return {
    success: true,
    data: { favoriteIds },
  };
}

async checkFavoriteStatus(userId: string, propertyId: string): Promise<FavoriteStatusResponseDto> {
  const isFavorite = await this.isFavorite(userId, propertyId);
  
  return {
    success: true,
    data: {
      isFavorite,
      propertyId,
    },
  };
}
```

#### Оновлений FavoritesController:

```typescript
@Get()
@ApiOperation({ summary: 'Отримати улюблені об\'єкти користувача' })
@ApiResponse({ status: 200, description: 'Список улюблених об\'єктів', type: FavoritesListResponseDto })
async getUserFavorites(@CurrentUser() user: any): Promise<FavoritesListResponseDto> {
  return this.favoritesService.getUserFavorites(user.id);
}

@Get('ids')
@ApiOperation({ summary: 'Отримати тільки ID улюблених об\'єктів (для швидкої синхронізації)' })
@ApiResponse({ status: 200, description: 'Масив ID улюблених об\'єктів' })
async getFavoriteIds(@CurrentUser() user: any) {
  return this.favoritesService.getFavoriteIds(user.id);
}

@Get(':propertyId/status')
@ApiOperation({ summary: 'Перевірити, чи property є в улюблених' })
@ApiResponse({ status: 200, type: FavoriteStatusResponseDto })
async checkFavoriteStatus(
  @CurrentUser() user: any,
  @Param('propertyId') propertyId: string,
): Promise<FavoriteStatusResponseDto> {
  return this.favoritesService.checkFavoriteStatus(user.id, propertyId);
}

@Post(':propertyId')
@ApiOperation({ summary: 'Додати об\'єкт в улюблені' })
@ApiResponse({ status: 201, description: 'Об\'єкт додано в улюблені', type: AddFavoriteResponseDto })
@ApiResponse({ status: 404, description: 'Property not found' })
@HttpCode(201)
async addToFavorites(
  @CurrentUser() user: any,
  @Param('propertyId') propertyId: string,
): Promise<AddFavoriteResponseDto> {
  return this.favoritesService.addToFavorites(user.id, propertyId);
}

@Delete(':propertyId')
@ApiOperation({ summary: 'Видалити об\'єкт з улюблених' })
@ApiResponse({ status: 200, description: 'Об\'єкт видалено з улюблених', type: RemoveFavoriteResponseDto })
async removeFromFavorites(
  @CurrentUser() user: any,
  @Param('propertyId') propertyId: string,
): Promise<RemoveFavoriteResponseDto> {
  return this.favoritesService.removeFromFavorites(user.id, propertyId);
}
```

### 6. Перевірка структури Property entity

Переконатися, що Property entity має всі необхідні поля та relations для мобільного додатку:
- city (з nameEn, nameRu, nameAr)
- country (якщо є)
- area (якщо є)
- images/photos
- developer
- amenities
- paymentPlans
- тощо

### 7. Тестування

Після реалізації перевірити:

1. ✅ `GET /favorites` повертає `{ success: true, data: Property[] }`
2. ✅ `POST /favorites/:propertyId` повертає `{ success: true, data: { message, propertyId } }` зі статусом 201
3. ✅ `DELETE /favorites/:propertyId` повертає `{ success: true, data: { message, propertyId } }`
4. ✅ `GET /favorites/ids` повертає `{ success: true, data: { favoriteIds: string[] } }`
5. ✅ `GET /favorites/:propertyId/status` повертає `{ success: true, data: { isFavorite: boolean, propertyId } }`
6. ✅ Ідемпотентність: додавання вже існуючого favorite не кидає помилку
7. ✅ Ідемпотентність: видалення неіснуючого favorite не кидає помилку
8. ✅ Всі необхідні relations завантажуються в getUserFavorites

## Резюме змін

### Нові файли:
- `backend/src/properties/dto/favorites-response.dto.ts` - DTO для відповідей

### Змінені файли:
- `backend/src/properties/favorites.service.ts` - оновити формат відповідей
- `backend/src/properties/favorites.controller.ts` - додати нові endpoints та оновити типи

### Нові endpoints:
- `GET /favorites/ids` - отримати тільки ID
- `GET /favorites/:propertyId/status` - перевірка статусу

### Покращення:
- Уніфікований формат відповідей `{ success: true, data: ... }`
- Ідемпотентність операцій
- Додаткові relations для Property
- Документація через Swagger DTO



