<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="neon-text pink">Galería</span> de Trabajos
        </h1>
        <p class="page-subtitle">
          Explora nuestros trabajos realizados y diseños únicos de carteles de neón
        </p>
      </div>
      

      
      <!-- Gallery Info -->
      <div class="results-info">
        <p>{{ totalProducts }} trabajos realizados</p>
        
        <div class="whatsapp-cta">
          <a :href="whatsappUrl" target="_blank" class="btn btn-neon">
            <MessageCircle :size="18" />
            Solicitar Cotización
          </a>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div v-if="loading" class="loading-state">
        <div class="neon-spinner">
          <div class="spinner-ring ring-1"></div>
          <div class="spinner-ring ring-2"></div>
          <div class="spinner-ring ring-3"></div>
          <div class="spinner-core">⚡</div>
        </div>
        <p class="loading-text neon-text pink">Cargando galería de trabajos...</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div v-else-if="allProducts.length === 0" class="empty-state">
        <Package :size="64" class="empty-icon" />
        <h3>Cargando trabajos...</h3>
        <p>Estamos preparando nuestra galería de trabajos realizados.</p>
      </div>
      
        <div v-else class="products-grid">
          <ProductCard 
            v-for="(product, index) in allProducts" 
            :key="product.id" 
            :product="product" 
            :class="`fade-in-up delay-${(index % 8) * 50}`"
            :style="{ '--animation-delay': `${(index % 8) * 50}ms` }"
          />
        </div>      <!-- Custom Work CTA -->
      <div v-if="allProducts.length > 0" class="load-more-section">
        <p class="load-more-text">
          ¿Te gusta algún diseño? Podemos crear algo similar o completamente personalizado para ti.
        </p>
        <a :href="whatsappCustomUrl" target="_blank" class="btn btn-primary btn-lg">
          <Palette :size="20" />
          Solicitar Trabajo Personalizado
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { MessageCircle, Package, Palette } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const productsStore = useProductsStore()

const loading = computed(() => productsStore.loading)
const allProducts = computed(() => productsStore.products)
const totalProducts = computed(() => productsStore.products.length)



// WhatsApp URLs
const whatsappNumber = '+5491140916764'

const whatsappUrl = computed(() => {
  const message = 'Hola! Vi su galería de trabajos y me interesa solicitar una cotización para un cartel de neón (Zona Sur). ¿Podrían ayudarme? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const whatsappCustomUrl = computed(() => {
    const message = 'Hola! Me interesan sus trabajos personalizados (Zona Sur). ¿Podrían ayudarme a crear algo único? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})



onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})
</script>

<style lang="scss" scoped>
.products-page {
  padding: $spacing-xl 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-3xl;
}

.page-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
}

.page-subtitle {
  font-size: 1.3rem;
  color: $text-secondary;
  max-width: 600px;
  margin: 0 auto;
}

.filters-section {
  background: rgba($card-bg, 0.5);
  border: 1px solid rgba($neon-blue, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  
  h3 {
    color: $text-primary;
    font-weight: 600;
    margin: 0;
  }
}

.clear-filters {
  background: transparent;
  border: 1px solid rgba($text-muted, 0.4);
  color: $text-muted;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 0.9rem;
  transition: all $transition-normal;
  
  &:hover {
    color: $text-primary;
    border-color: rgba($text-primary, 0.4);
  }
}

.filters-grid {
  display: grid;
  gap: $spacing-xl;
  
  @media (min-width: $tablet) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.filter-group {
  label {
    display: block;
    color: $text-primary;
    font-weight: 500;
    margin-bottom: $spacing-sm;
  }
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba($neon-blue, 0.4);
  color: $neon-blue;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all $transition-normal;
  
  &:hover {
    background: rgba($neon-blue, 0.1);
  }
  
  &.active {
    background: $neon-blue;
    color: $dark-bg;
    font-weight: 600;
  }
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  
  input[type="checkbox"] {
    accent-color: $neon-pink;
  }
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    gap: $spacing-md;
    text-align: center;
  }
  
  p {
    color: $text-secondary;
    margin: 0;
  }
}

.whatsapp-cta .btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: $spacing-3xl;
}

.loading-state {
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
}

.empty-state {
  .empty-icon {
    color: $text-muted;
    margin-bottom: $spacing-lg;
  }
  
  h3 {
    color: $text-primary;
    font-size: 1.5rem;
    margin-bottom: $spacing-md;
  }
  
  p {
    color: $text-secondary;
    margin-bottom: $spacing-xl;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-2xl;
}

.load-more-section {
  text-align: center;
  padding: $spacing-3xl;
  background: linear-gradient(135deg, rgba($neon-purple, 0.1) 0%, rgba($neon-pink, 0.1) 100%);
  border-radius: $border-radius-xl;
  border: 1px solid rgba($neon-purple, 0.2);
}

.load-more-text {
  font-size: 1.1rem;
  color: $text-secondary;
  margin-bottom: $spacing-xl;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.btn-lg {
  padding: $spacing-lg $spacing-2xl;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  
  &:hover {
    transform: translateY(-2px);
  }
}

// Keyframe animations
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

// Animaciones stagger para las cards
.fade-in-up {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  animation: fadeInUpCard 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--animation-delay);
}

@keyframes fadeInUpCard {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Clases de delay específicas
@for $i from 0 through 10 {
  .delay-#{$i * 50} {
    animation-delay: #{$i * 50}ms;
  }
}
</style>