<template>
  <div class="product-card">
    <div class="product-image" @click="openModal">
      <img 
        v-if="product.images && product.images[0]" 
        :src="product.images[0]" 
        :alt="product.name"
        class="product-img"
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
      

      
      <div class="product-rating">
        <div class="stars">
          <Star 
            v-for="star in 5" 
            :key="star"
            :size="16"
            :class="{ filled: star <= Math.floor(product.rating) }"
          />
        </div>
        <span class="rating-text">{{ product.rating }} ({{ product.reviews }})</span>
      </div>
    </div>
    
    <div class="product-actions">
      <RouterLink 
        :to="`/trabajo/${product.id}`" 
        class="btn btn-secondary btn-full"
      >
        <Eye :size="18" />
        Ver Trabajo
      </RouterLink>
      
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
      :description="product.description"
      :category="product.category"
      :product-id="product.id"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Zap, Star, MessageCircle, Eye } from 'lucide-vue-next'
import ImageModal from '@/components/common/ImageModal.vue'
import type { Product } from '@/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const isModalOpen = ref(false)

const openModal = () => {
  if (props.product.images && props.product.images[0]) {
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const categoryName = computed(() => {
  const categories = {
    business: 'Negocios',
    home: 'Hogar',
    custom: 'Personalizado',
    decorative: 'Decorativo',
    signs: 'Señales',
    letters: 'Letras'
  }
  return categories[props.product.category] || 'Producto'
})

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappProductUrl = computed(() => {
  const message = `Hola! Me interesa el trabajo "${props.product.name}" (Zona Sur). ¿Podrían darme más información y disponibilidad? 🌟`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})
</script>

<style lang="scss" scoped>
.product-card {
  background: $card-bg;
  border-radius: $border-radius-lg;
  border: 1px solid rgba($neon-blue, 0.2);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      $neon-glow-md rgba($neon-blue, 0.4),
      0 20px 40px rgba($neon-pink, 0.2),
      0 0 0 1px rgba($neon-pink, 0.3);
    border-color: rgba($neon-pink, 0.6);
    
    .product-img {
      transform: scale(1.1);
      filter: brightness(1.1) saturate(1.2);
    }
    
    .product-name {
      color: $neon-pink;
      text-shadow: 0 0 10px rgba($neon-pink, 0.5);
    }
    
    .badge {
      transform: scale(1.1);
      box-shadow: 0 0 15px currentColor;
    }
  }
}

.product-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, rgba($neon-pink, 0.1) 0%, rgba($neon-blue, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  
  &:hover .image-overlay {
    opacity: 1;
  }
  
  &:hover .product-img {
    transform: scale(1.05);
    filter: brightness(0.8);
  }
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.9) saturate(0.9);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($dark-bg, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  
  .overlay-icon {
    color: $neon-blue;
    margin-bottom: $spacing-sm;
    filter: drop-shadow(0 0 10px currentColor);
    animation: float 2s ease-in-out infinite;
  }
  
  .overlay-text {
    color: $text-primary;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    padding: 0 $spacing-md;
  }
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
  color: rgba($neon-blue, 0.6);
}

.placeholder-icon {
  filter: drop-shadow(0 0 10px currentColor);
}

.product-badges {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.badge {
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &.featured {
    background: linear-gradient(45deg, $neon-pink, lighten($neon-pink, 10%));
    color: $dark-bg;
    box-shadow: 0 0 10px rgba($neon-pink, 0.4);
    animation: neonPulse 2s ease-in-out infinite;
  }
  
  &.discount {
    background: linear-gradient(45deg, $neon-green, lighten($neon-green, 10%));
    color: $dark-bg;
    box-shadow: 0 0 10px rgba($neon-green, 0.4);
  }
  
  &.category {
    background: linear-gradient(45deg, rgba($neon-blue, 0.9), rgba($neon-blue, 0.7));
    color: white;
    border: 1px solid rgba($neon-blue, 0.3);
    box-shadow: 0 0 8px rgba($neon-blue, 0.3);
  }
}

@keyframes neonPulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba($neon-pink, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba($neon-pink, 0.6), 0 0 30px rgba($neon-pink, 0.3);
  }
}

.product-info {
  padding: $spacing-md;
  flex: 1;
}

.product-category {
  color: $neon-blue;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: $spacing-sm;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: 1.3;
}

.product-description {
  color: $text-secondary;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: $spacing-lg;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



.product-pricing {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 900;
  color: $neon-pink;
  font-family: $font-neon;
}

.original-price {
  font-size: 1rem;
  color: $text-muted;
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars svg {
  color: $text-muted;
  
  &.filled {
    color: $neon-yellow;
    fill: currentColor;
  }
}

.rating-text {
  font-size: 0.85rem;
  color: $text-secondary;
}

.product-actions {
  padding: $spacing-md;
  border-top: 1px solid rgba($text-muted, 0.1);
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.btn-full {
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(white, 0.1), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba($text-secondary, 0.4);
  color: $text-secondary;
  
  &:hover {
    background: rgba($text-secondary, 0.1);
    color: $text-primary;
    border-color: rgba($text-primary, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba($text-secondary, 0.2);
  }
}
</style>