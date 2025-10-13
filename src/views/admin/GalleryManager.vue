<template>
  <AdminLayout>
    <div class="flex flex-col gap-8">
      <!-- Page Heading -->
      <section class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-wide text-white">Gestión de Galería</h1>
            <p class="text-sm text-gray-400 mt-1 max-w-2xl">
              Administra todos los items de la galería de letreros de neón. Los cambios se reflejan automáticamente en el sitio público.
            </p>
          </div>
          <button
            @click="openAddForm"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-500/50"
            type="button"
          >
            <i class="fas fa-plus text-sm"></i>
            Agregar Item
          </button>
        </div>
      </section>

      <!-- Stats Summary -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-[#1a1a1a] border border-cyan-500/10 rounded-xl p-6 flex flex-col gap-2">
          <header class="text-xs uppercase text-gray-400 tracking-wider">Total Items</header>
          <p class="text-4xl font-bold text-white">{{ items?.length || 0 }}</p>
          <p class="text-xs text-gray-400">Activos: {{ activeItemsCount }}</p>
        </div>
        
        <div class="bg-[#1a1a1a] border border-cyan-500/10 rounded-xl p-6 flex flex-col gap-2">
          <header class="text-xs uppercase text-gray-400 tracking-wider">Destacados</header>
          <p class="text-4xl font-bold text-white">{{ featuredItemsCount }}</p>
          <p class="text-xs text-gray-400">{{ featuredSlotsText }}</p>
        </div>
        
        <div class="bg-[#1a1a1a] border border-cyan-500/10 rounded-xl p-6 flex flex-col gap-2">
          <header class="text-xs uppercase text-gray-400 tracking-wider">Inactivos</header>
          <p class="text-4xl font-bold text-white">{{ inactiveItemsCount }}</p>
          <p class="text-xs text-gray-400">Ocultos del público</p>
        </div>
        
        <div class="bg-[#1a1a1a] border border-cyan-500/10 rounded-xl p-6 flex flex-col gap-2">
          <header class="text-xs uppercase text-gray-400 tracking-wider">Categorías</header>
          <p class="text-4xl font-bold text-white">{{ categoriesCount }}</p>
          <p class="text-xs text-gray-400">En uso</p>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <i class="fas fa-spinner fa-spin text-5xl text-cyan-500 mb-4"></i>
        <p class="text-gray-400 text-lg">Cargando items desde Firebase...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && (!items || items.length === 0)" class="bg-[#1a1a1a] border border-cyan-500/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <i class="fas fa-images text-6xl text-gray-600 mb-6"></i>
        <h3 class="text-2xl font-semibold text-white mb-2">No hay items en la galería</h3>
        <p class="text-gray-400 mb-8 max-w-md">
          Comienza agregando tu primer letrero de neón. Los items aparecerán automáticamente en el sitio público.
        </p>
        <button
          @click="openAddForm"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50"
          type="button"
        >
          <i class="fas fa-plus"></i>
          Agregar Primer Item
        </button>
      </div>

      <!-- Gallery Table -->
      <section v-else class="bg-[#1a1a1a]/90 border border-cyan-500/10 rounded-2xl p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">Items de Galería</h2>
          <span class="text-sm text-gray-400">{{ items.length }} item{{ items.length === 1 ? '' : 's' }}</span>
        </div>

        <div class="border border-cyan-500/10 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-cyan-500/10 uppercase tracking-wider text-xs">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-gray-400">Imagen</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-400">Título</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-400">Categoría</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-400">Estado</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-400">Actualizado</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                class="border-t border-cyan-500/5 hover:bg-cyan-500/5 transition-colors"
              >
                <td class="px-4 py-3">
                  <img 
                    :src="item.imageUrl" 
                    :alt="item.title" 
                    class="w-16 h-16 object-cover rounded-lg border border-cyan-500/20"
                  />
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-col gap-1">
                    <span class="font-semibold text-white">{{ item.title }}</span>
                    <span class="text-xs text-gray-400 line-clamp-1">{{ item.description }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-300">
                  {{ getCategoryLabel(item.category) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    <span
                      v-if="item.isFeatured"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-pink-500/20 text-pink-400"
                    >
                      <i class="fas fa-star text-[10px]"></i>
                      Destacado
                    </span>
                    <span
                      :class="[
                        'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                        item.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      ]"
                    >
                      <i :class="item.isActive ? 'fas fa-check' : 'fas fa-eye-slash'" class="text-[10px]"></i>
                      {{ item.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-400 text-xs">
                  {{ formatDate(item.updatedAt || item.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="openEditForm(item)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      type="button"
                    >
                      <i class="fas fa-edit"></i>
                      Editar
                    </button>
                    <button
                      @click="confirmDelete(item)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      type="button"
                    >
                      <i class="fas fa-trash"></i>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Gallery Form Modal -->
      <GalleryForm
        :is-visible="showForm"
        :edit-item="editingItem"
        @close="handleClose"
        @success="handleSuccess"
        @error="handleError"
      />

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000] p-4"
        @click="showDeleteConfirm = false"
      >
        <div
          class="bg-[#1a1a1a] border border-cyan-500/25 rounded-xl shadow-2xl max-w-md w-full"
          @click.stop
        >
          <div class="flex items-center justify-between p-6 border-b border-cyan-500/10">
            <h3 class="text-xl font-bold text-white">Confirmar Eliminación</h3>
            <button
              @click="showDeleteConfirm = false"
              class="text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="p-6">
            <p class="text-gray-300 mb-2">¿Estás seguro de que deseas eliminar este item?</p>
            <p class="text-lg font-semibold text-white mb-4">{{ itemToDelete?.title }}</p>
            <p class="text-red-400 font-medium flex items-center gap-2 text-sm">
              <i class="fas fa-exclamation-triangle"></i>
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div class="flex gap-3 p-6 border-t border-cyan-500/10">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              type="button"
            >
              Cancelar
            </button>
            <button
              @click="handleDelete"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              type="button"
            >
              <i class="fas fa-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Feedback Toast -->
      <div
        v-if="feedbackMessage"
        :class="[
          'fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-[2100] font-semibold border',
          feedbackType === 'success' 
            ? 'bg-green-600 text-white border-green-500/50' 
            : 'bg-red-600 text-white border-red-500/50'
        ]"
      >
        <i :class="feedbackIcon"></i>
        <span>{{ feedbackMessage }}</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import GalleryForm from '@/components/admin/GalleryForm.vue'
import { useGallery } from '@/composables/useGallery'
import type { GalleryItem } from '@/types/gallery.types'

// Composables
const {
  items,
  loading,
  fetchAllItems,
  deleteItem
} = useGallery()

// Reactive state
const showForm = ref(false)
const editingItem = ref<GalleryItem | null>(null)
const showDeleteConfirm = ref(false)
const itemToDelete = ref<GalleryItem | null>(null)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')

// Computed
const feedbackIcon = computed(() => {
  return feedbackType.value === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
})

const activeItemsCount = computed(() => {
  if (!items.value || !Array.isArray(items.value)) return 0
  return items.value.filter(item => item.isActive).length
})

const featuredItemsCount = computed(() => {
  if (!items.value || !Array.isArray(items.value)) return 0
  return items.value.filter(item => item.isFeatured).length
})

const inactiveItemsCount = computed(() => {
  if (!items.value || !Array.isArray(items.value)) return 0
  return items.value.filter(item => !item.isActive).length
})

const categoriesCount = computed(() => {
  if (!items.value || !Array.isArray(items.value)) return 0
  const categories = new Set(items.value.map(item => item.category))
  return categories.size
})

const featuredSlotsText = computed(() => {
  const remaining = Math.max(4 - featuredItemsCount.value, 0)
  return remaining === 0 ? 'Cupo completo' : `Espacios libres: ${remaining}`
})

// Category labels
const categoryLabels: Record<string, string> = {
  'negocios': 'Negocios',
  'personalizado': 'Personalizado',
  'hogar': 'Hogar',
  'eventos': 'Eventos',
  'decorativo': 'Decorativo'
}

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'Sin fecha'
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Methods
const openAddForm = () => {
  editingItem.value = null
  showForm.value = true
}

const openEditForm = (item: GalleryItem) => {
  editingItem.value = item
  showForm.value = true
}

const handleClose = () => {
  showForm.value = false
  editingItem.value = null
}

const handleSuccess = async (item: GalleryItem) => {
  showForm.value = false
  const wasEditing = editingItem.value !== null
  editingItem.value = null

  // Show success message
  feedbackMessage.value = wasEditing
    ? 'Item actualizado exitosamente'
    : 'Item creado exitosamente'
  feedbackType.value = 'success'

  // Reload items from Firebase
  await fetchAllItems()

  // Clear message after 3 seconds
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 3000)
}

const handleError = (message: string) => {
  feedbackMessage.value = message
  feedbackType.value = 'error'

  setTimeout(() => {
    feedbackMessage.value = ''
  }, 5000)
}

const confirmDelete = (item: GalleryItem) => {
  itemToDelete.value = item
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return

  try {
    const success = await deleteItem(itemToDelete.value.id)

    if (success) {
      feedbackMessage.value = 'Item eliminado exitosamente'
      feedbackType.value = 'success'

      // Reload items from Firebase
      await fetchAllItems()
    } else {
      throw new Error('Error al eliminar el item')
    }
  } catch (error) {
    feedbackMessage.value = error instanceof Error ? error.message : 'Error al eliminar el item'
    feedbackType.value = 'error'
  } finally {
    showDeleteConfirm.value = false
    itemToDelete.value = null

    setTimeout(() => {
      feedbackMessage.value = ''
    }, 3000)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('[GalleryManager] ===== COMPONENT MOUNTED =====')
  console.log('[GalleryManager] Items BEFORE fetch:', items.value)
  console.log('[GalleryManager] Items is array?:', Array.isArray(items.value))
  console.log('[GalleryManager] Loading BEFORE fetch:', loading.value)
  
  await fetchAllItems()
  
  console.log('[GalleryManager] Items AFTER fetch:', items.value)
  console.log('[GalleryManager] Items length AFTER fetch:', items.value?.length)
  console.log('[GalleryManager] Loading AFTER fetch:', loading.value)
  
  // Check computed stats
  console.log('[GalleryManager] Active items count:', activeItemsCount.value)
  console.log('[GalleryManager] Featured items count:', featuredItemsCount.value)
  console.log('[GalleryManager] Inactive items count:', inactiveItemsCount.value)
  console.log('[GalleryManager] Categories count:', categoriesCount.value)
  
  console.log('[GalleryManager] ===== FETCH COMPLETED =====')
})
</script>
