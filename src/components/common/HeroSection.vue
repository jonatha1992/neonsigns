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
            <span class="title-line">
              <span class="neon-text pink animate-flicker">NEÓN</span>
            </span>
            <span class="animate-float">Personalizados</span>
          </h1>
          
          <p class="hero-subtitle">
            Explora nuestros trabajos realizados y transforma tu espacio con diseños únicos que <strong>brillan</strong> con luz propia.
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
            
            <RouterLink to="/galeria" class="btn btn-neon btn-lg">
              <Eye :size="20" />
              Ver Galería
            </RouterLink>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="neon-showcase">
            <div class="neon-sign logo-sign">
              <img src="/logo_neon.png" alt="NEONSigns LD Logo" class="neon-logo-large" />
            </div>
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
const whatsappNumber = '+5491140916764'
const whatsappMessage = '¡Hola! Me interesa cotizar un cartel de neón personalizado (Zona Sur) 🌟'
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
  gap: $spacing-2xl;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: $spacing-xl;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
  position: relative;
  
  .title-line {
    display: inline-flex;
    align-items: center;
    gap: clamp(10px, 2vw, 24px);
    white-space: nowrap; // mantener NEÓN y el logo en la misma línea
  }
  
  .hero-logo-inline {
    width: clamp(80px, 10vw, 140px);
    height: clamp(80px, 10vw, 140px);
    object-fit: contain;
    filter: brightness(1.25) saturate(1.4) drop-shadow(0 0 14px rgba(255, 20, 147, 0.85));
    animation: hero-neon-float 3s ease-in-out infinite;
    vertical-align: middle;
    margin-left: clamp(10px, 2vw, 28px); // empujar más a la derecha

    @media (max-width: $mobile) {
      width: 60px;
      height: 60px;
      margin-left: 8px;
    }
  }
  
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
  margin-bottom: $spacing-xl;
  line-height: 1.6;
  
  strong {
    color: $neon-pink;
    font-weight: 600;
  }
}

.hero-features {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    gap: $spacing-sm;
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
  gap: $spacing-md;
  
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
  padding: $spacing-lg $spacing-2xl;
  border: 3px solid;
  border-radius: $border-radius-lg;
  background: transparent;
  backdrop-filter: none;

  &.main-sign {
    font-size: 3.5rem;
    top: -8%;
    right: 5%;
    z-index: 3;
    animation: float 3s ease-in-out infinite;
    padding: $spacing-xl $spacing-3xl;

    @media (max-width: $tablet) {
      font-size: 2.5rem;
      top: -6%;
      right: 3%;
      padding: $spacing-lg $spacing-xl;
    }

    @media (max-width: $mobile) {
      font-size: 1.8rem;
      padding: $spacing-md $spacing-lg;
      top: -2%;
      right: 2%;
    }
  }

  &.secondary-sign {
    font-size: 1.5rem;
    top: 8%;
    left: 8%;
    z-index: 2;
    animation: float 3s ease-in-out infinite 1s;
    padding: $spacing-md $spacing-lg;

    @media (max-width: $tablet) {
      font-size: 1.2rem;
      top: 6%;
      left: 5%;
      padding: $spacing-sm $spacing-md;
    }

    @media (max-width: $mobile) {
      font-size: 0.9rem;
      padding: $spacing-xs $spacing-sm;
      top: 4%;
      left: 3%;
    }
  }

  &.tertiary-sign {
    font-size: 2.2rem;
    bottom: 15%;
    left: 10%;
    z-index: 1;
    animation: float 3s ease-in-out infinite 2s;
    padding: $spacing-lg $spacing-xl;

    @media (max-width: $tablet) {
      font-size: 1.8rem;
      bottom: 12%;
      left: 5%;
      padding: $spacing-md $spacing-lg;
    }

    @media (max-width: $mobile) {
      font-size: 1.3rem;
      padding: $spacing-sm $spacing-md;
      bottom: 8%;
      left: 3%;
    }
  }

  &.logo-sign {
    top: 65%;
    right: 15%;
    transform: translateY(-50%);
    z-index: 4;
    animation: logo-float-right 3s ease-in-out infinite;
    padding: 0;
    border: none;
    background: transparent;
    animation-fill-mode: both;

    @media (max-width: $tablet) {
      right: 10%;
      top: 65%;
    }

    @media (max-width: $mobile) {
      right: 5%;
      top: 65%;
    }

    .neon-logo-large {
      width: 280px;
      height: 280px;
      object-fit: contain;
      filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 30px rgba(255, 20, 147, 1))
              drop-shadow(0 0 60px rgba(255, 20, 147, 0.8))
              drop-shadow(0 0 100px rgba(255, 20, 147, 0.4));
      animation: logo-pulse-enhanced 2.5s ease-in-out infinite;

      @media (max-width: $tablet) {
        width: 220px;
        height: 220px;
      }

      @media (max-width: $mobile) {
        width: 160px;
        height: 160px;
      }
    }
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

@keyframes hero-neon-float {
  0% {
    transform: translateY(0px) rotate(0deg);
    filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 20px rgba(255, 20, 147, 0.9));
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
    filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 30px rgba(255, 20, 147, 1));
  }
  100% {
    transform: translateY(0px) rotate(0deg);
    filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 20px rgba(255, 20, 147, 0.9));
  }
}

@keyframes logo-pulse {
  0%, 100% {
    filter: brightness(1.4) saturate(1.5) drop-shadow(0 0 20px rgba(255, 20, 147, 1))
            drop-shadow(0 0 40px rgba(255, 20, 147, 0.6));
  }
  50% {
    filter: brightness(1.6) saturate(1.7) drop-shadow(0 0 30px rgba(255, 20, 147, 1))
            drop-shadow(0 0 50px rgba(255, 20, 147, 0.8));
  }
}

@keyframes logo-pulse-enhanced {
  0% {
    filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 30px rgba(255, 20, 147, 1))
            drop-shadow(0 0 60px rgba(255, 20, 147, 0.8))
            drop-shadow(0 0 100px rgba(255, 20, 147, 0.4));
  }
  33% {
    filter: brightness(1.7) saturate(1.8) drop-shadow(0 0 40px rgba(255, 20, 147, 1))
            drop-shadow(0 0 80px rgba(255, 20, 147, 0.9))
            drop-shadow(0 0 120px rgba(255, 20, 147, 0.5));
  }
  66% {
    filter: brightness(1.8) saturate(1.9) drop-shadow(0 0 50px rgba(255, 20, 147, 1))
            drop-shadow(0 0 100px rgba(255, 20, 147, 1))
            drop-shadow(0 0 150px rgba(255, 20, 147, 0.6));
  }
  100% {
    filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 30px rgba(255, 20, 147, 1))
            drop-shadow(0 0 60px rgba(255, 20, 147, 0.8))
            drop-shadow(0 0 100px rgba(255, 20, 147, 0.4));
  }
}

@keyframes logo-float {
  0% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
}

@keyframes logo-float-right {
  0% {
    transform: translateY(-50%) translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-50%) translateY(-8px) rotate(2deg) scale(1.02);
  }
  50% {
    transform: translateY(-50%) translateY(-15px) rotate(0deg) scale(1.05);
  }
  75% {
    transform: translateY(-50%) translateY(-8px) rotate(-2deg) scale(1.02);
  }
  100% {
    transform: translateY(-50%) translateY(0px) rotate(0deg) scale(1);
  }
}
</style>