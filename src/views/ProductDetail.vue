<template>
  <div class="product-detail">
    <div v-if="loading" class="loading-state">
      <div class="container">
        <div class="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    </div>
    
    <div v-else-if="!product" class="not-found-state">
      <div class="container">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe o ha sido removido.</p>
        <RouterLink to="/productos" class="btn btn-primary">
          Ver Todos los Productos
        </RouterLink>
      </div>
    </div>
    
    <div v-else class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/">Inicio</RouterLink>
        <ChevronRight :size="16" />
        <RouterLink to="/productos">Productos</RouterLink>
        <ChevronRight :size="16" />
        <span>{{ product.name }}</span>
      </nav>
      
      <div class="product-content">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <div class="image-placeholder">
              <Zap :size="80" class="placeholder-icon" />
              <p>Imagen del producto</p>
            </div>
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="product-info">
          <div class="product-badge">{{ categoryName }}</div>
          
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-rating">
            <div class="stars">
              <Star 
                v-for="star in 5" 
                :key="star"
                :size="20"
                :class="{ filled: star <= Math.floor(product.rating) }"
              />
            </div>
            <span class="rating-text">{{ product.rating }} ({{ product.reviews }} reseñas)</span>
          </div>
          
          <div class="product-pricing">
            <span class="current-price">${{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">
              ${{ product.originalPrice }}
            </span>
            <span v-if="product.originalPrice" class="discount-badge">
              -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
            </span>
          </div>
          
          <p class="product-description">{{ product.description }}</p>
          
          <!-- Color Options -->
          <div class="product-options">
            <div class="option-group">
              <label>Color:</label>
              <div class="color-options">
                <button 
                  v-for="color in product.colors" 
                  :key="color.name"
                  @click="selectedColor = color"
                  :class="{ active: selectedColor?.name === color.name }"
                  class="color-option"
                  :title="color.name"
                >
                  <div 
                    class="color-circle"
                    :style="{ 
                      backgroundColor: color.hex, 
                      boxShadow: selectedColor?.name === color.name ? `0 0 15px ${color.glowColor}` : 'none'
                    }"
                  ></div>
                  <span>{{ color.name }}</span>
                </button>
              </div>
            </div>
            
            <!-- Size Options -->
            <div class="option-group">
              <label>Tamaño:</label>
              <div class="size-options">
                <button 
                  v-for="size in product.sizes" 
                  :key="size.name"
                  @click="selectedSize = size"
                  :class="{ active: selectedSize?.name === size.name }"
                  class="size-option"
                >
                  <div class="size-info">
                    <span class="size-name">{{ size.name }}</span>
                    <span class="size-dimensions">{{ size.dimensions }}</span>
                    <span v-if="size.price > 0" class="size-price">+${{ size.price }}</span>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Custom Text -->
            <div v-if="product.customizable" class="option-group">
              <label for="custom-text">Texto personalizado (opcional):</label>
              <input 
                id="custom-text"
                v-model="customText" 
                type="text" 
                placeholder="Ingresa tu texto personalizado..."
                class="custom-text-input"
                maxlength="50"
              >
              <small class="input-hint">Máximo 50 caracteres</small>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="product-actions">
            <div class="quantity-selector">
              <label>Cantidad:</label>
              <div class="quantity-controls">
                <button @click="decreaseQuantity" :disabled="quantity <= 1">
                  <Minus :size="16" />
                </button>
                <span class="quantity">{{ quantity }}</span>
                <button @click="increaseQuantity">
                  <Plus :size="16" />
                </button>
              </div>
            </div>
            
            <div class="action-buttons">
              <button 
                @click="addToCart" 
                :disabled="!selectedColor || !selectedSize"
                class="btn btn-primary btn-lg"
              >
                <ShoppingCart :size="20" />
                Agregar al Carrito
              </button>
              
              <a 
                :href="whatsappProductUrl" 
                target="_blank" 
                class="btn btn-neon btn-lg"
              >
                <MessageCircle :size="20" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
          
          <!-- Product Features -->
          <div class="product-features">
            <div class="feature">
              <Shield :size="20" />
              <span>12 meses de garantía</span>
            </div>
            <div class="feature">
              <Truck :size="20" />
              <span>Envío gratuito en CABA</span>
            </div>
            <div class="feature">
              <Wrench :size="20" />
              <span>Instalación disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ChevronRight, Zap, Star, Minus, Plus, ShoppingCart, MessageCircle, 
  Shield, Truck, Wrench 
} from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { NeonColor, ProductSize } from '@/types'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const loading = ref(true)
const selectedColor = ref<NeonColor | null>(null)
const selectedSize = ref<ProductSize | null>(null)
const customText = ref('')
const quantity = ref(1)

const product = computed(() => {
  const id = route.params.id as string
  return productsStore.getProductById(id)
})

const categoryName = computed(() => {
  if (!product.value) return ''
  const categories = {
    business: 'Negocios',
    home: 'Hogar', 
    custom: 'Personalizado',
    decorative: 'Decorativo',
    signs: 'Señales',
    letters: 'Letras'
  }
  return categories[product.value.category] || 'Producto'
})

