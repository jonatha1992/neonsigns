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

.neon-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.neon-spinner .spinner-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-radius: 50%;
    
    &.ring-1 {
      border-top-color: #ff0080;
      border-right-color: rgba(255, 0, 128, 0.3);
      animation: neonSpin 2s linear infinite;
      box-shadow: 0 0 20px rgba(255, 0, 128, 0.5), inset 0 0 20px rgba(255, 0, 128, 0.2);
    }
    
    &.ring-2 {
      border-right-color: #00ffff;
      border-bottom-color: rgba(0, 255, 255, 0.3);
      animation: neonSpin 1.5s linear infinite reverse;
      transform: scale(0.75);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.2);
    }
    
    &.ring-3 {
      border-bottom-color: #00ff00;
      border-left-color: rgba(0, 255, 0, 0.3);
      animation: neonSpin 1s linear infinite;
      transform: scale(0.5);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.2);
    }
  }
  
.neon-spinner .spinner-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  color: #ffff00;
  filter: drop-shadow(0 0 15px #ffff00) drop-shadow(0 0 25px rgba(255, 255, 0, 0.5));
  animation: pulse 1.5s ease-in-out infinite;
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