import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    type QueryConstraint
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Product } from '@/types'
import { StorageService } from './storage.service'
<<<<<<< HEAD
=======
import { normalizeCategory } from '@/utils/categories'
>>>>>>> dev

// Interfaz para los datos en Firestore (gallery_items)
interface GalleryItemData {
    nombre: string
    descripcion: string
    precio: number
    imagenes: string[]
    categoria: string
    destacado: boolean
    fecha_creacion?: any
    fecha_actualizacion?: any
}

/**
 * Service for managing products in Firestore
 * Collection: gallery_items (where actual data is stored)
 */
export class ProductsService {
    private static readonly COLLECTION = 'gallery_items'

    /**
     * Convierte datos de gallery_items al formato Product
     */
    private static async adaptGalleryItemToProduct(id: string, data: GalleryItemData): Promise<Product> {
<<<<<<< HEAD
        // Mapear categorías de español a inglés
        const categoryMap: Record<string, string> = {
            'negocios': 'business',
            'hogar': 'home',
            'personalizado': 'custom',
            'eventos': 'events',
            'decorativo': 'decorative'
        }

        // Support both Spanish ('categoria') and English ('category') keys
        const rawCategory = (data as any).categoria ?? (data as any).category ?? ''
        const mappedCategory = categoryMap[rawCategory] || rawCategory
        // Be tolerant of different field names (migrations may have used english keys)
        const name = (data as any).nombre || (data as any).title || (data as any).name || ''
        const description = (data as any).descripcion || (data as any).description || ''
        const price = (data as any).precio || (data as any).price || 0
        let images: string[] = []
        if (Array.isArray((data as any).imagenes) && (data as any).imagenes.length) {
            images = (data as any).imagenes
        } else if (Array.isArray((data as any).images) && (data as any).images.length) {
            images = (data as any).images
        } else if ((data as any).imageUrl) {
            images = [(data as any).imageUrl]
        } else {
            images = []
        }

=======
        const rawCategory = (data as any).categoria ?? (data as any).category ?? ''
        const mappedCategory = normalizeCategory(rawCategory) ?? 'custom'
        // Be tolerant of different field names (migrations may have used english keys)
        const name = (data as any).nombre || (data as any).title || (data as any).name || ''
        const description = (data as any).descripcion || (data as any).description || ''
        const price = (data as any).precio || (data as any).price || 0
        let images: string[] = []
        if (Array.isArray((data as any).imagenes) && (data as any).imagenes.length) {
            images = (data as any).imagenes
        } else if (Array.isArray((data as any).images) && (data as any).images.length) {
            images = (data as any).images
        } else if ((data as any).imageUrl) {
            images = [(data as any).imageUrl]
        } else {
            images = []
        }

>>>>>>> dev
        // Resolve storage paths to downloadable URLs where necessary
        const resolvedImages: string[] = []
        for (const img of images) {
            try {
                const url = await StorageService.getFileUrl(img)
                if (url) resolvedImages.push(url)
            } catch (err) {
                // fallback to the original string
                resolvedImages.push(img)
            }
        }
        // Support multiple possible boolean keys from migrations or admin forms
        const featured = (data as any).destacado ?? (data as any).featured ?? (data as any).isFeatured ?? false

        return {
            id,
            name,
            description,
            price,
            images: resolvedImages,
            category: mappedCategory as any,
            featured
        }
    }

    /**
     * Get all products from Firestore
     */
    static async getAllProducts(): Promise<Product[]> {
        try {
            const productsRef = collection(db!, this.COLLECTION)
            const snapshot = await getDocs(productsRef)

            const products: Product[] = []
            const promises: Promise<Product>[] = []
            snapshot.forEach(doc => {
                const data = doc.data() as GalleryItemData
                promises.push(this.adaptGalleryItemToProduct(doc.id, data))
            })

            const resolved = await Promise.all(promises)
            products.push(...resolved)

            console.log(`[ProductsService] Loaded ${products.length} products from Firestore`)
            return products
        } catch (error) {
            console.error('[ProductsService] Error fetching products:', error)
            throw error
        }
    }

