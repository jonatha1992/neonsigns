import { computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

/**
 * Composable for authentication operations
 * Provides reactive access to auth state and methods
 */
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  // Reactive state
  const user = computed(() => authStore.user);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isAdmin = computed(() => authStore.isAdmin);
  const userEmail = computed(() => authStore.userEmail);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    const success = await authStore.signIn(email, password);
    return success;
  };

  /**
   * Sign out and redirect to home
   */
  const signOut = async (): Promise<void> => {
    await authStore.signOut();
    router.push({ name: 'home' });
  };

  /**
   * Send password reset email
   */
  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    return await authStore.sendPasswordResetEmail(email);
  };

  /**
   * Update password
   */
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return await authStore.updatePassword(currentPassword, newPassword);
  };

  /**
   * Clear error message
   */
  const clearError = (): void => {
    authStore.clearError();
  };

  /**
   * Initialize auth and subscribe to changes
   */
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    // Subscribe to auth state changes
    unsubscribe = authStore.subscribeToAuthChanges();
  });

  onUnmounted(() => {
    // Unsubscribe when component unmounts
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    userEmail,

    // Methods
    signIn,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    clearError
  };
}

export default useAuth;
