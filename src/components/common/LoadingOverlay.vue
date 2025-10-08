<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="neon-spinner">
        <div class="spinner-ring ring-1"></div>
        <div class="spinner-ring ring-2"></div>
        <div class="spinner-ring ring-3"></div>
        <div class="spinner-core">⚡</div>
      </div>
      <p class="loading-text neon-text pink">Cargando trabajos...</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba($dark-bg, 0.95) 0%, rgba($dark-bg, 0.98) 100%);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
  animation: fadeIn 0.3s ease-out;
}

.loading-content {
  text-align: center;
}

.neon-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto $spacing-xl;
  
  .spinner-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-radius: 50%;
    
    &.ring-1 {
      border-top-color: $neon-pink;
      border-right-color: rgba($neon-pink, 0.3);
      animation: neonSpin 2s linear infinite;
      box-shadow: 0 0 20px rgba($neon-pink, 0.5), inset 0 0 20px rgba($neon-pink, 0.2);
    }
    
    &.ring-2 {
      border-right-color: $neon-blue;
      border-bottom-color: rgba($neon-blue, 0.3);
      animation: neonSpin 1.5s linear infinite reverse;
      transform: scale(0.75);
      box-shadow: 0 0 15px rgba($neon-blue, 0.4), inset 0 0 15px rgba($neon-blue, 0.2);
    }
    
    &.ring-3 {
      border-bottom-color: $neon-green;
      border-left-color: rgba($neon-green, 0.3);
      animation: neonSpin 1s linear infinite;
      transform: scale(0.5);
      box-shadow: 0 0 10px rgba($neon-green, 0.3), inset 0 0 10px rgba($neon-green, 0.2);
    }
  }
  
  .spinner-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
    color: $neon-yellow;
    filter: drop-shadow(0 0 15px $neon-yellow) drop-shadow(0 0 25px rgba($neon-yellow, 0.5));
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: $spacing-lg;
  animation: textGlow 2s ease-in-out infinite;
}

.loading-dots {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $neon-blue;
    box-shadow: 0 0 10px $neon-blue;
    animation: dotBounce 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes neonSpin {
  0% { 
    transform: rotate(0deg);
    filter: hue-rotate(0deg) brightness(1);
  }
  50% {
    filter: hue-rotate(180deg) brightness(1.2);
  }
  100% { 
    transform: rotate(360deg);
    filter: hue-rotate(360deg) brightness(1);
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

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