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
            
            <RouterLink to="/galeria" class="btn btn-neon btn-lg">
              <Package :size="20" />
              Seguir Comprando
            </RouterLink>
          </div>
          
          <div v-if="cartItems === 0" class="empty-message">
            <p>Tu carrito está vacío. ¡Explora nuestros productos y encuentra el cartel perfecto!</p>
            <RouterLink to="/galeria" class="btn btn-primary">
              Ver Galería
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

<style scoped>
.cart-page {
  padding: 4rem 0;
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
  padding: 4rem;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
}

.cart-icon {
  color: #00ffff;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 20px currentColor);
}

.redirect-content h1 {
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 1rem;
  font-family: 'Orbitron', monospace;
}

.redirect-content p {
  color: #cccccc;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cart-summary {
  background: rgba(5, 5, 5, 0.8);
  border: 1px solid rgba(255, 0, 128, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(136, 136, 136, 0.2);
  }
  
  span {
    color: #cccccc;
  }
  
  strong {
    color: #ffffff;
    font-size: 1.1rem;
  }
}

.cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.btn-lg {
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.empty-message {
  p {
    color: #888888;
    font-style: italic;
    margin-bottom: 1.5rem;
  }
}
</style>