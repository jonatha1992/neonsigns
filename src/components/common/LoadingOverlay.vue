<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <NeonSpinner size="large" color="pink" />
      <p class="loading-text neon-text pink">Cargando trabajos...</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NeonSpinner from './NeonSpinner.vue'
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.loading-content {
  text-align: center;
}

/* Spinner styles removed - now using NeonSpinner component */

.loading-content {
  text-align: center;
}

.loading-content > :first-child {
  margin: 0 auto 2rem;
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: textGlow 2s ease-in-out infinite;
}

.loading-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ffff;
  box-shadow: 0 0 10px #00ffff;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Spinner animations removed - now using NeonSpinner component */

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px currentColor;
  }
  50% {
    text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.7;
  }
  40% {
    transform: scale(1.2) translateY(-10px);
    opacity: 1;
    box-shadow: 0 0 15px currentColor;
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>