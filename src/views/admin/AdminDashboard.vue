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
  const top = sorted[0]
  if (!top) return 'Sin datos'
  const [category, count] = top as [string, number]
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

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  color: #ffffff;
}

.page-heading {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 0.95rem;
    color: rgba(204, 204, 204, 0.9);
    max-width: 620px;
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.summary-card {
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.12);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  header {
    font-size: 0.85rem;
    text-transform: uppercase;
    color: rgba(204, 204, 204, 0.8);
    letter-spacing: 0.05em;
  }

  .summary-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: #ffffff;
  }

  .summary-meta {
    font-size: 0.85rem;
    color: rgba(204, 204, 204, 0.85);
  }
}

.panel-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.panel {
  background: rgba(26, 26, 26, 0.92);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &.actions-panel {
    gap: 1.5rem;
  }
}

.panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .panel-caption {
    font-size: 0.75rem;
    color: rgba(204, 204, 204, 0.8);
  }
}

.panel-action {
  font-size: 0.85rem;
  color: #00ffff;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(0, 255, 255, 0.6);
  }
}

.table-wrapper {
  border: 1px solid rgba(0, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  thead {
    background: rgba(0, 255, 255, 0.08);
    text-transform: uppercase;
    letter-spacing: 0.04em;

    th {
      padding: 0.5rem 1rem;
      text-align: left;
      font-weight: 600;
      color: rgba(204, 204, 204, 0.85);
    }
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background: rgba(26, 26, 26, 0.6);
      }

      &:hover {
        background: rgba(0, 255, 255, 0.08);
      }

      td {
        padding: 0.5rem 1rem;
        border-top: 1px solid rgba(0, 255, 255, 0.05);
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
  color: rgba(0, 255, 255, 0.8);
  text-decoration: none;
  border-bottom: 1px solid transparent;

  &:hover {
    border-color: rgba(0, 255, 255, 0.6);
  }
}

.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  background: rgba(0, 255, 0, 0.12);
  color: rgba(0, 255, 0, 0.9);

  &.inactive {
    background: rgba(255, 69, 0, 0.12);
    color: rgba(255, 69, 0, 0.85);
  }

  &.featured {
    background: rgba(255, 0, 128, 0.12);
    color: rgba(255, 0, 128, 0.9);
  }
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-row {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
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
    color: rgba(204, 204, 204, 0.8);
  }
}

.progress {
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background: rgba(204, 204, 204, 0.15);
  overflow: hidden;
}

.progress-bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 255, 255, 0.8), rgba(128, 0, 255, 0.7));
}

.category-count {
  color: rgba(204, 204, 204, 0.8);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.15);
  color: #ffffff;
  text-decoration: none;
  font-size: 0.85rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  i {
    font-size: 0.85rem;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 255, 255, 0.4);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  }

  &.primary {
    background: linear-gradient(120deg, rgba(255, 0, 128, 0.9), rgba(128, 0, 255, 0.8));
    border-color: transparent;
    color: white;

    &:hover {
      box-shadow: 0 10px 22px rgba(255, 0, 128, 0.35);
    }
  }
}

.empty-state {
  font-size: 0.85rem;
  color: rgba(204, 204, 204, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
  background: rgba(26, 26, 26, 0.8);
  border: 1px dashed rgba(0, 255, 255, 0.15);
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.25);

  i {
    font-size: 1.5rem;
    color: #00ffff;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: rgba(204, 204, 204, 0.9);
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
    gap: 0.5rem;

    td {
      border: none;
      padding: 0.125rem 0;

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
