import {
  users,
  pages,
  posts,
  categories,
  tags,
  postTags,
  media,
  forms,
  formSubmissions,
  consultations,
  analytics,
  type User,
  type UpsertUser,
  type Page,
  type InsertPage,
  type Post,
  type InsertPost,
  type Category,
  type InsertCategory,
  type Tag,
  type InsertTag,
  type Media,
  type InsertMedia,
  type Form,
  type InsertForm,
  type FormSubmission,
  type InsertFormSubmission,
  type Consultation,
  type InsertConsultation,
} from "@shared/schema";
import { db, dbConnectionFailed } from "./db";
import { eq, desc, and, like, sql, inArray } from "drizzle-orm";
import { mockUsers, mockPages, mockPosts, mockCategories, mockTags, mockPostTags } from "./mockData";

// Создаем тестового пользователя для режима разработки
const mockAdminUser: User = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  firstName: 'Администратор',
  lastName: 'Системы',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  profileImageUrl: null,
};

// Класс для использования в режиме разработки без базы данных
export class MockStorage implements IStorage {
  // Храним все моковые данные в памяти
  private users: User[] = [...mockUsers];
  private pages: Page[] = [...mockPages];  
  private posts: Post[] = [...mockPosts];
  private categories: Category[] = [...mockCategories];
  private tags: Tag[] = [...mockTags];
  private postTags = [...mockPostTags];
  private mediaItems: Media[] = [];
  private formItems: Form[] = [];
  private formSubmissions: FormSubmission[] = [];

