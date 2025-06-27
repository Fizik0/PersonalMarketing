import type { Express } from "express";
import * as localAuth from "./localAuth";
import * as replitAuth from "./replitAuth";
import 'dotenv/config';

// Экспортируем интерфейс auth, который будет содержать методы выбранной аутентификации
export async function setupAuth(app: Express) {
  // Выбираем метод аутентификации на основе переменной окружения
  const authMode = process.env.AUTH_MODE || (process.env.NODE_ENV === 'development' ? 'local' : 'replit');
  
  try {
    if (authMode === 'local') {
      console.log('🔑 Используется локальная аутентификация');
      await localAuth.setupAuth(app);
      return;
    } else if (authMode === 'replit') {
      console.log('🔑 Используется аутентификация Replit');
      if (!process.env.REPLIT_DOMAINS) {
        console.warn('⚠️ Переменная окружения REPLIT_DOMAINS не установлена. Переключение на локальную аутентификацию.');
        await localAuth.setupAuth(app);
      } else {
        await replitAuth.setupAuth(app);
      }
      return;
    }
    // Если authMode не распознан, используем локальную аутентификацию
    console.warn(`⚠️ Неизвестный режим аутентификации: ${authMode}. Переключение на локальную аутентификацию.`);
    await localAuth.setupAuth(app);
  } catch (error) {
    console.error('❌ Ошибка настройки аутентификации:', error);
    console.log('⚠️ Переключение на локальную аутентификацию после ошибки.');
    await localAuth.setupAuth(app);
  }
}

// Экспортируем middleware для проверки аутентификации
export const isAuthenticated = process.env.AUTH_MODE === 'replit' 
  && process.env.REPLIT_DOMAINS
  ? replitAuth.isAuthenticated 
  : localAuth.isAuthenticated; 