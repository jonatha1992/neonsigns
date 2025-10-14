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
    private static adaptGalleryItemToProduct(id: string, data: GalleryItemData): Product {
        // Mapear categorías de español a inglés
        const categoryMap: Record<string, string> = {
            'negocios': 'business',
            'hogar': 'home',
            'personalizado': 'custom',
            'eventos': 'events',
            'decorativo': 'decorative'
        }

        const mappedCategory = categoryMap[data.categoria] || data.categoria

        return {
            id,
            name: data.nombre,
            description: data.descripcion,
            price: data.precio,
            images: data.imagenes || [],
            category: mappedCategory as any,
            featured: data.destacado || false
        }
    }

    /**
     * Get all products from Firestore
     */
    static async getAllProducts(): Promise<Product[]> {
        try {
            const productsRef = collection(db, this.COLLECTION)
            const snapshot = await getDocs(productsRef)

            const products: Product[] = []
            snapshot.forEach(doc => {
                const data = doc.data() as GalleryItemData
                products.push(this.adaptGalleryItemToProduct(doc.id, data))
            })

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
            const productsRef = collection(db, this.COLLECTION)
            const q = query(
                productsRef,
                where('destacado', '==', true),
                limit(maxResults)
            )

            const snapshot = await getDocs(q)
            const products: Product[] = []

            snapshot.forEach(doc => {
                const data = doc.data() as GalleryItemData
                products.push(this.adaptGalleryItemToProduct(doc.id, data))
            })

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
            const productsRef = collection(db, this.COLLECTION)
            const q = query(
                productsRef,
                where('categoria', '==', category)
            )

            const snapshot = await getDocs(q)
            const products: Product[] = []

            snapshot.forEach(doc => {
                const data = doc.data() as GalleryItemData
                products.push(this.adaptGalleryItemToProduct(doc.id, data))
            })

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
            const productRef = doc(db, this.COLLECTION, id)
            const snapshot = await getDoc(productRef)

            if (!snapshot.exists()) {
                console.warn(`[ProductsService] Product ${id} not found`)
                return null
            }

            const data = snapshot.data() as GalleryItemData
            return this.adaptGalleryItemToProduct(snapshot.id, data)
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
            const productsRef = collection(db, this.COLLECTION)
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
            const productRef = doc(db, this.COLLECTION, id)
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
            const productRef = doc(db, this.COLLECTION, id)
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
            return allProducts.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            )
        } catch (error) {
            console.error('[ProductsService] Error searching products:', error)
            return []
        }
    }
}
