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
              Consultar
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
              <img src="/logo_neon.png" alt="Cuadros NEON LD Logo" class="neon-logo-large" />
            </div>
            <div class="neon-sign main-sign">
              <span class="neon-text blue glitch-open">
                <span class="glitch-layer" data-text="OPEN">OPEN</span>
              </span>
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

<style scoped>
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
  background: radial-gradient(circle at 50% 50%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(128, 0, 255, 0.1) 0%, transparent 50%);
}

.neon-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 0, 128, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 128, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
  font-family: 'Orbitron', monospace;
  position: relative;
}

.hero-title .title-line {
  display: inline-flex;
  align-items: center;
  gap: clamp(10px, 2vw, 24px);
  white-space: nowrap;
}

.hero-title .hero-logo-inline {
  width: clamp(80px, 10vw, 140px);
  height: clamp(80px, 10vw, 140px);
  object-fit: contain;
  filter: brightness(1.25) saturate(1.4) drop-shadow(0 0 14px rgba(255, 20, 147, 0.85));
  animation: hero-neon-float 3s ease-in-out infinite;
  vertical-align: middle;
  margin-left: clamp(10px, 2vw, 28px);
}

@media (max-width: 768px) {
  .hero-title .hero-logo-inline {
    width: 60px;
    height: 60px;
    margin-left: 8px;
  }
}

.hero-title span {
  display: block;
}

.hero-title span:first-child,
.hero-title span:last-child {
  font-size: 0.7em;
  font-weight: 600;
  color: #cccccc;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #cccccc;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-subtitle strong {
  color: #ff0080;
  font-weight: 600;
}

.hero-features {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .hero-features {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #cccccc;
}

.feature-icon {
  color: #00ffff;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
  }
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .btn-lg {
    padding: 1.25rem 2.5rem;
    font-size: 1.05rem;
  }
}

.hero-visual {
  position: relative;
  height: 400px;
}

