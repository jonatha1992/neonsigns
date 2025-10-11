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
          <h2>WhatsApp</h2>
          <p>Respuesta inmediata para cotizaciones y consultas generales.</p>
          
          <div class="whatsapp-options">
            <a 
              :href="whatsappConsultaUrl" 
              target="_blank" 
              class="btn btn-primary btn-lg"
            >
              Consulta General
            </a>
            
            <a 
              :href="whatsappCotizacionUrl" 
              target="_blank" 
              class="btn btn-neon btn-lg"
            >
              Pedir Cotización
            </a>
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
            href="mailto:info@neonsigns.com?subject=Consulta%20sobre%20carteles%20de%20ne%C3%B3n%20-%20Zona%20Sur"
            class="btn btn-secondary btn-lg"
          >
            Enviar Email
          </a>
          
          <div class="contact-info">
            <Mail :size="20" />
            <span>info@neonsigns.com</span>
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
                <span>Zona CABA - Consultanos ubicación exacta</span>
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
import { MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-vue-next'

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
</script>

<style lang="scss" scoped>
.contact-page {
  padding: $spacing-2xl 0;
  min-height: calc(100vh - 160px);
  background: linear-gradient(
    135deg,
    rgba($dark-bg, 1) 0%,
    rgba($darker-bg, 1) 50%,
    rgba($dark-bg, 1) 100%
  );
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-3xl;
  padding: $spacing-xl 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
  letter-spacing: 2px;
  
  @media (min-width: $desktop) {
    font-size: 2.2rem;
    letter-spacing: 3px;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  color: $text-secondary;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
  letter-spacing: 0.5px;
  
  @media (min-width: $desktop) {
    font-size: 1rem;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $spacing-2xl;
  margin-bottom: $spacing-3xl;
  padding: 0 $spacing-md;
  
  @media (min-width: $tablet) {
    gap: $spacing-xl;
    padding: 0 $spacing-lg;
  }
  
  @media (min-width: $desktop) {
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-3xl;
    max-width: 1200px;
    margin: 0 auto $spacing-3xl auto;
    padding: 0;
  }
}

.contact-card {
  background: linear-gradient(145deg, rgba($card-bg, 0.95), rgba($darker-bg, 0.9));
  border: 1px solid rgba($neon-blue, 0.2);
  border-radius: $border-radius-xl;
  padding: $spacing-2xl;
  text-align: center;
  transition: all $transition-normal;
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
    background: linear-gradient(90deg, transparent, rgba($neon-blue, 0.5), transparent);
    opacity: 0;
    transition: opacity $transition-normal;
  }
  
  @media (min-width: $desktop) {
    padding: $spacing-lg $spacing-xl;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba($neon-blue, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &.primary {
    border-color: rgba($neon-pink, 0.2);
    background: linear-gradient(135deg, rgba($neon-pink, 0.03) 0%, rgba($card-bg, 1) 100%);
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba($neon-pink, 0.6), transparent);
    }
    
    &:hover {
      border-color: rgba($neon-pink, 0.4);
    }
  }
}

.card-icon {
  color: $neon-blue;
  margin-bottom: $spacing-md;
  
  @media (min-width: $desktop) {
    margin-bottom: $spacing-sm;
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
  
  .primary & {
    color: $neon-pink;
  }
}

.contact-card h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: $spacing-md;
  color: $text-primary;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 1.1rem;
  
  @media (min-width: $desktop) {
    font-size: 1rem;
    margin-bottom: $spacing-sm;
  }
}

.contact-card p {
  color: $text-secondary;
  margin-bottom: $spacing-lg;
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 300;
  
  @media (min-width: $desktop) {
    margin-bottom: $spacing-md;
    font-size: 0.88rem;
    line-height: 1.5;
  }
}

.whatsapp-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
  
  @media (min-width: $desktop) {
    gap: $spacing-xs;
    margin-bottom: $spacing-md;
  }
}

.contact-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: $text-secondary;
  font-weight: 500;
  font-size: 0.9rem;
  
  @media (min-width: $desktop) {
    font-size: 0.85rem;
  }
  
  &.vertical {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-md;
    
    @media (min-width: $desktop) {
      gap: $spacing-sm;
    }
  }
  
  svg {
    color: $neon-blue;
  }
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  text-align: left;
  
  svg {
    margin-top: 2px;
    flex-shrink: 0;
    
    @media (min-width: $desktop) {
      width: 16px;
      height: 16px;
    }
  }
}