// WhatsApp URL
const whatsappNumber = '+5491123456789'
const whatsappProductUrl = computed(() => {
  if (!product.value) return ''
  
  let message = `Hola! Me interesa el producto "${product.value.name}".\n\n`
  
  if (selectedColor.value) {
    message += `Color: ${selectedColor.value.name}\n`
  }
  
  if (selectedSize.value) {
    message += `Tamaño: ${selectedSize.value.name} (${selectedSize.value.dimensions})\n`
  }
  
  if (customText.value) {
    message += `Texto personalizado: "${customText.value}"\n`
  }
  
  message += `Cantidad: ${quantity.value}\n\n`
  message += '¿Podrían darme más información y confirmar disponibilidad? 🌟'
  
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const addToCart = () => {
  if (!product.value || !selectedColor.value || !selectedSize.value) return
  
  cartStore.addItem(
    product.value,
    selectedColor.value,
    selectedSize.value,
    quantity.value,
    customText.value || undefined
  )
  
  // Open cart to show added item
  cartStore.openCart()
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  if (product.value) {
    // Set default selections
    selectedColor.value = product.value.colors[0] || null
    selectedSize.value = product.value.sizes[0] || null
  }
  
  loading.value = false
})
</script>

<style lang="scss" scoped>
.product-detail {
  padding: $spacing-3xl 0;
  min-height: calc(100vh - 160px);
}

.loading-state,
.not-found-state {
  text-align: center;
  padding: $spacing-3xl;
  
  h1 {
    color: $text-primary;
    margin-bottom: $spacing-md;
  }
  
  p {
    color: $text-secondary;
    margin-bottom: $spacing-xl;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-2xl;
  font-size: 0.9rem;
  
  a {
    color: $neon-blue;
    text-decoration: none;
    
    &:hover {
      color: $neon-pink;
    }
  }
  
  span {
    color: $text-secondary;
  }
  
  svg {
    color: $text-muted;
  }
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-3xl;
  
  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
  }
}

.product-images {
  .main-image {
    aspect-ratio: 1;
    background: linear-gradient(135deg, rgba($neon-pink, 0.1) 0%, rgba($neon-blue, 0.1) 100%);
    border-radius: $border-radius-lg;
    border: 1px solid rgba($neon-blue, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
    .image-placeholder {
      text-align: center;
      color: rgba($neon-blue, 0.6);
      
      .placeholder-icon {
        filter: drop-shadow(0 0 20px currentColor);
        margin-bottom: $spacing-md;
      }
      
      p {
        color: $text-muted;
        margin: 0;
      }
    }
  }
}

.product-badge {
  display: inline-block;
  background: rgba($neon-blue, 0.2);
  color: $neon-blue;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: $spacing-md;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  line-height: 1.2;
  
  @media (max-width: $mobile) {
    font-size: 2rem;
  }
}

.product-rating {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  
  .stars {
    display: flex;
    gap: 2px;
    
    svg {
      color: $text-muted;
      
      &.filled {
        color: $neon-yellow;
        fill: currentColor;
      }
    }
  }
  
  .rating-text {
    color: $text-secondary;
  }
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  
  .current-price {
    font-size: 2rem;
    font-weight: 900;
    color: $neon-pink;
    font-family: $font-neon;
  }
  
  .original-price {
    font-size: 1.2rem;
    color: $text-muted;
    text-decoration: line-through;
  }
  
  .discount-badge {
    background: $neon-green;
    color: $dark-bg;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    font-size: 0.85rem;
    font-weight: 600;
  }
}

.product-description {
  font-size: 1.1rem;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-2xl;
}

.product-options {
  margin-bottom: $spacing-2xl;
}

.option-group {
  margin-bottom: $spacing-xl;
  
  label {
    display: block;
    color: $text-primary;
    font-weight: 600;
    margin-bottom: $spacing-md;
  }
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.color-option {
  background: transparent;
  border: 2px solid transparent;
  border-radius: $border-radius-md;
  padding: $spacing-sm;
  cursor: pointer;
  transition: all $transition-normal;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  &.active {
    border-color: rgba($neon-pink, 0.6);
    background: rgba($neon-pink, 0.1);
  }
  
  .color-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(white, 0.3);
  }
  
  span {
    color: $text-primary;
    font-size: 0.9rem;
  }
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.size-option {
  background: transparent;
  border: 2px solid rgba($neon-blue, 0.4);
  border-radius: $border-radius-md;
  padding: $spacing-md;
  cursor: pointer;
  transition: all $transition-normal;
  
  &.active {
    border-color: $neon-blue;
    background: rgba($neon-blue, 0.1);
  }
  
  .size-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    
    .size-name {
      color: $text-primary;
      font-weight: 600;
    }
    
    .size-dimensions {
      color: $text-secondary;
      font-size: 0.85rem;
    }
    
    .size-price {
      color: $neon-pink;
      font-size: 0.85rem;
      font-weight: 600;
    }
  }
}

.custom-text-input {
  width: 100%;
  background: rgba($card-bg, 0.8);
  border: 2px solid rgba($neon-purple, 0.4);
  border-radius: $border-radius-md;
  padding: $spacing-md;
  color: $text-primary;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: $neon-purple;
    box-shadow: $neon-glow-sm rgba($neon-purple, 0.3);
  }
  
  &::placeholder {
    color: $text-muted;
  }
}

.input-hint {
  color: $text-muted;
  font-size: 0.8rem;
  margin-top: $spacing-xs;
}

.product-actions {
  margin-bottom: $spacing-2xl;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  
  label {
    color: $text-primary;
    font-weight: 600;
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  button {
    background: rgba($neon-blue, 0.2);
    border: 1px solid $neon-blue;
    color: $neon-blue;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-normal;
    
    &:hover:not(:disabled) {
      background: rgba($neon-blue, 0.3);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .quantity {
    min-width: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 1.1rem;
    color: $text-primary;
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  
  @media (max-width: $mobile) {
    flex-direction: column;
  }
  
  .btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.btn-lg {
  padding: $spacing-lg $spacing-xl;
  font-size: 1.1rem;
}

.product-features {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: rgba($card-bg, 0.5);
  border: 1px solid rgba($neon-green, 0.2);
  border-radius: $border-radius-md;
}

.feature {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  
  svg {
    color: $neon-green;
  }
}
</style>