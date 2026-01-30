# Voidlink

## Overview

Voidlink is a customizable bio-link platform similar to Linktree or fakecrime.bio. Users can create personalized profile pages with custom links, backgrounds, themes, and effects. The platform features a dark cyberpunk/void aesthetic with neon accents and provides a dashboard for managing profile content and appearance.

Key features:
- User registration and authentication with unique username claiming
- Customizable public profile pages at `/<username>`
- Link management with drag-and-drop reordering
- Theme customization (backgrounds, colors, fonts, button styles)
- Visual effects (cursor effects, animations)
- Real-time profile preview in dashboard

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and effects
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- `client/src/pages/` - Page components (Landing, Dashboard, PublicProfile)
- `client/src/components/` - Reusable components including shadcn/ui
- `client/src/hooks/` - Custom hooks for auth, profile, and links management
- `client/src/lib/` - Utilities and query client configuration

### Backend Architecture
- **Framework**: Express.js 5 with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Pattern**: REST API with typed routes defined in `shared/routes.ts`
- **Authentication**: Passport.js with local strategy, session-based auth
- **Session Store**: PostgreSQL-backed sessions via connect-pg-simple

The server follows a layered architecture:
- `server/routes.ts` - API route handlers with Passport middleware
- `server/storage.ts` - Data access layer with storage interface
- `server/db.ts` - Database connection pool
- `server/vite.ts` - Vite dev server integration for HMR

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with `db:push` command

Database tables:
- `users` - Authentication data (username, email, password hash, admin flag)
- `profiles` - User profile customization (display name, bio, avatar, background, theme/effects/music settings as JSONB)
- `links` - Profile links with ordering and styling options

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Drizzle table definitions and Zod schemas
- `routes.ts` - API route definitions with input/output schemas

## External Dependencies

### Database
- **PostgreSQL** - Primary data store, requires `DATABASE_URL` environment variable
- **Drizzle ORM** - Type-safe database queries and schema management
- **connect-pg-simple** - Session storage in PostgreSQL

### Authentication
- **Passport.js** - Authentication middleware
- **passport-local** - Username/password strategy
- **express-session** - Session management (requires `SESSION_SECRET` env var)

### Frontend Libraries
- **@tanstack/react-query** - Server state management and caching
- **framer-motion** - Animation library
- **lucide-react** - Icon library
- **recharts** - Analytics charts (noted in requirements)
- **Radix UI** - Accessible UI primitives (accordion, dialog, dropdown, etc.)

### Build & Development
- **Vite** - Frontend build tool with HMR
- **esbuild** - Server bundling for production
- **tsx** - TypeScript execution for development

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Tailwind class merging utility