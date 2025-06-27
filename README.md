# Персональный сайт-портфолио

Многофункциональный сайт-портфолио с CMS для маркетинга консалтинговых услуг.

## Технологии

- **Frontend**: React, TailwindCSS, ShadcnUI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Drizzle ORM
- **Authentication**: Passport.js
- **File Storage**: Local storage with Multer

## Требования

- Node.js 18+ (рекомендуется LTS)
- PostgreSQL 15+
- npm или yarn

## Установка и настройка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd portfolio-website
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне проекта и настройте переменные окружения:
```
DATABASE_URL=postgres://username:password@localhost:5432/portfolio_db
SESSION_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

4. Создайте базу данных PostgreSQL:
```bash
createdb portfolio_db
```

5. Примените миграции базы данных:
```bash
npm run db:push
```

## Запуск проекта

### Режим разработки

```bash
npm run dev
```

Сервер будет доступен по адресу [http://localhost:5000](http://localhost:5000).

### Сборка для продакшена

```bash
npm run build
```

### Запуск в режиме продакшена

```bash
npm run start
```

## Структура проекта

- `client/` - клиентская часть (React)
  - `src/` - исходный код
    - `components/` - компоненты
    - `pages/` - страницы
    - `hooks/` - хуки
    - `lib/` - утилиты и библиотеки
- `server/` - серверная часть (Express)
  - `index.ts` - точка входа
  - `routes.ts` - API-маршруты
  - `db.ts` - конфигурация базы данных
  - `storage.ts` - функции для работы с данными
- `shared/` - общий код
  - `schema.ts` - схема базы данных
- `uploads/` - загруженные файлы

## Функциональность

- Управление страницами сайта через CMS
- Блог с поддержкой категорий и тегов
- Медиа-библиотека для управления файлами
- Формы обратной связи и запросов на консультацию
- Аналитика посещений
- Адаптивный дизайн

## Локальная разработка

При локальной разработке используется hot-reload для клиентской и серверной части. 