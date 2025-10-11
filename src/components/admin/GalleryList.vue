<template>
  <div class="gallery-list">
    <!-- Header with filters and actions -->
    <div class="list-header">
      <div class="header-left">
        <h3 class="list-title">
          <i class="fas fa-images"></i>
          Items de Galería
          <span class="item-count">({{ filteredItems.length }})</span>
        </h3>
      </div>
      
      <div class="header-right">
        <div class="filters">
          <!-- Search -->
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Buscar por título..."
              class="search-input"
            />
            <button
              v-if="searchTerm"
              @click="searchTerm = ''"
              class="clear-search"
              type="button"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Category Filter -->
          <select v-model="filterCategory" class="filter-select">
            <option value="">Todas las categorías</option>
            <option 
              v-for="category in categoryOptions" 
              :key="category.value" 
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>

          <!-- Status Filter -->
          <select v-model="filterStatus" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
            <option value="featured">Solo destacados</option>
          </select>

          <!-- Sort -->
          <select v-model="sortBy" class="filter-select">
            <option value="orderIndex">Orden personalizado</option>
            <option value="createdAt">Fecha de creación</option>
            <option value="updatedAt">Última actualización</option>
            <option value="title">Título</option>
          </select>
        </div>

        <button
          @click="$emit('create')"
          class="btn btn-primary"
          type="button"
        >
          <i class="fas fa-plus"></i>
          Agregar Item
        </button>
      </div>
    </div>

    <!-- Bulk Actions (when items are selected) -->
    <div v-if="selectedItems.length > 0" class="bulk-actions">
      <div class="bulk-info">
        <span>{{ selectedItems.length }} item{{ selectedItems.length > 1 ? 's' : '' }} seleccionado{{ selectedItems.length > 1 ? 's' : '' }}</span>
        <button @click="selectedItems = []" class="clear-selection" type="button">
          <i class="fas fa-times"></i>
          Limpiar selección
        </button>
      </div>
      
      <div class="bulk-buttons">
        <button
          @click="bulkToggleActive(true)"
          class="btn btn-sm btn-success"
          type="button"
        >
          <i class="fas fa-eye"></i>
          Activar
        </button>
        
        <button
          @click="bulkToggleActive(false)"
          class="btn btn-sm btn-warning"
          type="button"
        >
          <i class="fas fa-eye-slash"></i>
          Desactivar
        </button>
        
        <button
          @click="confirmBulkDelete"
          class="btn btn-sm btn-danger"
          type="button"
        >
          <i class="fas fa-trash"></i>
          Eliminar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando items...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-images"></i>
      </div>
      <h3>No hay items en la galería</h3>
      <p>Comienza agregando tu primera imagen de neón</p>
      <button
        @click="$emit('create')"
        class="btn btn-primary"
        type="button"
      >
        <i class="fas fa-plus"></i>
        Agregar primer item
      </button>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredItems.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-search"></i>
      </div>
      <h3>No se encontraron resultados</h3>
      <p>Intenta cambiar los filtros o el término de búsqueda</p>
      <button
        @click="clearFilters"
        class="btn btn-secondary"
        type="button"
      >
        <i class="fas fa-filter"></i>
        Limpiar filtros
      </button>
    </div>

    <!-- Items Grid/List -->
    <div v-else class="items-container">
      <!-- View Toggle -->
      <div class="view-controls">
        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="['view-btn', { active: viewMode === 'grid' }]"
            type="button"
          >
            <i class="fas fa-th"></i>
            Cuadrícula
          </button>
          <button
            @click="viewMode = 'list'"
            :class="['view-btn', { active: viewMode === 'list' }]"
            type="button"
          >
            <i class="fas fa-list"></i>
            Lista
          </button>
        </div>

        <div class="sort-direction">
          <button
            @click="toggleSortDirection"
            class="sort-btn"
            type="button"
            :title="sortDirection === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'"
          >
            <i :class="['fas', sortDirection === 'asc' ? 'fa-sort-amount-up' : 'fa-sort-amount-down']"></i>
          </button>
        </div>
      </div>

      <!-- Draggable Items Container -->
      <div
        ref="itemsContainer"
        :class="['items-grid', viewMode, { 'drag-mode': isDragMode }]"
      >
        <div
          v-for="(item, index) in sortedItems"
          :key="item.id"
          :class="['item-card', { 
            selected: selectedItems.includes(item.id),
            dragging: draggedItem === item.id,
            featured: item.isFeatured,
            inactive: !item.isActive
          }]"
          :draggable="sortBy === 'orderIndex'"
          @dragstart="onDragStart($event, item, index)"
          @dragend="onDragEnd"
          @dragover="onDragOver($event, index)"
          @drop="onDrop($event, index)"
          @click="handleItemClick(item, $event)"
        >
          <!-- Selection Checkbox -->
          <div class="item-checkbox">
            <input
              type="checkbox"
              :checked="selectedItems.includes(item.id)"
              @click.stop
              @change="toggleItemSelection(item.id)"
            />
          </div>

          <!-- Drag Handle (only visible when sorting by order) -->
          <div 
            v-if="sortBy === 'orderIndex'" 
            class="drag-handle"
            @mousedown="isDragMode = true"
            @mouseup="isDragMode = false"
          >
            <i class="fas fa-grip-vertical"></i>
          </div>

          <!-- Image -->
          <div class="item-image">
            <img :src="item.imageUrl" :alt="item.title" />
            <div class="image-overlay">
              <div class="overlay-actions">
                <button
                  @click.stop="$emit('edit', item)"
                  class="action-btn edit"
                  title="Editar"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click.stop="toggleFeatured(item)"
                  :class="['action-btn', 'featured', { active: item.isFeatured }]"
                  :title="item.isFeatured ? 'Quitar de destacados' : 'Marcar como destacado'"
                  type="button"
                >
                  <i class="fas fa-star"></i>
                </button>
                <button
                  @click.stop="toggleActive(item)"
                  :class="['action-btn', 'visibility', { active: item.isActive }]"
                  :title="item.isActive ? 'Desactivar' : 'Activar'"
                  type="button"
                >
                  <i :class="['fas', item.isActive ? 'fa-eye' : 'fa-eye-slash']"></i>
                </button>
                <button
                  @click.stop="confirmDelete(item)"
                  class="action-btn delete"
                  title="Eliminar"
                  type="button"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Status Badges -->
            <div class="item-badges">
              <span v-if="item.isFeatured" class="badge featured">
                <i class="fas fa-star"></i>
                Destacado
              </span>
              <span v-if="!item.isActive" class="badge inactive">
                <i class="fas fa-eye-slash"></i>
                Inactivo
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="item-content">
            <div class="item-header">
              <h4 class="item-title">{{ item.title }}</h4>
              <span class="item-category">{{ getCategoryLabel(item.category) }}</span>
            </div>

            <p class="item-description">{{ truncateText(item.description, 100) }}</p>

            <div class="item-meta">
              <div class="meta-item">
                <i class="fas fa-calendar"></i>
                <span>{{ formatDate(item.createdAt) }}</span>
              </div>
              <div v-if="item.price" class="meta-item price">
                <i class="fas fa-dollar-sign"></i>
                <span>${{ item.price }}</span>
              </div>
              <div class="meta-item order">
                <i class="fas fa-sort-numeric-up"></i>
                <span>Orden: {{ item.orderIndex }}</span>
              </div>
            </div>

            <!-- Quick Actions (List View) -->
            <div v-if="viewMode === 'list'" class="item-actions">
              <button
                @click="$emit('edit', item)"
                class="btn btn-sm btn-primary"
                type="button"
              >
                <i class="fas fa-edit"></i>
                Editar
              </button>
              <button
                @click="duplicateItem(item)"
                class="btn btn-sm btn-secondary"
                type="button"
              >
                <i class="fas fa-copy"></i>
                Duplicar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="page-btn"
          type="button"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
        
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="page-btn"
          type="button"
        >
          <i class="fas fa-angle-left"></i>
        </button>

        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="page-btn"
          type="button"
        >
          <i class="fas fa-angle-right"></i>
        </button>

        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="page-btn"
          type="button"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>

        <select v-model="itemsPerPage" class="per-page-select">
          <option :value="12">12 por página</option>
          <option :value="24">24 por página</option>
          <option :value="48">48 por página</option>
          <option :value="96">96 por página</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useGallery } from '@/composables/useGallery'
