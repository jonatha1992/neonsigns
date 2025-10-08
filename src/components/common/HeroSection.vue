<template>
  <section class="hero">
    <div class="hero-background">
      <div class="neon-grid"></div>
    </div>
    
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="animate-float">Carteles de</span>
            <span class="neon-text pink animate-flicker">NEÓN</span>
            <span class="animate-float">Personalizados</span>
          </h1>
          
          <p class="hero-subtitle">
            Transforma tu espacio con diseños únicos que <strong>brillan</strong> con luz propia.
            Calidad profesional para tu negocio o hogar.
          </p>
          
          <div class="hero-features">
            <div class="feature">
              <Zap class="feature-icon" />
              <span>Diseños Únicos</span>
            </div>
            <div class="feature">
              <Palette class="feature-icon" />
              <span>100% Personalizable</span>
            </div>
            <div class="feature">
              <Shield class="feature-icon" />
              <span>Garantía de Calidad</span>
            </div>
          </div>
          
          <div class="hero-actions">
            <a 
              :href="whatsappUrl" 
              target="_blank" 
              class="btn btn-primary btn-lg"
            >
              <MessageCircle :size="20" />
              Cotizar por WhatsApp
            </a>
            
            <RouterLink to="/productos" class="btn btn-neon btn-lg">
              <Eye :size="20" />
              Ver Catálogo
            </RouterLink>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="neon-showcase">
            <div class="neon-sign main-sign">
              <span class="neon-text blue">OPEN</span>
            </div>
            <div class="neon-sign secondary-sign">
              <span class="neon-text green">24/7</span>
            </div>
            <div class="neon-sign tertiary-sign">
              <span class="neon-text purple">CAFÉ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <ChevronDown :size="24" class="bounce" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MessageCircle, Eye, Zap, Palette, Shield, ChevronDown } from 'lucide-vue-next'

// WhatsApp configuration
const whatsappNumber = '+5491123456789'
const whatsappMessage = '¡Hola! Me interesa cotizar un cartel de neón personalizado 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba($neon-pink, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba($neon-blue, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba($neon-purple, 0.1) 0%, transparent 50%);
}

.neon-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba($neon-pink, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba($neon-pink, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-3xl;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: $spacing-2xl;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: $spacing-lg;
  font-family: $font-neon;
  
  span {
    display: block;
    
    &:first-child,
    &:last-child {
      font-size: 0.7em;
      font-weight: 600;
      color: $text-secondary;
    }
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: $text-secondary;
  margin-bottom: $spacing-2xl;
  line-height: 1.6;
  
  strong {
    color: $neon-pink;
    font-weight: 600;
  }
}

.hero-features {
  display: flex;
  gap: $spacing-xl;
  margin-bottom: $spacing-2xl;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    gap: $spacing-md;
  }
}

.feature {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  
  &-icon {
    color: $neon-blue;
  }
}

.hero-actions {
  display: flex;
  gap: $spacing-lg;
  
  @media (max-width: $mobile) {
    flex-direction: column;
  }
}

.btn-lg {
  padding: $spacing-lg $spacing-2xl;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  justify-content: center;
}

.hero-visual {
  position: relative;
  height: 400px;
  
  @media (max-width: $tablet) {
    height: 300px;
  }
}

.neon-showcase {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neon-sign {
  position: absolute;
  padding: $spacing-lg $spacing-xl;
  border: 2px solid;
  border-radius: $border-radius-lg;
  background: rgba($dark-bg, 0.8);
  backdrop-filter: blur(10px);
  
  &.main-sign {
    font-size: 3rem;
    z-index: 3;
    animation: float 3s ease-in-out infinite;
  }
  
  &.secondary-sign {
    font-size: 1.5rem;
    top: 20%;
    right: 10%;
    z-index: 2;
    animation: float 3s ease-in-out infinite 1s;
  }
  
  &.tertiary-sign {
    font-size: 2rem;
    bottom: 20%;
    left: 5%;
    z-index: 1;
    animation: float 3s ease-in-out infinite 2s;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  color: $text-muted;
  
  .bounce {
    animation: bounce 2s infinite;
  }
}

// Animations
@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>