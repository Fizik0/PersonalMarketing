import type { Express, Request, Response } from "express";
import { mockCategories, mockTags, mockPosts, mockPages, mockPostTags } from "./mockData";

/**
 * Регистрирует маршруты для доступа к моковым данным в режиме разработки
 */
export function registerMockRoutes(app: Express) {
  console.log('🧪 Регистрация маршрутов для моковых данных');

  // Маршруты для категорий
  app.get('/api/mock-categories', (req: Request, res: Response) => {
    res.json(mockCategories);
  });

  // Маршруты для тегов
  app.get('/api/mock-tags', (req: Request, res: Response) => {
    res.json(mockTags);
  });

  // Маршруты для постов
  app.get('/api/mock-posts', (req: Request, res: Response) => {
    // Добавляем информацию о категориях к постам
    const postsWithCategories = mockPosts.map(post => {
      const category = mockCategories.find(c => c.id === post.categoryId);
      return {
        ...post,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : undefined
      };
    });
    
    res.json(postsWithCategories);
  });

  // Получение опубликованных постов с пагинацией
  app.get('/api/mock-posts/published', (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Фильтрация по опубликованным
    let filteredPosts = mockPosts.filter(post => post.isPublished);
    
    // Фильтрация по категории если указан slug
    if (req.query.category) {
      const categoryId = mockCategories.find(c => c.slug === req.query.category)?.id;
      if (categoryId) {
        filteredPosts = filteredPosts.filter(post => post.categoryId === categoryId);
      }
    }
    
    // Фильтрация по тегу если указан slug
    if (req.query.tag) {
      const tagId = mockTags.find(t => t.slug === req.query.tag)?.id;
      if (tagId) {
        const postIdsWithTag = mockPostTags
          .filter(pt => pt.tagId === tagId)
          .map(pt => pt.postId);
        filteredPosts = filteredPosts.filter(post => postIdsWithTag.includes(post.id));
      }
    }
    
    // Сортировка по дате публикации
    filteredPosts = filteredPosts.sort((a, b) => 
      (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
    );
    
    // Пагинация
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);
    
    // Добавляем информацию о категориях
    const postsWithCategories = paginatedPosts.map(post => {
      const category = mockCategories.find(c => c.id === post.categoryId);
      return {
        ...post,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : undefined
      };
    });
    
    res.json({
      posts: postsWithCategories,
      total: filteredPosts.length
    });
  });

  // Получение поста по slug
  app.get('/api/mock-posts/slug/:slug', (req: Request, res: Response) => {
    const post = mockPosts.find(p => p.slug === req.params.slug);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const category = mockCategories.find(c => c.id === post.categoryId);
    
    res.json({
      ...post,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug
      } : undefined
    });
  });

  // Маршруты для страниц
  app.get('/api/mock-pages', (req: Request, res: Response) => {
    res.json(mockPages);
  });

  // Получение опубликованных страниц
  app.get('/api/mock-pages/published', (req: Request, res: Response) => {
    const publishedPages = mockPages.filter(page => page.isPublished);
    res.json(publishedPages);
  });

  // Получение страницы по slug
  app.get('/api/mock-pages/slug/:slug', (req: Request, res: Response) => {
    const page = mockPages.find(p => p.slug === req.params.slug);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    res.json(page);
  });
} 