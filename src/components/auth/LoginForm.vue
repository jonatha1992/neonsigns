<template>
  <div class="login-form-wrapper">
    <form @submit.prevent="handleSubmit" class="login-form">
      <!-- Error message -->
      <div v-if="error" class="alert alert-error">
        <AlertCircle :size="18" />
        <span>{{ error }}</span>
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="alert alert-success">
        <CheckCircle :size="18" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- Email field -->
      <div class="form-group">
        <label for="email" class="form-label">
          <Mail :size="16" />
          <span>Correo electrónico</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          placeholder="admin@ejemplo.com"
          class="form-input"
          :disabled="loading"
          autocomplete="email"
        />
      </div>

      <!-- Password field -->
      <div class="form-group">
        <label for="password" class="form-label">
          <Lock :size="16" />
          <span>Contraseña</span>
        </label>
        <div class="password-input-wrapper">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="form-input"
            :disabled="loading"
            autocomplete="current-password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="password-toggle"
            :disabled="loading"
            tabindex="-1"
          >
            <Eye v-if="!showPassword" :size="18" />
            <EyeOff v-else :size="18" />
          </button>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="loading"
      >
        <Loader2 v-if="loading" class="spinner" :size="20" />
        <LogIn v-else :size="20" />
        <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { signIn, loading, error, clearError } = useAuth();

// Form state
const formData = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
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
</script>

<style lang="scss" scoped>
.login-form-wrapper {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.login-form {
  width: 100%;
}

.alert {
  margin-bottom: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &-error {
    background: linear-gradient(135deg, rgba(#ef4444, 0.15), rgba(#ef4444, 0.08));
    border: 1.5px solid rgba(#ef4444, 0.4);
    color: #fca5a5;
  }
  
  &-success {
    background: linear-gradient(135deg, rgba(#10b981, 0.15), rgba(#10b981, 0.08));
    border: 1.5px solid rgba(#10b981, 0.4);
    color: #6ee7b7;
  }
}

.form-group {
  margin-bottom: 1rem;

  &:last-of-type {
    margin-bottom: 1.25rem;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: $text-primary;
  margin-bottom: 0.375rem;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: rgba($dark-bg, 0.6);
  border: 2px solid rgba($neon-purple, 0.2);
  border-radius: 0.5rem;
  color: $text-primary;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: $neon-pink;
    background: rgba($dark-bg, 0.8);
    box-shadow: 
      0 0 0 4px rgba($neon-pink, 0.1),
      0 0 20px rgba($neon-pink, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: rgba($text-secondary, 0.5);
  }
}

.password-input-wrapper {
  position: relative;

  .form-input {
    padding-right: 3.5rem;
  }
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: $text-secondary;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  
  &:hover {
    color: $neon-purple;
    background: rgba($neon-purple, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, $neon-pink, $neon-purple);
  color: white;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  box-shadow: 
    0 4px 15px rgba($neon-pink, 0.3),
    0 0 20px rgba($neon-pink, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba($neon-pink, 0.4),
      0 0 30px rgba($neon-pink, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: $mobile) {
  .form-input {
    padding: 0.625rem 0.75rem;
    font-size: 16px; // Previene zoom en iOS
  }

  .password-input-wrapper .form-input {
    padding-right: 2.5rem;
  }

  .submit-btn {
    padding: 0.75rem 0.875rem;
  }
}
</style>

