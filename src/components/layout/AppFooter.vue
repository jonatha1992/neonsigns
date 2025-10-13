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
            <li><RouterLink to="/admin-simple" class="admin-link">Panel</RouterLink></li>
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
              <span>Ldesidel@hotmail.com</span>
            </div>
            <div class="contact-item">
              <MapPin :size="16" />
              <span>Zona Sur, Buenos Aires</span>
            </div>
          </div>

          <!-- Social CTAs -->
          <div class="social-ctas">
            <a
              :href="whatsappUrl"
              target="_blank"
              class="whatsapp-cta"
            >
              <MessageCircle :size="20" />
              <span>WhatsApp</span>
            </a>
            <a
              :href="instagramUrl"
              target="_blank"
              class="instagram-cta"
            >
              <Instagram :size="20" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 Neon Signs Store. Desarrollado por Tecnofusion.IT.</p>
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

// Instagram configuration
const instagramUsername = 'neonsignsld'
const instagramUrl = computed(() =>
  `https://ig.me/m/${instagramUsername}`
)
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #050505 0%, #0a0a0a 100%);
  border-top: 1px solid rgba(255, 0, 128, 0.2);
  margin-top: 5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 0 1.5rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem 0;
  }
}

.footer-section .logo {
  font-size: 1.5rem;
  font-weight: 900;
  font-family: 'Orbitron', monospace;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.footer-section .logo .logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
  margin-left: 0.25rem;
  animation: neon-pulse 2s ease-in-out infinite alternate;
  transition: all 0.3s ease;
}

.footer-section .logo .logo-icon:hover {
  filter: brightness(1.5) saturate(1.5) drop-shadow(0 0 20px rgba(255, 20, 147, 1));
  transform: scale(1.1);
}

.footer-description {
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 2px;
  background: #ff0080;
  box-shadow: 0 0 5px #ff0080;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.25rem;
}

.footer-links a {
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-links a:hover {
  color: #ff0080;
  padding-left: 0.25rem;
}

.footer-links a.admin-link {
  opacity: 0.3;
  font-size: 0.85rem;
}

.footer-links a.admin-link:hover {
  opacity: 1;
  color: #00ffff;
}

.contact-info {
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #cccccc;
  margin-bottom: 0.25rem;
}

.contact-item svg {
  color: #00ffff;
}

.social-ctas {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.whatsapp-cta,
.instagram-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.whatsapp-cta {
  background: linear-gradient(45deg, #25d366, #128c7e);
  color: white;
}

.whatsapp-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
}

.instagram-cta {
  background: linear-gradient(45deg, #E1306C, #C13584, #833AB4);
  color: white;
}

.instagram-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(225, 48, 108, 0.4);
}

.footer-bottom {
  border-top: 1px solid rgba(136, 136, 136, 0.2);
  padding: 1rem 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

.footer-bottom-content p {
  color: #888888;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #888888;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-link:hover {
  color: #ff0080;
  transform: translateY(-2px);
}

@keyframes neon-pulse {
  0% {
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
  }
  100% {
    filter: brightness(1.4) saturate(1.5) drop-shadow(0 0 15px rgba(255, 20, 147, 1));
  }
}
</style>