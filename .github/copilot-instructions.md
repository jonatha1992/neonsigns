# Neon Signs - AI Coding Assistant Guide

## 🎯 Project Overview
This is a **Vue 3 + TypeScript + Firebase** portfolio application for a neon LED signs business ("Cruados Neon LeD Store"). It features a public gallery and an admin panel for content management.

## 🏗️ Architecture & Key Patterns

### 1. **Dual Data Strategy (Critical)**
The app uses Firebase Firestore as primary data source with mock data fallback:
- **Primary**: Firebase `gallery_items` collection 
- **Fallback**: Mock data in `src/stores/products.ts`
- **Data Adaptation**: `ProductsService.adaptGalleryItemToProduct()` converts Firestore schema to frontend types
- **Timeout Strategy**: 3s timeout for products, 2s for featured items before fallback

### 2. **Firebase Configuration & Authentication**
- **Config**: `src/config/firebase.ts` with smart auth persistence (handles project ID changes)
- **Auth Guard**: `src/middleware/auth.guard.ts` with bypass via `VITE_REQUIRE_AUTH=false`
- **Admin Email**: `tecnofusion.it@gmail.com` (hardcoded in auth store)
- **Collections**: `gallery_items` (Spanish fields), security rules in `firestore.rules`

### 3. **State Management (Pinia)**
- **Products Store**: `src/stores/products.ts` - handles Firebase/mock switching, featured products limit (4)
- **Auth Store**: `src/stores/auth.ts` - Firebase auth integration 
- **Cart Store**: Basic cart functionality (not fully implemented)

### 4. **Routing Strategy**
- **Public Routes**: `/`, `/galeria`, `/trabajo/:id`, `/contacto`
- **Admin Routes**: `/admin/login`, `/admin/dashboard` (protected by auth guards)
- **SEO-friendly**: Spanish URLs with meta titles

## 🛠️ Development Workflow

### Essential Commands
```bash
# Development (port 3000)
npm run dev

# Firebase testing (browser console)
const tests = await import('/scripts/test-firebase.ts')
await tests.runAllTests()

# Environment setup
cp .env.local.example .env.local
# Fill Firebase credentials in .env.local

# Deploy Firebase rules
firebase deploy --only firestore:rules,storage:rules
```

### Testing Strategy
- **Automated**: Browser-based Firebase tests (`scripts/test-firebase.ts`) - 22 tests covering auth, CRUD, featured limits
- **Manual**: Admin panel testing via `/admin/login`
- **Data Integrity**: Featured products must be exactly 4 items

## 📁 File Organization Patterns

### Service Layer Pattern
- **Products**: `src/services/products.service.ts` - Firestore CRUD with Spanish→English category mapping
- **Auth**: `src/services/auth.service.ts` - Firebase auth wrapper
- **Storage**: `src/services/storage.service.ts` - Image upload with validation

### Component Architecture
- **Layout**: `src/components/layout/` (AppHeader, AppFooter, AdminLayout)
- **Feature-based**: `src/components/auth/`, `src/components/cart/`, `src/components/product/`
- **Common**: Reusable components in `src/components/common/`

### Styling Approach
- **Tailwind CSS**: Primary styling framework
- **Neon Theme**: Custom CSS for neon effects and animations
- **Responsive**: Mobile-first design patterns

## 🔧 Critical Configuration Files

- **Vite**: `vite.config.ts` - Aliases (@, @components, etc.), Firebase optimization, chunk splitting
- **Firebase**: `firebase.json` - Hosting config, SPA routing, cache headers
- **Types**: `src/types/index.ts` - Central type definitions, Product/CartItem interfaces

## 🚨 Important Constraints & Gotchas

### Firebase Integration
- **Featured Limit**: Exactly 4 featured products enforced in UI and service layer
- **Image Storage**: Firebase Storage for images, Firestore for metadata
- **Category Mapping**: Spanish categories in Firestore → English in frontend
- **Error Handling**: Always provide mock fallback for Firebase failures

### Development Environment
- **Port**: Dev server runs on port 3000 (not 5173)
- **Auth Bypass**: Set `VITE_REQUIRE_AUTH=false` for development without Firebase
- **Hot Reload**: Configured to not show overlay errors

### Admin Panel Specifics
- **Single Admin**: Only `tecnofusion.it@gmail.com` 
- **Protected Routes**: Use `adminGuard` middleware
- **Form Validation**: Client-side validation in admin forms
- **Image Upload**: Direct to Firebase Storage with compression

## 📋 When Working on Features

### Adding New Products
1. Use admin panel at `/admin/dashboard`
2. Data goes to `gallery_items` collection
3. Images upload to Firebase Storage
4. Category must be Spanish (negocios, hogar, personalizado, etc.)

### Modifying Product Display
1. Check both Firebase data structure and mock data fallback
2. Update `ProductsService.adaptGalleryItemToProduct()` for schema changes
3. Test with Firebase timeout scenarios

### Authentication Changes
1. Update `useAuthStore` in `src/stores/auth.ts`
2. Modify guards in `src/middleware/auth.guard.ts` 
3. Test with `VITE_REQUIRE_AUTH` environment variable

Always test both Firebase-connected and fallback modes when making data-related changes.