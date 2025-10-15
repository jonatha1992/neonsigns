<template>
  <div class="home">
    <!-- Hero Section -->
    <HeroSection />
    
    <!-- Featured Products -->
    <section id="destacados" class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="neon-text blue">TRABAJOS</span> Destacados
          </h2>
        </div>
        
        <!-- Loading State -->
        <div v-if="productsStoreLoading" class="loading-state">
          <NeonSpinner size="large" color="pink" />
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
          <p>Cotiza tu proyecto personalizado por WhatsApp o Instagram</p>
          <div class="cta-buttons">
            <a 
              :href="whatsappUrl" 
              target="_blank" 
              class="btn btn-whatsapp btn-lg cta-btn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            <a 
              :href="instagramUrl" 
              target="_blank" 
              class="btn btn-instagram btn-lg cta-btn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MessageCircle, Palette, Zap, Shield, Instagram } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useSEO } from '@/composables/useSEO'
import HeroSection from '@/components/common/HeroSection.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import NeonSpinner from '@/components/common/NeonSpinner.vue'
import type { Product } from '@/types'

// Usar el store de productos
const productsStore = useProductsStore()

// SEO Setup
const { updateSEO, generateBusinessStructuredData } = useSEO()

// Estado reactivo
const featuredProducts = ref<Product[]>([])
const dataSource = ref<'firebase' | 'mock'>('mock')
const systemStats = ref<any>(null)

// Productos limitados para mostrar
const limitedFeaturedProducts = computed(() => featuredProducts.value.slice(0, 4))

// Estado de carga (compatible con template existente)
const productsStoreLoading = computed(() => productsStore.loading)

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappMessage = '¡Hola! Me interesa crear un cartel de neón personalizado (Zona Sur). ¿Podrían ayudarme con una cotización? 🌟'
const whatsappUrl = computed(() => 
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)

// Instagram URL
const instagramUrl = 'https://www.instagram.com/neonsignsld/'

// Cargar datos
const loadData = async () => {
  try {
    // Cargar solo productos destacados primero (más rápido)
    await productsStore.fetchFeaturedProducts()
    
    featuredProducts.value = productsStore.featuredProducts
    
    // Detectar si los datos vienen de Firebase o mock
    // Si el primer producto tiene un ID que no empieza con 'mock-', viene de Firebase
    if (featuredProducts.value.length > 0 && !featuredProducts.value[0]?.id.startsWith('mock-')) {
      dataSource.value = 'firebase'
      console.log(`🏠 Home: Cargados ${featuredProducts.value.length} productos destacados desde Firebase`)
    } else {
      dataSource.value = 'mock'
      console.log(`🏠 Home: Cargados ${featuredProducts.value.length} productos destacados desde mock`)
    }
    
    // Stats del sistema
    systemStats.value = {
      totalItems: productsStore.products.length,
      featuredItems: productsStore.featuredProducts.length,
      source: dataSource.value
    }
  } catch (err) {
    console.error('Error cargando datos en Home:', err)
  }
}

onMounted(() => {
  // Configure SEO for homepage
  updateSEO({
    title: 'Cuadros NEON LeD - Carteles de Neón Personalizados | Zona Sur',
    description: 'Tienda profesional de carteles de neón personalizados en Zona Sur. Diseños únicos con efectos luminosos para tu negocio o hogar. WhatsApp: +54 9 11 4091-6764',
    keywords: 'carteles neón zona sur, letreros luminosos personalizados, señalética neon, diseño personalizado, carteles LED argentina, neon signs',
    structuredData: generateBusinessStructuredData()
  })
  
  loadData()
})
</script>

<style scoped>
.featured-section {
  padding-top: 6rem; /* Extra space to clear fixed navbar */
  padding-bottom: 3rem;
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
  gap: 1.5rem;
  margin-bottom: 3rem;

  /* Desktop: 4 columnas con ancho fijo óptimo */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, minmax(260px, 1fr));
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Tablet grande: 3 columnas */
  @media (min-width: 992px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Tablet: 2 columnas */
  @media (min-width: 768px) and (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Móvil: 1 columna con padding reducido */
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
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
  transition: all 0.15s ease;
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

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
  }
}

.cta-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-btn:hover {
  transform: translateY(-3px);
}

.btn-whatsapp {
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  border: none;
}

.btn-whatsapp:hover {
  background: linear-gradient(135deg, #2edf71, #13a087);
  box-shadow: 0 0 20px #25D366 !important;
}

.btn-instagram {
  background: linear-gradient(135deg, #E4405F, #C13584, #833AB4);
  color: white;
  border: none;
}

.btn-instagram:hover {
  background: linear-gradient(135deg, #ea4c6d, #d63f92, #9347c4);
  box-shadow: 0 0 20px #E4405F !important;
}

/* Loading State Styles */
.loading-state {
  text-align: center;
  padding: 4rem;
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