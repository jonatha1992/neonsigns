<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="neon-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text neon-text pink">Cargando...</p>
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
  background: rgba($dark-bg, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
}

.loading-content {
  text-align: center;
}

.neon-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto $spacing-lg;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  
  &:nth-child(1) {
    border-top-color: $neon-pink;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    border-top-color: $neon-blue;
    animation-delay: 0.5s;
    width: 90%;
    height: 90%;
    top: 5%;
    left: 5%;
  }
  
  &:nth-child(3) {
    border-top-color: $neon-purple;
    animation-delay: 1s;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
  }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>