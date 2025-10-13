import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
  type AuthError
} from 'firebase/auth';
import { auth } from '@/config/firebase';

/**
 * Authentication Service
 * Handles all Firebase authentication operations
 */
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Update user password
   * Requires recent authentication
   */
  static async updatePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Reauthenticate user with current password
   * Required before sensitive operations like password change
   */
  static async reauthenticate(currentPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user is currently signed in');
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Check if user is admin
   * Admin users are verified by email
   */
  static isAdmin(user: User | null): boolean {
    if (!user || !user.email) {
      return false;
    }
    // If admin requirement is disabled, any authenticated user is considered admin
    const requireAdmin = ((import.meta as any)?.env?.VITE_REQUIRE_ADMIN ?? 'true').toString().toLowerCase() !== 'false';
    if (!requireAdmin) {
      return true;
    }
    // Allow configuring admin emails via env (comma-separated)
    const envAdmins = (import.meta as any)?.env?.VITE_ADMIN_EMAILS as string | undefined;
    if (envAdmins && envAdmins.trim().length > 0) {
      const allowed = envAdmins
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
      return allowed.includes(user.email.toLowerCase());
    }

    // Fallback to legacy single admin email
    return user.email.toLowerCase() === 'ldesidel@hotmail.com';
  }

  /**
   * Subscribe to authentication state changes
   */
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convert Firebase auth error codes to user-friendly messages
   */
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/invalid-login-credentials': 'Credenciales inválidas',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No se encontró ninguna cuenta con este correo electrónico',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este correo electrónico ya está en uso',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intente nuevamente más tarde',
      'auth/network-request-failed': 'Error de red. Verifique su conexión a internet',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/requires-recent-login': 'Esta operación requiere una autenticación reciente. Inicie sesión nuevamente'
    };

    return errorMessages[errorCode] || 'Error de autenticación. Intente nuevamente';
  }

  /**
   * Wait for auth to be initialized
   * Useful for checking auth state on app startup
   */
  static waitForAuthInit(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}

export default AuthService;
