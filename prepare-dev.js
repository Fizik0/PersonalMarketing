#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

// Получаем директорию текущего файла
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Функция для логирования с цветом
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Проверка наличия .env файла
function checkEnvFile() {
  log('Проверка .env файла...', colors.cyan);
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    log('Файл .env не найден. Копирование из .env.example...', colors.yellow);
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('Файл .env создан. Пожалуйста, отредактируйте его для вашей среды.', colors.green);
    } else {
      log('Файл .env.example не найден!', colors.red);
      process.exit(1);
    }
  } else {
    log('Файл .env уже существует.', colors.green);
  }
}

// Создание директории uploads, если она не существует
function createUploadDir() {
  log('Проверка директории uploads...', colors.cyan);
  const uploadsPath = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsPath)) {
    log('Создание директории uploads...', colors.yellow);
    fs.mkdirSync(uploadsPath);
    log('Директория uploads создана.', colors.green);
  } else {
    log('Директория uploads уже существует.', colors.green);
  }
}

// Проверка установки зависимостей
function checkDependencies() {
  log('Проверка установленных зависимостей...', colors.cyan);
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    log('Зависимости не установлены. Установка зависимостей...', colors.yellow);
    try {
      execSync('npm install', { stdio: 'inherit' });
      log('Зависимости успешно установлены.', colors.green);
    } catch (error) {
      log(`Ошибка при установке зависимостей: ${error.message}`, colors.red);
      process.exit(1);
    }
  } else {
    log('Зависимости установлены.', colors.green);
  }
}

// Главная функция
async function main() {
  log('======================================', colors.cyan);
  log('  Подготовка среды разработки', colors.cyan);
  log('======================================', colors.cyan);
  
  // Проверки и подготовка
  checkDependencies();
  checkEnvFile();
  createUploadDir();
  
  const { setupDatabase } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'setupDatabase',
      message: 'Хотите настроить базу данных? (Применить миграции и заполнить тестовыми данными)',
      default: true,
    },
  ]);
  
  if (setupDatabase) {
    log('Применение миграций базы данных...', colors.cyan);
    try {
      execSync('npm run db:push', { stdio: 'inherit' });
      log('Миграции успешно применены.', colors.green);
      
      log('Заполнение базы данных тестовыми данными...', colors.cyan);
      execSync('npm run db:seed', { stdio: 'inherit' });
      log('База данных заполнена тестовыми данными.', colors.green);
    } catch (error) {
      log(`Ошибка при настройке базы данных: ${error.message}`, colors.red);
      log('Убедитесь, что PostgreSQL запущен и настройки в .env файле корректны.', colors.yellow);
    }
  }
  
  log('======================================', colors.green);
  log('  Среда разработки подготовлена!', colors.green);
  log('======================================', colors.green);
  log('Для запуска проекта выполните:', colors.yellow);
  log('  npm run dev', colors.cyan);
  log('======================================', colors.green);
}

main().catch(error => {
  log(`Критическая ошибка: ${error.message}`, colors.red);
  process.exit(1);
}); 