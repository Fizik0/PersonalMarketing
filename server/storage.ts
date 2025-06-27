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
import { db } from "./db";
import { eq, desc, and, like, sql, inArray } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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

export const storage = new DatabaseStorage();
