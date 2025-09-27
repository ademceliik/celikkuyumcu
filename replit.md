# Overview

This is a Turkish jewelry e-commerce application built with a modern full-stack architecture. The application serves as an online catalog for "Çelik Kuyumcu" (Çelik Jewelry), allowing customers to browse gold jewelry products and contact the business via WhatsApp for orders. The system includes both a customer-facing storefront and an admin panel for product management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and better development experience
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **Development Server**: Custom Vite integration for seamless development experience
- **Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints for product CRUD operations with proper error handling

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Database**: PostgreSQL (configured but currently using in-memory storage)
- **Migrations**: Drizzle Kit for database schema management
- **Schema**: Shared TypeScript schema definitions between frontend and backend

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Admin Access**: Direct access to admin routes without authentication (development setup)
- **Session Management**: Express session configuration prepared with PostgreSQL session store

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database service (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### UI and Components
- **Radix UI**: Comprehensive component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component system with consistent design tokens
- **Embla Carousel**: Touch-friendly carousel component
- **Lucide React**: Modern icon library

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation and schema parsing

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### Communication Integration
- **WhatsApp Business API**: Direct customer communication through WhatsApp links
- **Font Awesome**: Icon library for social media and interface icons

### Styling and Design
- **Google Fonts**: Custom typography with Playfair Display and Inter fonts
- **CSS Variables**: Theme system with light/dark mode support preparation
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities

The architecture emphasizes type safety, developer experience, and scalability while maintaining a clean separation between frontend and backend concerns. The application is designed to easily transition from in-memory storage to a full PostgreSQL database when needed.