<template>
  <div class="w-full max-w-md mx-auto">
    <form @submit.prevent="handleSubmit" class="bg-dark-lighter p-8 rounded-lg shadow-xl">
      <h2 class="text-3xl font-bold text-light mb-6 text-center">
        Acceso Administrativo
      </h2>

      <!-- Error message -->
      <div
        v-if="error"
        class="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm"
      >
        {{ error }}
      </div>

      <!-- Success message -->
      <div
        v-if="successMessage"
        class="mb-4 p-3 bg-green-500/10 border border-green-500 rounded text-green-500 text-sm"
      >
        {{ successMessage }}
      </div>

      <!-- Email field -->
      <div class="mb-4">
        <label for="email" class="block text-light mb-2">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          placeholder="admin@ejemplo.com"
          class="w-full px-4 py-3 bg-dark border border-gray-700 rounded text-light focus:outline-none focus:border-primary transition-colors"
          :disabled="loading"
        />
      </div>

      <!-- Password field -->
      <div class="mb-6">
        <label for="password" class="block text-light mb-2">
          Contraseña
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-dark border border-gray-700 rounded text-light focus:outline-none focus:border-primary transition-colors"
            :disabled="loading"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-light transition-colors"
            :disabled="loading"
          >
            <Eye v-if="!showPassword" :size="20" />
            <EyeOff v-else :size="20" />
          </button>
        </div>
      </div>

      <!-- Forgot password -->
      <div class="mb-6 text-right">
        <button
          type="button"
          @click="showForgotPassword = true"
          class="text-sm text-primary hover:text-primary-light transition-colors"
          :disabled="loading"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        :disabled="loading"
      >
        <Loader2 v-if="loading" class="animate-spin mr-2" :size="20" />
        {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
      </button>
    </form>

    <!-- Forgot Password Modal -->
    <div
      v-if="showForgotPassword"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showForgotPassword = false"
    >
      <div class="bg-dark-lighter p-6 rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-light">Recuperar contraseña</h3>
          <button
            @click="showForgotPassword = false"
            class="text-gray-400 hover:text-light transition-colors"
          >
            <X :size="24" />
          </button>
        </div>

        <p class="text-gray-400 mb-4 text-sm">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form @submit.prevent="handlePasswordReset">
          <div class="mb-4">
            <label for="reset-email" class="block text-light mb-2">
              Correo electrónico
            </label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              placeholder="admin@ejemplo.com"
              class="w-full px-4 py-3 bg-dark border border-gray-700 rounded text-light focus:outline-none focus:border-primary transition-colors"
              :disabled="loading"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="animate-spin mr-2" :size="20" />
            {{ loading ? 'Enviando...' : 'Enviar enlace' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Eye, EyeOff, Loader2, X } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { signIn, sendPasswordResetEmail, loading, error, clearError } = useAuth();

// Form state
const formData = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const showForgotPassword = ref(false);
const resetEmail = ref('');
const successMessage = ref('');

/**
 * Handle login form submission
 */
const handleSubmit = async () => {
  clearError();
  successMessage.value = '';

  const success = await signIn(formData.value.email, formData.value.password);

  if (success) {
    // Redirect to intended page or dashboard
    const redirect = route.query.redirect as string;
    router.push(redirect || { name: 'admin-dashboard' });
  }
};

/**
 * Handle password reset
 */
const handlePasswordReset = async () => {
  clearError();
  successMessage.value = '';

  const success = await sendPasswordResetEmail(resetEmail.value);

  if (success) {
    successMessage.value = 'Se ha enviado un enlace de recuperación a tu correo electrónico';
    showForgotPassword.value = false;
    resetEmail.value = '';
  }
};
</script>
