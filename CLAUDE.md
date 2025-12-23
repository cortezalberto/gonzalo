# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**barijho** is a Progressive Web App for shared digital restaurant menus. Diners at a table collaboratively order from a shared cart, split bills, and manage table sessions. Built for offline-first mobile use.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server (port 5176)
npm run build    # Production build
npm run lint     # Run ESLint
npx tsc --noEmit # Type check without emitting
npm run preview  # Preview production build
```

No test framework is configured. Deployment: Vercel (configured via `vercel.json`)

## Technology Stack

- **React 19** with TypeScript (strict mode)
- **Vite 7** with Tailwind CSS v4
- **Zustand 5** for state management (with localStorage/sessionStorage persistence)
- **i18next** for internationalization (es, en, pt)
- **vite-plugin-pwa** with Workbox service workers
- **Google OAuth** for authentication (uses `MOCK_MODE` in authStore - enabled in dev, disabled when `VITE_MOCK_AUTH=false`)

## Architecture

### State Management

Two Zustand stores with persistence:

- **tableStore/** (modular) - Session, cart, orders, payment calculations. Uses localStorage with 8-hour expiry. No cross-store imports (auth context passed as parameter).
  - `store.ts` - Main Zustand store (uses helpers for calculations)
  - `selectors.ts` - React hooks (`useSession`, `useCartItems`, `useDiners`, etc.)
  - `helpers.ts` - Pure utility functions (`calculatePaymentShares`, `withRetry`, `shouldExecute`)
  - `types.ts` - TypeScript interfaces
- **authStore.ts** - Google OAuth state. Uses sessionStorage. `MOCK_MODE` auto-enabled in dev mode. Uses `AuthError` class with i18n keys for error messages.

Both stores use selectors for optimized re-renders.

### Key Patterns

- **Lazy loading** - Components below the fold use `React.lazy()` with Suspense
- **Optimistic updates** - `useOptimisticCart` hook uses React 19's `useOptimistic` for instant cart feedback
- **Request deduplication** - API client deduplicates identical in-flight requests
- **Mount guards** - Use `useIsMounted` hook in async operations to prevent state updates after unmount
- **Ref pattern for callbacks** - Use `useRef` + `useEffect` to avoid stale closures in timeouts (see `ProductDetailModal`, `CallWaiterModal`)
- **Functional state updates** - Async store actions use `set((state) => ...)` to avoid stale state after `await`
- **Retry with backoff** - Use `withRetry` from `tableStore/helpers.ts` for API calls with exponential backoff
- **Secure ID generation** - Use `crypto.randomUUID()` via `generateId()` helper
- **Module loggers** - Use `utils/logger.ts` with module prefixes (e.g., `tableStoreLogger`)
- **Modular components** - Complex components use folder structure with `index.tsx` and subcomponents (JoinTable/, AIChat/, tableStore/)

### Security

- **SSRF prevention** - API base URL validated against allowed hosts in `services/api.ts`
- **CSRF protection** - `X-Requested-With` header on all API calls
- **Token storage** - OAuth tokens in sessionStorage (not localStorage)

### Service Worker Caching

Three strategies in `vite.config.ts`:
1. **CacheFirst** - Images (30d), fonts (1y)
2. **NetworkFirst** - APIs with timeout fallback
3. **SPA fallback** - Navigates to index.html offline

## Key Directories

```
src/
├── pages/           # Home.tsx (menu), CloseTable.tsx (bill splitting)
├── components/      # UI components, ui/ subdirectory for primitives
│   ├── JoinTable/   # Modular - TableNumberStep, NameStep, AuthenticatedUserCard
│   ├── AIChat/      # Modular - responseHandlers.ts with strategy pattern
│   ├── cart/        # Cart components (CartEmpty, CartItemCard, OrderSuccess)
│   └── close-table/ # Bill splitting (DinersList, OrdersList, PaymentSummary)
├── stores/          # Zustand stores
│   └── tableStore/  # Modular store structure
├── hooks/           # Custom hooks (useOptimisticCart, useAsync, useDebounce, etc.)
├── services/        # API client, mock data, Google auth
├── types/           # TypeScript interfaces
├── i18n/            # i18next config and locale JSON files
├── constants/       # App constants and timing values
└── utils/           # Logger, validation helpers
```

## Core Conventions

### TypeScript

- Strict mode enabled with noUnusedLocals/noUnusedParameters
- Unused variables prefixed with underscore are allowed
- All imports use relative paths (no aliases)

### Styling

- Tailwind utilities with dark mode classes (`dark-bg`, `dark-card`, `dark-muted`, `dark-border`, `dark-elevated`)
- Primary color: Orange (`#f97316`)
- Safe area classes for mobile notch support (`safe-area-top`, `safe-area-bottom`)

### Internationalization

- Always use `useTranslation` hook, never hardcode strings
- Add keys to all three locales (es.json, en.json, pt.json)
- Spanish is the most complete, English/Portuguese fall back to it
- Error messages use i18n keys (e.g., `errors.timeout`, `errors.authGoogleInvalid`) - store the key, display via `t(errorKey)`

### State Updates

- Use Zustand selectors, not direct store access in components
- Selectors prevent unnecessary re-renders on unrelated state changes

### Logging

- Always use centralized logger from `utils/logger.ts`, never `console.log/warn/error`
- Pre-configured module loggers: `tableStoreLogger`, `authStoreLogger`, `apiLogger`, `googleAuthLogger`, `errorBoundaryLogger`, `joinTableLogger`
- Create new module loggers: `const myLogger = logger.module('ModuleName')`

### Code Comments

- All comments must be in English

### Input Validation

- Use validation helpers from `utils/validation.ts`: `validateTableNumber`, `validateDinerName`, `validateImageUrl`, `sanitizeText`
- Validation functions return i18n keys (e.g., `validation.tableRequired`) - use `t(error, errorParams)` to translate
- Cart operations validate price (positive finite number) and quantity (integer 1-99)
- Local fallback images in `public/` for offline support (`fallback-product.svg`, `default-avatar.svg`)

### Accessibility

- Modals must have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the title
- Add `aria-hidden="true"` to decorative SVG icons inside buttons with `aria-label`
- Modals should support Escape key to close (use keyboard event listener pattern)

## Environment Variables

```bash
VITE_API_URL=          # Backend API endpoint
VITE_GOOGLE_CLIENT_ID= # Google OAuth Client ID
VITE_RESTAURANT_ID=    # Restaurant identifier (default: "default")
VITE_MOCK_AUTH=        # Set to "false" to disable mock auth in production
```

## Table Session Flow

1. QR scan → JoinTable → enter table number & name
2. Home → browse products, manage shared cart
3. Submit orders → creates OrderRecord (rounds)
4. CloseTable → split bill (equal, by consumption, custom)
5. Leave → session reset
