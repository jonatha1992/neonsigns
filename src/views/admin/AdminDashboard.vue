<template>
  <div class="flex flex-col gap-6 mt-6 text-white">
    <!-- Page Heading -->
    <section class="flex flex-col gap-0.5">
      <h1 class="text-2xl font-bold tracking-wide">Panel de galería</h1>
    </section>

    <!-- Summary Cards Grid -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Items Publicados Card -->
      <article class="bg-gray-900/90 border border-neon-cyan/12 rounded-lg p-4 flex flex-col gap-1.5">
        <header class="text-xs tracking-wider uppercase text-gray-400/80">Items publicados</header>
        <p class="text-3xl font-bold text-white">{{ stats.totalItems }}</p>
        <p class="text-xs text-gray-300/85">Activos: {{ stats.activeItems }}</p>
      </article>

      <!-- Destacados Card -->
      <article class="bg-gray-900/90 border border-neon-cyan/12 rounded-lg p-4 flex flex-col gap-1.5">
        <header class="text-xs tracking-wider uppercase text-gray-400/80">Destacados</header>
        <p class="text-3xl font-bold text-white">{{ stats.featuredItems }}</p>
        <p class="text-xs text-gray-300/85">{{ featuredSlotsText }}</p>
      </article>

      <!-- Inactivos Card -->
      <article class="bg-gray-900/90 border border-neon-cyan/12 rounded-lg p-4 flex flex-col gap-1.5">
        <header class="text-xs tracking-wider uppercase text-gray-400/80">Inactivos</header>
        <p class="text-3xl font-bold text-white">{{ inactiveItems }}</p>
        <p class="text-xs text-gray-300/85">Ocultos para el público</p>
      </article>

      <!-- Categorías Card -->
      <article class="bg-gray-900/90 border border-neon-cyan/12 rounded-lg p-4 flex flex-col gap-1.5">
        <header class="text-xs tracking-wider uppercase text-gray-400/80">Categorías</header>
        <p class="text-3xl font-bold text-white">{{ categoryEntries.length }}</p>
        <p class="text-xs text-gray-300/85">{{ mostPopularCategory }}</p>
      </article>
    </section>

    <!-- Panel Group: Latest Items & Categories Distribution -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Latest Items Panel -->
      <section class="flex flex-col gap-3 p-5 border bg-gray-900/92 border-neon-cyan/10 rounded-xl">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-xl font-semibold">Últimos items cargados</h2>
          <router-link
            to="/galeria"
            class="text-sm text-neon-cyan hover:border-neon-cyan/60 border-b border-transparent pb-0.5 transition-colors"
          >
            Ver galería
          </router-link>
        </div>

        <!-- Table -->
        <div v-if="latestItems.length" class="overflow-hidden border border-neon-cyan/8 rounded-xl">
          <table class="w-full text-sm border-collapse">
            <thead class="tracking-wider uppercase bg-neon-cyan/8">
              <tr>
                <th class="px-4 py-2 font-semibold text-left text-gray-400/85">Título</th>
                <th class="px-4 py-2 font-semibold text-left text-gray-400/85">Categoría</th>
                <th class="px-4 py-2 font-semibold text-left text-gray-400/85">Estado</th>
                <th class="px-4 py-2 font-semibold text-left text-gray-400/85">Actualizado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in latestItems"
                :key="item.id"
                class="transition-colors odd:bg-gray-900/60 hover:bg-neon-cyan/8"
              >
                <td class="px-4 py-2 align-middle border-t border-neon-cyan/5">
                  <span class="block font-semibold mb-0.5">{{ item.name }}</span>
                  <router-link
                    :to="`/trabajo/${item.id}`"
                    class="text-xs border-b border-transparent text-neon-cyan/80 hover:border-neon-cyan/60"
                  >
                    Editar
                  </router-link>
                </td>
                <td class="px-4 py-2 align-middle border-t border-neon-cyan/5">
                  {{ getCategoryLabel(item.category) }}
                </td>
                <td class="px-4 py-2 align-middle border-t border-neon-cyan/5">
                  <span
                    class="inline-flex items-center px-2 py-1 text-xs rounded"
                    :class="{
                      'bg-green-500/12 text-green-400/90': !item.featured,
                      'bg-pink-500/12 text-pink-400/90': item.featured
                    }"
                  >
                    {{ itemStatus(item) }}
                  </span>
                </td>
                <td class="px-4 py-2 align-middle border-t border-neon-cyan/5">
                  {{ formatUpdatedAt((item as any).updatedAt || (item as any).createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="p-6 text-sm border border-dashed rounded-lg text-gray-400/80 bg-gray-900/80 border-neon-cyan/15">
          Todavía no se subieron elementos. Hacé clic en "Agregar item" para empezar.
        </p>
      </section>

      <!-- Categories Distribution Panel -->
      <section class="flex flex-col gap-3 p-5 border bg-gray-900/92 border-neon-cyan/10 rounded-xl">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-lg font-semibold">Distribución por categorías</h2>
          <span class="text-xs text-gray-400/80">Referenciada directamente desde Firestore</span>
        </div>

        <ul v-if="categoryEntries.length" class="flex flex-col gap-3">
          <li v-for="([category, count]) in categoryEntries" :key="category" class="flex flex-col gap-0.5">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold">{{ getCategoryLabel(category) }}</span>
              <small class="text-gray-400/80">{{ getCategoryPercentage(count) }}%</small>
            </div>
            <div class="w-full h-1.5 rounded-full bg-gray-400/15 overflow-hidden">
              <span
                class="block h-full bg-gradient-to-r from-neon-cyan/80 to-neon-purple/70"
                :style="{ width: getCategoryPercentage(count) + '%' }"
              ></span>
            </div>
            <small class="text-gray-400/80">{{ count }} item{{ count === 1 ? '' : 's' }}</small>
          </li>
        </ul>

        <p v-else class="p-6 text-sm border border-dashed rounded-lg text-gray-400/80 bg-gray-900/80 border-neon-cyan/15">
          Cuando cargues contenido verás el desglose por categoría.
        </p>
      </section>
    </div>

    <!-- Quick Actions Panel -->
    <section class="flex flex-col gap-4 p-5 border bg-gray-900/92 border-neon-cyan/10 rounded-xl">
      <div class="flex items-baseline justify-between gap-2">
        <h2 class="text-lg font-semibold">Acciones rápidas</h2>
      </div>
      <div class="flex flex-wrap gap-3">
        <router-link
          to="/galeria"
          class="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-br from-neon-pink/90 to-neon-purple/80 text-white hover:shadow-neon-pink/35 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
        >
          <i class="text-sm fas fa-plus"></i>
          Agregar item
        </router-link>
        <router-link
          to="/galeria"
          class="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-neon-cyan/15 text-white hover:border-neon-cyan/40 hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm"
        >
          <i class="text-sm fas fa-star"></i>
          Ajustar destacados
        </router-link>
        <router-link
          to="/galeria"
          class="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-neon-cyan/15 text-white hover:border-neon-cyan/40 hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm"
        >
          <i class="text-sm fas fa-eye-slash"></i>
          Ver inactivos
        </router-link>
      </div>
    </section>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black/88 flex items-center justify-center z-[2000]">
      <div class="p-8 text-center border rounded-xl bg-gray-900/95 border-neon-cyan/25">
        <div class="mb-4">
          <NeonSpinner size="large" color="cyan" />
        </div>
        <p class="m-0 text-sm text-gray-300/90">Cargando datos del dashboard…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types'
import { CATEGORY_LABELS, normalizeCategory, resolveCategoryLabel } from '@/utils/categories'
import NeonSpinner from '@/components/common/NeonSpinner.vue'

// Reactive state
const loading = ref(true)
const productsStore = useProductsStore()
const items = ref<Product[]>([])

const buildEmptyCategoryTotals = (): Record<string, number> => {
  return Object.keys(CATEGORY_LABELS).reduce((acc, key) => {
    acc[key] = 0
    return acc
  }, {} as Record<string, number>)
}

// Stats
const stats = ref<{
  totalItems: number;
  activeItems: number;
  featuredItems: number;
  itemsByCategory: Record<string, number>;
  itemsChange: number;
  visitsToday: number;
}>({
  totalItems: 0,
  activeItems: 0,
  featuredItems: 0,
  itemsByCategory: buildEmptyCategoryTotals(),
  itemsChange: 3, // Simulado
  visitsToday: 127 // Simulado
})

// Computed properties
const latestItems = computed(() => {
  return [...items.value].slice(0, 6)
})

const categoryEntries = computed(() => {
  return Object.entries(stats.value.itemsByCategory).filter(([, count]) => count > 0)
})

const inactiveItems = computed(() => {
  return Math.max(stats.value.totalItems - stats.value.activeItems, 0)
})

const featuredSlotsText = computed(() => {
  const remaining = Math.max(4 - stats.value.featuredItems, 0)
  return remaining === 0 ? 'Cupo completo' : `Espacios libres: ${remaining}`
})

const mostPopularCategory = computed(() => {
  if (categoryEntries.value.length === 0) return 'Sin datos'
  const sorted = [...categoryEntries.value].sort(([, a], [, b]) => b - a)
  const top = sorted[0]
  if (!top) return 'Sin datos'
  const [category, count] = top as [string, number]
  return count > 0 ? `Más pedidos: ${getCategoryLabel(category)}` : 'Sin datos'
})

// Methods
const loadDashboardData = async () => {
  try {
    loading.value = true

    await productsStore.fetchProducts()
    items.value = productsStore.products

    const allProducts = productsStore.products
    const categoryCount = buildEmptyCategoryTotals()

    allProducts.forEach(product => {
      const normalized = normalizeCategory(product.category) ?? 'custom'
      categoryCount[normalized] = (categoryCount[normalized] || 0) + 1
    })

    stats.value = {

      totalItems: allProducts.length,
      activeItems: allProducts.length,
      featuredItems: allProducts.filter(p => p.featured).length,
      itemsByCategory: categoryCount,
      itemsChange: 3,
      visitsToday: 127
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryLabel = (category: string): string => {
  return resolveCategoryLabel(category)
}

const getCategoryPercentage = (count: number): number => {
  if (stats.value.totalItems === 0) return 0
  return Math.round((count / stats.value.totalItems) * 100)
}

const formatUpdatedAt = (timestamp: any) => {
  if (!timestamp) return 'Sin fecha'
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

const itemStatus = (item: Product) => {
  if (item.featured) return 'Destacado'
  return 'Publicado'
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
/* Estilos mínimos para responsive en mobile */
@media (max-width: 768px) {
  table thead {
    display: none;
  }

  table tbody tr {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  table tbody tr td {
    border: none;
    padding: 0.5rem 0;
  }

  table tbody tr td:first-child {
    grid-column: 1 / -1;
  }
}
</style>