import type { GalleryItem, GalleryCategory } from '@/types/gallery.types'

// Props
interface Props {
  items: GalleryItem[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
interface Emits {
  (e: 'edit', item: GalleryItem): void
  (e: 'create'): void
  (e: 'delete', item: GalleryItem): void
  (e: 'bulk-delete', items: GalleryItem[]): void
  (e: 'toggle-featured', item: GalleryItem): void
  (e: 'toggle-active', item: GalleryItem): void
  (e: 'reorder', updates: Array<{ id: string; orderIndex: number }>): void
  (e: 'duplicate', item: GalleryItem): void
}

const emit = defineEmits<Emits>()

// Composables
const { toggleFeatured: toggleFeaturedItem, toggleActive: toggleActiveItem } = useGallery()

// Reactive state
const searchTerm = ref('')
const filterCategory = ref<GalleryCategory | ''>('')
const filterStatus = ref<'active' | 'inactive' | 'featured' | ''>('')
const sortBy = ref<'orderIndex' | 'createdAt' | 'updatedAt' | 'title'>('orderIndex')
const sortDirection = ref<'asc' | 'desc'>('asc')
const viewMode = ref<'grid' | 'list'>('grid')
const selectedItems = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(24)

// Drag and drop state
const draggedItem = ref<string | null>(null)
const draggedIndex = ref<number>(-1)
const isDragMode = ref(false)
const itemsContainer = ref<HTMLElement>()

// Category options
const categoryOptions = [
  { value: 'negocios', label: 'Negocios' },
  { value: 'personalizado', label: 'Personalizado' },
  { value: 'hogar', label: 'Hogar' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'decorativo', label: 'Decorativo' }
]

// Computed properties
const filteredItems = computed(() => {
  let filtered = [...props.items]

  // Text search
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    )
  }

  // Category filter
  if (filterCategory.value) {
    filtered = filtered.filter(item => item.category === filterCategory.value)
  }

  // Status filter
  if (filterStatus.value === 'active') {
    filtered = filtered.filter(item => item.isActive)
  } else if (filterStatus.value === 'inactive') {
    filtered = filtered.filter(item => !item.isActive)
  } else if (filterStatus.value === 'featured') {
    filtered = filtered.filter(item => item.isFeatured)
  }

  return filtered
})

