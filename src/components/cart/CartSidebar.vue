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
import { buildWhatsAppUrl } from '@/utils/contact'

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
  
  return buildWhatsAppUrl(message)
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

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.cart-sidebar {
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  background: #1a1a1a;
  border-left: 1px solid rgba(255, 0, 128, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(136, 136, 136, 0.2);
  
  h3 {
    margin: 0;
    color: #ffffff;
  }
}

.close-btn {
  background: transparent;
  border: none;
  color: #888888;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #ff0080;
  }
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  
  .empty-icon {
    color: #888888;
    margin-bottom: 1.5rem;
  }
  
  p {
    color: #cccccc;
    margin-bottom: 1.5rem;
  }
}

.cart-item {
  border-bottom: 1px solid rgba(136, 136, 136, 0.1);
  padding: 1rem 0;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-info {
  margin-bottom: 1rem;
  
  h4 {
    margin: 0 0 0.5rem;
    color: #ffffff;
  }
  
  .item-details {
    color: #cccccc;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .custom-text {
    color: #ff0080;
    font-size: 0.9rem;
    font-style: italic;
    margin: 0.5rem 0 0;
  }
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    background: rgba(0, 255, 255, 0.2);
    border: 1px solid #00ffff;
    color: #00ffff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba(0, 255, 255, 0.3);
    }
  }
  
  span {
    min-width: 30px;
    text-align: center;
    font-weight: 600;
  }
}

.item-price {
  font-weight: 700;
  color: #00ffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.025em;
  background: rgba(0, 255, 255, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  font-size: 0.85rem;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #888888;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #ff4444;
  }
}

.cart-footer {
  border-top: 1px solid rgba(136, 136, 136, 0.2);
  padding: 1rem;
}

.total {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(26, 26, 26, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(136, 136, 136, 0.2);
  backdrop-filter: blur(10px);
  
  strong {
    font-size: 1.5rem;
    font-weight: 700;
    color: #00ffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: 0.025em;
  }
}

.cart-actions {
  display: flex;
  gap: 1rem;
  
  .btn {
    flex: 1;
    justify-content: center;
  }
}

.btn-secondary {
  background: transparent;
  border: 1px solid #888888;
  color: #888888;
  
  &:hover {
    background: rgba(136, 136, 136, 0.1);
  }
}
</style>

