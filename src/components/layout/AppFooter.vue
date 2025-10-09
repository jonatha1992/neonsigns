<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="logo">
            <span class="neon-text pink">NEON</span>
            <span class="text-white">Signs</span>
            <span class="text-white">LD</span>
            <img src="/logo_neon.png" alt="León Neón" class="logo-icon" />
          </div>
          <p class="footer-description">
            Creamos carteles de neón únicos y personalizados para dar vida a tus ideas.
            Calidad profesional con diseños que brillan.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">Enlaces Rápidos</h3>
          <ul class="footer-links">
            <li><RouterLink to="/">Inicio</RouterLink></li>
            <li><RouterLink to="/galeria">Galería</RouterLink></li>
            <li><RouterLink to="/contacto">Contacto</RouterLink></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="footer-section">
          <h3 class="footer-title">Categorías</h3>
          <ul class="footer-links">
            <li><a href="#">Carteles de Negocio</a></li>
            <li><a href="#">Decoración Hogar</a></li>
            <li><a href="#">Letras Personalizadas</a></li>
            <li><a href="#">Diseños Customizados</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h3 class="footer-title">Contacto</h3>
          <div class="contact-info">
            <div class="contact-item">
              <Phone :size="16" />
              <span>+54 9 11 4091-6764</span>
            </div>
            <div class="contact-item">
              <Mail :size="16" />
              <span>info@neonsigns.com</span>
            </div>
            <div class="contact-item">
              <MapPin :size="16" />
              <span>Zona Sur, Buenos Aires</span>
            </div>
          </div>

          <!-- WhatsApp CTA -->
          <a 
            :href="whatsappUrl" 
            target="_blank" 
            class="whatsapp-cta"
          >
            <MessageCircle :size="20" />
            <span>¡Chateemos por WhatsApp!</span>
          </a>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 Neon Signs Store. Desarrollado por Lauti Design.</p>
          <div class="social-links">
            <a href="#" class="social-link" title="Instagram">
              <Instagram :size="20" />
            </a>
            <a href="#" class="social-link" title="Facebook">
              <Facebook :size="20" />
            </a>
            <a href="#" class="social-link" title="Twitter">
              <Twitter :size="20" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Twitter } from 'lucide-vue-next'

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappMessage = 'Hola! Quiero más información sobre sus carteles de neón (Zona Sur) 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)
</script>

<style lang="scss" scoped>
.footer {
  background: linear-gradient(135deg, $darker-bg 0%, $dark-bg 100%);
  border-top: 1px solid rgba($neon-pink, 0.2);
  margin-top: $spacing-3xl;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-xl;
  padding: $spacing-2xl 0 $spacing-lg;
  
  @media (max-width: $mobile) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    padding: $spacing-xl 0;
  }
}

.footer-section {
  .logo {
    font-size: 1.5rem;
    font-weight: 900;
    font-family: $font-neon;
    margin-bottom: $spacing-md;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .logo-icon {
      width: 40px;
      height: 40px;
      object-fit: contain;
      filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
      margin-left: $spacing-sm;
      animation: neon-pulse 2s ease-in-out infinite alternate;
      transition: all 0.3s ease;
      
      &:hover {
        filter: brightness(1.5) saturate(1.5) drop-shadow(0 0 20px rgba(255, 20, 147, 1));
        transform: scale(1.1);
      }
    }
  }
}

.footer-description {
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
}

.footer-title {
  color: $text-primary;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: $spacing-lg;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background: $neon-pink;
    box-shadow: $neon-glow-sm $neon-pink;
  }
}

.footer-links {
  list-style: none;
  
  li {
    margin-bottom: $spacing-sm;
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

.contact-info {
  margin-bottom: $spacing-lg;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
  
  svg {
    color: $neon-blue;
  }
}

.whatsapp-cta {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  background: linear-gradient(45deg, #25d366, #128c7e);
  color: white;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-lg;
  text-decoration: none;
  font-weight: 600;
  transition: all $transition-normal;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
  }
}

.footer-bottom {
  border-top: 1px solid rgba($text-muted, 0.2);
  padding: $spacing-md 0;
  
  &-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: $mobile) {
      flex-direction: column;
      gap: $spacing-md;
      text-align: center;
    }
    
    p {
      color: $text-muted;
      font-size: 0.9rem;
    }
  }
}

.social-links {
  display: flex;
  gap: $spacing-md;
}

.social-link {
  color: $text-muted;
  transition: all $transition-normal;
  
  &:hover {
    color: $neon-pink;
    transform: translateY(-2px);
  }
}

// Animations
@keyframes neon-pulse {
  0% {
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
  }
  100% {
    filter: brightness(1.4) saturate(1.5) drop-shadow(0 0 15px rgba(255, 20, 147, 1));
  }
}
</style>