const sortedItems = computed(() => {
  const sorted = [...filteredItems.value]

  sorted.sort((a, b) => {
    let aVal: any
    let bVal: any

    switch (sortBy.value) {
      case 'title':
        aVal = a.title.toLowerCase()
        bVal = b.title.toLowerCase()
        break
      case 'createdAt':
      case 'updatedAt':
        aVal = a[sortBy.value].toDate().getTime()
        bVal = b[sortBy.value].toDate().getTime()
        break
      default:
        aVal = a.orderIndex
        bVal = b.orderIndex
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sorted.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value)
})

// Methods
const getCategoryLabel = (category: GalleryCategory): string => {
  const option = categoryOptions.find(opt => opt.value === category)
  return option?.label || category
}

const formatDate = (timestamp: any): string => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const clearFilters = () => {
  searchTerm.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const handleItemClick = (item: GalleryItem, event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) {
    // Multi-select with Ctrl/Cmd
    toggleItemSelection(item.id)
  } else if (event.shiftKey && selectedItems.value.length > 0) {
    // Range select with Shift
    const lastSelected = selectedItems.value[selectedItems.value.length - 1]
    const lastIndex = sortedItems.value.findIndex(i => i.id === lastSelected)
    const currentIndex = sortedItems.value.findIndex(i => i.id === item.id)
    
    const start = Math.min(lastIndex, currentIndex)
    const end = Math.max(lastIndex, currentIndex)
    
    const rangeIds = sortedItems.value.slice(start, end + 1).map(i => i.id)
    selectedItems.value = [...new Set([...selectedItems.value, ...rangeIds])]
  } else {
    // Single select
    selectedItems.value = [item.id]
  }
}

const toggleItemSelection = (itemId: string) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const toggleFeatured = async (item: GalleryItem) => {
  try {
    await toggleFeaturedItem(item.id, !item.isFeatured)
    emit('toggle-featured', item)
  } catch (error) {
    console.error('Error toggling featured status:', error)
  }
}

const toggleActive = async (item: GalleryItem) => {
  try {
    await toggleActiveItem(item.id, !item.isActive)
    emit('toggle-active', item)
  } catch (error) {
    console.error('Error toggling active status:', error)
  }
}

const confirmDelete = (item: GalleryItem) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${item.title}"?`)) {
    emit('delete', item)
  }
}

