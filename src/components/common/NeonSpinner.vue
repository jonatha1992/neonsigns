<template>
  <div 
    class="neon-spinner" 
    :class="[`size-${size}`, `color-${color}`, { inline }]"
  >
    <div class="spinner-ring ring-1"></div>
    <div class="spinner-ring ring-2"></div>
    <div class="spinner-core">⚡</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  color?: 'pink' | 'cyan' | 'purple' | 'white'
  inline?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'pink',
  inline: false
})
</script>

<style scoped>
.neon-spinner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neon-spinner.inline {
  display: inline-flex;
}

/* Tamaños */
.neon-spinner.size-small {
  width: 20px;
  height: 20px;
}

.neon-spinner.size-medium {
  width: 32px;
  height: 32px;
}

.neon-spinner.size-large {
  width: 48px;
  height: 48px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-radius: 50%;
}

/* Small size adjustments */
.neon-spinner.size-small .spinner-ring {
  border-width: 1.5px;
}

.neon-spinner.size-small .spinner-core {
  font-size: 0.7rem;
}

/* Medium size (default) */
.neon-spinner.size-medium .spinner-ring {
  border-width: 2px;
}

.neon-spinner.size-medium .spinner-core {
  font-size: 1rem;
}

/* Large size adjustments */
.neon-spinner.size-large .spinner-ring {
  border-width: 3px;
}

.neon-spinner.size-large .spinner-core {
  font-size: 1.5rem;
}

/* Color variants - Pink */
.neon-spinner.color-pink .ring-1 {
  border-top-color: #ff0080;
  border-right-color: rgba(255, 0, 128, 0.3);
  animation: neonSpin 1.5s linear infinite;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.5);
}

.neon-spinner.color-pink .ring-2 {
  border-bottom-color: #ff0080;
  border-left-color: rgba(255, 0, 128, 0.2);
  animation: neonSpin 1s linear infinite reverse;
  transform: scale(0.7);
  box-shadow: 0 0 8px rgba(255, 0, 128, 0.3);
}

.neon-spinner.color-pink .spinner-core {
  color: #ff0080;
  filter: drop-shadow(0 0 8px #ff0080);
}

/* Color variants - Cyan */
.neon-spinner.color-cyan .ring-1 {
  border-top-color: #00ffff;
  border-right-color: rgba(0, 255, 255, 0.3);
  animation: neonSpin 1.5s linear infinite;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.neon-spinner.color-cyan .ring-2 {
  border-bottom-color: #00ffff;
  border-left-color: rgba(0, 255, 255, 0.2);
  animation: neonSpin 1s linear infinite reverse;
  transform: scale(0.7);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
}

.neon-spinner.color-cyan .spinner-core {
  color: #00ffff;
  filter: drop-shadow(0 0 8px #00ffff);
}

/* Color variants - Purple */
.neon-spinner.color-purple .ring-1 {
  border-top-color: #8000ff;
  border-right-color: rgba(128, 0, 255, 0.3);
  animation: neonSpin 1.5s linear infinite;
  box-shadow: 0 0 10px rgba(128, 0, 255, 0.5);
}

.neon-spinner.color-purple .ring-2 {
  border-bottom-color: #8000ff;
  border-left-color: rgba(128, 0, 255, 0.2);
  animation: neonSpin 1s linear infinite reverse;
  transform: scale(0.7);
  box-shadow: 0 0 8px rgba(128, 0, 255, 0.3);
}

.neon-spinner.color-purple .spinner-core {
  color: #8000ff;
  filter: drop-shadow(0 0 8px #8000ff);
}

/* Color variants - White */
.neon-spinner.color-white .ring-1 {
  border-top-color: #ffffff;
  border-right-color: rgba(255, 255, 255, 0.3);
  animation: neonSpin 1.5s linear infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.neon-spinner.color-white .ring-2 {
  border-bottom-color: #ffffff;
  border-left-color: rgba(255, 255, 255, 0.2);
  animation: neonSpin 1s linear infinite reverse;
  transform: scale(0.7);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.neon-spinner.color-white .spinner-core {
  color: #ffffff;
  filter: drop-shadow(0 0 8px #ffffff);
}

.spinner-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes neonSpin {
  0% { 
    transform: rotate(0deg);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% { 
    transform: rotate(360deg);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>