<template>
  <header class="header">
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <!-- Logo -->
          <RouterLink to="/" class="logo">
            <span class="neon-text pink">NEON</span>
            <span class="text-white">Signs</span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="nav-links desktop-only">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
            <RouterLink to="/productos" class="nav-link">Productos</RouterLink>
            <RouterLink to="/contacto" class="nav-link">Contacto</RouterLink>
          </div>

          <!-- WhatsApp & Cart Actions -->
          <div class="navbar-actions">
            <!-- Cart Icon -->
            <button @click="toggleCart" class="cart-btn">
              <ShoppingCart :size="24" />
              <span v-if="cartItems > 0" class="cart-badge">{{ cartItems }}</span>
            </button>

            <!-- WhatsApp Button -->
            <a 
              :href="whatsappUrl" 
              target="_blank" 
              class="btn btn-neon whatsapp-btn"
            >
              <MessageCircle :size="20" />
              <span class="desktop-only">WhatsApp</span>
            </a>

            <!-- Mobile Menu Toggle -->
            <button @click="toggleMobileMenu" class="mobile-menu-btn mobile-only">
              <Menu v-if="!isMobileMenuOpen" :size="24" />
              <X v-else :size="24" />
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-show="isMobileMenuOpen" class="mobile-nav">
          <RouterLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Inicio</RouterLink>
          <RouterLink to="/productos" class="mobile-nav-link" @click="closeMobileMenu">Productos</RouterLink>
          <RouterLink to="/contacto" class="mobile-nav-link" @click="closeMobileMenu">Contacto</RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingCart, MessageCircle, Menu, X } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const isMobileMenuOpen = ref(false)

const cartItems = computed(() => cartStore.totalItems)

// WhatsApp configuration
const whatsappNumber = '+5491123456789' // Cambiar por tu número
const whatsappMessage = 'Hola! Me interesa información sobre sus carteles de neón 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)

const toggleCart = () => {
  cartStore.toggleCart()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
  background: rgba($dark-bg, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba($neon-pink, 0.2);
}

.navbar {
  padding: $spacing-md 0;

  &-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
}

.logo {
  font-size: 1.5rem;
  font-weight: 900;
  text-decoration: none;
  font-family: $font-neon;
  
  &:hover {
    .neon-text {
      animation: neon-flicker 0.5s;
    }
  }
}

.nav-links {
  display: flex;
  gap: $spacing-xl;
}

.nav-link {
  text-decoration: none;
  color: $text-secondary;
  font-weight: 500;
  transition: all $transition-normal;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  
  &:hover,
  &.router-link-active {
    color: $neon-pink;
    background: rgba($neon-pink, 0.1);
  }
}

.cart-btn {
  position: relative;
  background: transparent;
  border: 1px solid rgba($neon-blue, 0.5);
  color: $neon-blue;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-normal;
  
  &:hover {
    background: rgba($neon-blue, 0.1);
    box-shadow: $neon-glow-sm $neon-blue;
  }
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: $neon-pink;
  color: $dark-bg;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.whatsapp-btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.mobile-menu-btn {
  background: transparent;
  border: none;
  color: $text-primary;
  cursor: pointer;
  padding: $spacing-sm;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  padding: $spacing-lg 0;
  border-top: 1px solid rgba($neon-pink, 0.2);
  margin-top: $spacing-md;
}

.mobile-nav-link {
  text-decoration: none;
  color: $text-secondary;
  font-weight: 500;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  transition: all $transition-normal;
  
  &:hover,
  &.router-link-active {
    color: $neon-pink;
    background: rgba($neon-pink, 0.1);
  }
}

// Responsive
.desktop-only {
  @media (max-width: $mobile) {
    display: none;
  }
}

.mobile-only {
  @media (min-width: $mobile) {
    display: none;
  }
}
</style>