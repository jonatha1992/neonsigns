/**
 * Hybrid Gallery Service
 * Permite usar datos mock o Firebase dependiendo del estado
 */

import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useGalleryStore } from '@/stores/gallery'
import type { Product } from '@/types'
import type { GalleryItem } from '@/types/gallery.types'

export interface HybridGalleryConfig {
    useFirebase: boolean
    fallbackToMock: boolean
    autoDetect: boolean
}

const defaultConfig: HybridGalleryConfig = {
    useFirebase: true,
    fallbackToMock: true,
    autoDetect: true
}

export class HybridGalleryService {
    private config: HybridGalleryConfig
    private productsStore = useProductsStore()
    private galleryStore = useGalleryStore()
    private isFirebaseAvailable = ref<boolean | null>(null)
    private firebaseItemCount = ref(0)

    constructor(config: Partial<HybridGalleryConfig> = {}) {
        this.config = { ...defaultConfig, ...config }
    }

    /**
     * Detectar automáticamente si Firebase tiene datos
     */
    async detectFirebaseAvailability(): Promise<boolean> {
        if (this.isFirebaseAvailable.value !== null && !this.config.autoDetect) {
            return this.isFirebaseAvailable.value
        }

        try {
            await this.galleryStore.fetchItems()
            const hasData = this.galleryStore.items.length > 0
            this.firebaseItemCount.value = this.galleryStore.items.length
            this.isFirebaseAvailable.value = hasData

            console.log(`🔍 Firebase detection: ${hasData ? 'AVAILABLE' : 'EMPTY'} (${this.galleryStore.items.length} items)`)
            return hasData
        } catch (error) {
            console.warn('🚫 Firebase not available:', error)
            this.isFirebaseAvailable.value = false
            return false
        }
    }

    /**
     * Obtener todos los productos/items
     */
    async getAllItems(): Promise<{ items: (Product | GalleryItem)[], source: 'firebase' | 'mock' }> {
        // Si está configurado para usar Firebase
        if (this.config.useFirebase) {
            const firebaseAvailable = await this.detectFirebaseAvailability()

            if (firebaseAvailable) {
                await this.galleryStore.fetchItems()
                return {
                    items: this.galleryStore.items,
                    source: 'firebase'
                }
            }
        }

        // Fallback a datos mock
        if (this.config.fallbackToMock) {
            await this.productsStore.fetchProducts()
            return {
                items: this.productsStore.products,
                source: 'mock'
            }
        }

        // Sin datos disponibles
        return {
            items: [],
            source: 'mock'
        }
    }

    /**
     * Obtener items destacados
     */
    async getFeaturedItems(): Promise<{ items: (Product | GalleryItem)[], source: 'firebase' | 'mock' }> {
        const { items, source } = await this.getAllItems()

        let featuredItems: (Product | GalleryItem)[] = []

        if (source === 'firebase') {
            // Firebase: usar isFeatured
            featuredItems = (items as GalleryItem[])
                .filter(item => item.isFeatured && item.isActive)
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .slice(0, 4)
        } else {
            // Mock: usar featured property
            featuredItems = (items as Product[])
                .filter(item => item.featured && item.inStock)
                .slice(0, 4)
        }

        return {
            items: featuredItems,
            source
        }
    }

    /**
     * Obtener item por ID
     */
    async getItemById(id: string): Promise<{ item: Product | GalleryItem | null, source: 'firebase' | 'mock' }> {
        const { items, source } = await this.getAllItems()
        const item = items.find(item => item.id === id) || null

        return { item, source }
    }

    /**
     * Convertir GalleryItem a Product para compatibilidad
     */
    convertGalleryItemToProduct(galleryItem: GalleryItem): Product {
        return {
            id: galleryItem.id,
            name: galleryItem.title,
            description: galleryItem.description,
            price: galleryItem.price || 0,
            images: [galleryItem.imageUrl],
            category: this.mapFirebaseCategoryToMock(galleryItem.category),
            colors: [
                { name: 'Personalizable', hex: '#ffffff', glowColor: '#ffffff' }
            ],
            sizes: [
                { name: 'Personalizable', dimensions: 'A medida', price: 0 }
            ],
            customizable: true,
            featured: galleryItem.isFeatured,
            inStock: galleryItem.isActive,
            rating: 4.8,
            reviews: Math.floor(Math.random() * 100) + 20,
            tags: ['personalizado', galleryItem.category]
        }
    }

    /**
     * Convertir Product a GalleryItem para compatibilidad
     */
    convertProductToGalleryItem(product: Product): Partial<GalleryItem> {
        return {
            id: product.id,
            title: product.name,
            description: product.description,
            imageUrl: product.images[0] || '',
            category: this.mapMockCategoryToFirebase(product.category),
            price: product.price,
            isFeatured: product.featured,
            isActive: product.inStock,
            orderIndex: parseInt(product.id) || 0
        }
    }

    /**
     * Mapear categorías de Firebase a Mock
     */
    private mapFirebaseCategoryToMock(firebaseCategory: string): any {
        const mapping: Record<string, string> = {
            'negocios': 'business',
            'personalizado': 'custom',
            'hogar': 'home',
            'eventos': 'custom',
            'decorativo': 'decorative'
        }
        return mapping[firebaseCategory] || 'custom'
    }

    /**
     * Mapear categorías de Mock a Firebase
     */
    private mapMockCategoryToFirebase(mockCategory: string): any {
        const mapping: Record<string, string> = {
            'business': 'negocios',
            'custom': 'personalizado',
            'home': 'hogar',
            'decorative': 'decorativo'
        }
        return mapping[mockCategory] || 'personalizado'
    }

    /**
     * Obtener estadísticas del sistema
     */
    async getSystemStats() {
        const { items, source } = await this.getAllItems()

        return {
            source,
            totalItems: items.length,
            featuredItems: source === 'firebase'
                ? (items as GalleryItem[]).filter(i => i.isFeatured).length
                : (items as Product[]).filter(i => i.featured).length,
            firebaseAvailable: this.isFirebaseAvailable.value,
            firebaseItemCount: this.firebaseItemCount.value,
            config: this.config
        }
    }

    /**
     * Forzar el uso de un sistema específico
     */
    setDataSource(source: 'firebase' | 'mock' | 'auto') {
        if (source === 'firebase') {
            this.config.useFirebase = true
            this.config.fallbackToMock = false
        } else if (source === 'mock') {
            this.config.useFirebase = false
            this.config.fallbackToMock = true
        } else {
            this.config.useFirebase = true
            this.config.fallbackToMock = true
            this.config.autoDetect = true
        }
    }
}

// Instancia singleton
export const hybridGallery = new HybridGalleryService()

// Composable para usar en componentes Vue
export function useHybridGallery(config?: Partial<HybridGalleryConfig>) {
    const service = config ? new HybridGalleryService(config) : hybridGallery

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const getAllItems = async () => {
        isLoading.value = true
        error.value = null
        try {
            const result = await service.getAllItems()
            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error loading items'
            return { items: [], source: 'mock' as const }
        } finally {
            isLoading.value = false
        }
    }

    const getFeaturedItems = async () => {
        isLoading.value = true
        error.value = null
        try {
            const result = await service.getFeaturedItems()
            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error loading featured items'
            return { items: [], source: 'mock' as const }
        } finally {
            isLoading.value = false
        }
    }

    const getSystemStats = async () => {
        try {
            return await service.getSystemStats()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error getting stats'
            return null
        }
    }

    return {
        service,
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        getAllItems,
        getFeaturedItems,
        getSystemStats,
        setDataSource: service.setDataSource.bind(service)
    }
}

export default HybridGalleryService