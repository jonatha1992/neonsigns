<template>
  <div class="product-card">
    <div class="product-image">
      <div class="image-placeholder">
        <Zap :size="48" class="placeholder-icon" />
      </div>
      <div class="product-badges">
        <span v-if="product.featured" class="badge featured">Destacado</span>
        <span v-if="product.originalPrice" class="badge discount">
          -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
        </span>
      </div>
    </div>
    
    <div class="product-info">
      <div class="product-category">{{ categoryName }}</div>
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <div class="product-colors">
        <span class="colors-label">Colores:</span>
        <div class="color-dots">
          <div 
            v-for="color in product.colors.slice(0, 4)" 
            :key="color.name"
            class="color-dot"
            :style="{ backgroundColor: color.hex, boxShadow: `0 0 10px ${color.glowColor}` }"
            :title="color.name"
          ></div>
          <span v-if="product.colors.length > 4" class="more-colors">
            +{{ product.colors.length - 4 }}
          </span>
        </div>
      </div>
      
      <div class="product-pricing">
        <span class="current-price">${{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ${{ product.originalPrice }}
        </span>
      </div>
      
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
        :to="`/producto/${product.id}`" 
        class="btn btn-secondary btn-full"
      >
        Ver Detalles
      </RouterLink>
      
      <a 
        :href="whatsappProductUrl" 
        target="_blank" 
        class="btn btn-neon btn-full"
      >
        <MessageCircle :size="18" />
        Consultar
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Zap, Star, MessageCircle } from 'lucide-vue-next'
import type { Product } from '@/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

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
const whatsappNumber = '+5491123456789'
const whatsappProductUrl = computed(() => {
  const message = `Hola! Me interesa el producto "${props.product.name}". ¿Podrían darme más información y disponibilidad? 🌟`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})
</script>

<style lang="scss" scoped>
.product-card {
  background: $card-bg;
  border-radius: $border-radius-lg;
  border: 1px solid rgba($neon-blue, 0.2);
  overflow: hidden;
  transition: all $transition-normal;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $neon-glow-md rgba($neon-blue, 0.3);
    border-color: rgba($neon-pink, 0.4);
  }
}

.product-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, rgba($neon-pink, 0.1) 0%, rgba($neon-blue, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
  
  &.featured {
    background: $neon-pink;
    color: $dark-bg;
  }
  
  &.discount {
    background: $neon-green;
    color: $dark-bg;
  }
}

.product-info {
  padding: $spacing-lg;
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

.product-colors {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.colors-label {
  font-size: 0.85rem;
  color: $text-secondary;
}

.color-dots {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(white, 0.3);
  cursor: pointer;
}

.more-colors {
  font-size: 0.75rem;
  color: $text-muted;
  margin-left: $spacing-xs;
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
  padding: $spacing-lg;
  border-top: 1px solid rgba($text-muted, 0.1);
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.btn-full {
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba($text-secondary, 0.4);
  color: $text-secondary;
  
  &:hover {
    background: rgba($text-secondary, 0.1);
    color: $text-primary;
  }
}
</style>