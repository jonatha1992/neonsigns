<template>
  <div v-if="isOpen" class="cart-overlay" @click="closeCart">
    <div class="cart-sidebar" @click.stop>
      <div class="cart-header">
        <h3>Carrito de Compras</h3>
        <button @click="closeCart" class="close-btn">
          <X :size="24" />
        </button>
      </div>
      
      <div class="cart-content">
        <div v-if="items.length === 0" class="empty-cart">
          <ShoppingCart :size="48" class="empty-icon" />
          <p>Tu carrito está vacío</p>
          <RouterLink to="/galeria" class="btn btn-neon" @click="closeCart">
            Ver Productos
          </RouterLink>
        </div>
        
        <div v-else class="cart-items">
          <div v-for="(item, index) in items" :key="index" class="cart-item">
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <p class="item-details">
                Color: {{ item.selectedColor.name }} | 
                Tamaño: {{ item.selectedSize.name }}
              </p>
              <p v-if="item.customText" class="custom-text">
                Texto: "{{ item.customText }}"
              </p>
            </div>
            
            <div class="item-actions">
              <div class="quantity-controls">
                <button @click="updateQuantity(index, item.quantity - 1)">
                  <Minus :size="16" />
                </button>
                <span>{{ item.quantity }}</span>
                <button @click="updateQuantity(index, item.quantity + 1)">
                  <Plus :size="16" />
                </button>
              </div>
              
              <div class="item-price">
                ${{ ((item.product.price + item.selectedSize.price) * item.quantity).toFixed(2) }}
              </div>
              
              <button @click="removeItem(index)" class="remove-btn">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="items.length > 0" class="cart-footer">
        <div class="total">
          <strong>Total: ${{ totalPrice.toFixed(2) }}</strong>
        </div>
        
        <div class="cart-actions">
          <button @click="clearCart" class="btn btn-secondary">
            Vaciar Carrito
          </button>
          
          <a 
            :href="whatsappOrderUrl" 
            target="_blank" 
            class="btn btn-primary"
            @click="closeCart"
          >
            <MessageCircle :size="20" />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, ShoppingCart, Minus, Plus, Trash2, MessageCircle } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const isOpen = computed(() => cartStore.isOpen)
const items = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappOrderUrl = computed(() => {
  let message = '¡Hola! Quiero hacer un pedido:\n\n'
  
  items.value.forEach((item, index) => {
    message += `${index + 1}. ${item.product.name}\n`
    message += `   - Color: ${item.selectedColor.name}\n`
    message += `   - Tamaño: ${item.selectedSize.name}\n`
    if (item.customText) {
      message += `   - Texto personalizado: "${item.customText}"\n`
    }
    message += `   - Cantidad: ${item.quantity}\n`
    message += `   - Precio: $${((item.product.price + item.selectedSize.price) * item.quantity).toFixed(2)}\n\n`
  })
  
  message += `*Total: $${totalPrice.value.toFixed(2)}*\n\n`
  message += '¿Podrían confirmarme disponibilidad y tiempo de entrega? ¡Gracias! 🌟'
  
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const closeCart = () => {
  cartStore.closeCart()
}

const updateQuantity = (index: number, quantity: number) => {
  cartStore.updateQuantity(index, quantity)
}

const removeItem = (index: number) => {
  cartStore.removeItem(index)
}

const clearCart = () => {
  cartStore.clearCart()
}
</script>

<style lang="scss" scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($dark-bg, 0.8);
  backdrop-filter: blur(5px);
  z-index: $z-modal;
  display: flex;
  justify-content: flex-end;
}

.cart-sidebar {
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  background: $card-bg;
  border-left: 1px solid rgba($neon-pink, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  border-bottom: 1px solid rgba($text-muted, 0.2);
  
  h3 {
    margin: 0;
    color: $text-primary;
  }
}

.close-btn {
  background: transparent;
  border: none;
  color: $text-muted;
  cursor: pointer;
  padding: $spacing-sm;
  
  &:hover {
    color: $neon-pink;
  }
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
}

.empty-cart {
  text-align: center;
  padding: $spacing-2xl;
  
  .empty-icon {
    color: $text-muted;
    margin-bottom: $spacing-lg;
  }
  
  p {
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }
}

.cart-item {
  border-bottom: 1px solid rgba($text-muted, 0.1);
  padding: $spacing-md 0;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-info {
  margin-bottom: $spacing-md;
  
  h4 {
    margin: 0 0 $spacing-sm;
    color: $text-primary;
  }
  
  .item-details {
    color: $text-secondary;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .custom-text {
    color: $neon-pink;
    font-size: 0.9rem;
    font-style: italic;
    margin: $spacing-sm 0 0;
  }
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  button {
    background: rgba($neon-blue, 0.2);
    border: 1px solid $neon-blue;
    color: $neon-blue;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba($neon-blue, 0.3);
    }
  }
  
  span {
    min-width: 30px;
    text-align: center;
    font-weight: 600;
  }
}

.item-price {
  font-weight: 600;
  color: $neon-pink;
}

.remove-btn {
  background: transparent;
  border: none;
  color: $text-muted;
  cursor: pointer;
  padding: $spacing-sm;
  
  &:hover {
    color: #ff4444;
  }
}

.cart-footer {
  border-top: 1px solid rgba($text-muted, 0.2);
  padding: $spacing-md;
}

.total {
  text-align: center;
  margin-bottom: $spacing-lg;
  font-size: 1.2rem;
  color: $text-primary;
}

.cart-actions {
  display: flex;
  gap: $spacing-md;
  
  .btn {
    flex: 1;
    justify-content: center;
  }
}

.btn-secondary {
  background: transparent;
  border: 1px solid $text-muted;
  color: $text-muted;
  
  &:hover {
    background: rgba($text-muted, 0.1);
  }
}
</style>