@media (max-width: 1024px) {
  .hero-visual {
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
  padding: 1.5rem 3rem;
  border: 3px solid;
  border-radius: 12px;
  background: transparent;
  backdrop-filter: none;
}

.neon-sign.main-sign {
  font-size: 3.5rem;
  top: -8%;
  right: 5%;
  z-index: 3;
  animation: float 3s ease-in-out infinite;
  padding: 2rem 5rem;
}

/* Glitch Effect for OPEN */
.glitch-open {
  position: relative;
  display: inline-block;
  animation: intense-flicker-open 6s infinite;
}

.glitch-layer {
  position: relative;
  display: inline-block;
}

.glitch-layer::before,
.glitch-layer::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.glitch-layer::before {
  color: #ff00ff;
  animation: glitch-open-1 6s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  text-shadow: 
    -3px 0 #ff00ff,
    0 0 10px #ff00ff,
    0 0 20px #ff00ff,
    0 0 30px #ff00ff;
}

.glitch-layer::after {
  color: #ffff00;
  animation: glitch-open-2 6s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
  text-shadow: 
    3px 0 #ffff00,
    0 0 10px #ffff00,
    0 0 20px #ffff00,
    0 0 30px #ffff00;
}

@keyframes glitch-open-1 {
  0%, 88%, 100% {
    opacity: 0;
    transform: translate(0, 0);
  }
  89% {
    opacity: 0.9;
    transform: translate(-6px, -4px);
  }
  90% {
    opacity: 0;
    transform: translate(4px, 3px);
  }
  91% {
    opacity: 1;
    transform: translate(-5px, 3px);
  }
  92% {
    opacity: 0;
    transform: translate(3px, -3px);
  }
  93% {
    opacity: 0.8;
    transform: translate(-4px, 2px);
  }
  94% {
    opacity: 0;
    transform: translate(2px, -2px);
  }
  95% {
    opacity: 0.7;
    transform: translate(-3px, 3px);
  }
}

@keyframes glitch-open-2 {
  0%, 88%, 100% {
    opacity: 0;
    transform: translate(0, 0);
  }
  89% {
    opacity: 0.8;
    transform: translate(5px, 4px);
  }
  90% {
    opacity: 0;
    transform: translate(-4px, -3px);
  }
  91% {
    opacity: 0.9;
    transform: translate(6px, -3px);
  }
  92% {
    opacity: 0;
    transform: translate(-3px, 4px);
  }
  93% {
    opacity: 0.7;
    transform: translate(5px, -2px);
  }
  94% {
    opacity: 0;
    transform: translate(-2px, 3px);
  }
  95% {
    opacity: 0.6;
    transform: translate(4px, -3px);
  }
}

@keyframes intense-flicker-open {
  0%, 87%, 100% {
    opacity: 1;
    filter: brightness(1);
  }
  /* Inicio del cortocircuito - parpadeo lento */
  88% {
    opacity: 0.4;
    filter: brightness(1.3);
  }
  89% {
    opacity: 0.1;
    filter: brightness(2);
  }
  90% {
    opacity: 0.6;
    filter: brightness(0.7);
  }
  91% {
    opacity: 0.2;
    filter: brightness(2.5);
  }
  92% {
    opacity: 0.05;
    filter: brightness(3);
  }
  /* Parpadeo más intenso */
  93% {
    opacity: 0.5;
    filter: brightness(1.5);
  }
  94% {
    opacity: 0.1;
    filter: brightness(2.8);
  }
  /* Recuperación gradual */
  95% {
    opacity: 0.7;
    filter: brightness(1.8);
  }
  96% {
    opacity: 0.9;
    filter: brightness(1.3);
  }
  97% {
    opacity: 1;
    filter: brightness(1.1);
  }
  98% {
    opacity: 1;
    filter: brightness(1);
  }
}

@media (max-width: 1024px) {
  .neon-sign.main-sign {
    font-size: 2.5rem;
    top: -6%;
    right: 3%;
    padding: 1.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .neon-sign.main-sign {
    font-size: 1.8rem;
    padding: 1rem 1.5rem;
    top: -2%;
    right: 2%;
  }
}

.neon-sign.secondary-sign {
  font-size: 1.5rem;
  top: 8%;
  left: 8%;
  z-index: 2;
  animation: float 3s ease-in-out infinite 1s;
  padding: 1rem 1.5rem;
}

@media (max-width: 1024px) {
  .neon-sign.secondary-sign {
    font-size: 1.2rem;
    top: 6%;
    left: 5%;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .neon-sign.secondary-sign {
    font-size: 0.9rem;
    padding: 0.125rem 0.25rem;
    top: 4%;
    left: 3%;
  }
}

.neon-sign.tertiary-sign {
  font-size: 2.2rem;
  bottom: 15%;
  left: 10%;
  z-index: 1;
  animation: float 3s ease-in-out infinite 2s;
  padding: 1.5rem 2rem;
}

@media (max-width: 1024px) {
  .neon-sign.tertiary-sign {
    font-size: 1.8rem;
    bottom: 12%;
    left: 5%;
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .neon-sign.tertiary-sign {
    font-size: 1.3rem;
    padding: 0.5rem 1rem;
    bottom: 8%;
    left: 3%;
  }
}

.neon-sign.logo-sign {
  top: 65%;
  right: 15%;
  transform: translateY(-50%);
  z-index: 4;
  animation: logo-float-right 3s ease-in-out infinite;
  padding: 0;
  border: none;
  background: transparent;
  animation-fill-mode: both;
}

@media (max-width: 1024px) {
  .neon-sign.logo-sign {
    right: 10%;
    top: 65%;
  }
}

@media (max-width: 768px) {
  .neon-sign.logo-sign {
    right: 5%;
    top: 65%;
  }
}

.neon-sign.logo-sign .neon-logo-large {
  width: 280px;
  height: 280px;
  object-fit: contain;
  filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 30px rgba(255, 20, 147, 1))
          drop-shadow(0 0 60px rgba(255, 20, 147, 0.8))
          drop-shadow(0 0 100px rgba(255, 20, 147, 0.4));
  animation: logo-pulse-enhanced 2.5s ease-in-out infinite;
}

@media (max-width: 1024px) {
  .neon-sign.logo-sign .neon-logo-large {
    width: 220px;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .neon-sign.logo-sign .neon-logo-large {
    width: 160px;
    height: 160px;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #888888;
}

.scroll-indicator .bounce {
  animation: bounce 2s infinite;
}

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