import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import FirestoreService from '@/services/firestore.service';
import type {
  GalleryItem,
  CreateGalleryItemData,
  UpdateGalleryItemData,
  GalleryFilters,
  GallerySortOptions,
  GalleryStats
} from '@/types/gallery.types';

/**
 * Gallery Store
 * Manages gallery items state and operations
 */
export const useGalleryStore = defineStore('gallery', () => {
  // State
  const items = ref<GalleryItem[]>([]);
  const featuredItems = ref<GalleryItem[]>([]);
  const currentItem = ref<GalleryItem | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const stats = ref<GalleryStats | null>(null);

  // Getters
  const activeItems = computed(() => items.value.filter(item => item.isActive));
  const inactiveItems = computed(() => items.value.filter(item => !item.isActive));
  const totalItems = computed(() => items.value.length);

  /**
   * Fetch ALL items (for admin panel - no complex filters)
   * This avoids the composite index requirement
   */
  const fetchAllItems = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      items.value = await FirestoreService.getAllItems();
      console.log('[GalleryStore] Fetched all items:', items.value.length);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar elementos';
      console.error('Error fetching all items:', err);
      items.value = []; // Ensure items is always an array
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch all items with optional filters
   */
  const fetchItems = async (filters?: GalleryFilters, sort?: GallerySortOptions): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      items.value = await FirestoreService.getItems(filters, sort);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar elementos';
      console.error('Error fetching items:', err);
      items.value = []; // Ensure items is always an array
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch featured items
   */
  const fetchFeaturedItems = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      featuredItems.value = await FirestoreService.getFeaturedItems();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar elementos destacados';
      console.error('Error fetching featured items:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch public items (for frontend gallery)
   */
  const fetchPublicItems = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      items.value = await FirestoreService.getPublicItems();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar la galería';
      console.error('Error fetching public items:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single item by ID
   */
  const fetchItem = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      currentItem.value = await FirestoreService.getItem(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar elemento';
      console.error('Error fetching item:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create new item
   */
  const createItem = async (data: CreateGalleryItemData): Promise<GalleryItem | null> => {
    loading.value = true;
    error.value = null;

    try {
      const newItem = await FirestoreService.createItem(data);
      items.value.push(newItem);
      return newItem;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear elemento';
      console.error('Error creating item:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing item
   */
  const updateItem = async (id: string, data: UpdateGalleryItemData): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await FirestoreService.updateItem(id, data);

      // Update local state
      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        const existingItem = items.value[index];
        if (existingItem) {
          items.value[index] = {
            ...existingItem,
            ...data,
            id: existingItem.id // Ensure id is preserved
          } as GalleryItem;
        }
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar elemento';
      console.error('Error updating item:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete item
   */
  const deleteItem = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await FirestoreService.deleteItem(id);

      // Remove from local state
      items.value = items.value.filter(item => item.id !== id);

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar elemento';
      console.error('Error deleting item:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update order indexes (drag & drop)
   */
  const updateOrderIndexes = async (updates: Array<{ id: string; orderIndex: number }>): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await FirestoreService.updateOrderIndexes(updates);

      // Update local state
      updates.forEach(({ id, orderIndex }) => {
        const item = items.value.find(i => i.id === id);
        if (item) {
          item.orderIndex = orderIndex;
        }
      });

      // Re-sort items
      items.value.sort((a, b) => a.orderIndex - b.orderIndex);

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar orden';
      console.error('Error updating order:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Toggle featured status
   */
  const toggleFeatured = async (id: string, isFeatured: boolean): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await FirestoreService.toggleFeatured(id, isFeatured);

      // Update local state
      const item = items.value.find(i => i.id === id);
      if (item) {
        item.isFeatured = isFeatured;
      }

      // Refresh featured items
      await fetchFeaturedItems();

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cambiar estado destacado';
      console.error('Error toggling featured:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Toggle active status
   */
  const toggleActive = async (id: string, isActive: boolean): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await FirestoreService.toggleActive(id, isActive);

      // Update local state
      const item = items.value.find(i => i.id === id);
      if (item) {
        item.isActive = isActive;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cambiar estado activo';
      console.error('Error toggling active:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch statistics
   */
  const fetchStats = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      stats.value = await FirestoreService.getStats();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      console.error('Error fetching stats:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get next order index
   */
  const getNextOrderIndex = async (): Promise<number> => {
    try {
      return await FirestoreService.getNextOrderIndex();
    } catch (err) {
      console.error('Error getting next order index:', err);
      return items.value.length;
    }
  };

  /**
   * Search items
   */
  const searchItems = async (searchTerm: string): Promise<GalleryItem[]> => {
    loading.value = true;
    error.value = null;

    try {
      return await FirestoreService.searchItems(searchTerm);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al buscar elementos';
      console.error('Error searching items:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear error
   */
  const clearError = (): void => {
    error.value = null;
  };

  /**
   * Reset store
   */
  const reset = (): void => {
    items.value = [];
    featuredItems.value = [];
    currentItem.value = null;
    loading.value = false;
    error.value = null;
    stats.value = null;
  };

  return {
    // State
    items,
    featuredItems,
    currentItem,
    loading,
    error,
    stats,

    // Getters
    activeItems,
    inactiveItems,
    totalItems,

    // Actions
    fetchAllItems,
    fetchItems,
    fetchFeaturedItems,
    fetchPublicItems,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
    updateOrderIndexes,
    toggleFeatured,
    toggleActive,
    fetchStats,
    getNextOrderIndex,
    searchItems,
    clearError,
    reset
  };
});

export default useGalleryStore;
