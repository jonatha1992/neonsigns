<template>
  <div class="contact-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="neon-text pink">CONTACTO</span>
        </h1>
        <p class="page-subtitle">
          Conectá con nosotros para crear tu cartel de neón personalizado
        </p>
      </div>
      
      <!-- Contact Options -->
      <div class="contact-grid">
        <!-- WhatsApp Section -->
        <div class="contact-card primary">
          <div class="card-icon">
            <MessageCircle :size="40" />
          </div>
          <h2>Redes Sociales</h2>
          <p>Respuesta inmediata para cotizaciones y consultas generales.</p>
          
          <div class="whatsapp-options">
            <div class="quote-section">
              <p class="quote-label">Consultar por:</p>
              <div class="quote-buttons">
                <a 
                  :href="whatsappCotizacionUrl" 
                  target="_blank" 
                  class="btn btn-quote btn-whatsapp"
                  title="Cotizar por WhatsApp"
                >
                  <MessageCircle :size="18" />
                  WhatsApp
                </a>
                <a 
                  :href="instagramUrl" 
                  target="_blank" 
                  class="btn btn-quote btn-instagram"
                  title="Cotizar por Instagram"
                >
                  <Instagram :size="18" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
          
          <div class="contact-info">
            <Phone :size="20" />
            <span>+54 9 11 4091-6764</span>
          </div>
        </div>
        
        <!-- Email Section -->
        <div class="contact-card">
          <div class="card-icon">
            <Mail :size="40" />
          </div>
          <h2>Email</h2>
          <p>Consultas detalladas y envío de archivos de diseño personalizados.</p>
          
          <a 
            href="mailto:Ldesidel@hotmail.com?subject=Consulta%20carteles%20de%20neon&body=Hola!%20Me%20gustaria%20consultar%20sobre%20carteles%20de%20neon%20personalizados.%0D%0A%0D%0AGracias!"
            class="btn btn-secondary btn-lg"
          >
            <Mail :size="18" />
            Enviar Email
          </a>
          
          <div class="contact-info">
            <Mail :size="20" />
            <span>Ldesidel@hotmail.com</span>
          </div>
        </div>
        
        <!-- Location Section -->
        <div class="contact-card">
          <div class="card-icon">
            <MapPin :size="40" />
          </div>
          <h2>Showroom</h2>
          <p>Visitá nuestro local y descubrí ejemplos reales de nuestro trabajo.</p>
          
          <div class="contact-info vertical">
            <div class="info-item">
              <MapPin :size="20" />
              <div>
                <strong>Zona Sur, Buenos Aires</strong><br>
                <span>Ezeiza - Consultanos ubicación exacta</span>
              </div>
            </div>
            
            <div class="info-item">
              <Clock :size="20" />
              <div>
                <strong>Horarios de Atención</strong><br>
                <span>Lun a Vie: 9:00 - 18:00</span><br>
                <span>Sáb: 9:00 - 14:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- FAQ Section -->
      <div class="faq-section">
        <h2 class="section-title">
          PREGUNTAS <span class="neon-text blue">FRECUENTES</span>
        </h2>
        
        <div class="faq-grid">
          <div class="faq-item">
            <h3>¿Cuánto tiempo tarda la fabricación?</h3>
            <p>Generalmente entre 7 a 15 días hábiles, dependiendo de la complejidad del diseño.</p>
          </div>
          
          <div class="faq-item">
            <h3>¿Hacen instalación?</h3>
            <p>Sí, ofrecemos servicio de instalación profesional en CABA y GBA.</p>
          </div>
          
          <div class="faq-item">
            <h3>¿Qué garantía tienen los productos?</h3>
            <p>Todos nuestros carteles tienen 12 meses de garantía contra defectos de fabricación.</p>
          </div>
          
          <div class="faq-item">
            <h3>¿Puedo enviar mi propio diseño?</h3>
            <p>Por supuesto! Trabajamos con diseños propios o podemos crear uno desde cero.</p>
          </div>
        </div>
      </div>
      
      <!-- Final CTA -->
      <div class="final-cta">
        <div class="cta-content">
          <h2>¿Listo para comenzar tu proyecto?</h2>
          <p>Obtené tu cotización personalizada en minutos</p>
          <a 
            :href="whatsappConsultaUrl" 
            target="_blank" 
            class="btn btn-primary btn-lg"
          >
            <MessageCircle :size="20" />
            Iniciar Conversación
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MessageCircle, Mail, Phone, MapPin, Clock, Instagram } from 'lucide-vue-next'

// WhatsApp configuration
const whatsappNumber = '+5491140916764'

