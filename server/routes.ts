import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes
  // Get published pages
  app.get('/api/pages/published', async (req, res) => {
    try {
      const pages = await storage.getPublishedPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching published pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Get page by slug
  app.get('/api/pages/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getPageBySlug(slug);
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      // Track page view
      await storage.trackAnalytics({
        pageId: page.id,
        event: "view",
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip || "unknown",
        referrer: req.headers.referer || undefined,
      });
      
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Get published posts
  app.get('/api/posts/published', async (req, res) => {
    try {
      const { page = 1, limit = 10, category, tag } = req.query;
      const posts = await storage.getPublishedPosts({
        page: Number(page),
        limit: Number(limit),
        categorySlug: category as string,
        tagSlug: tag as string,
      });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching published posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get post by slug
  app.get('/api/posts/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getPostBySlug(slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Track post view
      await storage.trackAnalytics({
        postId: post.id,
        event: "view",
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip || "unknown",
        referrer: req.headers.referer || undefined,
      });
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Get categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get tags
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Submit form
  app.post('/api/forms/:formId/submit', async (req, res) => {
    try {
      const { formId } = req.params;
      const form = await storage.getForm(formId);
      
      if (!form || !form.isActive) {
        return res.status(404).json({ message: "Form not found or inactive" });
      }

      // Validate form data against schema
      const submission = await storage.createFormSubmission({
        formId,
        data: req.body,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip,
      });

      // Track form submission
      await storage.trackAnalytics({
        event: "form_submit",
        data: { formId, submissionId: submission.id },
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip || "unknown",
      });

      // TODO: Send notifications (Telegram, email)
      
      res.json({ message: "Form submitted successfully", id: submission.id });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ message: "Failed to submit form" });
    }
  });

  // Create consultation booking
  app.post('/api/consultations', async (req, res) => {
    try {
      const consultationSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        company: z.string().optional(),
        service: z.string().min(1),
        message: z.string().optional(),
        scheduledAt: z.string().optional(),
      });

      const validatedData = consultationSchema.parse(req.body);
      
      const consultation = await storage.createConsultation({
        ...validatedData,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined,
      });

      // Track consultation booking
      await storage.trackAnalytics({
        event: "consultation_booked",
        data: { consultationId: consultation.id, service: validatedData.service },
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip || "unknown",
      });

      res.json({ message: "Consultation booked successfully", id: consultation.id });
    } catch (error) {
      console.error("Error booking consultation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to book consultation" });
    }
  });

  // Protected Admin API routes
  // Get all pages (admin)
  app.get('/api/admin/pages', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const pages = await storage.getAllPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching admin pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Create page
  app.post('/api/admin/pages', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const page = await storage.createPage({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      res.json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  // Update page
  app.put('/api/admin/pages/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const page = await storage.updatePage(id, req.body);
      res.json(page);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  // Get all posts (admin)
  app.get('/api/admin/posts', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Create post
  app.post('/api/admin/posts', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const post = await storage.createPost({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Update post
  app.put('/api/admin/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const post = await storage.updatePost(id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // Media upload
  app.post('/api/admin/media/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Move file to permanent location
      const filename = `${Date.now()}-${req.file.originalname}`;
      const finalPath = path.join("uploads", filename);
      
      fs.renameSync(req.file.path, finalPath);

      const media = await storage.createMedia({
        filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${filename}`,
        alt: req.body.alt || "",
        uploadedBy: req.user.claims.sub,
      });

      res.json(media);
    } catch (error) {
      console.error("Error uploading media:", error);
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  // Get media library
  app.get('/api/admin/media', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const media = await storage.getMediaLibrary();
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  // Get analytics
  app.get('/api/admin/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { startDate, endDate } = req.query;
      const analytics = await storage.getAnalytics({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
