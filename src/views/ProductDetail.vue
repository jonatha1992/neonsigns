<template>
  <div class="product-detail">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">
        Inicio
      </router-link>
      <ChevronRight :size="16" />
      <router-link to="/galeria" class="breadcrumb-link">
        Galería
      </router-link>
      <ChevronRight :size="16" />
      <span v-if="product">{{ product.name }}</span>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <NeonSpinner size="large" color="cyan" />
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="not-found">
      <div class="not-found-content">
        <h2>Trabajo no encontrado</h2>
        <p>El trabajo que buscas no existe.</p>
        <router-link to="/galeria" class="btn btn-primary">
          Ver toda la galería
        </router-link>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else class="product-container">
      <!-- Product Images -->
      <div class="product-images">
        <div class="main-image">
          <img 
            :src="product.images[0]" 
            :alt="product.name"
            class="main-product-image"
          />
          <div class="image-overlay">
            <div class="overlay-content">
              <p>{{ product.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <div class="product-header">
          <div class="product-badge">{{ categoryName }}</div>
          
          <h1 class="product-title">{{ product.name }}</h1>
        </div>

        <div class="product-description-section">
          <p class="product-description">{{ product.description }}</p>
        </div>

        <!-- Product Pricing -->
        <div class="product-pricing">
          <span class="current-price">${{ formatPrice(product.price) }}</span>

        </div>

        <!-- Product Actions -->
        <div class="product-actions">
          <div class="action-buttons">
            <a 
              :href="whatsappUrlQuote"
              target="_blank"
              class="btn btn-primary btn-lg"
            >
              <MessageCircle :size="20" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <!-- Product Features -->
        <div class="product-features">
          <div class="feature">
            <Shield :size="20" />
            <span>Garantía de calidad</span>
          </div>
          <div class="feature">
            <Truck :size="20" />
            <span>Zona Sur - Buenos Aires</span>
          </div>
          <div class="feature">
            <Wrench :size="20" />
            <span>Instalación profesional</span>
          </div>
          <div class="feature">
            <Palette :size="20" />
            <span>Diseño 100% personalizable</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChevronRight, MessageCircle,
  Shield, Truck, Wrench, Palette
} from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useSEO } from '@/composables/useSEO'
import NeonSpinner from '@/components/common/NeonSpinner.vue'
import type { Product } from '@/types'

const route = useRoute()
const productsStore = useProductsStore()

// SEO Setup
const { updateSEO, generateProductStructuredData } = useSEO()

const loading = ref(true)
const product = ref<Product | null>(null)
const dataSource = ref<'firebase' | 'mock' | null>(null)

const categoryName = computed(() => {
  if (!product.value) return ''
  const categoryNames: Record<string, string> = {
    business: 'Comercial',
    custom: 'Personalizado', 
    home: 'Hogar',
    decorative: 'Decorativo',
    signs: 'Señales',
    letters: 'Letras'
  }
  return categoryNames[product.value.category] || 'Otros'
})

const whatsappUrlQuote = computed(() => {
  if (!product.value) return ''
  const whatsappNumber = '5491140916764'
  const message = `Hola! Vi su trabajo "${product.value.name}" en la galería y me gustaría algo similar. ¿Podrían ayudarme con un diseño parecido? 🌟`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

// Función para formatear precios
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

onMounted(async () => {
  loading.value = true
  const id = route.params.id as string
  try {
    // First fetch products if not loaded
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts()
    }
    
    // Find product by id
    const foundProduct = productsStore.getProductById(id)
    if (foundProduct) {
      product.value = foundProduct
      dataSource.value = 'mock'
      
      // Configure SEO for product page
      updateSEO({
        title: `${foundProduct.name} - Cartel de Neón Personalizado | Cuadros NEON LeD`,
        description: `${foundProduct.description || `Cartel de neón personalizado ${foundProduct.name}`}. Diseño único para tu negocio o hogar. WhatsApp: +54 9 11 4091-6764`,
        keywords: `${foundProduct.name}, cartel neón personalizado, ${categoryName.value.toLowerCase()}, letreros luminosos zona sur`,
        ogTitle: `${foundProduct.name} - Cartel de Neón | Cuadros NEON LeD`,
        ogDescription: foundProduct.description || `Cartel de neón personalizado ${foundProduct.name}`,
        ogImage: foundProduct.images[0] || '/og-image.jpg',
        structuredData: generateProductStructuredData(foundProduct)
      })
    } else {
      product.value = null
      
      // Configure SEO for not found
      updateSEO({
        title: 'Trabajo no encontrado - Cuadros NEON LeD',
        description: 'El trabajo que buscas no está disponible. Explora nuestra galería completa de carteles de neón personalizados.',
        keywords: 'carteles neón, galería trabajos, letreros luminosos'
      })
    }
  } catch (e) {
    product.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  padding: 1.5rem 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
  padding: 0 2rem;
  font-size: 0.8rem;
  color: #8892b0;

  .breadcrumb-link {
    color: #64ffda;
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: #ffffff;
    }
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

/* Spinner styles removed - now using NeonSpinner component */

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  text-align: center;

  .not-found-content {
    h2 {
      color: #ffffff;
      margin-bottom: 1rem;
    }

    p {
      color: #8892b0;
      margin-bottom: 2rem;
    }
  }
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 768px) {
    .product-title {
      font-size: 1.5rem !important;
    }
    
    .current-price {
      font-size: 1.75rem !important;
    }
    

    
    .product-description {
      font-size: 0.9rem !important;
    }
  }
}

.product-images {
  .main-image {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #1a1a1a;

    .main-product-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      padding: 2rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;

      .overlay-content p {
        color: #ffffff;
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
      }
    }

    &:hover {
      .main-product-image {
        transform: scale(1.05);
      }

      .image-overlay {
        transform: translateY(0);
      }
    }
  }
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .product-header {
    .product-badge {
      display: inline-block;
      background: linear-gradient(135deg, #ff0080, #00ffff);
      color: #ffffff;
      padding: 0.375rem 0.75rem;
      border-radius: 16px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    .product-title {
      color: #ffffff;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      line-height: 1.2;
    }
  }

  .product-description-section {
    .product-description {
      color: #ccd6f6;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }
  }

  .product-pricing {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid rgba(136, 136, 136, 0.2);
    border-radius: 8px;
    margin: 1rem 0;
    backdrop-filter: blur(10px);

    .current-price {
      font-size: 2.25rem;
      font-weight: 700;
      color: #00ffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      letter-spacing: 0.025em;
    }


  }



  .product-actions {
    /* push actions to the end of the info column */
    margin-top: auto;
    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &.btn-primary {
    background: linear-gradient(135deg, #ff0080, #00ffff);
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 0, 128, 0.4);
    }
  }

  &.btn-lg {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

.product-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 10px;

  .feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #8892b0;
    font-size: 0.9rem;
    
    svg {
      color: #00ff00;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }
  }
}
</style>