const whatsappConsultaUrl = computed(() => {
  const message = '¡Hola! Me gustaría hacer una consulta sobre sus carteles de neón. ¿Podrían ayudarme? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const whatsappCotizacionUrl = computed(() => {
  const message = 'Hola! Quiero solicitar una cotización para un cartel de neón personalizado (Zona Sur). Los detalles son:\n\n' +
                  '- Texto/diseño: \n' +
                  '- Tamaño aproximado: \n' +
                  '- Colores preferidos: \n' +
                  '- Uso (interior/exterior): \n\n' +
                  '¡Gracias! 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const whatsappEmailUrl = computed(() => {
  const message = 'Hola! Quisiera hacer una consulta detallada sobre carteles de neón personalizados. ¿Podrían ayudarme? También puedo escribir a Ldesidel@hotmail.com si prefieren. ¡Gracias! 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const instagramUrl = 'https://www.instagram.com/cuadros_neonled/'
</script>

<style scoped>
.contact-page {
  padding: 3rem 0;
  min-height: calc(100vh - 160px);
  background: linear-gradient(
    135deg,
    rgba(10, 10, 10, 1) 0%,
    rgba(5, 5, 5, 1) 50%,
    rgba(10, 10, 10, 1) 100%
  );
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 1rem 0;
  
  @media (min-width: 1200px) {
    margin-bottom: 2rem;
    padding: 0.5rem 0;
  }
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: 'Orbitron', monospace;
  letter-spacing: 2px;
  
  @media (min-width: 1200px) {
    font-size: 2.2rem;
    letter-spacing: 3px;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
  letter-spacing: 0.5px;
  
  @media (min-width: 1200px) {
    font-size: 1rem;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 0 1rem;
  
  @media (min-width: 1024px) {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto 3rem auto;
    padding: 0;
  }
}

.contact-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(5, 5, 5, 0.9));
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  @media (min-width: 1200px) {
    padding: 1.5rem 2rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(0, 255, 255, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &.primary {
    border-color: rgba(255, 0, 128, 0.2);
    background: linear-gradient(135deg, rgba(255, 0, 128, 0.03) 0%, rgba(26, 26, 26, 1) 100%);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(255, 0, 128, 0.6), transparent);
    }
    
    &:hover {
      border-color: rgba(255, 0, 128, 0.4);
    }
  }
}

.card-icon {
  color: #00ffff;
  margin-bottom: 1rem;
  
  @media (min-width: 1200px) {
    margin-bottom: 0.5rem;
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
  
  .primary & {
    color: #ff0080;
  }
}

.contact-card h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 1.1rem;
  
  @media (min-width: 1200px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
}

.contact-card p {
  color: #cccccc;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 300;
  
  @media (min-width: 1200px) {
    margin-bottom: 1rem;
    font-size: 0.88rem;
    line-height: 1.5;
  }
}

.whatsapp-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 1200px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
}

.quote-section {
  border-top: 1px solid rgba(255, 0, 128, 0.2);
  padding-top: 0.75rem;
}

.quote-label {
  font-size: 0.85rem;
  color: #cccccc;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quote-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-quote {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  @media (min-width: 1200px) {
    padding: 0.65rem 0.85rem;
    font-size: 0.85rem;
  }
}

.btn-whatsapp {
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  border: 1px solid rgba(37, 211, 102, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #2edf71, #13a087);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  }
}

.btn-instagram {
  background: linear-gradient(135deg, #E4405F, #C13584, #833AB4);
  color: white;
  border: 1px solid rgba(228, 64, 95, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #ea4c6d, #d63f92, #9347c4);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(228, 64, 95, 0.4);
  }
}

.contact-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #cccccc;
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (min-width: 1200px) {
    font-size: 0.85rem;
  }
  
  &.vertical {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    
    @media (min-width: 1200px) {
      gap: 0.5rem;
    }
  }
  
  svg {
    color: #00ffff;
  }
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  text-align: left;
  
  svg {
    margin-top: 2px;
    flex-shrink: 0;
    
    @media (min-width: 1200px) {
      width: 16px;
      height: 16px;
    }
  }
}

.faq-section {
  margin-bottom: 3rem;
  padding: 2rem 1rem 0;
  
  @media (min-width: 1024px) {
    padding: 2rem 1.5rem 0;
  }
  
  @media (min-width: 1200px) {
    margin-bottom: 2rem;
    padding: 2rem 0 0;
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: 'Orbitron', monospace;
  
  @media (min-width: 1200px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }
}

.faq-item {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(5, 5, 5, 0.6));
  border: 1px solid rgba(128, 0, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  @media (min-width: 1200px) {
    padding: 1.25rem 1.5rem;
  }
  
  &:hover {
    border-color: rgba(128, 0, 255, 0.3);
    background: rgba(26, 26, 26, 0.7);
  }
  
  h3 {
    color: #8000ff;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 0.3px;
    
    @media (min-width: 1200px) {
      font-size: 0.92rem;
    }
  }
  
  p {
    color: #cccccc;
    line-height: 1.5;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 300;
    
    @media (min-width: 1200px) {
      font-size: 0.85rem;
    }
  }
}

.final-cta {
  text-align: center;
  padding: 2.5rem 2rem;
  margin: 3rem 1rem 0;
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(128, 0, 255, 0.1) 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 0, 128, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  
  @media (min-width: 1024px) {
    margin: 2rem 1.5rem 0;
    padding: 2rem 3rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff0080, #8000ff, #ff0080);
    border-radius: 16px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
  
  @media (min-width: 1200px) {
    padding: 2rem 3rem;
    max-width: 700px;
    margin: 0 auto;
  }
}

.cta-content h2 {
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #ffffff;
  font-family: 'Orbitron', monospace;
  letter-spacing: 1px;
  
  @media (min-width: 1200px) {
    font-size: 1.5rem;
  }
}

.cta-content p {
  font-size: 1rem;
  color: #cccccc;
  margin-bottom: 1.5rem;
  font-weight: 300;
  
  @media (min-width: 1200px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  @media (min-width: 1200px) {
    padding: 1rem 1.5rem;
    font-size: 0.92rem;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(204, 204, 204, 0.3);
  color: #cccccc;
  
  &:hover {
    background: rgba(204, 204, 204, 0.08);
    color: #ffffff;
    border-color: rgba(204, 204, 204, 0.5);
  }
}
</style>