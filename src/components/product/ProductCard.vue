<template>
  <div class="product-card">
    <div class="product-image" @click="openModal">
      <!-- Spinner mientras carga -->
      <div v-if="imageLoading && product.images && product.images[0]" class="image-loading">
        <div class="spinner"></div>
        <p class="loading-text">Cargando...</p>
      </div>
      
      <img
        v-if="product.images && product.images[0]"
        :src="product.images[0]"
        :alt="product.name"
        class="product-img"
        :class="{ 'loading': imageLoading }"
        loading="lazy"
        @load="onImageLoad"
        @error="onImageError"
      />
      <div v-else class="image-placeholder">
        <Zap :size="48" class="placeholder-icon" />
        <p>{{ product.name }}</p>
      </div>
      <div class="image-overlay">
        <div class="overlay-icon">
          <Eye :size="24" />
        </div>
        <span class="overlay-text">Ver imagen completa</span>
      </div>
      <div class="product-badges">
        <span v-if="product.featured" class="badge featured">Destacado</span>

        <span class="badge category">{{ categoryName }}</span>
      </div>
    </div>
    
    <div class="product-info">
      <div class="product-category">{{ categoryName }}</div>
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <!-- Sección de precio -->
      <div class="product-pricing">
        <span class="current-price">${{ formatPrice(product.price) }}</span>

      </div>
    </div>
    
    <div class="product-actions">
      <a 
        :href="whatsappProductUrl" 
        target="_blank" 
        class="btn btn-neon btn-full"
      >
        <MessageCircle :size="18" />
        Cotizar Similar
      </a>
    </div>
    
    <!-- Modal para imagen completa -->
    <ImageModal
      :is-open="isModalOpen"
      :image="product.images?.[0] || ''"
      :title="product.name"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Zap, Star, MessageCircle, Eye } from 'lucide-vue-next'
import ImageModal from '@/components/common/ImageModal.vue'
import type { Product } from '@/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const isModalOpen = ref(false)
const imageLoading = ref(true)
const imageError = ref(false)

const openModal = () => {
  if (props.product.images && props.product.images[0]) {
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const onImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const onImageError = () => {
  imageLoading.value = false
  imageError.value = true
}

// Inicializar estado de carga
onMounted(() => {
  if (props.product.images && props.product.images[0]) {
    imageLoading.value = true
  } else {
    imageLoading.value = false
  }
})

const categoryName = computed(() => {
  const categories: Record<string, string> = {
    business: 'Negocios',
    home: 'Hogar',
    custom: 'Personalizado',
    decorative: 'Decorativo',
    signs: 'Señales',
    letters: 'Letras'
  }
  return categories[props.product.category] || 'Producto'
})

// Función para formatear precios
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappProductUrl = computed(() => {
  const message = `Hola! Me interesa el trabajo "${props.product.name}" (Zona Sur). ¿Podrían darme más información y disponibilidad? 🌟`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})
</script>

<style scoped>
.product-card {
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.8s ease-out;
  position: relative;
}

@media (max-width: 768px) {
  .product-card {
    border-radius: 8px;
  }
  
  .product-image {
    height: 120px;
  }
  
  .product-info {
    padding: 0.625rem;
  }
  
  .product-actions {
    padding: 0.625rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .product-name {
    font-size: 0.9rem;
  }
  
  .product-description {
    font-size: 0.75rem;
  }
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 255, 255, 0.1), 
    transparent
  );
  transition: left 0.6s ease;
  z-index: 1;
  pointer-events: none;
}

.product-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 
    0 0 10px rgba(0, 255, 255, 0.5),
    0 25px 50px rgba(255, 0, 128, 0.3),
    0 0 0 1px rgba(255, 0, 128, 0.4),
    inset 0 0 50px rgba(0, 255, 255, 0.1);
  border-color: rgba(255, 0, 128, 0.8);
}

.product-card:hover::before {
  left: 100%;
}

.product-card:hover .product-img {
  transform: scale(1.1) rotate(1deg);
  filter: brightness(1.2) saturate(1.3) contrast(1.1);
}

.product-card:hover .product-name {
  color: #ff0080;
  text-shadow: 0 0 15px rgba(255, 0, 128, 0.6);
  transform: translateY(-2px);
}

.product-card:hover .badge {
  transform: scale(1.15) translateY(-2px);
  box-shadow: 0 0 20px currentColor;
}

.product-card:hover .product-category {
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.product-card:hover .product-pricing {
  border-color: rgba(0, 255, 255, 0.4);
  background: rgba(26, 26, 26, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 255, 255, 0.2);
}

.product-card:hover .current-price {
  color: #00d4ff;
}

.product-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  /* Aspect ratio para mantener proporciones */
  @media (min-width: 768px) {
    aspect-ratio: 16 / 10;
    height: auto;
  }
}

.product-image:hover .image-overlay {
  opacity: 1;
}

.product-image:hover .product-img {
  transform: scale(1.05);
  filter: brightness(0.8);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.9) saturate(0.9);
}

.product-img.loading {
  opacity: 0;
  transform: scale(1.1);
}

.product-img:not(.loading) {
  opacity: 1;
  transform: scale(1);
}

/* Spinner de carga */
.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%);
  backdrop-filter: blur(4px);
  z-index: 2;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 255, 255, 0.1);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

@keyframes spin {
  0% { 
    transform: rotate(0deg);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  }
  100% { 
    transform: rotate(360deg);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
}

.loading-text {
  color: #00ffff;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.8;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.15s ease;
  backdrop-filter: blur(4px);
}

.image-overlay .overlay-icon {
  color: #00ffff;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 10px currentColor);
  animation: float 2s ease-in-out infinite;
}

.image-overlay .overlay-text {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  padding: 0 1rem;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.image-placeholder {
  color: rgba(0, 255, 255, 0.6);
}

.placeholder-icon {
  filter: drop-shadow(0 0 10px currentColor);
}

.product-badges {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.badge {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.badge.featured {
  background: linear-gradient(45deg, #ff0080, #ff3399);
  color: #0a0a0a;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.4);
  animation: neonPulse 2s ease-in-out infinite;
}



.badge.category {
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.9), rgba(0, 255, 255, 0.7));
  color: white;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
}

@keyframes neonPulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.6), 0 0 30px rgba(255, 0, 128, 0.3);
  }
}

.product-info {
  padding: 0.75rem;
  flex: 1;
}

.product-category {
  color: #00ffff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.product-name {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
  line-height: 1.2;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-description {
  color: #cccccc;
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



.product-pricing {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.375rem;
  margin-bottom: 0.375rem;
  padding: 0.25rem 0.375rem;
  background: rgba(26, 26, 26, 0.8);
  border-radius: 3px;
  border: 1px solid rgba(136, 136, 136, 0.2);
  backdrop-filter: blur(10px);
}

.current-price {
  font-size: 1rem;
  font-weight: 700;
  color: #00ffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.025em;
}





.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars svg {
  color: #888888;
}

.stars svg.filled {
  color: #ffff00;
  fill: currentColor;
}

.rating-text {
  font-size: 0.85rem;
  color: #cccccc;
}

.product-actions {
  padding: 0.625rem;
  border-top: 1px solid rgba(136, 136, 136, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.btn-full {
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-full::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.btn-full:hover::before {
  left: 100%;
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(204, 204, 204, 0.4);
  color: #cccccc;
}

.btn-secondary:hover {
  background: rgba(204, 204, 204, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(204, 204, 204, 0.2);
}
</style>