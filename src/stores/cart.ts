import { defineStore } from 'pinia'
import type { CartItem, Product, NeonColor, ProductSize } from '@/types'

interface CartState {
    items: CartItem[]
    isOpen: boolean
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => ({
        items: [],
        isOpen: false
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0)
        },

        totalPrice: (state) => {
            return state.items.reduce((total, item) => {
                const itemPrice = item.product.price + item.selectedSize.price
                return total + (itemPrice * item.quantity)
            }, 0)
        },

        itemCount: (state) => {
            return state.items.length
        },

        getItemById: (state) => {
            return (productId: string) =>
                state.items.find(item => item.product.id === productId)
        }
    },

    actions: {
        addItem(
            product: Product,
            selectedColor: NeonColor,
            selectedSize: ProductSize,
            quantity: number = 1,
            customText?: string
        ) {
            const existingItemIndex = this.items.findIndex(item =>
                item.product.id === product.id &&
                item.selectedColor.name === selectedColor.name &&
                item.selectedSize.name === selectedSize.name &&
                item.customText === customText
            )

            if (existingItemIndex > -1) {
                const existingItem = this.items[existingItemIndex]
                if (existingItem) {
                    existingItem.quantity += quantity
                }
            } else {
                this.items.push({
                    product,
                    selectedColor,
                    selectedSize,
                    quantity,
                    customText
                })
            }
            this.saveToLocalStorage()
        },

        removeItem(index: number) {
            this.items.splice(index, 1)
            this.saveToLocalStorage()
        },

        updateQuantity(index: number, quantity: number) {
            if (quantity <= 0) {
                this.removeItem(index)
            } else {
                const item = this.items[index]
                if (item) {
                    item.quantity = quantity
                    this.saveToLocalStorage()
                }
            }
        },

        clearCart() {
            this.items = []
            this.saveToLocalStorage()
        },

        toggleCart() {
            this.isOpen = !this.isOpen
        },

        openCart() {
            this.isOpen = true
        },

        closeCart() {
            this.isOpen = false
        },

        // Persistencia manual del carrito
        saveToLocalStorage() {
            try {
                localStorage.setItem('neon-cart', JSON.stringify(this.items))
            } catch (error) {
                console.warn('No se pudo guardar el carrito en localStorage:', error)
            }
        },

        loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('neon-cart')
                if (saved) {
                    this.items = JSON.parse(saved)
                }
            } catch (error) {
                console.warn('No se pudo cargar el carrito desde localStorage:', error)
            }
        }
    }
})