  async getUser(id: string): Promise<User | undefined> {
    console.log('🔍 Запрос мок-пользователя:', id);
    return this.users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    console.log('🔄 Обновление мок-пользователя:', userData);
    const existingIndex = this.users.findIndex(user => user.id === userData.id);
    
    if (existingIndex >= 0) {
      // Обновляем существующего пользователя
      const updatedUser = {
        ...this.users[existingIndex],
        ...userData,
        updatedAt: new Date()
      };
      this.users[existingIndex] = updatedUser;
      return updatedUser;
    } else {
      // Создаем нового пользователя
      const newUser: User = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileImageUrl: userData.profileImageUrl || null
      } as User;
      
      this.users.push(newUser);
      return newUser;
    }
  }

  // Мок реализации страниц
  async getAllPages(): Promise<Page[]> { 
    console.log('📄 Получение всех страниц');
    return this.pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  async getPublishedPages(): Promise<Page[]> { 
    console.log('📄 Получение опубликованных страниц');
    return this.pages
      .filter(page => page.isPublished)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }
  
  async getPageBySlug(slug: string): Promise<Page | undefined> {
    console.log(`📄 Поиск страницы по slug: ${slug}`);
    return this.pages.find(page => page.slug === slug);
  }
  
  async createPage(page: InsertPage): Promise<Page> { 
    console.log('📄 Создание новой страницы');
    const newPage: Page = {
      id: `page-${Date.now()}`,
      ...page,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Page;
    
    this.pages.push(newPage);
    return newPage;
  }
  
  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page> { 
    console.log(`📄 Обновление страницы: ${id}`);
    const index = this.pages.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Page with id ${id} not found`);
    }
    
    const updatedPage = {
      ...this.pages[index],
      ...page,
      updatedAt: new Date()
    };
    
    this.pages[index] = updatedPage;
    return updatedPage;
  }
  
  async deletePage(id: string): Promise<void> {
    console.log(`📄 Удаление страницы: ${id}`);
    const index = this.pages.findIndex(p => p.id === id);
    
    if (index !== -1) {
      this.pages.splice(index, 1);
    }
  }

  // Мок реализации постов
  async getAllPosts(): Promise<Post[]> { 
    console.log('📝 Получение всех постов');
    return this.posts.map(post => {
      const category = this.categories.find(c => c.id === post.categoryId);
      return {
        ...post,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : undefined
      };
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  async getPublishedPosts(options: {
    page: number;
    limit: number;
    categorySlug?: string;
    tagSlug?: string;
  }): Promise<{ posts: Post[]; total: number }> { 
    console.log('📝 Получение опубликованных постов', options);
    const { page, limit, categorySlug, tagSlug } = options;
    const offset = (page - 1) * limit;
    
    // Фильтрация по published
    let filteredPosts = this.posts.filter(post => post.isPublished);
    
    // Фильтрация по категории
    if (categorySlug) {
      const categoryId = this.categories.find(c => c.slug === categorySlug)?.id;
      if (categoryId) {
        filteredPosts = filteredPosts.filter(post => post.categoryId === categoryId);
      }
    }
    
    // Фильтрация по тегу
    if (tagSlug) {
      const tagId = this.tags.find(t => t.slug === tagSlug)?.id;
      if (tagId) {
        const postIdsWithTag = this.postTags
          .filter(pt => pt.tagId === tagId)
          .map(pt => pt.postId);
        filteredPosts = filteredPosts.filter(post => postIdsWithTag.includes(post.id));
      }
    }
    
    // Сортировка
    filteredPosts = filteredPosts.sort((a, b) => 
      (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
    );
    
    // Пагинация
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);
    
    // Добавляем категории к постам
    const postsWithCategories = paginatedPosts.map(post => {
      const category = this.categories.find(c => c.id === post.categoryId);
      return {
        ...post,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : undefined
      };
    });
    
    return {
      posts: postsWithCategories,
      total: filteredPosts.length
    };
  }
  
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    console.log(`📝 Поиск поста по slug: ${slug}`);
    const post = this.posts.find(p => p.slug === slug);
    
    if (!post) return undefined;
    
    const category = this.categories.find(c => c.id === post.categoryId);
    return {
      ...post,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug
      } : undefined
    };
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    console.log('📝 Создание нового поста');
    const newPost: Post = {
      id: `post-${Date.now()}`,
      ...post,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Post;
    
    this.posts.push(newPost);
    return newPost;
  }
  
  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post> {
    console.log(`📝 Обновление поста: ${id}`);
    const index = this.posts.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Post with id ${id} not found`);
    }
    
    const updatedPost = {
      ...this.posts[index],
      ...post,
      updatedAt: new Date()
    };
    
    this.posts[index] = updatedPost;
    return updatedPost;
  }
  
  async deletePost(id: string): Promise<void> {
    console.log(`📝 Удаление поста: ${id}`);
    const index = this.posts.findIndex(p => p.id === id);
    
    if (index !== -1) {
      this.posts.splice(index, 1);
      
      // Удаляем связи с тегами
      this.postTags = this.postTags.filter(pt => pt.postId !== id);
    }
  }

  // Мок реализации категорий
  async getCategories(): Promise<Category[]> { 
    console.log('🏷️ Получение категорий');
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    console.log('🏷️ Создание новой категории');
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      ...category,
      createdAt: new Date()
    };
    
    this.categories.push(newCategory);
    return newCategory;
  }

  // Мок реализации тегов
  async getTags(): Promise<Tag[]> { 
    console.log('🔖 Получение тегов');
    return [...this.tags].sort((a, b) => a.name.localeCompare(b.name)); 
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    console.log('🔖 Создание нового тега');
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      ...tag,
      createdAt: new Date()
    };
    
    this.tags.push(newTag);
    return newTag;
  }

  // Остальные методы оставляем как есть
  async getMediaLibrary(): Promise<Media[]> { return this.mediaItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  
  async createMedia(media: InsertMedia): Promise<Media> {
    const newMedia: Media = {
      id: `media-${Date.now()}`,
      ...media,
      createdAt: new Date()
    };
    this.mediaItems.push(newMedia);
    return newMedia;
  }
  
  async deleteMedia(id: string): Promise<void> {
    const index = this.mediaItems.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mediaItems.splice(index, 1);
    }
  }
  
  async getForms(): Promise<Form[]> { return this.formItems; }
  async getForm(id: string): Promise<Form | undefined> { return this.formItems.find(f => f.id === id); }
  
  async createForm(form: InsertForm): Promise<Form> {
    const newForm: Form = {
      id: `form-${Date.now()}`,
      ...form,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Form;
    this.formItems.push(newForm);
    return newForm;
  }
  
  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const newSubmission: FormSubmission = {
      id: `submission-${Date.now()}`,
      ...submission,
      createdAt: new Date()
    } as FormSubmission;
    this.formSubmissions.push(newSubmission);
    return newSubmission;
  }
  
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    return {
      id: `consultation-${Date.now()}`,
      ...consultation,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Consultation;
  }
  
  async trackAnalytics(data: any): Promise<void> {}
  async getAnalytics(options: any): Promise<any[]> { return []; }
}

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Page operations
  getAllPages(): Promise<Page[]>;
  getPublishedPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: string): Promise<void>;

  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPublishedPosts(options: {
    page: number;
    limit: number;
    categorySlug?: string;
    tagSlug?: string;
  }): Promise<{ posts: Post[]; total: number }>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string): Promise<void>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Tag operations
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Media operations
  getMediaLibrary(): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: string): Promise<void>;

  // Form operations
  getForms(): Promise<Form[]>;
  getForm(id: string): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;

  // Consultation operations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;

  // Analytics operations
  trackAnalytics(data: {
    pageId?: string;
    postId?: string;
    event: string;
    data?: any;
    userAgent: string;
    ipAddress: string;
    referrer?: string;
  }): Promise<void>;
  getAnalytics(options: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("❌ Ошибка при получении пользователя:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error) {
      console.error("❌ Ошибка при обновлении пользователя:", error);
      
      // В случае ошибки, пробуем создать фиктивного пользователя для разработки
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ Создаю фиктивного пользователя для локальной разработки");
        return {
          id: userData.id || 'admin-user-id',
          email: userData.email || 'admin@example.com',
          firstName: userData.firstName || 'Администратор',
          lastName: userData.lastName || 'Системы',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          profileImageUrl: null,
        };
      }
      
      throw error;
    }
  }

  // Page operations
  async getAllPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(desc(pages.updatedAt));
  }

  async getPublishedPages(): Promise<Page[]> {
    return await db
      .select()
      .from(pages)
      .where(eq(pages.isPublished, true))
      .orderBy(desc(pages.publishedAt));
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Post operations
  async getAllPosts(): Promise<Post[]> {
    return await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        categoryId: posts.categoryId,
        metaTitle: posts.metaTitle,
        metaDescription: posts.metaDescription,
        isPublished: posts.isPublished,
        publishedAt: posts.publishedAt,
        readingTime: posts.readingTime,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .orderBy(desc(posts.updatedAt));
  }

  async getPublishedPosts(options: {
    page: number;
    limit: number;
    categorySlug?: string;
    tagSlug?: string;
  }): Promise<{ posts: Post[]; total: number }> {
    const { page, limit, categorySlug, tagSlug } = options;
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        categoryId: posts.categoryId,
        metaTitle: posts.metaTitle,
        metaDescription: posts.metaDescription,
        isPublished: posts.isPublished,
        publishedAt: posts.publishedAt,
        readingTime: posts.readingTime,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.isPublished, true));

    if (categorySlug) {
      query = query.where(and(eq(posts.isPublished, true), eq(categories.slug, categorySlug)));
    }

    if (tagSlug) {
      const tag = await db.select().from(tags).where(eq(tags.slug, tagSlug)).limit(1);
      if (tag.length > 0) {
        const postIds = await db
          .select({ postId: postTags.postId })
          .from(postTags)
          .where(eq(postTags.tagId, tag[0].id));
        
        if (postIds.length > 0) {
          query = query.where(
            and(
              eq(posts.isPublished, true),
              inArray(posts.id, postIds.map(p => p.postId!))
            )
          );
        }
      }
    }

    const results = await query
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(eq(posts.isPublished, true));

    return {
      posts: results as Post[],
      total: totalResult[0].count,
    };
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        categoryId: posts.categoryId,
        metaTitle: posts.metaTitle,
        metaDescription: posts.metaDescription,
        isPublished: posts.isPublished,
        publishedAt: posts.publishedAt,
        readingTime: posts.readingTime,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.slug, slug));
    
    return post as Post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Tag operations
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  // Media operations
  async getMediaLibrary(): Promise<Media[]> {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  }

  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(mediaData).returning();
    return newMedia;
  }

  async deleteMedia(id: string): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  // Form operations
  async getForms(): Promise<Form[]> {
    return await db.select().from(forms).orderBy(desc(forms.createdAt));
  }

  async getForm(id: string): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    return form;
  }

  async createForm(form: InsertForm): Promise<Form> {
    const [newForm] = await db.insert(forms).values(form).returning();
    return newForm;
  }

  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const [newSubmission] = await db.insert(formSubmissions).values(submission).returning();
    return newSubmission;
  }

  // Consultation operations
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [newConsultation] = await db.insert(consultations).values(consultation).returning();
    return newConsultation;
  }

  // Analytics operations
  async trackAnalytics(data: {
    pageId?: string;
    postId?: string;
    event: string;
    data?: any;
    userAgent: string;
    ipAddress: string;
    referrer?: string;
  }): Promise<void> {
    await db.insert(analytics).values(data);
  }

  async getAnalytics(options: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    let query = db.select().from(analytics);

    if (options.startDate || options.endDate) {
      const conditions = [];
      if (options.startDate) {
        conditions.push(sql`${analytics.createdAt} >= ${options.startDate}`);
      }
      if (options.endDate) {
        conditions.push(sql`${analytics.createdAt} <= ${options.endDate}`);
      }
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(analytics.createdAt));
  }
}

// Выбираем правильную реализацию хранилища в зависимости от состояния подключения
let storageImplementation: IStorage;

if (process.env.NODE_ENV === 'development' && (dbConnectionFailed || process.env.USE_MOCK_STORAGE === 'true')) {
  console.log('🗄️ Используется мок-хранилище данных');
  storageImplementation = new MockStorage();
} else {
  console.log('🗄️ Используется хранилище PostgreSQL');
  storageImplementation = new DatabaseStorage();
}

// Экспортируем правильную реализацию хранилища
export const storage = storageImplementation;