const confirmBulkDelete = () => {
  const items = props.items.filter(item => selectedItems.value.includes(item.id))
  if (confirm(`¿Estás seguro de que quieres eliminar ${items.length} item${items.length > 1 ? 's' : ''}?`)) {
    emit('bulk-delete', items)
    selectedItems.value = []
  }
}

const bulkToggleActive = async (isActive: boolean) => {
  for (const itemId of selectedItems.value) {
    try {
      await toggleActiveItem(itemId, isActive)
    } catch (error) {
      console.error(`Error toggling active status for item ${itemId}:`, error)
    }
  }
  selectedItems.value = []
}

const duplicateItem = (item: GalleryItem) => {
  emit('duplicate', item)
}

// Drag and Drop Methods
const onDragStart = (event: DragEvent, item: GalleryItem, index: number) => {
  if (sortBy.value !== 'orderIndex') return
  
  draggedItem.value = item.id
  draggedIndex.value = index
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', item.id)
  }
}

const onDragEnd = () => {
  draggedItem.value = null
  draggedIndex.value = -1
  isDragMode.value = false
}

const onDragOver = (event: DragEvent, index: number) => {
  if (sortBy.value !== 'orderIndex') return
  
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent, dropIndex: number) => {
  if (sortBy.value !== 'orderIndex' || draggedIndex.value === -1) return
  
  event.preventDefault()
  
  const dragIndex = draggedIndex.value
  if (dragIndex === dropIndex) return

  // Create reorder updates
  const updates: Array<{ id: string; orderIndex: number }> = []
  const itemsCopy = [...sortedItems.value]
  
  // Move item to new position
  const [draggedItemData] = itemsCopy.splice(dragIndex, 1)
  if (draggedItemData) {
    itemsCopy.splice(dropIndex, 0, draggedItemData)
  }

  // Update order indexes
  itemsCopy.forEach((item, index) => {
    const newOrderIndex = index + 1
    if (item.orderIndex !== newOrderIndex) {
      updates.push({
        id: item.id,
        orderIndex: newOrderIndex
      })
    }
  })

  if (updates.length > 0) {
    emit('reorder', updates)
  }
}

