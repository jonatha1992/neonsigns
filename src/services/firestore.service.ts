import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  type DocumentData,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';
import type {
  GalleryItem,
  CreateGalleryItemData,
  UpdateGalleryItemData,
  GalleryFilters,
  GallerySortOptions,
  GalleryStats,
  GalleryCategory
} from '@/types/gallery.types';

const COLLECTION_NAME = 'gallery_items';

/**
 * Firestore Service
 * Handles all Firestore database operations for gallery items
 */
export class FirestoreService {
  /**
   * Create a new gallery item
   */
  static async createItem(data: CreateGalleryItemData): Promise<GalleryItem> {
    try {
      const now = Timestamp.now();
      const itemData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), itemData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Failed to retrieve created item');
      }

      return {
        id: docRef.id,
        ...docSnap.data()
      } as GalleryItem;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw new Error('Error al crear el elemento de galería');
    }
  }

  /**
   * Get ALL items without complex filters (for admin)
   * Simple query that doesn't require composite index
   */
  static async getAllItems(): Promise<GalleryItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

      const items: GalleryItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        } as GalleryItem);
      });

      // Sort in memory to avoid index requirement
      items.sort((a, b) => {
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) {
          return a.orderIndex - b.orderIndex;
        }
        return 0;
      });

      return items;
    } catch (error) {
      console.error('Error getting all gallery items:', error);
      throw new Error('Error al obtener elementos de galería');
    }
  }

  /**
   * Get a single gallery item by ID
   */
  static async getItem(id: string): Promise<GalleryItem | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as GalleryItem;
    } catch (error) {
      console.error('Error getting gallery item:', error);
      throw new Error('Error al obtener el elemento de galería');
    }
  }

  /**
   * Get all gallery items with optional filters
   */
  static async getItems(filters?: GalleryFilters, sort?: GallerySortOptions): Promise<GalleryItem[]> {
    try {
      const constraints: QueryConstraint[] = [];

      // Apply filters
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters?.isFeatured !== undefined) {
        constraints.push(where('isFeatured', '==', filters.isFeatured));
      }
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      // Apply sorting
      if (sort) {
        constraints.push(orderBy(sort.field, sort.direction));
      } else {
        // Default sorting
        constraints.push(orderBy('orderIndex', 'asc'));
      }

      // Apply limit
      if (filters?.limit) {
        constraints.push(limit(filters.limit));
      }

      const q = query(collection(db, COLLECTION_NAME), ...constraints);
      const querySnapshot = await getDocs(q);

      const items: GalleryItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        } as GalleryItem);
      });

      return items;
    } catch (error) {
      console.error('Error getting gallery items:', error);
      throw new Error('Error al obtener elementos de galería');
    }
  }

  /**
   * Get featured items (max 4)
   */
  static async getFeaturedItems(): Promise<GalleryItem[]> {
    return this.getItems(
      { isFeatured: true, isActive: true, limit: 4 },
      { field: 'orderIndex', direction: 'asc' }
    );
  }

  /**
   * Get all active items for public gallery
   * Featured items first, then others
   */
  static async getPublicItems(): Promise<GalleryItem[]> {
    try {
      const featured = await this.getItems(
        { isFeatured: true, isActive: true },
        { field: 'orderIndex', direction: 'asc' }
      );

      const nonFeatured = await this.getItems(
        { isFeatured: false, isActive: true },
        { field: 'orderIndex', direction: 'asc' }
      );

      return [...featured, ...nonFeatured];
    } catch (error) {
      console.error('Error getting public items:', error);
      throw new Error('Error al obtener elementos públicos');
    }
  }

  /**
   * Update an existing gallery item
   */
  static async updateItem(id: string, data: UpdateGalleryItemData): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw new Error('Error al actualizar el elemento de galería');
    }
  }

  /**
   * Delete a gallery item
   */
  static async deleteItem(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw new Error('Error al eliminar el elemento de galería');
    }
  }

  /**
   * Batch update order indexes
   * Used for drag & drop reordering
   */
  static async updateOrderIndexes(updates: Array<{ id: string; orderIndex: number }>): Promise<void> {
    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, orderIndex }) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.update(docRef, {
          orderIndex,
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error updating order indexes:', error);
      throw new Error('Error al actualizar el orden de elementos');
    }
  }

  /**
   * Toggle featured status
   * Ensures maximum of 4 featured items
   */
  static async toggleFeatured(id: string, isFeatured: boolean): Promise<boolean> {
    try {
      if (isFeatured) {
        // Check current featured count
        const featured = await this.getFeaturedItems();

        if (featured.length >= 4) {
          throw new Error('Ya hay 4 elementos destacados. Debes quitar uno antes de agregar otro.');
        }
      }

      await this.updateItem(id, { isFeatured });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Error toggling featured status:', error);
      throw new Error('Error al cambiar estado destacado');
    }
  }

  /**
   * Toggle active status
   */
  static async toggleActive(id: string, isActive: boolean): Promise<void> {
    try {
      await this.updateItem(id, { isActive });
    } catch (error) {
      console.error('Error toggling active status:', error);
      throw new Error('Error al cambiar estado activo');
    }
  }

  /**
   * Get statistics for admin dashboard
   */
  static async getStats(): Promise<GalleryStats> {
    try {
      const allItems = await this.getItems();

      const stats: GalleryStats = {
        totalItems: allItems.length,
        activeItems: allItems.filter(item => item.isActive).length,
        featuredItems: allItems.filter(item => item.isFeatured).length,
        itemsByCategory: {
          negocios: 0,
          personalizado: 0,
          hogar: 0,
          eventos: 0,
          decorativo: 0
        }
      };

      allItems.forEach(item => {
        stats.itemsByCategory[item.category]++;
      });

      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }

  /**
   * Get next order index for new items
   */
  static async getNextOrderIndex(): Promise<number> {
    try {
      const items = await this.getItems(undefined, { field: 'orderIndex', direction: 'desc' });

      if (items.length === 0) {
        return 0;
      }

      const firstItem = items[0];
      return (firstItem?.orderIndex ?? 0) + 1;
    } catch (error) {
      console.error('Error getting next order index:', error);
      return 0;
    }
  }

  /**
   * Search items by title or description
   */
  static async searchItems(searchTerm: string): Promise<GalleryItem[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple client-side filter
      const allItems = await this.getItems({ isActive: true });

      const lowerSearchTerm = searchTerm.toLowerCase();
      return allItems.filter(item =>
        item.title.toLowerCase().includes(lowerSearchTerm) ||
        item.description.toLowerCase().includes(lowerSearchTerm)
      );
    } catch (error) {
      console.error('Error searching items:', error);
      throw new Error('Error al buscar elementos');
    }
  }
}

export default FirestoreService;
