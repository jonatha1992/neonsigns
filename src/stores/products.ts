import { defineStore } from 'pinia'
import type { Product, ProductCategory, FilterOptions } from '@/types'
import { ProductsService } from '@/services/products.service'

interface ProductsState {
    products: Product[]
    featuredProducts: Product[]
    loading: boolean
    selectedCategory: ProductCategory | null
    filters: FilterOptions
}

export const useProductsStore = defineStore('products', {
    state: (): ProductsState => ({
        products: [],
        featuredProducts: [],
        loading: false,
        selectedCategory: null,
        filters: {}
    }),

    getters: {
        filteredProducts: (state) => {
            let filtered = [...state.products]

            if (state.filters.category) {
                filtered = filtered.filter(p => p.category === state.filters.category)
            }

            if (state.filters.priceRange) {
                const [min, max] = state.filters.priceRange
                filtered = filtered.filter(p => p.price >= min && p.price <= max)
            }

            if (state.filters.colors?.length) {
                filtered = filtered.filter(p =>
                    p.colors.some(color => state.filters.colors!.includes(color.name))
                )
            }

            if (state.filters.inStock) {
                filtered = filtered.filter(p => p.inStock)
            }

            if (state.filters.featured) {
                filtered = filtered.filter(p => p.featured)
            }

            return filtered
        },

        productsByCategory: (state) => {
            return (category: ProductCategory) =>
                state.products.filter(p => p.category === category)
        },

        getProductById: (state) => {
            return (id: string) => state.products.find(p => p.id === id)
        }
    },

    actions: {
        async fetchProducts() {
            this.loading = true
            try {
                // Intentar cargar desde Firestore con timeout
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                )

                this.products = await Promise.race([
                    ProductsService.getAllProducts(),
                    timeoutPromise
                ]) as Product[]

                // Si no hay productos en Firestore, usar mock como fallback
                if (this.products.length === 0) {
                    console.warn('[ProductsStore] No products found in Firestore, using mock data')
                    this.products = this.getMockProducts()
                }

                this.featuredProducts = this.products.filter(p => p.featured).slice(0, 4)

                const source = this.products.length > 0 && this.products[0] && !this.products[0].id.startsWith('mock-') ? 'Firebase' : 'Mock'
                console.log(`[ProductsStore] Loaded ${this.products.length} products from ${source}`)
                console.log(`[ProductsStore] Featured products: ${this.featuredProducts.length}`)
            } catch (error) {
                console.error('[ProductsStore] Error fetching products from Firestore:', error)
                // En caso de error, usar datos mock como fallback
                console.warn('[ProductsStore] Falling back to mock data')
                this.products = this.getMockProducts()
                this.featuredProducts = this.products.filter(p => p.featured).slice(0, 4)
            } finally {
                this.loading = false
            }
        },

        async fetchFeaturedProducts() {
            try {
                // Timeout más corto para productos destacados
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 2000)
                )

                this.featuredProducts = await Promise.race([
                    ProductsService.getFeaturedProducts(4),
                    timeoutPromise
                ]) as Product[]

                if (this.featuredProducts.length === 0) {
                    // Fallback a productos mock
                    console.warn('[ProductsStore] No featured products in Firebase, using mock')
                    this.featuredProducts = this.getMockProducts().filter(p => p.featured).slice(0, 4)
                } else {
                    console.log(`[ProductsStore] Loaded ${this.featuredProducts.length} featured products from Firebase`)
                }
            } catch (error) {
                console.error('[ProductsStore] Error fetching featured products:', error)
                this.featuredProducts = this.getMockProducts().filter(p => p.featured).slice(0, 4)
            }
        },

        async fetchProductById(id: string): Promise<Product | null> {
            try {
                // Primero buscar en el store local
                const localProduct = this.products.find(p => p.id === id)
                if (localProduct) {
                    return localProduct
                }

                // Si no está en local, buscar en Firestore
                const product = await ProductsService.getProductById(id)

                if (product) {
                    // Agregar al store local si no existe
                    if (!this.products.find(p => p.id === product.id)) {
                        this.products.push(product)
                    }
                    return product
                }

                // Fallback: buscar en mock
                const mockProduct = this.getMockProducts().find(p => p.id === id)
                return mockProduct || null
            } catch (error) {
                console.error(`[ProductsStore] Error fetching product ${id}:`, error)
                // Fallback a mock
                return this.getMockProducts().find(p => p.id === id) || null
            }
        },

        getMockProducts(): Product[] {
            // Datos mock como fallback
            return [
                {
                    id: 'mock-1',
                    name: 'Letrero Neon Personalizado',
                    description: 'Letrero de neón LED personalizable para negocios y eventos especiales.',
                    price: 25000,
                    originalPrice: 30000,
                    images: ['/images/nombre.jpeg'],
                    category: 'custom',
                    colors: [{ name: 'Multicolor', hex: '#ff0080', glowColor: '#ff0080' }],
                    sizes: [{ name: 'Mediano', dimensions: '50x30cm', price: 0 }],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 4.8,
                    reviews: 45,
                    tags: ['personalizado', 'neón', 'led']
                },
                {
                    id: 'mock-2',
                    name: 'Cartel Comercial LED',
                    description: 'Cartel luminoso para negocios con alta visibilidad nocturna.',
                    price: 35000,
                    images: ['/images/pizza.jpeg'],
                    category: 'business',
                    colors: [{ name: 'Azul Neón', hex: '#00ffff', glowColor: '#00ffff' }],
                    sizes: [{ name: 'Grande', dimensions: '80x40cm', price: 0 }],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 4.6,
                    reviews: 32,
                    tags: ['negocio', 'comercial', 'led']
                },
                {
                    id: 'mock-3',
                    name: 'Decoración Hogar Neón',
                    description: 'Elementos decorativos de neón para ambientar espacios del hogar.',
                    price: 18000,
                    originalPrice: 22000,
                    images: ['/images/harppit bithday.jpeg'],
                    category: 'home',
                    colors: [{ name: 'Rosa Neón', hex: '#ff0080', glowColor: '#ff0080' }],
                    sizes: [{ name: 'Pequeño', dimensions: '30x20cm', price: 0 }],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 4.7,
                    reviews: 28,
                    tags: ['hogar', 'decorativo', 'ambiente']
                },
                {
                    id: 'mock-4',
                    name: 'Cerrajería LED',
                    description: 'Cartel luminoso para cerrajerías y servicios. Perfecto para alta visibilidad.',
                    price: 12000,
                    images: ['/images/cerrajeria.jpeg'],
                    category: 'business',
                    colors: [{ name: 'Verde Neón', hex: '#00ff00', glowColor: '#00ff00' }],
                    sizes: [{ name: 'Estándar', dimensions: '40x15cm', price: 0 }],
                    customizable: false,
                    featured: false,
                    inStock: true,
                    rating: 4.5,
                    reviews: 67,
                    tags: ['cerrajería', 'negocio', 'comercial']
                },
                {
                    id: 'mock-5',
                    name: 'Cartel para Lavadero',
                    description: 'Señalética luminosa para lavaderos y servicios de limpieza.',
                    price: 8500,
                    originalPrice: 10000,
                    images: ['/images/lavadero.jpeg'],
                    category: 'business',
                    colors: [{ name: 'Azul', hex: '#0088ff', glowColor: '#0088ff' }],
                    sizes: [{ name: 'Pequeño', dimensions: '30x10cm', price: 0 }],
                    customizable: true,
                    featured: false,
                    inStock: true,
                    rating: 4.9,
                    reviews: 89,
                    tags: ['lavadero', 'servicio', 'negocio']
                },
                {
                    id: 'mock-6',
                    name: 'Logo Empresarial LED',
                    description: 'Logo de tu empresa en neón LED de alta calidad. Impacto visual garantizado.',
                    price: 45000,
                    images: ['/images/tecno alfa.jpeg'],
                    category: 'business',
                    colors: [{ name: 'Blanco Frío', hex: '#ffffff', glowColor: '#ffffff' }],
                    sizes: [{ name: 'Extra Grande', dimensions: '100x60cm', price: 0 }],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 4.8,
                    reviews: 23,
                    tags: ['logo', 'empresa', 'corporativo']
                }
            ]
        },

        setFilters(filters: FilterOptions) {
            this.filters = { ...this.filters, ...filters }
        },

        clearFilters() {
            this.filters = {}
        },

        setCategory(category: ProductCategory | null) {
            this.selectedCategory = category
            if (category) {
                this.filters.category = category
            } else {
                delete this.filters.category
            }
        }
    }
})