// Watchers
watch([searchTerm, filterCategory, filterStatus], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Reset current page when filters change and no results
watch(filteredItems, (newItems) => {
  if (newItems.length === 0 && currentPage.value > 1) {
    currentPage.value = 1
  }
})
</script>

<style scoped lang="scss">
.gallery-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.header-left {
  .list-title {
    margin: 0;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    i {
      color: #3b82f6;
    }

    .item-count {
      color: #6b7280;
      font-weight: 400;
      font-size: 0.875rem;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
}

.filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex: 1;
  }
}

.search-box {
  position: relative;
  min-width: 200px;

  i {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  .clear-search {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;

    &:hover {
      color: #374151;
    }
  }
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.bulk-actions {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #374151;

  .clear-selection {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;

    &:hover {
      background: #e5e7eb;
    }
  }
}

.bulk-buttons {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;

  .loading-spinner, .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    
    i {
      color: #9ca3af;
    }
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  p {
    margin: 0 0 1.5rem 0;
    max-width: 400px;
  }
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.view-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
}

.view-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:not(:last-child) {
    border-right: 1px solid #d1d5db;
  }

  &.active {
    background: #3b82f6;
    color: white;
  }

  &:hover:not(.active) {
    background: #f9fafb;
  }
}

.sort-direction {
  .sort-btn {
    background: none;
    border: 1px solid #d1d5db;
    color: #6b7280;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  }
}

.items-grid {
  display: grid;
  gap: 1.5rem;
  
  &.grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  &.list {
    grid-template-columns: 1fr;
    gap: 1rem;

    .item-card {
      display: grid;
      grid-template-columns: auto auto 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;

      .item-image {
        width: 80px;
        height: 60px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-content {
        grid-column: 3;
        
        .item-header {
          flex-direction: row;
          align-items: center;
          gap: 1rem;
        }

        .item-description {
          margin: 0.25rem 0;
        }

        .item-meta {
          display: flex;
          gap: 1rem;
          margin: 0.5rem 0;
        }
      }

      .item-actions {
        grid-column: 4;
        display: flex;
        gap: 0.5rem;
      }
    }
  }

  &.drag-mode {
    .item-card {
      cursor: grabbing;
    }
  }
}

.item-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.dragging {
    opacity: 0.5;
    transform: rotate(5deg);
  }

  &.featured {
    border-color: #f59e0b;
  }

  &.inactive {
    opacity: 0.6;
  }
}

.item-checkbox {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: #3b82f6;
  }
}

.drag-handle {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.25rem;
  padding: 0.25rem;
  cursor: grab;
  color: #6b7280;

  &:hover {
    background: rgba(255, 255, 255, 1);
    color: #374151;
  }

  &:active {
    cursor: grabbing;
  }
}

.item-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;

  .item-card:hover & {
    opacity: 1;
  }
}

.overlay-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &.edit {
    &:hover {
      background: #3b82f6;
    }
  }

  &.featured {
    &.active, &:hover {
      background: #f59e0b;
    }
  }

  &.visibility {
    &.active {
      background: #10b981;
    }
    
    &:not(.active):hover {
      background: #f59e0b;
    }
  }

  &.delete {
    &:hover {
      background: #ef4444;
    }
  }
}

.item-badges {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &.featured {
    background: #fef3c7;
    color: #92400e;
  }

  &.inactive {
    background: #fee2e2;
    color: #991b1b;
  }
}

.item-content {
  padding: 1rem;
}

.item-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  .item-title {
    margin: 0;
    color: #1f2937;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .item-category {
    background: #f3f4f6;
    color: #6b7280;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    text-transform: capitalize;
    align-self: flex-start;
  }
}

.item-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;

    i {
      width: 12px;
      text-align: center;
    }

    &.price {
      color: #059669;
      font-weight: 600;
    }
  }
}

.item-actions {
  margin-top: 1rem;
  display: none; // Will be shown in list view
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  flex-wrap: wrap;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.page-info {
  color: #374151;
  font-size: 0.875rem;
  margin: 0 1rem;
}

.per-page-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;

  &.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }
  }

  &.btn-secondary {
    background: #e5e7eb;
    color: #374151;

    &:hover {
      background: #d1d5db;
    }
  }

  &.btn-success {
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
    }
  }

  &.btn-warning {
    background: #f59e0b;
    color: white;

    &:hover {
      background: #d97706;
    }
  }

  &.btn-danger {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }
  }
}

@media (max-width: 640px) {
  .items-grid {
    &.grid {
      grid-template-columns: 1fr;
    }

    &.list {
      .item-card {
        grid-template-columns: 1fr;
        
        .item-content {
          grid-column: 1;
        }

        .item-actions {
          grid-column: 1;
          display: flex;
        }
      }
    }
  }

  .filters {
    width: 100%;
    
    .search-box {
      min-width: auto;
      flex: 1;
    }

    .filter-select {
      flex: 1;
    }
  }
}
</style>