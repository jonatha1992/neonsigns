export interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: ProductCategory
    featured: boolean
}

export interface CartItem {
    product: Product
    quantity: number
    customText?: string
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