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
          
          <RouterLink to="/galeria" class="btn btn-neon">
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
            <li><RouterLink to="/galeria">Galería de trabajos</RouterLink></li>
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
const whatsappNumber = '+5491140916764'
const whatsappMessage = 'Hola! Estaba navegando en su página y me gustaría más información sobre sus carteles de neón (Zona Sur) 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.error-content {
  text-align: center;
  max-width: 600px;
}

.neon-404 {
  font-size: 8rem;
  font-weight: 900;
  font-family: 'Orbitron', monospace;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
}

.error-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.error-message {
  font-size: 1.1rem;
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.error-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.error-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(204, 204, 204, 0.4);
  color: #cccccc;
  
  &:hover {
    background: rgba(204, 204, 204, 0.1);
    color: #ffffff;
  }
}

.helpful-links {
  text-align: left;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  
  h3 {
    color: #00ffff;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  a {
    color: #cccccc;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: #ff0080;
      padding-left: 0.5rem;
    }
  }
}
</style>