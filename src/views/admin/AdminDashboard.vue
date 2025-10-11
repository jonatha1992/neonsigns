<template>
  <div class="admin-dashboard">
    <section class="page-heading">
      <h1>Panel de galería</h1>
      <p>Consulta un resumen claro de lo que ya está publicado y gestiona tus actualizaciones sin distracciones.</p>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <header>Items publicados</header>
        <p class="summary-value">{{ stats.totalItems }}</p>
        <p class="summary-meta">Activos: {{ stats.activeItems }}</p>
      </article>

      <article class="summary-card">
        <header>Destacados</header>
        <p class="summary-value">{{ stats.featuredItems }}</p>
        <p class="summary-meta">{{ featuredSlotsText }}</p>
      </article>

      <article class="summary-card">
        <header>Inactivos</header>
        <p class="summary-value">{{ inactiveItems }}</p>
        <p class="summary-meta">Ocultos para el público</p>
      </article>

      <article class="summary-card">
        <header>Categorías</header>
        <p class="summary-value">{{ categoryEntries.length }}</p>
        <p class="summary-meta">{{ mostPopularCategory }}</p>
      </article>
    </section>

    <div class="panel-group">
      <section class="panel">
        <div class="panel-header">
          <h2>Últimos items cargados</h2>
          <router-link to="/admin/gallery" class="panel-action">Ver galería</router-link>
        </div>

        <div v-if="latestItems.length" class="table-wrapper">
          <table class="items-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in latestItems" :key="item.id">
                <td>
                  <span class="item-title">{{ item.title }}</span>
                  <router-link :to="`/admin/gallery?edit=${item.id}`" class="inline-link">Editar</router-link>
                </td>
                <td>{{ getCategoryLabel(item.category) }}</td>
                <td>
                  <span class="status-chip" :class="{ inactive: !item.isActive, featured: item.isFeatured }">
                    {{ itemStatus(item) }}
                  </span>
                </td>
                <td>{{ formatUpdatedAt(item.updatedAt || item.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="empty-state">Todavía no se subieron elementos. Hacé clic en “Agregar item” para empezar.</p>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Distribución por categorías</h2>
          <span class="panel-caption">Referenciada directamente desde Firestore</span>
        </div>

        <ul v-if="categoryEntries.length" class="category-list">
          <li v-for="([category, count], index) in categoryEntries" :key="category" class="category-row">
            <div class="category-label">
              <span>{{ getCategoryLabel(category) }}</span>
              <small>{{ getCategoryPercentage(count) }}%</small>
            </div>
            <div class="progress">
              <span class="progress-bar" :style="{ width: getCategoryPercentage(count) + '%' }"></span>
            </div>
            <small class="category-count">{{ count }} item{{ count === 1 ? '' : 's' }}</small>
          </li>
        </ul>
        <p v-else class="empty-state">Cuando cargues contenido verás el desglose por categoría.</p>
      </section>
    </div>

    <section class="panel actions-panel">
      <div class="panel-header">
        <h2>Acciones rápidas</h2>
      </div>
      <div class="actions">
        <router-link to="/admin/gallery" class="action-btn primary">
          <i class="fas fa-plus"></i>
          Agregar item
        </router-link>
        <router-link to="/admin/gallery?filter=featured" class="action-btn">
          <i class="fas fa-star"></i>
          Ajustar destacados
        </router-link>
        <router-link to="/admin/gallery?filter=inactive" class="action-btn">
          <i class="fas fa-eye-slash"></i>
          Ver inactivos
        </router-link>
      </div>
    </section>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando datos del dashboard…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import FirestoreService from '@/services/firestore.service'
import type { GalleryItem, GalleryStats } from '@/types/gallery.types'

// Reactive state
const loading = ref(true)
const items = ref<GalleryItem[]>([])

// Stats
const stats = ref<GalleryStats & { itemsChange: number; visitsToday: number }>({
  totalItems: 0,
  activeItems: 0,
  featuredItems: 0,
  itemsByCategory: {
    negocios: 0,
    personalizado: 0,
    hogar: 0,
    eventos: 0,
    decorativo: 0
  },
  itemsChange: 3, // Simulado
  visitsToday: 127 // Simulado
})

// Category labels
const categoryLabels: Record<string, string> = {
  negocios: 'Negocios',
  personalizado: 'Personalizado',
  hogar: 'Hogar',
  eventos: 'Eventos',
  decorativo: 'Decorativo'
}

// Computed properties
const latestItems = computed(() => {
  const toMillis = (value: any) => {
    if (!value) return 0
    if (typeof value.toDate === 'function') {
      return value.toDate().getTime()
    }
    return new Date(value).getTime()
  }

  return [...items.value]
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
    .slice(0, 6)
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
  const [category, count] = sorted[0]
  return count > 0 ? `Más pedidos: ${getCategoryLabel(category)}` : 'Sin datos'
})

// Methods
const loadDashboardData = async () => {
  try {
    loading.value = true

    // Cargar estadísticas
    const statistics = await FirestoreService.getStats()
    stats.value = {
      ...statistics,
      itemsChange: 3,
      visitsToday: 127
    }

    // Cargar items más recientes
    const allItems = await FirestoreService.getItems()
    items.value = allItems

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category
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

const itemStatus = (item: GalleryItem) => {
  if (!item.isActive) return 'Inactivo'
  if (item.isFeatured) return 'Destacado'
  return 'Publicado'
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-2xl;
  color: $text-primary;
}

.page-heading {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 0.95rem;
    color: rgba($text-secondary, 0.9);
    max-width: 620px;
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: $spacing-xl;
}

.summary-card {
  background: rgba($card-bg, 0.9);
  border: 1px solid rgba($neon-blue, 0.12);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  header {
    font-size: 0.85rem;
    text-transform: uppercase;
    color: rgba($text-secondary, 0.8);
    letter-spacing: 0.05em;
  }

  .summary-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: $text-primary;
  }

  .summary-meta {
    font-size: 0.85rem;
    color: rgba($text-secondary, 0.85);
  }
}

.panel-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $spacing-xl;
}

.panel {
  background: rgba($card-bg, 0.92);
  border: 1px solid rgba($neon-blue, 0.1);
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &.actions-panel {
    gap: $spacing-lg;
  }
}

.panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $spacing-sm;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .panel-caption {
    font-size: 0.75rem;
    color: rgba($text-secondary, 0.8);
  }
}

.panel-action {
  font-size: 0.85rem;
  color: $neon-blue;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: border-color $transition-fast;

  &:hover {
    border-color: rgba($neon-blue, 0.6);
  }
}

.table-wrapper {
  border: 1px solid rgba($neon-blue, 0.08);
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  thead {
    background: rgba($neon-blue, 0.08);
    text-transform: uppercase;
    letter-spacing: 0.04em;

    th {
      padding: $spacing-sm $spacing-md;
      text-align: left;
      font-weight: 600;
      color: rgba($text-secondary, 0.85);
    }
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background: rgba($card-bg, 0.6);
      }

      &:hover {
        background: rgba($neon-blue, 0.08);
      }

      td {
        padding: $spacing-sm $spacing-md;
        border-top: 1px solid rgba($neon-blue, 0.05);
        vertical-align: middle;
      }
    }
  }
}

