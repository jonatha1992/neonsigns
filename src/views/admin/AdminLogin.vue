<template>
  <div class="login-modal-backdrop">
    <!-- Close button -->
    <router-link to="/" class="close-button" aria-label="Volver al inicio">
      <X :size="24" />
    </router-link>

    <!-- Modal Container -->
    <div class="login-modal">
      <!-- Logo Section -->
      <div class="modal-logo">
        <div class="logo-glow"></div>
        <img
          src="/logo_neon.png"
          alt="Neon Signs LD"
          class="neon-logo"
        />
        <h1 class="brand-title">
          <span class="neon-text pink">NEON</span><span class="text-white">Signs</span> <span class="text-white">LD</span>
        </h1>
        <p class="brand-subtitle">Panel de Administración</p>
      </div>

      <!-- Login Form -->
      <div class="modal-form">
        <LoginForm />
      </div>

      <!-- Footer Info -->
      <div class="modal-footer">
        <p class="footer-text">
          Acceso restringido solo para administradores
        </p>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="decorative-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<style lang="scss" scoped>
.login-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba($dark-bg, 0.98) 0%, 
    rgba($darker-bg, 0.95) 50%,
    rgba($dark-bg, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
  z-index: 9999;
  
  // Animated gradient background
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba($neon-pink, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba($neon-purple, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba($neon-blue, 0.05) 0%, transparent 60%);
    animation: gradient-shift 15s ease infinite;
    pointer-events: none;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.close-button {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba($card-bg, 0.9), rgba($card-bg, 0.7));
  border: 2px solid rgba($neon-pink, 0.3);
  border-radius: 50%;
  color: $text-secondary;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, rgba($neon-pink, 0.2), rgba($neon-purple, 0.2));
    border-color: $neon-pink;
    color: $neon-pink;
    transform: rotate(90deg) scale(1.1);
    box-shadow: 
      0 0 30px rgba($neon-pink, 0.4),
      0 8px 25px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: $mobile) {
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
  }
}

.login-modal {
  position: relative;
  background: linear-gradient(145deg, 
    rgba($card-bg, 0.95) 0%, 
    rgba($darker-bg, 0.9) 100%
  );
  border: 1px solid rgba($neon-pink, 0.3);
  border-radius: 1.5rem;
  padding: 1.5rem 1.5rem;
  max-width: 380px;
  width: 100%;
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba($neon-pink, 0.2),
    0 0 80px rgba($neon-pink, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  animation: modal-appear 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;

  @media (max-width: $mobile) {
    padding: 1.25rem 1rem;
    border-radius: 1.25rem;
    max-width: 100%;
  }
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-logo {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;

  .logo-glow {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(
      circle,
      rgba($neon-pink, 0.3) 0%,
      rgba($neon-purple, 0.2) 50%,
      transparent 70%
    );
    filter: blur(30px);
    animation: glow-pulse 3s ease-in-out infinite;
    pointer-events: none;
  }

  .neon-logo {
    width: 90px;
    height: auto;
    margin: 0 auto 0.75rem;
    display: block;
    filter: drop-shadow(0 0 20px rgba($neon-pink, 0.5));
    animation: logo-float 4s ease-in-out infinite;
    position: relative;
    z-index: 1;

    @media (max-width: $mobile) {
      width: 80px;
    }
  }
}

@keyframes logo-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.1);
  }
}

.brand-title {
  font-size: 1.75rem;
  font-weight: 900;
  font-family: $font-neon;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
  position: relative;
  z-index: 1;

  .neon-text {
    display: inline-block;
    animation: neon-flicker 3s ease-in-out infinite;
  }

  .text-white {
    color: $text-primary;
  }

  @media (max-width: $mobile) {
    font-size: 1.5rem;
  }
}

@keyframes neon-flicker {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba($neon-pink, 0.8),
      0 0 20px rgba($neon-pink, 0.6),
      0 0 30px rgba($neon-pink, 0.4);
  }
  50% {
    text-shadow: 
      0 0 15px rgba($neon-pink, 1),
      0 0 25px rgba($neon-pink, 0.8),
      0 0 40px rgba($neon-pink, 0.6);
  }
}

.brand-subtitle {
  color: $text-secondary;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;

  @media (max-width: $mobile) {
    font-size: 0.75rem;
  }
}

.modal-form {
  margin-bottom: 1rem;
}

.modal-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba($neon-purple, 0.15);

  .footer-text {
    color: $text-secondary;
    font-size: 0.75rem;
    margin: 0;
    opacity: 0.7;
  }
}

// Decorative circles
.decorative-circles {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  .circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    animation: float-circles 20s ease-in-out infinite;

    &.circle-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba($neon-pink, 0.15), transparent);
      top: 10%;
      left: 5%;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba($neon-purple, 0.12), transparent);
      bottom: 15%;
      right: 10%;
      animation-delay: -7s;
    }

    &.circle-3 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba($neon-blue, 0.1), transparent);
      top: 50%;
      left: 50%;
      animation-delay: -14s;
    }
  }
}

@keyframes float-circles {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(20px, -20px);
  }
  50% {
    transform: translate(-20px, 20px);
  }
  75% {
    transform: translate(20px, 20px);
  }
}

// Responsive adjustments
@media (max-width: $mobile) {
  .login-modal-backdrop {
    padding: 1rem;
  }

  .decorative-circles .circle {
    &.circle-1 {
      width: 200px;
      height: 200px;
    }

    &.circle-2 {
      width: 180px;
      height: 180px;
    }

    &.circle-3 {
      width: 150px;
      height: 150px;
    }
  }
}
</style>

