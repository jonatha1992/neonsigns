import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

/**
 * Auth Guard Middleware
 * Protects routes that require authentication
 */
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const requireAuth = ((import.meta as any)?.env?.VITE_REQUIRE_AUTH ?? 'true').toString().toLowerCase() !== 'false'
  if (!requireAuth) {
    // Bypass auth guard (development/testing)
    next()
    return
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
  const requireAuth = ((import.meta as any)?.env?.VITE_REQUIRE_AUTH ?? 'true').toString().toLowerCase() !== 'false'
  if (!requireAuth) {
    // Bypass admin guard (development/testing)
    next()
    return
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
  const requireAuth = ((import.meta as any)?.env?.VITE_REQUIRE_AUTH ?? 'true').toString().toLowerCase() !== 'false'
  if (!requireAuth) {
    // Allow access to guest routes without redirects when auth is disabled
    next()
    return
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
