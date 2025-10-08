<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="neon-404">
          <span class="neon-text pink animate-flicker">404</span>
        </div>
        
        <h1>Página no encontrada</h1>
        
        <p class="error-message">
          La página que buscas parece haberse desconectado.
          ¿Que tal si pruebas con estas opciones?
        </p>
        
        <div class="error-actions">
          <RouterLink to="/" class="btn btn-primary">
            <Home :size="20" />
            Volver al Inicio
          </RouterLink>
          
          <RouterLink to="/productos" class="btn btn-neon">
            <Package :size="20" />
            Ver Productos
          </RouterLink>
          
          <a 
            :href="whatsappUrl" 
            target="_blank" 
            class="btn btn-secondary"
          >
            <MessageCircle :size="20" />
            Contactar
          </a>
        </div>
        
        <div class="helpful-links">
          <h3>Enlaces útiles:</h3>
          <ul>
            <li><RouterLink to="/">Página principal</RouterLink></li>
            <li><RouterLink to="/productos">Catálogo de productos</RouterLink></li>
            <li><RouterLink to="/contacto">Información de contacto</RouterLink></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Home, Package, MessageCircle } from 'lucide-vue-next'

// WhatsApp configuration
const whatsappNumber = '+5491123456789'
const whatsappMessage = 'Hola! Estaba navegando en su página y me gustaría más información sobre sus carteles de neón 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)
</script>

<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3xl 0;
}

.error-content {
  text-align: center;
  max-width: 600px;
}

.neon-404 {
  font-size: 8rem;
  font-weight: 900;
  font-family: $font-neon;
  margin-bottom: $spacing-lg;
  
  @media (max-width: $mobile) {
    font-size: 5rem;
  }
}

.error-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-lg;
  
  @media (max-width: $mobile) {
    font-size: 1.5rem;
  }
}

.error-message {
  font-size: 1.1rem;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-2xl;
}

.error-actions {
  display: flex;
  gap: $spacing-lg;
  justify-content: center;
  margin-bottom: $spacing-3xl;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    align-items: center;
  }
}

.error-actions .btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
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

.helpful-links {
  text-align: left;
  background: rgba($card-bg, 0.5);
  border: 1px solid rgba($neon-blue, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  
  h3 {
    color: $neon-blue;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: $spacing-md;
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    margin-bottom: $spacing-sm;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  a {
    color: $text-secondary;
    text-decoration: none;
    transition: all $transition-normal;
    
    &:hover {
      color: $neon-pink;
      padding-left: $spacing-sm;
    }
  }
}
</style>