import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from 'firebase/auth';
import AuthService from '@/services/auth.service';
import logger from '@/utils/logger';

/**
 * Authentication Store
 * Manages user authentication state and operations
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => AuthService.isAdmin(user.value));
  const userEmail = computed(() => user.value?.email || null);

  /**
   * Initialize auth state
   * Should be called on app startup
   */
  const initAuth = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const currentUser = await AuthService.waitForAuthInit();
      user.value = currentUser;
    } catch (err) {
      error.value = 'Error initializing authentication';
      logger.error('Error initializing auth:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const authenticatedUser = await AuthService.signIn(email, password);
      user.value = authenticatedUser;

      // Check if user is admin
      if (!AuthService.isAdmin(authenticatedUser)) {
        await signOut();
        error.value = 'No tiene permisos de administrador';
        return false;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al iniciar sesión';
      logger.error('Sign in error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await AuthService.signOut();
      user.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cerrar sesión';
      logger.error('Sign out error:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Send password reset email
   */
  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await AuthService.sendPasswordResetEmail(email);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al enviar correo de recuperación';
      logger.error('Password reset error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update user password
   */
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      // Reauthenticate first
      await AuthService.reauthenticate(currentPassword);

      // Update password
      await AuthService.updatePassword(newPassword);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar contraseña';
      logger.error('Password update error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear error message
   */
  const clearError = (): void => {
    error.value = null;
  };

  /**
   * Subscribe to auth state changes
   */
  const subscribeToAuthChanges = (): (() => void) => {
    return AuthService.onAuthStateChanged((newUser) => {
      user.value = newUser;
      loading.value = false;
    });
  };

  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    userEmail,

    // Actions
    initAuth,
    signIn,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    clearError,
    subscribeToAuthChanges
  };
});

export default useAuthStore;
