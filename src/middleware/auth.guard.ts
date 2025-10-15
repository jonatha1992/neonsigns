import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

/**
 * Safe parse for Vite boolean-ish env vars
 */
function parseViteBool(val: unknown, defaultValue = true): boolean {
  if (val === undefined || val === null) return defaultValue;
  try {
    return String(val).toString().toLowerCase() !== 'false';
  } catch {
    return defaultValue;
  }
}

/**
 * Auth Guard Middleware
 * Protects routes that require authentication
 */
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const requireAuth = parseViteBool((import.meta as any)?.env?.VITE_REQUIRE_AUTH, true);
  console.debug('[authGuard] VITE_REQUIRE_AUTH parsed:', requireAuth);
  if (!requireAuth) {
    // Bypass auth guard (development/testing)
    console.debug('[authGuard] Bypassing auth guard because VITE_REQUIRE_AUTH is false');
    next();
    return;
  }
  const authStore = useAuthStore();

  // Wait for auth initialization if still loading
  if (authStore.loading) {
    await authStore.initAuth();
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Redirect to login with return URL
    next({
      name: 'admin-login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Proceed to route
  next();
};

/**
 * Admin Guard Middleware
 * Protects routes that require admin privileges
 */
export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const requireAuth = parseViteBool((import.meta as any)?.env?.VITE_REQUIRE_AUTH, true);
  console.debug('[adminGuard] VITE_REQUIRE_AUTH parsed:', requireAuth);
  if (!requireAuth) {
    // Bypass admin guard (development/testing)
    console.debug('[adminGuard] Bypassing admin guard because VITE_REQUIRE_AUTH is false');
    next();
    return;
  }
  // Respect VITE_REQUIRE_ADMIN to allow a dev bypass specifically for admin checks
  const requireAdmin = parseViteBool((import.meta as any)?.env?.VITE_REQUIRE_ADMIN, true);
  console.debug('[adminGuard] VITE_REQUIRE_ADMIN parsed:', requireAdmin);
  if (!requireAdmin) {
    console.debug('[adminGuard] Bypassing admin requirement because VITE_REQUIRE_ADMIN is false');
    next();
    return;
  }
  const authStore = useAuthStore();

  // Wait for auth initialization if still loading
  if (authStore.loading) {
    await authStore.initAuth();
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    next({
      name: 'admin-login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Check if user is admin
  if (!authStore.isAdmin) {
    console.warn('Access denied: User is not an admin');
    next({ name: 'home' });
    return;
  }

  // Proceed to route
  next();
};

/**
 * Guest Guard Middleware
 * Redirects authenticated users away from guest-only routes (like login)
 */
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const requireAuth = parseViteBool((import.meta as any)?.env?.VITE_REQUIRE_AUTH, true);
  console.debug('[guestGuard] VITE_REQUIRE_AUTH parsed:', requireAuth);
  if (!requireAuth) {
    // Allow access to guest routes without redirects when auth is disabled
    console.debug('[guestGuard] Skipping guest redirects because VITE_REQUIRE_AUTH is false');
    next();
    return;
  }
  const authStore = useAuthStore();

  // Wait for auth initialization if still loading
  if (authStore.loading) {
    await authStore.initAuth();
  }

  // If user is authenticated and is admin, redirect to admin dashboard
  if (authStore.isAuthenticated && authStore.isAdmin) {
    next({ name: 'admin-dashboard' });
    return;
  }

  // If user is authenticated but not admin, redirect to home
  if (authStore.isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  // Proceed to route
  next();
};

export default {
  authGuard,
  adminGuard,
  guestGuard
};
