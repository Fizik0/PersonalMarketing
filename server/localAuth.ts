import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import MemoryStore from 'memorystore';
import { storage } from "./storage";
import 'dotenv/config';

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Для локальной разработки используем MemoryStore если нет доступа к PostgreSQL
  if (process.env.NODE_ENV === 'development' && process.env.USE_MEMORY_SESSION === 'true') {
    console.log('📝 Используется хранилище сессий в памяти (MemoryStore)');
    const MemorySessionStore = MemoryStore(session);
    return session({
      secret: process.env.SESSION_SECRET || 'local-development-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: sessionTtl,
      },
      store: new MemorySessionStore({
        checkPeriod: 86400000 // очистка каждые 24 часа
      })
    });
  }
  
  // Стандартное хранилище в PostgreSQL
  try {
    console.log('📝 Инициализация хранилища сессий в PostgreSQL');
    const pgStore = connectPg(session);
    
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true, // Создаем таблицу, если её нет
      ttl: sessionTtl,
      tableName: "sessions",
    });
    
    // Добавляем обработчик ошибок для сессий
    sessionStore.on('error', (error: Error) => {
      console.error('❌ Ошибка хранилища сессий PostgreSQL:', error);
    });
    
    return session({
      secret: process.env.SESSION_SECRET || 'local-development-secret',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
      },
    });
  } catch (error) {
    console.error('❌ Ошибка при инициализации хранилища сессий:', error);
    console.warn('⚠️ Переключение на хранилище сессий в памяти');
    
    // Используем MemoryStore как запасной вариант
    const MemorySessionStore = MemoryStore(session);
    return session({
      secret: process.env.SESSION_SECRET || 'local-development-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
      },
      store: new MemorySessionStore({
        checkPeriod: 86400000 // очистка каждые 24 часа
      })
    });
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Используем LocalStrategy для локальной аутентификации
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // В режиме разработки принимаем любые креды для админа
        if (process.env.NODE_ENV === 'development' && email === 'admin@example.com') {
          // Получаем или создаем пользователя admin
          const adminUser = await storage.getUser('admin-user-id');
          if (adminUser) {
            return done(null, adminUser);
          }
          
          // Создаем тестового админа
          const newAdmin = await storage.upsertUser({
            id: 'admin-user-id',
            email: 'admin@example.com',
            firstName: 'Администратор',
            lastName: 'Системы',
            role: 'admin'
          });
          
          return done(null, newAdmin);
        }
        
        // В продакшене вы бы проверяли пароль, но для демо мы используем упрощенную логику
        return done(null, false, { message: 'Неверные учетные данные' });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: Express.User, cb) => cb(null, (user as any).id));
  passport.deserializeUser(async (id: string, cb) => {
    try {
      const user = await storage.getUser(id);
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  });

  // Маршруты аутентификации
  app.post("/api/login", (req, res, next) => {
    console.log('🔐 Попытка входа:', req.body.email);
    
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("❌ Ошибка входа:", err);
        return res.status(500).json({ message: "Внутренняя ошибка сервера при входе" });
      }
      
      if (!user) {
        console.warn("⚠️ Неудачная попытка входа:", info?.message);
        return res.status(401).json({ message: info?.message || 'Неверные учетные данные' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error("❌ Ошибка при установке сессии:", err);
          return res.status(500).json({ message: "Ошибка при установке сессии" });
        }
        console.log('✅ Успешный вход пользователя:', user.email);
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Отдельный маршрут для получения формы логина в режиме разработки
  app.get("/api/login", (req, res) => {
    if (req.isAuthenticated()) {
      console.log('👋 Перенаправление аутентифицированного пользователя');
      return res.redirect('/');
    }
    
    // В режиме разработки показываем простую форму входа
    if (process.env.NODE_ENV === 'development') {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Вход в систему</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input[type="email"], input[type="password"] { width: 100%; padding: 8px; box-sizing: border-box; }
            button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
            .message { margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Вход в систему</h1>
          <div class="message">
            <p><strong>Тестовый пользователь:</strong></p>
            <p>Email: admin@example.com</p>
            <p>Пароль: любой (в режиме разработки)</p>
          </div>
          <form id="loginForm" method="POST" action="/api/login">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Пароль:</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Войти</button>
          </form>
          <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
              
              try {
                const response = await fetch('/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                  window.location.href = '/';
                } else {
                  const data = await response.json();
                  alert(data.message || 'Ошибка входа');
                }
              } catch (err) {
                console.error('Ошибка:', err);
                alert('Произошла ошибка при входе');
              }
            });
          </script>
        </body>
        </html>
      `);
    } else {
      res.status(401).json({ message: 'Не авторизован' });
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  return next();
}; 