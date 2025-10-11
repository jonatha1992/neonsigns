import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Timestamp } from 'firebase/firestore';
import type {
    GalleryItem,
    CreateGalleryItemData,
    UpdateGalleryItemData,
    GalleryCategory
} from '@/types/gallery.types';

/**
 * Temporary Gallery Store without Firebase
 * Uses mock data for development
 */
export const useGalleryStore = defineStore('gallery', () => {
    // Mock data
    const mockItems: GalleryItem[] = [
        {
            id: '1',
            title: 'Hombre Araña - Diseño Personalizado',
            description: 'Diseño de Hombre Araña en neón LED con efectos vibrantes. Perfecto para fans y espacios temáticos.',
            category: 'personalizado',
            imageUrl: '/images/hombre araña.jpeg',
            isFeatured: true,
            orderIndex: 1,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-15T10:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-15T10:00:00Z'))
        },
        {
            id: '2',
            title: 'Pizza - Letrero Comercial',
            description: 'Letrero comercial para pizzería con diseño llamativo y colores vibrantes. Ideal para restaurantes.',
            category: 'negocios',
            imageUrl: '/images/pizza.jpeg',
            isFeatured: true,
            orderIndex: 2,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-16T11:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-16T11:00:00Z'))
        },
        {
            id: '3',
            title: 'Cerrajería - Letrero Comercial',
            description: 'Letrero profesional para cerrajería con diseño elegante y gran visibilidad nocturna.',
            category: 'negocios',
            imageUrl: '/images/cerrajeria.jpeg',
            isFeatured: false,
            orderIndex: 3,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-17T12:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-17T12:00:00Z'))
        },
        {
            id: '4',
            title: 'Tecno Alfa - Logo Empresarial',
            description: 'Logo corporativo moderno con efectos de neón profesionales. Diseño bicolor impactante.',
            category: 'negocios',
            imageUrl: '/images/tecno alfa.jpeg',
            isFeatured: true,
            orderIndex: 4,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-18T13:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-18T13:00:00Z'))
        },
        {
            id: '5',
            title: 'Happy Birthday - Celebración',
            description: 'Letrero personalizado para celebraciones especiales con diseño elegante y festivo.',
            category: 'eventos',
            imageUrl: '/images/happy birthday.jpeg',
            isFeatured: false,
            orderIndex: 5,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-19T14:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-19T14:00:00Z'))
        },
        {
            id: '6',
            title: 'Nombre Personalizado',
            description: 'Letrero personalizado con nombre en estilo elegante y moderno, perfecto para decoración.',
            category: 'hogar',
            imageUrl: '/images/nombre personalizado.jpeg',
            isFeatured: true,
            orderIndex: 6,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-20T15:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-20T15:00:00Z'))
        },
        {
            id: '7',
            title: 'Lavadero El Veci - Comercial',
            description: 'Letrero comercial para lavadero con diseño profesional y múltiples colores.',
            category: 'negocios',
            imageUrl: '/images/lavadero el veci.jpeg',
            isFeatured: false,
            orderIndex: 7,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-21T16:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-21T16:00:00Z'))
        },
        {
            id: '8',
            title: 'Pizza - Variante 2',
            description: 'Segunda versión del letrero para pizzería con diseño alternativo y efectos únicos.',
            category: 'negocios',
            imageUrl: '/images/pizza2.jpeg',
            isFeatured: false,
            orderIndex: 8,
            isActive: true,
            createdAt: Timestamp.fromDate(new Date('2024-01-22T17:00:00Z')),
            updatedAt: Timestamp.fromDate(new Date('2024-01-22T17:00:00Z'))
        }
    ];

    // State
    const items = ref<GalleryItem[]>([...mockItems]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const activeItems = computed(() => items.value.filter(item => item.isActive));
    const totalItems = computed(() => items.value.length);

    /**
     * Fetch items (simulated)
     */
    const fetchItems = async (): Promise<void> => {
        loading.value = true;
        error.value = null;

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Items are already loaded from mock data
        } catch (err) {
            error.value = 'Error al cargar elementos';
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newItem: GalleryItem = {
                id: Date.now().toString(),
                title: data.title,
                description: data.description,
                category: data.category,
                imageUrl: data.imageUrl,
                isFeatured: data.isFeatured || false,
                orderIndex: data.orderIndex || items.value.length + 1,
                isActive: data.isActive !== undefined ? data.isActive : true,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            items.value.unshift(newItem);
            return newItem;
        } catch (err) {
            error.value = 'Error al crear elemento';
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const itemIndex = items.value.findIndex(item => item.id === id);
            if (itemIndex === -1) {
                throw new Error('Item no encontrado');
            }

            const currentItem = items.value[itemIndex];
            if (!currentItem) {
                throw new Error('Item no encontrado');
            }

            items.value[itemIndex] = {
                ...currentItem,
                ...data,
                id: currentItem.id, // Ensure id is preserved
                updatedAt: Timestamp.now()
            } as GalleryItem;

            return true;
        } catch (err) {
            error.value = 'Error al actualizar elemento';
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const itemIndex = items.value.findIndex(item => item.id === id);
            if (itemIndex === -1) {
                throw new Error('Item no encontrado');
            }

            items.value.splice(itemIndex, 1);
            return true;
        } catch (err) {
            error.value = 'Error al eliminar elemento';
            return false;
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

    return {
        // State
        items,
        loading,
        error,

        // Getters
        activeItems,
        totalItems,

        // Actions
        fetchItems,
        createItem,
        updateItem,
        deleteItem,
        clearError
    };
});