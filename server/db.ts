import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import 'dotenv/config';

neonConfig.webSocketConstructor = ws;

// Переменная для отслеживания, удалось ли подключение к БД
let dbConnectionFailed = false;

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️ DATABASE_URL не установлен. Используйте правильную строку подключения к PostgreSQL.",
  );
  dbConnectionFailed = true;
}

// Создаем экземпляр пула для подключения к БД
let pool: Pool;

try {
  // Инициализируем подключение к базе данных
  if (!dbConnectionFailed && process.env.DATABASE_URL) {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      // Добавляем таймаут для быстрого обнаружения проблем подключения 
      connectionTimeoutMillis: 5000
    });
    
    // Пробуем сделать тестовый запрос для проверки подключения
    pool.query('SELECT NOW()').then(() => {
      console.log('✅ Успешное подключение к базе данных PostgreSQL');
    }).catch((err) => {
      console.error('❌ Ошибка при тестировании подключения к БД:', err);
      dbConnectionFailed = true;
    });
  } else {
    // Создаем фиктивный пул для предотвращения ошибок в коде
    // В реальной разработке обычно не следует так делать, но для локальной разработки это допустимо
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Создаем фиктивное подключение к БД для локальной разработки');
      pool = {} as Pool;
    } else {
      throw new Error("Не удалось инициализировать подключение к базе данных");
    }
  }
} catch (error) {
  console.error('❌ Критическая ошибка подключения к базе данных:', error);
  dbConnectionFailed = true;
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Создаем фиктивное подключение к БД для локальной разработки');
    pool = {} as Pool;
  } else {
    throw error;
  }
}

export const db = drizzle({ client: pool, schema });
export { dbConnectionFailed };