    /**
     * Get featured products
     */
    static async getFeaturedProducts(maxResults: number = 4): Promise<Product[]> {
        try {
            const productsRef = collection(db!, this.COLLECTION)
            // Buscar por los 3 posibles campos de destacado
            const queries = [
                query(productsRef, where('destacado', '==', true), limit(maxResults)),
                query(productsRef, where('isFeatured', '==', true), limit(maxResults)),
                query(productsRef, where('featured', '==', true), limit(maxResults)),
            ]
            let products: Product[] = []
            for (const q of queries) {
                const snapshot = await getDocs(q)
                if (!snapshot.empty) {
                    const promises: Promise<Product>[] = []
                    snapshot.forEach(doc => {
                        const data = doc.data() as GalleryItemData
                        promises.push(this.adaptGalleryItemToProduct(doc.id, data))
                    })
                    const resolved = await Promise.all(promises)
                    products.push(...resolved)
                }
                if (products.length > 0) break
            }
            console.log(`[ProductsService] Loaded ${products.length} featured products`)
            return products
        } catch (error) {
            console.error('[ProductsService] Error fetching featured products:', error)
            return []
        }
    }

    /**
     * Get products by category
     */
    static async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const productsRef = collection(db!, this.COLLECTION)
            const q = query(
                productsRef,
                where('categoria', '==', category)
            )

            const snapshot = await getDocs(q)
            const products: Product[] = []

            const promises: Promise<Product>[] = []
            snapshot.forEach(doc => {
                const data = doc.data() as GalleryItemData
                promises.push(this.adaptGalleryItemToProduct(doc.id, data))
            })

            const resolved = await Promise.all(promises)
            products.push(...resolved)

            return products
        } catch (error) {
            console.error(`[ProductsService] Error fetching products by category ${category}:`, error)
            return []
        }
    }

    /**
     * Get a single product by ID
     */
    static async getProductById(id: string): Promise<Product | null> {
        try {
            const productRef = doc(db!, this.COLLECTION, id)
            const snapshot = await getDoc(productRef)

            if (!snapshot.exists()) {
                console.warn(`[ProductsService] Product ${id} not found`)
                return null
            }

            const data = snapshot.data() as GalleryItemData
            return await this.adaptGalleryItemToProduct(snapshot.id, data)
        } catch (error) {
            console.error(`[ProductsService] Error fetching product ${id}:`, error)
            return null
        }
    }

    /**
     * Add a new product (Admin only)
     */
    static async addProduct(product: Omit<Product, 'id'>): Promise<string> {
        try {
            const productsRef = collection(db!, this.COLLECTION)
            const docRef = await addDoc(productsRef, {
                ...product,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })

            console.log(`[ProductsService] Product created with ID: ${docRef.id}`)
            return docRef.id
        } catch (error) {
            console.error('[ProductsService] Error adding product:', error)
            throw error
        }
    }

    /**
     * Update an existing product (Admin only)
     */
    static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
        try {
            const productRef = doc(db!, this.COLLECTION, id)
            await updateDoc(productRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            })

            console.log(`[ProductsService] Product ${id} updated`)
        } catch (error) {
            console.error(`[ProductsService] Error updating product ${id}:`, error)
            throw error
        }
    }

    /**
     * Delete a product (Admin only)
     */
    static async deleteProduct(id: string): Promise<void> {
        try {
            const productRef = doc(db!, this.COLLECTION, id)
            await deleteDoc(productRef)

            console.log(`[ProductsService] Product ${id} deleted`)
        } catch (error) {
            console.error(`[ProductsService] Error deleting product ${id}:`, error)
            throw error
        }
    }

    /**
     * Search products by name or description
     */
    static async searchProducts(searchTerm: string): Promise<Product[]> {
        try {
            // Note: Firestore doesn't support full-text search out of the box
            // This is a simple implementation that fetches all products and filters client-side
            // For production, consider using Algolia, Elasticsearch, or Cloud Functions
            const allProducts = await this.getAllProducts()

            const searchLower = searchTerm.toLowerCase()
            return allProducts.filter(product => {
                const matchesName = product.name.toLowerCase().includes(searchLower)
                const matchesDescription = product.description.toLowerCase().includes(searchLower)
                const matchesTags = Array.isArray((product as any).tags)
                    ? (product as any).tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
                    : false

                return matchesName || matchesDescription || matchesTags
            })
        } catch (error) {
            console.error('[ProductsService] Error searching products:', error)
            return []
        }
    }
}




