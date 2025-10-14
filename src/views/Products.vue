<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="neon-text pink">Galería</span> de Trabajos
        </h1>
      </div>
      

      
 
      
      <!-- Products Grid -->
      <div v-if="loading" class="loading-state">
        <NeonSpinner size="large" color="pink" />
        <p class="loading-text neon-text pink">Cargando galería de trabajos...</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div v-else-if="errorMessage" class="empty-state">
        <Package :size="64" class="empty-icon" />
        <h3>Galería temporalmente vacía</h3>
        <p>{{ errorMessage }}</p>
      </div>

      <div v-else-if="allProducts.length === 0" class="empty-state">
        <Package :size="64" class="empty-icon" />
        <h3>Cargando trabajos...</h3>
        <p>Estamos preparando nuestra galería de trabajos realizados.</p>
      </div>
      
        <div v-else class="products-grid">
          <ProductCard 
            v-for="(product, index) in allProducts" 
            :key="product.id" 
            :product="product" 
            :class="`fade-in-up delay-${(index % 8) * 50}`"
            :style="{ '--animation-delay': `${(index % 8) * 50}ms` }"
          />
        </div>      <!-- Custom Work CTA -->
      <div v-if="allProducts.length > 0" class="load-more-section">
        <p class="load-more-text">
          ¿Te gusta algún diseño? Podemos crear algo similar o completamente personalizado para ti.
        </p>
        <a :href="whatsappCustomUrl" target="_blank" class="btn btn-primary btn-lg">
          <Palette :size="20" />
          Solicitar Trabajo Personalizado
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Package, Palette } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useSEO } from '@/composables/useSEO'
import ProductCard from '@/components/product/ProductCard.vue'
import NeonSpinner from '@/components/common/NeonSpinner.vue'
import type { Product } from '@/types'

const productsStore = useProductsStore()

// SEO Setup
const { updateSEO } = useSEO()

const allProducts = ref<Product[]>([])
const dataSource = ref<'firebase' | 'mock'>('mock')
const systemStats = ref<any>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

const totalProducts = computed(() => allProducts.value.length)



// WhatsApp URLs
const whatsappNumber = '+5491140916764'

const whatsappUrl = computed(() => {
  const message = 'Hola! Vi su galería de trabajos y me interesa solicitar una cotización para un cartel de neón (Zona Sur). ¿Podrían ayudarme? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const whatsappCustomUrl = computed(() => {
    const message = 'Hola! Me interesan sus trabajos personalizados (Zona Sur). ¿Podrían ayudarme a crear algo único? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})



const loadData = async () => {
  loading.value = true
  errorMessage.value = null

  try {
    await productsStore.fetchProducts()

    if (productsStore.products.length > 0) {
      allProducts.value = [...productsStore.products]
      dataSource.value = 'mock'
    } else {
      errorMessage.value = 'No encontramos trabajos para mostrar todavía.'
    }

    systemStats.value = {
      source: dataSource.value,
      totalItems: allProducts.value.length
    }
  } catch (err) {
    console.error('Error cargando datos en Products:', err)
    errorMessage.value = 'No pudimos cargar la galería. Intentalo nuevamente más tarde.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Configure SEO for gallery page
  updateSEO({
    title: 'Galería de Trabajos - Carteles de Neón Personalizados | Zona Sur',
    description: 'Explora nuestra galería de carteles de neón personalizados realizados en Zona Sur. Diseños únicos para negocios y hogares. WhatsApp: +54 9 11 4091-6764',
    keywords: 'galería carteles neón, trabajos realizados, letreros luminosos zona sur, portfolio neon signs, diseños personalizados argentina',
    ogTitle: 'Galería de Trabajos - Carteles de Neón | Cuadros NEON LeD',
    ogDescription: 'Descubre nuestros trabajos realizados en carteles de neón personalizados. Inspirate para tu próximo proyecto.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "Galería de Carteles de Neón",
      "description": "Galería de trabajos realizados en carteles de neón personalizados",
      "url": window.location.href,
      "author": {
        "@type": "Organization",
        "name": "Cuadros NEON LeD"
      }
    }
  })
  
  loadData()
})
</script>

<style scoped>
.products-page {
  padding: 1.5rem 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  font-family: 'Orbitron', monospace;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
}

.filters-section {
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  color: #ffffff;
  font-weight: 600;
  margin: 0;
}

.clear-filters {
  background: transparent;
  border: 1px solid rgba(136, 136, 136, 0.4);
  color: #888888;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.clear-filters:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.4);
}

.filters-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.filter-group label {
  display: block;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: #00ffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(0, 255, 255, 0.1);
}

.filter-btn.active {
  background: #00ffff;
  color: #0a0a0a;
  font-weight: 600;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #ff0080;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .results-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

.results-info p {
  color: #cccccc;
  margin: 0;
}

.whatsapp-cta .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem;
}

/* Spinner styles removed - now using NeonSpinner component */

.loading-text {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: textGlow 2s ease-in-out infinite;
}

.loading-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ffff;
  box-shadow: 0 0 10px #00ffff;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

.empty-state .empty-icon {
  color: #888888;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #cccccc;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-state .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .products-page {
    padding: 1rem 0;
  }
}

.load-more-section {
  text-align: center;
  padding: 4rem;
  background: linear-gradient(135deg, rgba(128, 0, 255, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(128, 0, 255, 0.2);
}

.load-more-text {
  font-size: 1.1rem;
  color: #cccccc;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.btn-lg {
  padding: 1.5rem 3rem;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-lg:hover {
  transform: translateY(-2px);
}

/* Keyframe animations */

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px currentColor;
  }
  50% {
    text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.7;
  }
  40% {
    transform: scale(1.2) translateY(-10px);
    opacity: 1;
    box-shadow: 0 0 15px currentColor;
  }
}

/* Animaciones stagger para las cards */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  animation: fadeInUpCard 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--animation-delay);
}

@keyframes fadeInUpCard {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Clases de delay específicas (0ms a 200ms) - Más rápido */
.delay-0 { animation-delay: 0ms; }
.delay-25 { animation-delay: 25ms; }
.delay-50 { animation-delay: 50ms; }
.delay-75 { animation-delay: 75ms; }
.delay-100 { animation-delay: 100ms; }
.delay-125 { animation-delay: 125ms; }
.delay-150 { animation-delay: 150ms; }
.delay-175 { animation-delay: 175ms; }
.delay-200 { animation-delay: 200ms; }
</style>