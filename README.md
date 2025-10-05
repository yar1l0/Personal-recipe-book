# Книга Рецептів

Повнофункціональний додаток для управління персональною книгою рецептів з планувальником меню та автоматичною генерацією списку покупок.

## Структура проєкту

```
recipe-book/
├── backend/          # NestJS + Prisma + PostgreSQL
└── frontend/         # Next.js 14 + TypeScript + NextUI
```

## Технологічний стек

### Backend
- **NestJS** 10 - Node.js фреймворк
- **Prisma** 5 - ORM
- **PostgreSQL** 16 - База даних
- **JWT** - Аутентифікація
- **Multer** - Завантаження файлів
- **Docker** - Контейнеризація БД

### Frontend
- **Next.js** 14 (App Router)
- **TypeScript**
- **HeroUI** - UI бібліотека
- **Tailwind CSS** - Стилізація
- **Zustand** - State management
- **Axios** - HTTP клієнт

## Функціональність

### ✅ Аутентифікація
- Реєстрація та вхід
- JWT токени
- Захищені маршрути

### ✅ Управління рецептами
- Створення, редагування, видалення рецептів
- Завантаження фотографій
- Фільтрація за категорією, складністю, часом приготування
- Пагінація списку рецептів

### 📅 Планувальник меню
- Календар на тиждень
- Призначення рецептів на сніданок/обід/вечерю
- Перегляд плану харчування

### 🛒 Список покупок
- Автоматична генерація з планувальника
- Групування однакових інгредієнтів
- Відмітка куплених товарів

### 👤 Профіль користувача
- Редагування даних
- Зміна пароля

### Вимоги
- Node.js 18+
- Docker & Docker Compose
- npm або yarn

### 1. Клонування репозиторію

```bash
git clone <repository-url>
```

### 2. Запуск Backend

```bash
cd backend

# Встановити залежності
npm install

# Створити .env файл
DATABASE_URL="postgresql://testuser:testpass@localhost:5434/backend?schema=public"
JWT_SECRET=c7b9d4a8f2e1a6d3e9f47c1b82a4d7f0c1e9b3d4a7f2e6c9b5d8f3a2c7e1d9f4
JWT_EXPIRES_IN=7d
PORT=3001" > .env

# Запустити PostgreSQL
docker-compose up -d

# Застосувати міграції
npx prisma migrate dev --name init

# Запустити сервер
npm run start:dev
```

Backend буде доступний на `http://localhost:3001`

### 3. Запуск Frontend

```bash
cd frontend

# Встановити залежності
npm install

# Створити .env.local файл
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Запустити dev сервер
npm run dev
```

Frontend буде доступний на `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Реєстрація
- `POST /auth/login` - Вхід

### Users
- `GET /users/me` - Профіль
- `PUT /users/me` - Оновити профіль

### Recipes
- `GET /recipes` - Список рецептів (з фільтрами)
- `GET /recipes/:id` - Рецепт за ID
- `POST /recipes` - Створити рецепт
- `PUT /recipes/:id` - Оновити рецепт
- `DELETE /recipes/:id` - Видалити рецепт

### Meal Plan
- `GET /meal-plan?startDate=...&endDate=...` - Плани
- `POST /meal-plan` - Додати в план
- `DELETE /meal-plan/:id` - Видалити з плану

### Shopping List
- `GET /shopping-list` - Список покупок
- `POST /shopping-list/generate` - Згенерувати
- `PATCH /shopping-list/items/:id/toggle` - Відмітити товар

## Моделі даних

### User
```typescript
{
  id: string
  email: string
  password: string (хешований)
  name?: string
}
```

### Recipe
```typescript
{
  id: string
  userId: string
  title: string
  category: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'DESSERT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  cookingTime: number
  servings: number
  photo?: string
  ingredients: Array<{name, amount, unit}>
  instructions: string[]
}
```

### MealPlan
```typescript
{
  id: string
  userId: string
  recipeId: string
  date: Date
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER'
}
```

### ShoppingList
```typescript
{
  id: string
  userId: string
  items: Array<{
    ingredient: string
    amount: number
    unit: string
    checked: boolean
  }>
}
```

## Змінні середовища

### Backend (.env)
```env
DATABASE_URL="postgresql://testuser:testpass@localhost:5434/backend?schema=public"
JWT_SECRET=c7b9d4a8f2e1a6d3e9f47c1b82a4d7f0c1e9b3d4a7f2e6c9b5d8f3a2c7e1d9f4
JWT_EXPIRES_IN=7d
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Скрипти

### Backend
```bash
npm run start:dev      # Development
npm run build          # Production build
npm run start:prod     # Production режим
npx prisma studio      # GUI бази даних
```

### Frontend
```bash
npm run dev            # Development
npm run build          # Production build
npm run start          # Production режим
npm run lint           # Перевірка коду
```

## Структура файлів

### Backend
```
src/
├── auth/              # JWT аутентифікація
├── users/             # Користувачі
├── recipes/           # Рецепти + file upload
├── meal-plan/         # Планувальник меню
├── shopping-list/     # Список покупок
├── prisma/            # Prisma service
└── main.ts
```

### Frontend
```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── recipes/
├── meal-plan/
├── shopping-list/
├── profile/
└── layout.tsx

components/
├── Header.tsx
├── RecipeCard.tsx
└── ...

lib/
├── api.ts             # Axios client
└── utils.ts

store/
└── authStore.ts       # Zustand auth state

types/
└── index.ts           # TypeScript типи
```


