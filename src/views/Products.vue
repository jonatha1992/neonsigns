<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="neon-text pink">Catálogo</span> de Productos
        </h1>
        <p class="page-subtitle">
          Descubre nuestra colección completa de carteles de neón personalizados
        </p>
      </div>
      
      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-header">
          <h3>Filtrar productos</h3>
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-filters">
            <X :size="16" />
            Limpiar filtros
          </button>
        </div>
        
        <div class="filters-grid">
          <!-- Category Filter -->
          <div class="filter-group">
            <label>Categoría</label>
            <div class="filter-options">
              <button 
                v-for="category in categories" 
                :key="category.value"
                @click="toggleCategory(category.value)"
                :class="{ active: selectedCategory === category.value }"
                class="filter-btn"
              >
                {{ category.label }}
              </button>
            </div>
          </div>
          
          <!-- Price Range Filter -->
          <div class="filter-group">
            <label>Rango de precio</label>
            <div class="filter-options">
              <button 
                v-for="range in priceRanges" 
                :key="range.label"
                @click="setPriceRange(range.value)"
                :class="{ active: isPriceRangeActive(range.value) }"
                class="filter-btn"
              >
                {{ range.label }}
              </button>
            </div>
          </div>
          
          <!-- In Stock Filter -->
          <div class="filter-group">
            <label class="checkbox-label">
              <input 
                v-model="showOnlyInStock" 
                type="checkbox" 
                @change="updateInStockFilter"
              >
              <span>Solo productos disponibles</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Results Info -->
      <div class="results-info">
        <p>Mostrando {{ filteredProducts.length }} de {{ totalProducts }} productos</p>
        
        <div class="whatsapp-cta">
          <a :href="whatsappCatalogUrl" target="_blank" class="btn btn-neon">
            <MessageCircle :size="18" />
            Consultar Catálogo
          </a>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <Package :size="64" class="empty-icon" />
        <h3>No encontramos productos</h3>
        <p>Intenta ajustar los filtros o contactanos para consultar disponibilidad.</p>
        <a :href="whatsappConsultaUrl" target="_blank" class="btn btn-primary">
          <MessageCircle :size="20" />
          Consultar Disponibilidad
        </a>
      </div>
      
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
      
      <!-- Load More (simulado) -->
      <div v-if="filteredProducts.length > 0" class="load-more-section">
        <p class="load-more-text">
          ¿No encuentras lo que buscas? Podemos crear un diseño personalizado para ti.
        </p>
        <a :href="whatsappCustomUrl" target="_blank" class="btn btn-primary btn-lg">
          <Palette :size="20" />
          Solicitar Diseño Personalizado
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, MessageCircle, Package, Palette } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'
import type { ProductCategory } from '@/types'

const productsStore = useProductsStore()

const selectedCategory = ref<ProductCategory | null>(null)
const showOnlyInStock = ref(false)
const selectedPriceRange = ref<[number, number] | null>(null)

const loading = computed(() => productsStore.loading)
const filteredProducts = computed(() => productsStore.filteredProducts)
const totalProducts = computed(() => productsStore.products.length)

const categories = [
  { value: 'business' as ProductCategory, label: 'Negocios' },
  { value: 'home' as ProductCategory, label: 'Hogar' },
  { value: 'custom' as ProductCategory, label: 'Personalizado' },
  { value: 'decorative' as ProductCategory, label: 'Decorativo' },
  { value: 'signs' as ProductCategory, label: 'Señales' },
  { value: 'letters' as ProductCategory, label: 'Letras' }
]

const priceRanges = [
  { label: 'Hasta $50', value: [0, 50] as [number, number] },
  { label: '$50 - $100', value: [50, 100] as [number, number] },
  { label: '$100 - $200', value: [100, 200] as [number, number] },
  { label: 'Más de $200', value: [200, 9999] as [number, number] }
]

const hasActiveFilters = computed(() => 
  selectedCategory.value !== null || 
  showOnlyInStock.value || 
  selectedPriceRange.value !== null
)

// WhatsApp URLs
const whatsappNumber = '+5491123456789'

const whatsappCatalogUrl = computed(() => {
  const message = 'Hola! Me gustaría recibir información completa sobre su catálogo de carteles de neón. ¿Podrían enviarme detalles y precios? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const whatsappConsultaUrl = computed(() => {
  const message = 'Hola! No encuentro exactamente lo que busco en el catálogo. ¿Podrían ayudarme a encontrar el producto ideal? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const whatsappCustomUrl = computed(() => {
  const message = 'Hola! Me interesa un diseño personalizado de cartel de neón. ¿Podrían ayudarme a crear algo único? 🌟'
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

const toggleCategory = (category: ProductCategory) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = null
    productsStore.setCategory(null)
  } else {
    selectedCategory.value = category
    productsStore.setCategory(category)
  }
}

const setPriceRange = (range: [number, number]) => {
  if (selectedPriceRange.value && 
      selectedPriceRange.value[0] === range[0] && 
      selectedPriceRange.value[1] === range[1]) {
    selectedPriceRange.value = null
    productsStore.setFilters({ priceRange: undefined })
  } else {
    selectedPriceRange.value = range
    productsStore.setFilters({ priceRange: range })
  }
}

const isPriceRangeActive = (range: [number, number]) => {
  return selectedPriceRange.value && 
         selectedPriceRange.value[0] === range[0] && 
         selectedPriceRange.value[1] === range[1]
}

const updateInStockFilter = () => {
  productsStore.setFilters({ inStock: showOnlyInStock.value || undefined })
}

const clearAllFilters = () => {
  selectedCategory.value = null
  selectedPriceRange.value = null
  showOnlyInStock.value = false
  productsStore.clearFilters()
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})
</script>

<style lang="scss" scoped>
.products-page {
  padding: $spacing-3xl 0;
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
  padding: $spacing-xl;
  margin-bottom: $spacing-2xl;
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
  gap: $spacing-xl;
  margin-bottom: $spacing-3xl;
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