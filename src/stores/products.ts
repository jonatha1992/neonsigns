import { defineStore } from 'pinia'
import type { Product, ProductCategory, FilterOptions } from '@/types'

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
                // Simulamos datos hasta que tengas un backend
                await this.loadMockProducts()
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                this.loading = false
            }
        },

        async loadMockProducts() {
            // Datos de ejemplo para la tienda
            this.products = [
                {
                    id: '1',
                    name: 'Cartel "OPEN" Clásico',
                    description: 'Cartel de neón clásico para negocios. Perfecto para restaurantes, tiendas y oficinas.',
                    price: 89.99,
                    originalPrice: 120.00,
                    images: ['/images/open-neon-1.jpg', '/images/open-neon-2.jpg'],
                    category: 'business',
                    colors: [
                        { name: 'Rojo', hex: '#ff0000', glowColor: '#ff6666' },
                        { name: 'Azul', hex: '#0066ff', glowColor: '#66b3ff' }
                    ],
                    sizes: [
                        { name: 'Pequeño', dimensions: '30x15 cm', price: 0 },
                        { name: 'Mediano', dimensions: '45x22 cm', price: 25 },
                        { name: 'Grande', dimensions: '60x30 cm', price: 50 }
                    ],
                    customizable: false,
                    featured: true,
                    inStock: true,
                    rating: 4.8,
                    reviews: 156,
                    tags: ['negocio', 'clásico', 'popular']
                },
                {
                    id: '2',
                    name: 'Letra Personalizada',
                    description: 'Crea tu propio diseño con letras de neón personalizadas. Ideal para nombres y frases únicas.',
                    price: 45.99,
                    images: ['/images/custom-letter-1.jpg', '/images/custom-letter-2.jpg'],
                    category: 'custom',
                    colors: [
                        { name: 'Rosa', hex: '#ff0080', glowColor: '#ff66b3' },
                        { name: 'Verde', hex: '#00ff00', glowColor: '#66ff66' },
                        { name: 'Morado', hex: '#8000ff', glowColor: '#b366ff' }
                    ],
                    sizes: [
                        { name: 'Por letra', dimensions: '10cm altura', price: 0 }
                    ],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 4.9,
                    reviews: 203,
                    tags: ['personalizado', 'letras', 'nombre']
                }
                // Añadiríamos más productos aquí
            ]

            this.featuredProducts = this.products.filter(p => p.featured)
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