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
                // Aquí deberías implementar la obtención real de productos desde Firestore
                // Por ejemplo: usar FirestoreService.getAllItems() y mapear a Product si es necesario
                this.products = []
                this.featuredProducts = []
                // Lanzar error o warning si no está implementado
                // throw new Error('fetchProducts debe implementarse con backend')
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                this.loading = false
            }
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