.item-title {
  display: block;
  font-weight: 600;
  margin-bottom: 2px;
}

.inline-link {
  font-size: 0.75rem;
  color: rgba($neon-blue, 0.8);
  text-decoration: none;
  border-bottom: 1px solid transparent;

  &:hover {
    border-color: rgba($neon-blue, 0.6);
  }
}

.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: $border-radius-sm;
  font-size: 0.75rem;
  background: rgba($neon-green, 0.12);
  color: rgba($neon-green, 0.9);

  &.inactive {
    background: rgba($neon-orange, 0.12);
    color: rgba($neon-orange, 0.85);
  }

  &.featured {
    background: rgba($neon-pink, 0.12);
    color: rgba($neon-pink, 0.9);
  }
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.category-row {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.category-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  span {
    font-weight: 600;
  }

  small {
    color: rgba($text-secondary, 0.8);
  }
}

.progress {
  width: 100%;
  height: 6px;
  border-radius: $border-radius-sm;
  background: rgba($text-secondary, 0.15);
  overflow: hidden;
}

.progress-bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba($neon-blue, 0.8), rgba($neon-purple, 0.7));
}

.category-count {
  color: rgba($text-secondary, 0.8);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-lg;
  border-radius: $border-radius-md;
  border: 1px solid rgba($neon-blue, 0.15);
  color: $text-primary;
  text-decoration: none;
  font-size: 0.85rem;
  transition: transform $transition-fast, box-shadow $transition-fast, border-color $transition-fast;

  i {
    font-size: 0.85rem;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba($neon-blue, 0.4);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  }

  &.primary {
    background: linear-gradient(120deg, rgba($neon-pink, 0.9), rgba($neon-purple, 0.8));
    border-color: transparent;
    color: white;

    &:hover {
      box-shadow: 0 10px 22px rgba($neon-pink, 0.35);
    }
  }
}

.empty-state {
  font-size: 0.85rem;
  color: rgba($text-secondary, 0.8);
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  background: rgba($card-bg, 0.8);
  border: 1px dashed rgba($neon-blue, 0.15);
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba($darker-bg, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-indicator {
  text-align: center;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  background: rgba($card-bg, 0.95);
  border: 1px solid rgba($neon-blue, 0.25);

  i {
    font-size: 1.5rem;
    color: $neon-blue;
    margin-bottom: $spacing-sm;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: rgba($text-secondary, 0.9);
  }
}

@media (max-width: 768px) {
  .panel-group {
    grid-template-columns: 1fr;
  }

  .items-table thead {
    display: none;
  }

  .items-table tbody tr {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $spacing-sm;

    td {
      border: none;
      padding: $spacing-xs 0;

      &:first-child {
        grid-column: 1 / -1;
      }
    }
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
