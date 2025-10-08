<template>
  <div class="contact-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="neon-text pink">Contacto</span>
        </h1>
        <p class="page-subtitle">
          ¡Estás a un mensaje de distancia de tu cartel de neón perfecto!
        </p>
      </div>
      
      <!-- Contact Options -->
      <div class="contact-grid">
        <!-- WhatsApp Section -->
        <div class="contact-card primary">
          <div class="card-icon">
            <MessageCircle :size="48" />
          </div>
          <h2>WhatsApp</h2>
          <p>La forma más rápida de cotizar tu proyecto. Respuesta inmediata.</p>
          
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
            <Mail :size="48" />
          </div>
          <h2>Email</h2>
          <p>Para consultas detalladas o envío de archivos de diseño.</p>
          
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
            <MapPin :size="48" />
          </div>
          <h2>Ubicación</h2>
          <p>Visitanos en nuestro showroom para ver ejemplos reales.</p>
          
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
          <span class="neon-text blue">Preguntas</span> Frecuentes
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
          <h2>¿Listo para empezar?</h2>
          <p>Contactanos ahora y recibí tu cotización en minutos</p>
          <a 
            :href="whatsappConsultaUrl" 
            target="_blank" 
            class="btn btn-primary btn-lg"
          >
            <MessageCircle :size="24" />
            ¡Hablemos por WhatsApp!
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
  padding: $spacing-xl 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-2xl;
}

.page-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
}

.page-subtitle {
  font-size: 1.3rem;
  color: $text-secondary;
  max-width: 600px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-3xl;
}

.contact-card {
  background: $card-bg;
  border: 1px solid rgba($neon-blue, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  transition: all $transition-normal;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $neon-glow-md rgba($neon-blue, 0.3);
  }
  
  &.primary {
    border-color: rgba($neon-pink, 0.4);
    background: linear-gradient(135deg, rgba($neon-pink, 0.05) 0%, rgba($card-bg, 1) 100%);
    
    &:hover {
      box-shadow: $neon-glow-md rgba($neon-pink, 0.4);
    }
  }
}

.card-icon {
  color: $neon-blue;
  margin-bottom: $spacing-lg;
  
  .primary & {
    color: $neon-pink;
  }
}

.contact-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: $spacing-md;
  color: $text-primary;
}

.contact-card p {
  color: $text-secondary;
  margin-bottom: $spacing-xl;
  line-height: 1.6;
}

.whatsapp-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.contact-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: $text-secondary;
  font-weight: 500;
  
  &.vertical {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-lg;
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
  }
}

.faq-section {
  margin-bottom: $spacing-3xl;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: $spacing-2xl;
  font-family: $font-neon;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
}

.faq-item {
  background: rgba($card-bg, 0.5);
  border: 1px solid rgba($neon-purple, 0.2);
  border-radius: $border-radius-md;
  padding: $spacing-lg;
  
  h3 {
    color: $neon-purple;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }
  
  p {
    color: $text-secondary;
    line-height: 1.5;
    margin: 0;
  }
}

.final-cta {
  text-align: center;
  padding: $spacing-3xl;
  background: linear-gradient(135deg, rgba($neon-pink, 0.1) 0%, rgba($neon-purple, 0.1) 100%);
  border-radius: $border-radius-xl;
  border: 1px solid rgba($neon-pink, 0.2);
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  color: $text-primary;
  font-family: $font-neon;
}

.cta-content p {
  font-size: 1.2rem;
  color: $text-secondary;
  margin-bottom: $spacing-xl;
}

.btn-lg {
  padding: $spacing-lg $spacing-2xl;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  
  &:hover {
    transform: translateY(-2px);
  }
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
</style>