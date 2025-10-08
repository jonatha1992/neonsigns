<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-redirect">
        <div class="redirect-content">
          <ShoppingCart :size="64" class="cart-icon" />
          <h1>Carrito de Compras</h1>
          <p>Tu carrito se maneja desde el sidebar. ¡Ábrelo para ver tus productos!</p>
          
          <div class="cart-summary" v-if="cartItems > 0">
            <div class="summary-item">
              <span>Productos en carrito:</span>
              <strong>{{ cartItems }}</strong>
            </div>
            <div class="summary-item">
              <span>Total:</span>
              <strong class="neon-text pink">${{ totalPrice.toFixed(2) }}</strong>
            </div>
          </div>
          
          <div class="cart-actions">
            <button @click="openCart" class="btn btn-primary btn-lg">
              <ShoppingCart :size="20" />
              Abrir Carrito
            </button>
            
            <RouterLink to="/productos" class="btn btn-neon btn-lg">
              <Package :size="20" />
              Seguir Comprando
            </RouterLink>
          </div>
          
          <div v-if="cartItems === 0" class="empty-message">
            <p>Tu carrito está vacío. ¡Explora nuestros productos y encuentra el cartel perfecto!</p>
            <RouterLink to="/productos" class="btn btn-primary">
              Ver Catálogo
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingCart, Package } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const cartItems = computed(() => cartStore.totalItems)
const totalPrice = computed(() => cartStore.totalPrice)

const openCart = () => {
  cartStore.openCart()
}
</script>

<style lang="scss" scoped>
.cart-page {
  padding: $spacing-3xl 0;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
}

.cart-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.redirect-content {
  text-align: center;
  max-width: 500px;
  padding: $spacing-3xl;
  background: rgba($card-bg, 0.8);
  border: 1px solid rgba($neon-blue, 0.2);
  border-radius: $border-radius-xl;
}

.cart-icon {
  color: $neon-blue;
  margin-bottom: $spacing-lg;
  filter: drop-shadow(0 0 20px currentColor);
}

.redirect-content h1 {
  font-size: 2rem;
  font-weight: 900;
  color: $text-primary;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
}

.redirect-content p {
  color: $text-secondary;
  font-size: 1.1rem;
  margin-bottom: $spacing-xl;
  line-height: 1.6;
}

.cart-summary {
  background: rgba($darker-bg, 0.8);
  border: 1px solid rgba($neon-pink, 0.2);
  border-radius: $border-radius-md;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: $spacing-sm;
    border-top: 1px solid rgba($text-muted, 0.2);
  }
  
  span {
    color: $text-secondary;
  }
  
  strong {
    color: $text-primary;
    font-size: 1.1rem;
  }
}

.cart-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  margin-bottom: $spacing-xl;
  
  @media (max-width: $mobile) {
    flex-direction: column;
  }
}

.btn-lg {
  padding: $spacing-lg $spacing-xl;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.empty-message {
  p {
    color: $text-muted;
    font-style: italic;
    margin-bottom: $spacing-lg;
  }
}
</style>