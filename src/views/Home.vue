<template>
  <div class="home">
    <!-- Hero Section -->
    <HeroSection />
    
    <!-- Featured Products -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="neon-text blue">Trabajos</span> Destacados
          </h2>
          <p class="section-subtitle">
            Explora algunos de nuestros trabajos más destacados y solicita el tuyo personalizado
          </p>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        
        <div class="section-cta">
          <RouterLink to="/galeria" class="btn btn-neon btn-lg">
            Ver Galería Completa
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <Palette :size="48" />
            </div>
            <h3>Diseño Personalizado</h3>
            <p>Creamos carteles únicos según tu visión. Desde logotipos hasta frases personalizadas.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <Zap :size="48" />
            </div>
            <h3>Tecnología LED</h3>
            <p>Utilizamos la última tecnología en iluminación LED para máxima durabilidad y brillo.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <Shield :size="48" />
            </div>
            <h3>Garantía de Calidad</h3>
            <p>Todos nuestros productos incluyen garantía y soporte técnico completo.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>¿Te gustó algún trabajo?</h2>
          <p>Contactanos por WhatsApp y cotiza tu proyecto personalizado en minutos</p>
          <a 
            :href="whatsappUrl" 
            target="_blank" 
            class="btn btn-primary btn-lg cta-btn"
          >
            <MessageCircle :size="24" />
            Cotizar Ahora
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { MessageCircle, Palette, Zap, Shield } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import HeroSection from '@/components/common/HeroSection.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const productsStore = useProductsStore()

const featuredProducts = computed(() => productsStore.featuredProducts)

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappMessage = '¡Hola! Me interesa crear un cartel de neón personalizado (Zona Sur). ¿Podrían ayudarme con una cotización? 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})
</script>

<style lang="scss" scoped>
.featured-section {
  padding: $spacing-2xl 0;
  background: rgba($darker-bg, 0.5);
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-2xl;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
}

.section-subtitle {
  font-size: 1.2rem;
  color: $text-secondary;
  max-width: 600px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-2xl;
}

.section-cta {
  text-align: center;
}

.features-section {
  padding: $spacing-2xl 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-2xl;
}

.feature-card {
  text-align: center;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  background: rgba($card-bg, 0.5);
  border: 1px solid rgba($neon-blue, 0.2);
  transition: all $transition-normal;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba($card-bg, 0.8);
    box-shadow: $neon-glow-md rgba($neon-blue, 0.3);
  }
}

.feature-icon {
  color: $neon-blue;
  margin-bottom: $spacing-lg;
  display: flex;
  justify-content: center;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: $spacing-md;
  color: $text-primary;
}

.feature-card p {
  color: $text-secondary;
  line-height: 1.6;
}

.cta-section {
  padding: $spacing-2xl 0;
  background: linear-gradient(135deg, rgba($neon-pink, 0.1) 0%, rgba($neon-purple, 0.1) 100%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: $spacing-md;
  font-family: $font-neon;
  color: $text-primary;
}

.cta-content p {
  font-size: 1.2rem;
  color: $text-secondary;
  margin-bottom: $spacing-xl;
}

.cta-btn {
  font-size: 1.2rem;
  padding: $spacing-md $spacing-xl;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: $neon-glow-lg $neon-pink;
  }
}
</style>