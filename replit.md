# Alexander Novikov's Professional Portfolio & CMS

## Overview

This is a full-stack web application built as a professional portfolio and content management system for Alexander Novikov, a business consultant specializing in e-commerce and unit economics. The application serves as both a public-facing portfolio website and a private admin dashboard for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds
- **UI Components**: Extensive use of Radix UI primitives via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OIDC-based)
- **Session Management**: PostgreSQL-backed sessions
- **File Upload**: Multer middleware for media handling
- **API Design**: RESTful endpoints with type-safe schema validation

### Database Architecture
- **ORM**: Drizzle with TypeScript-first approach
- **Migration Strategy**: Schema-driven migrations via drizzle-kit
- **Database Provider**: Neon Database (PostgreSQL-compatible)

## Key Components

### Authentication System
- Replit Auth integration with OIDC flow
- Role-based access control (admin/user roles)
- Session persistence with PostgreSQL storage
- Automatic token refresh and user management

### Content Management System
- **Page Builder**: Dynamic page creation with template system
- **Blog Management**: Full-featured blog with categories and tags
- **Media Library**: File upload and management system
- **Form Builder**: Dynamic form creation and submission handling

### Business-Specific Features
- **Unit Economics Calculator**: Interactive calculator for e-commerce metrics
- **Service Pages**: Specialized landing pages for consulting services
- **Analytics Dashboard**: Business metrics and performance tracking
- **Consultation Booking**: Appointment scheduling system

## Data Flow

### Public Routes
1. Landing page with hero, services, and contact sections
2. Blog index with pagination and category filtering
3. Individual blog posts with social sharing
4. Service-specific pages (Unit Economics, OZON Audit)

### Admin Routes (Authentication Required)
1. Dashboard with analytics overview
2. Page builder for creating/editing landing pages
3. Blog editor with rich text capabilities
4. Media library for asset management
5. Form management and submission tracking

### API Endpoints
- `/api/auth/*` - Authentication and user management
- `/api/pages/*` - Page CRUD operations
- `/api/posts/*` - Blog post management
- `/api/media/*` - File upload and management
- `/api/admin/*` - Admin-only endpoints with role checking

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless`
- **Authentication**: Replit Auth via `openid-client`
- **File Processing**: Multer for file uploads
- **UI Framework**: Extensive Radix UI ecosystem
- **Form Handling**: React Hook Form with Zod validation

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Database**: Drizzle Kit for schema management and migrations
- **Development Server**: Express with Vite middleware integration
- **Code Quality**: TypeScript with strict configuration

## Deployment Strategy

### Replit Platform
- **Environment**: Node.js 20 with PostgreSQL 16 module
- **Build Process**: Vite build for frontend, esbuild for backend
- **Start Command**: Production server serves static assets and API
- **Database**: Automatic provisioning via Replit database module

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OIDC provider URL (defaults to Replit)

### Build Process
1. Frontend build via Vite (outputs to `dist/public`)
2. Backend bundle via esbuild (outputs to `dist/index.js`)
3. Static asset serving in production mode
4. Database migrations via `npm run db:push`

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```