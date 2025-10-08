<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="neon-text pink">Galería</span> de Trabajos
        </h1>
        <p class="page-subtitle">
          Explora nuestros trabajos realizados y diseños únicos de carteles de neón
        </p>
      </div>
      

      
      <!-- Gallery Info -->
      <div class="results-info">
        <p>{{ totalProducts }} trabajos realizados</p>
        
        <div class="whatsapp-cta">
          <a :href="whatsappCatalogUrl" target="_blank" class="btn btn-neon">
            <MessageCircle :size="18" />
            Solicitar Cotización
          </a>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
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
          :class="`animate-fade-in-up animate-delay-${Math.min(index % 3 + 1, 3)}`"
        />
      </div>
      
      <!-- Custom Work CTA -->
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
import { computed, onMounted } from 'vue'
import { MessageCircle, Package, Palette } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const productsStore = useProductsStore()

const loading = computed(() => productsStore.loading)
const allProducts = computed(() => productsStore.products)
const totalProducts = computed(() => productsStore.products.length)



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



onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})
</script>

<style lang="scss" scoped>
.products-page {
  padding: $spacing-xl 0;
  min-height: calc(100vh - 160px);
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-3xl;
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

.filters-section {
  background: rgba($card-bg, 0.5);
  border: 1px solid rgba($neon-blue, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  
  h3 {
    color: $text-primary;
    font-weight: 600;
    margin: 0;
  }
}

.clear-filters {
  background: transparent;
  border: 1px solid rgba($text-muted, 0.4);
  color: $text-muted;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 0.9rem;
  transition: all $transition-normal;
  
  &:hover {
    color: $text-primary;
    border-color: rgba($text-primary, 0.4);
  }
}

.filters-grid {
  display: grid;
  gap: $spacing-xl;
  
  @media (min-width: $tablet) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.filter-group {
  label {
    display: block;
    color: $text-primary;
    font-weight: 500;
    margin-bottom: $spacing-sm;
  }
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba($neon-blue, 0.4);
  color: $neon-blue;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all $transition-normal;
  
  &:hover {
    background: rgba($neon-blue, 0.1);
  }
  
  &.active {
    background: $neon-blue;
    color: $dark-bg;
    font-weight: 600;
  }
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  
  input[type="checkbox"] {
    accent-color: $neon-pink;
  }
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    gap: $spacing-md;
    text-align: center;
  }
  
  p {
    color: $text-secondary;
    margin: 0;
  }
}

.whatsapp-cta .btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: $spacing-3xl;
}

.loading-state {
  .spinner {
    margin: 0 auto $spacing-lg;
  }
  
  p {
    color: $text-secondary;
  }
}

.empty-state {
  .empty-icon {
    color: $text-muted;
    margin-bottom: $spacing-lg;
  }
  
  h3 {
    color: $text-primary;
    font-size: 1.5rem;
    margin-bottom: $spacing-md;
  }
  
  p {
    color: $text-secondary;
    margin-bottom: $spacing-xl;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-2xl;
}

.load-more-section {
  text-align: center;
  padding: $spacing-3xl;
  background: linear-gradient(135deg, rgba($neon-purple, 0.1) 0%, rgba($neon-pink, 0.1) 100%);
  border-radius: $border-radius-xl;
  border: 1px solid rgba($neon-purple, 0.2);
}

.load-more-text {
  font-size: 1.1rem;
  color: $text-secondary;
  margin-bottom: $spacing-xl;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
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
</style>