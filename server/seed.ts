import 'dotenv/config';
import { db } from './db';
import {
  users,
  pages,
  categories,
  tags,
  posts,
  postTags
} from '@shared/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Начало заполнения базы данных...');

  // Очистка таблиц
  console.log('Очистка существующих данных...');
  await db.delete(postTags);
  await db.delete(posts);
  await db.delete(tags);
  await db.delete(categories);
  await db.delete(pages);

  // Создание тестового администратора
  console.log('Создание администратора...');
  const adminUser = {
    id: 'admin-user-id',
    email: 'admin@example.com',
    firstName: 'Администратор',
    lastName: 'Системы',
    role: 'admin'
  };

  // Проверка существования пользователя
  const existingUser = await db.select().from(users).where(eq(users.id, adminUser.id));
  if (existingUser.length === 0) {
    await db.insert(users).values(adminUser);
  }

  // Создание категорий
  console.log('Создание категорий...');
  const categoriesData = [
    { name: 'Unit-экономика', slug: 'unit-economics', description: 'Статьи о unit-экономике' },
    { name: 'Маркетплейсы', slug: 'marketplaces', description: 'Работа с маркетплейсами' },
    { name: 'Аналитика', slug: 'analytics', description: 'Аналитика бизнес-процессов' },
  ];

  const createdCategories = await db.insert(categories).values(categoriesData).returning();
  
  // Создание тегов
  console.log('Создание тегов...');
  const tagsData = [
    { name: 'OZON', slug: 'ozon' },
    { name: 'Wildberries', slug: 'wildberries' },
    { name: 'KPI', slug: 'kpi' },
    { name: 'Аудит', slug: 'audit' },
    { name: 'Автоматизация', slug: 'automation' },
  ];
  
  const createdTags = await db.insert(tags).values(tagsData).returning();

  // Создание страниц
  console.log('Создание страниц...');
  const pagesData = [
    {
      title: 'Главная страница',
      slug: 'home',
      content: JSON.stringify({
        sections: [
          { type: 'hero', data: { title: 'Превращаю данные в прибыль' } },
          { type: 'expertise', data: { title: 'Экспертиза' } },
          { type: 'services', data: { title: 'Услуги' } },
        ]
      }),
      template: 'landing',
      metaTitle: 'Главная - Консалтинг unit-экономики',
      metaDescription: 'Экспертиза в области unit-экономики, аудит маркетплейсов, оптимизация бизнес-процессов',
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
    },
    {
      title: 'Услуги',
      slug: 'services',
      content: JSON.stringify({
        sections: [
          { type: 'header', data: { title: 'Мои услуги' } },
          { type: 'services-list', data: { services: [
            { title: 'Аудит Unit-экономики', slug: 'unit-economics' },
            { title: 'Аудит OZON', slug: 'ozon-audit' },
            { title: 'Оптимизация бизнес-процессов', slug: 'business-optimization' },
          ]} },
        ]
      }),
      template: 'service',
      metaTitle: 'Услуги - Консалтинг unit-экономики',
      metaDescription: 'Профессиональные услуги по аудиту и оптимизации бизнеса',
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
    },
  ];

  await db.insert(pages).values(pagesData);

  // Создание постов
  console.log('Создание блог-постов...');
  const postsData = [
    {
      title: 'Как улучшить unit-экономику маркетплейса на 30%',
      slug: 'improve-unit-economics-marketplace',
      excerpt: 'Практические советы для повышения прибыльности вашего бизнеса на маркетплейсах',
      content: `# Как улучшить unit-экономику маркетплейса на 30%
      
В этой статье я расскажу о проверенных методах улучшения вашей unit-экономики...`,
      categoryId: createdCategories[0].id,
      readingTime: 5,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
    },
    {
      title: 'Ключевые метрики для мониторинга эффективности на OZON',
      slug: 'key-metrics-ozon-monitoring',
      excerpt: 'Обзор ключевых показателей, которые необходимо отслеживать для успешной работы на OZON',
      content: `# Ключевые метрики для мониторинга эффективности на OZON
      
Для успешной работы на OZON необходимо регулярно отслеживать следующие метрики...`,
      categoryId: createdCategories[1].id,
      readingTime: 7,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
    },
  ];

  const createdPosts = await db.insert(posts).values(postsData).returning();
  
  // Связывание постов и тегов
  console.log('Связывание постов с тегами...');
  const postTagsData = [
    { postId: createdPosts[0].id, tagId: createdTags[2].id }, // Первый пост с тегом KPI
    { postId: createdPosts[0].id, tagId: createdTags[4].id }, // Первый пост с тегом Автоматизация
    { postId: createdPosts[1].id, tagId: createdTags[0].id }, // Второй пост с тегом OZON
    { postId: createdPosts[1].id, tagId: createdTags[3].id }, // Второй пост с тегом Аудит
  ];
  
  await db.insert(postTags).values(postTagsData);

  console.log('✅ База данных успешно заполнена!');
}

// Запуск скрипта
seed()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.pool.end();
    process.exit(0);
  }); 