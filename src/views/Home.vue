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
        
        <!-- Loading State -->
        <div v-if="productsStore.loading" class="loading-state">
          <div class="neon-spinner">
            <div class="spinner-ring ring-1"></div>
            <div class="spinner-ring ring-2"></div>
            <div class="spinner-ring ring-3"></div>
            <div class="spinner-core">⚡</div>
          </div>
          <p class="loading-text neon-text pink">Cargando trabajos destacados...</p>
        </div>
        
        <!-- Products Grid -->
        <div v-else class="products-grid">
          <ProductCard 
            v-for="(product, index) in limitedFeaturedProducts" 
            :key="product.id" 
            :product="product" 
            :class="`fade-in-up delay-${index * 100}`"
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
import { computed, onMounted, ref } from 'vue'
import { MessageCircle, Palette, Zap, Shield } from 'lucide-vue-next'
import { useHybridGallery } from '@/services/hybrid-gallery.service'
import HeroSection from '@/components/common/HeroSection.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import type { Product } from '@/types'
import type { GalleryItem } from '@/types/gallery.types'

// Usar el servicio híbrido
const { getFeaturedItems, getSystemStats, isLoading, error } = useHybridGallery()

// Estado reactivo
const featuredProducts = ref<Product[]>([])
const dataSource = ref<'firebase' | 'mock'>('mock')
const systemStats = ref<any>(null)

// Productos limitados para mostrar
const limitedFeaturedProducts = computed(() => featuredProducts.value.slice(0, 4))

// Estado de carga (compatible con template existente)
const productsStore = computed(() => ({
  loading: isLoading.value
}))

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappMessage = '¡Hola! Me interesa crear un cartel de neón personalizado (Zona Sur). ¿Podrían ayudarme con una cotización? 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)

// Cargar datos híbridos
const loadData = async () => {
  try {
    const { getFeaturedItems, getSystemStats, service } = useHybridGallery()
    const { items, source } = await getFeaturedItems()
    
    // Convertir GalleryItems a Products si es necesario
    const products = items.map(item => {
      if (source === 'firebase') {
        return service.convertGalleryItemToProduct(item as GalleryItem)
      }
      return item as Product
    })
    
    featuredProducts.value = products
    dataSource.value = source
    
    // Obtener estadísticas del sistema
    systemStats.value = await getSystemStats()
    
    console.log(`🏠 Home: Cargados ${items.length} productos destacados desde ${source}`)
    if (systemStats.value) {
      console.log('📊 System stats:', systemStats.value)
    }
  } catch (err) {
    console.error('Error cargando datos en Home:', err)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.featured-section {
  padding: 3rem 0;
  background: rgba(5, 5, 5, 0.5);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: 'Orbitron', monospace;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  /* En desktop, máximo 4 columnas */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* En tablet, máximo 2 columnas */
  @media (min-width: 1024px) and (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* En móvil, 1 columna */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.section-cta {
  text-align: center;
}

.features-section {
  padding: 3rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(26, 26, 26, 0.8);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.feature-icon {
  color: #00ffff;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
}

.feature-card p {
  color: #cccccc;
  line-height: 1.6;
}

.cta-section {
  padding: 3rem 0;
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(128, 0, 255, 0.1) 100%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: 'Orbitron', monospace;
  color: #ffffff;
}

.cta-content p {
  font-size: 1.2rem;
  color: #cccccc;
  margin-bottom: 2rem;
}

.cta-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px #ff0080;
}

/* Loading State Styles */
.loading-state {
  text-align: center;
  padding: 4rem;
}

.neon-spinner {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
}

.neon-spinner .spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
}

.neon-spinner .spinner-ring.ring-1 {
  border-top-color: #ff0080;
  border-right-color: rgba(255, 0, 128, 0.3);
  animation: neonSpin 2s linear infinite;
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
}

.neon-spinner .spinner-ring.ring-2 {
  border-right-color: #00ffff;
  border-bottom-color: rgba(0, 255, 255, 0.3);
  animation: neonSpin 1.5s linear infinite reverse;
  transform: scale(0.75);
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
}

.neon-spinner .spinner-ring.ring-3 {
  border-bottom-color: #00ff00;
  border-left-color: rgba(0, 255, 0, 0.3);
  animation: neonSpin 1s linear infinite;
  transform: scale(0.5);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.neon-spinner .spinner-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: #ffff00;
  filter: drop-shadow(0 0 10px #ffff00);
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
  animation: textGlow 2s ease-in-out infinite;
}

/* Animation classes for cards */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.fade-in-up.delay-0 { animation-delay: 0ms; }
.fade-in-up.delay-100 { animation-delay: 100ms; }
.fade-in-up.delay-200 { animation-delay: 200ms; }
.fade-in-up.delay-300 { animation-delay: 300ms; }

/* Keyframe animations */
@keyframes neonSpin {
  0% { 
    transform: rotate(0deg);
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
  100% { 
    transform: rotate(360deg);
    filter: brightness(1);
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px currentColor;
  }
  50% {
    text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>