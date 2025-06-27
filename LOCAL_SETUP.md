# Настройка локальной разработки

Этот документ содержит пошаговые инструкции для настройки локальной среды разработки вашего сайта-портфолио.

## Требования

- Node.js 18+ (рекомендуется LTS-версия)
- PostgreSQL 15+
- npm или yarn

## Шаги настройки

### 1. Настройка базы данных

1. Установите PostgreSQL, если еще не установлен:
   - [Загрузить PostgreSQL](https://www.postgresql.org/download/)

2. Создайте базу данных:
   ```bash
   psql -U postgres
   CREATE DATABASE portfolio_db;
   \q
   ```

3. Создайте пользователя базы данных (опционально):
   ```bash
   psql -U postgres
   CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
   \q
   ```

### 2. Настройка проекта

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Настройте переменные окружения:
   ```bash
   # Скопируйте файл-образец .env
   cp .env.example .env
   
   # Отредактируйте .env, указав правильные данные подключения к базе данных
   # Пример: DATABASE_URL=postgres://portfolio_user:your_password@localhost:5432/portfolio_db
   ```

3. Примените миграции базы данных:
   ```bash
   npm run db:push
   ```

4. Заполните базу данных начальными данными:
   ```bash
   npm run db:seed
   ```

### 3. Запуск проекта

1. Запустите проект в режиме разработки:
   ```bash
   npm run dev
   ```

2. Откройте браузер и перейдите по адресу: [http://localhost:5000](http://localhost:5000)

## Тестовый пользователь

Скрипт инициализации базы данных создает тестового пользователя с правами администратора:

- **Email**: admin@example.com
- **Имя**: Администратор
- **Роль**: admin

## Доступ к админке

После входа в систему с учетной записью администратора, вы получите доступ к админ-панели по адресу:
[http://localhost:5000/admin](http://localhost:5000/admin)

## Структура проекта

```
├── client/             # Frontend (React)
│   ├── src/            # Исходный код клиента
│   └── index.html      # Шаблон HTML
├── server/             # Backend (Express)
│   ├── index.ts        # Точка входа сервера
│   ├── routes.ts       # API маршруты
│   └── db.ts           # Конфигурация базы данных
├── shared/             # Общий код
│   └── schema.ts       # Схема базы данных
├── uploads/            # Загруженные файлы
├── .env                # Переменные окружения
└── package.json        # Зависимости и скрипты
```

## Часто встречающиеся проблемы

### 1. Ошибка подключения к базе данных

Убедитесь, что:
- PostgreSQL запущен
- Учетные данные в .env корректны
- Порт для подключения к PostgreSQL верен (обычно 5432)

### 2. Проблемы с npm-пакетами

Если возникают ошибки с зависимостями, попробуйте:
```bash
npm cache clean --force
npm install
```

### 3. Проблемы с загрузкой файлов

Убедитесь, что директория `uploads` существует и права доступа настроены корректно:
```bash
mkdir -p uploads
chmod 755 uploads
``` 