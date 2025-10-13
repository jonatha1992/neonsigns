import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGalleryStore } from '@/stores/gallery';
import type {
  CreateGalleryItemData,
  UpdateGalleryItemData,
  GalleryFilters,
  GallerySortOptions
} from '@/types/gallery.types';

/**
 * Composable for gallery operations
 * Provides reactive access to gallery state and methods
 */
export function useGallery() {
  const galleryStore = useGalleryStore();

  // Use storeToRefs to maintain reactivity when destructuring store state
  const {
    items,
    featuredItems,
    currentItem,
    loading,
    error,
    stats
  } = storeToRefs(galleryStore);

  // Computed properties from store (these are already computed, just extract them)
  const activeItems = computed(() => galleryStore.activeItems);
  const inactiveItems = computed(() => galleryStore.inactiveItems);
  const totalItems = computed(() => galleryStore.totalItems);

  /**
   * Fetch ALL items (admin - no complex filters)
   */
  const fetchAllItems = async (): Promise<void> => {
    await galleryStore.fetchAllItems();
  };

  /**
   * Fetch all items
   */
  const fetchItems = async (filters?: GalleryFilters, sort?: GallerySortOptions): Promise<void> => {
    await galleryStore.fetchItems(filters, sort);
  };

  /**
   * Fetch featured items
   */
  const fetchFeaturedItems = async (): Promise<void> => {
    await galleryStore.fetchFeaturedItems();
  };

  /**
   * Fetch public items
   */
  const fetchPublicItems = async (): Promise<void> => {
    await galleryStore.fetchPublicItems();
  };

  /**
   * Fetch single item
   */
  const fetchItem = async (id: string): Promise<void> => {
    await galleryStore.fetchItem(id);
  };

  /**
   * Create new item
   */
  const createItem = async (data: CreateGalleryItemData) => {
    return await galleryStore.createItem(data);
  };

  /**
   * Update item
   */
  const updateItem = async (id: string, data: UpdateGalleryItemData): Promise<boolean> => {
    return await galleryStore.updateItem(id, data);
  };

  /**
   * Delete item
   */
  const deleteItem = async (id: string): Promise<boolean> => {
    return await galleryStore.deleteItem(id);
  };

  /**
   * Update order indexes
   */
  const updateOrderIndexes = async (updates: Array<{ id: string; orderIndex: number }>): Promise<boolean> => {
    return await galleryStore.updateOrderIndexes(updates);
  };

  /**
   * Toggle featured status
   */
  const toggleFeatured = async (id: string, isFeatured: boolean): Promise<boolean> => {
    return await galleryStore.toggleFeatured(id, isFeatured);
  };

  /**
   * Toggle active status
   */
  const toggleActive = async (id: string, isActive: boolean): Promise<boolean> => {
    return await galleryStore.toggleActive(id, isActive);
  };

  /**
   * Fetch statistics
   */
  const fetchStats = async (): Promise<void> => {
    await galleryStore.fetchStats();
  };

  /**
   * Get next order index
   */
  const getNextOrderIndex = async (): Promise<number> => {
    return await galleryStore.getNextOrderIndex();
  };

  /**
   * Search items
   */
  const searchItems = async (searchTerm: string) => {
    return await galleryStore.searchItems(searchTerm);
  };

  /**
   * Clear error
   */
  const clearError = (): void => {
    galleryStore.clearError();
  };

  /**
   * Reset store
   */
  const reset = (): void => {
    galleryStore.reset();
  };

  return {
    // State
    items,
    featuredItems,
    currentItem,
    loading,
    error,
    stats,
    activeItems,
    inactiveItems,
    totalItems,

    // Methods
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
}

export default useGallery;