.faq-section {
  margin-bottom: $spacing-3xl;
  padding: $spacing-2xl $spacing-md 0;
  
  @media (min-width: $tablet) {
    padding: $spacing-3xl $spacing-lg 0;
  }
  
  @media (min-width: $desktop) {
    margin-bottom: $spacing-3xl;
    padding: $spacing-3xl 0 0;
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: $spacing-xl;
  font-family: $font-neon;
  
  @media (min-width: $desktop) {
    font-size: 1.8rem;
    margin-bottom: $spacing-lg;
  }
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-xl;
  
  @media (min-width: $tablet) {
    gap: $spacing-lg;
  }
  
  @media (min-width: $desktop) {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;
    max-width: 1000px;
    margin: 0 auto;
  }
}

.faq-item {
  background: linear-gradient(135deg, rgba($card-bg, 0.8), rgba($darker-bg, 0.6));
  border: 1px solid rgba($neon-purple, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  transition: all $transition-normal;
  backdrop-filter: blur(5px);
  
  @media (min-width: $desktop) {
    padding: $spacing-xl $spacing-2xl;
  }
  
  &:hover {
    border-color: rgba($neon-purple, 0.3);
    background: rgba($card-bg, 0.7);
  }
  
  h3 {
    color: $neon-purple;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: $spacing-sm;
    letter-spacing: 0.3px;
    
    @media (min-width: $desktop) {
      font-size: 0.92rem;
    }
  }
  
  p {
    color: $text-secondary;
    line-height: 1.5;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 300;
    
    @media (min-width: $desktop) {
      font-size: 0.85rem;
    }
  }
}

.final-cta {
  text-align: center;
  padding: $spacing-3xl $spacing-xl;
  margin: $spacing-3xl $spacing-md 0;
  background: linear-gradient(135deg, rgba($neon-pink, 0.1) 0%, rgba($neon-purple, 0.1) 100%);
  border-radius: $border-radius-2xl;
  border: 1px solid rgba($neon-pink, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  
  @media (min-width: $tablet) {
    margin: $spacing-3xl $spacing-lg 0;
    padding: $spacing-3xl $spacing-2xl;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, $neon-pink, $neon-purple, $neon-pink);
    border-radius: $border-radius-xl;
    opacity: 0;
    z-index: -1;
    transition: opacity $transition-normal;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
  
  @media (min-width: $desktop) {
    padding: $spacing-xl $spacing-2xl;
    max-width: 700px;
    margin: 0 auto;
  }
}

.cta-content h2 {
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  color: $text-primary;
  font-family: $font-neon;
  letter-spacing: 1px;
  
  @media (min-width: $desktop) {
    font-size: 1.5rem;
  }
}

.cta-content p {
  font-size: 1rem;
  color: $text-secondary;
  margin-bottom: $spacing-lg;
  font-weight: 300;
  
  @media (min-width: $desktop) {
    font-size: 0.95rem;
    margin-bottom: $spacing-md;
  }
}

.btn-lg {
  padding: $spacing-md $spacing-xl;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all $transition-normal;
  
  @media (min-width: $desktop) {
    padding: $spacing-md $spacing-lg;
    font-size: 0.92rem;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba($text-secondary, 0.3);
  color: $text-secondary;
  
  &:hover {
    background: rgba($text-secondary, 0.08);
    color: $text-primary;
    border-color: rgba($text-secondary, 0.5);
  }
}
</style>