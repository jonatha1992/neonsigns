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
                    name: 'Hombre Araña - Diseño Personalizado',
                    description: 'Diseño de Hombre Araña en neón LED con efectos vibrantes. Perfecto para fans y espacios temáticos.',
                    price: 0,
                    images: ['/images/hombre araña.jpeg'],
                    category: 'custom',
                    colors: [
                        { name: 'Rojo', hex: '#ff0000', glowColor: '#ff6666' },
                        { name: 'Azul', hex: '#0066ff', glowColor: '#66b3ff' }
                    ],
                    sizes: [
                        { name: 'Pequeño', dimensions: '30x15 cm', price: 0 },
                        { name: 'Mediano', dimensions: '45x22 cm', price: 0 },
                        { name: 'Grande', dimensions: '60x30 cm', price: 0 }
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
                    name: 'Pizza - Letrero Comercial',
                    description: 'Letrero comercial para pizzería con diseño llamativo y colores vibrantes. Ideal para restaurantes.',
                    price: 0,
                    images: ['/images/pizza.jpeg'],
                    category: 'business',
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
                },
                {
                    id: '3',
                    name: 'Cerrajería - Letrero Comercial',
                    description: 'Letrero profesional para cerrajería con diseño elegante y gran visibilidad nocturna.',
                    price: 0,
                    images: ['/images/cerrajeria.jpeg'],
                    category: 'business',
                    colors: [
                        { name: 'Blanco', hex: '#ffffff', glowColor: '#f0f0f0' },
                        { name: 'Azul', hex: '#0066ff', glowColor: '#66b3ff' },
                        { name: 'Verde', hex: '#00ff00', glowColor: '#66ff66' }
                    ],
                    sizes: [
                        { name: 'Mediano', dimensions: '50x30 cm', price: 0 },
                        { name: 'Grande', dimensions: '80x50 cm', price: 0 }
                    ],
                    customizable: true,
                    featured: false,
                    inStock: true,
                    rating: 4.7,
                    reviews: 89,
                    tags: ['empresa', 'logo', 'corporativo']
                },
                {
                    id: '4',
                    name: 'Tecno Alfa - Logo Empresarial',
                    description: 'Logo corporativo moderno con efectos de neón profesionales. Diseño bicolor impactante.',
                    price: 0,
                    images: ['/images/tecno alfa.jpeg'],
                    category: 'business',
                    colors: [
                        { name: 'Rosa', hex: '#ff69b4', glowColor: '#ff8dc7' },
                        { name: 'Púrpura', hex: '#9932cc', glowColor: '#b347d9' },
                        { name: 'Turquesa', hex: '#40e0d0', glowColor: '#5ce8db' }
                    ],
                    sizes: [
                        { name: 'Pequeño', dimensions: '25x15 cm', price: 0 },
                        { name: 'Mediano', dimensions: '40x25 cm', price: 0 }
                    ],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 4.6,
                    reviews: 124,
                    tags: ['hogar', 'decorativo', 'personal']
                },
                {
                    id: '5',
                    name: 'Happy Birthday - Celebración',
                    description: 'Letrero personalizado para celebraciones especiales con diseño elegante y festivo.',
                    price: 0,
                    images: ['/images/harppit bithday.jpeg'],
                    category: 'custom',
                    colors: [
                        { name: 'Naranja', hex: '#ff4500', glowColor: '#ff6a33' },
                        { name: 'Rojo', hex: '#dc143c', glowColor: '#e3456b' },
                        { name: 'Amarillo', hex: '#ffd700', glowColor: '#ffdf33' }
                    ],
                    sizes: [
                        { name: 'Grande', dimensions: '70x40 cm', price: 0 },
                        { name: 'Extra grande', dimensions: '100x60 cm', price: 0 }
                    ],
                    customizable: false,
                    featured: false,
                    inStock: true,
                    rating: 4.9,
                    reviews: 78,
                    tags: ['bar', 'restaurant', 'comercial']
                },
                {
                    id: '6',
                    name: 'Nombre Personalizado',
                    description: 'Letrero personalizado con nombre en estilo elegante y moderno, perfecto para decoración.',
                    price: 0,
                    images: ['/images/nombre.jpeg'],
                    category: 'home',
                    colors: [
                        { name: 'Multicolor', hex: '#ff00ff', glowColor: '#ff33ff' },
                        { name: 'Azul eléctrico', hex: '#00bfff', glowColor: '#33ccff' },
                        { name: 'Verde limón', hex: '#32cd32', glowColor: '#5ad85a' }
                    ],
                    sizes: [
                        { name: 'Personalizado', dimensions: 'A medida', price: 0 }
                    ],
                    customizable: true,
                    featured: true,
                    inStock: true,
                    rating: 5.0,
                    reviews: 32,
                    tags: ['nombre', 'personalizado', 'hogar']
                },
                {
                    id: '7',
                    name: 'Lavadero El Veci - Comercial',
                    description: 'Letrero comercial para lavadero con diseño profesional y múltiples colores.',
                    price: 0,
                    images: ['/images/lavadero.jpeg'],
                    category: 'business',
                    colors: [
                        { name: 'Blanco', hex: '#ffffff', glowColor: '#f0f0f0' },
                        { name: 'Verde', hex: '#00ff00', glowColor: '#66ff66' },
                        { name: 'Amarillo', hex: '#ffff00', glowColor: '#ffff66' }
                    ],
                    sizes: [
                        { name: 'Grande', dimensions: '80x40 cm', price: 0 },
                        { name: 'Extra grande', dimensions: '120x60 cm', price: 0 }
                    ],
                    customizable: false,
                    featured: true,
                    inStock: true,
                    rating: 4.9,
                    reviews: 67,
                    tags: ['comercial', 'lavadero', 'negocio']
                },
                {
                    id: '8',
                    name: 'Pizza - Variante 2',
                    description: 'Segunda versión del letrero para pizzería con diseño alternativo y efectos únicos.',
                    price: 0,
                    images: ['/images/pizza2.jpeg'],
                    category: 'business',
                    colors: [
                        { name: 'Rojo', hex: '#ff0000', glowColor: '#ff6666' },
                        { name: 'Blanco', hex: '#ffffff', glowColor: '#f0f0f0' },
                        { name: 'Amarillo', hex: '#ffff00', glowColor: '#ffff66' }
                    ],
                    sizes: [
                        { name: 'Mediano', dimensions: '60x30 cm', price: 0 },
                        { name: 'Grande', dimensions: '80x40 cm', price: 0 }
                    ],
                    customizable: false,
                    featured: false,
                    inStock: true,
                    rating: 4.8,
                    reviews: 43,
                    tags: ['pizza', 'comercial', 'restaurante']
                }
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