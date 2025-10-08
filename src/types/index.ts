export interface Product {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    category: ProductCategory
    colors: NeonColor[]
    sizes: ProductSize[]
    customizable: boolean
    featured: boolean
    inStock: boolean
    rating: number
    reviews: number
    tags: string[]
}

export interface CartItem {
    product: Product
    quantity: number
    selectedColor: NeonColor
    selectedSize: ProductSize
    customText?: string
}

export interface NeonColor {
    name: string
    hex: string
    glowColor: string
}

export interface ProductSize {
    name: string
    dimensions: string
    price: number
}

export type ProductCategory =
    | 'business'
    | 'home'
    | 'custom'
    | 'decorative'
    | 'signs'
    | 'letters'

export interface FilterOptions {
    category?: ProductCategory
    priceRange?: [number, number]
    colors?: string[]
    inStock?: boolean
    featured?: boolean
}

export interface User {
    id: string
    name: string
    email: string
    phone?: string
    address?: Address
}

export interface Address {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface Order {
    id: string
    userId: string
    items: CartItem[]
    total: number
    status: OrderStatus
    createdAt: Date
    shippingAddress: Address
}

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'