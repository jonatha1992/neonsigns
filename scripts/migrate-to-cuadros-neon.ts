/**
 * Script para migrar datos mock al nuevo proyecto Firebase 'cuadros-neon'
 * Ejecutar desde la consola del navegador en http://localhost:3002
 */

import { getDb } from '../src/config/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { getStorageInstance } from '../src/config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Mapeo de categorías español-inglés
const categoryMapping: Record<string, string> = {
    'custom': 'personalizado',
    'business': 'negocios',
    'home': 'hogar'
}

// Datos mock a migrar
const mockProducts = [
    {
        id: 'cuadros-neon-1',
        name: 'Letrero Neon Personalizado',
        description: 'Letrero de neón LED personalizable para negocios y eventos especiales.',
        price: 25000,
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
        id: 'cuadros-neon-2',
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
        id: 'cuadros-neon-3',
        name: 'Decoración Hogar Neón',
        description: 'Elementos decorativos de neón para ambientar espacios del hogar.',
        price: 18000,
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
        id: 'cuadros-neon-4',
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
        id: 'cuadros-neon-5',
        name: 'Cartel para Lavadero',
        description: 'Señalética luminosa para lavaderos y servicios de limpieza.',
        price: 8500,
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
        id: 'cuadros-neon-6',
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

export async function migrateMockDataToFirebase() {
    console.log('🚀 Iniciando migración de datos mock a cuadros-neon...')

    try {
        const db = getDb()
        const galleryCollection = collection(db, 'gallery_items')

        // Limpiar colección existente
        console.log('🧹 Limpiando colección existente...')
        const existingDocs = await getDocs(galleryCollection)
        const batch = writeBatch(db)

        existingDocs.forEach((docSnapshot) => {
            batch.delete(docSnapshot.ref)
        })

        if (!existingDocs.empty) {
            await batch.commit()
            console.log(`✅ Eliminados ${existingDocs.size} documentos existentes`)
        }

        // Migrar productos
        console.log('📦 Migrando productos...')
        let migratedCount = 0

        // Crear nuevo batch para insertar
        const insertBatch = writeBatch(db)

        for (const product of mockProducts) {
            try {
                // Convertir formato a schema de Firestore (español)
                const firestoreDoc = {
                    nombre: product.name,
                    descripcion: product.description,
                    precio: product.price,
                    imagenes: product.images,
                    categoria: categoryMapping[product.category] || product.category,
                    colores: product.colors,
                    tamanos: product.sizes,
                    personalizable: product.customizable,
                    destacado: product.featured,
                    en_stock: product.inStock,
                    rating: product.rating,
                    reviews: product.reviews,
                    tags: product.tags,
                    fecha_creacion: new Date(),
                    fecha_actualizacion: new Date()
                }

                // Usar ID personalizado
                const docRef = doc(galleryCollection, product.id)
                insertBatch.set(docRef, firestoreDoc)

                migratedCount++
                console.log(`✅ Preparado: ${product.name}`)

            } catch (error) {
                console.error(`❌ Error preparando ${product.name}:`, error)
            }
        }

        // Ejecutar batch de inserción
        if (migratedCount > 0) {
            await insertBatch.commit()
            console.log(`✅ Batch ejecutado: ${migratedCount} productos insertados`)
        }

        console.log(`🎉 Migración completada: ${migratedCount}/${mockProducts.length} productos`)

        // Verificar datos migrados
        const finalDocs = await getDocs(galleryCollection)
        console.log(`📊 Total de documentos en Firestore: ${finalDocs.size}`)

        // Mostrar productos destacados
        const featuredProducts: string[] = []
        finalDocs.forEach(doc => {
            const data = doc.data()
            if (data.destacado) {
                featuredProducts.push(data.nombre)
            }
        })

        console.log(`⭐ Productos destacados: ${featuredProducts.length}`)
        console.log('Productos destacados:', featuredProducts)

        return {
            success: true,
            migrated: migratedCount,
            total: mockProducts.length,
            featured: featuredProducts.length
        }

    } catch (error) {
        console.error('❌ Error durante la migración:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

export async function verifyMigration() {
    console.log('🔍 Verificando migración...')

    try {
        const db = getDb()
        const snapshot = await getDocs(collection(db, 'gallery_items'))

        console.log(`📊 Total documentos: ${snapshot.size}`)

        snapshot.forEach(doc => {
            const data = doc.data()
            console.log(`📄 ${data.nombre} - Destacado: ${data.destacado ? '⭐' : '❌'}`)
        })

        return snapshot.size

    } catch (error) {
        console.error('❌ Error verificando migración:', error)
        return 0
    }
}

// Auto-ejecutar si se llama directamente
console.log('📋 Script de migración cargado.')
console.log('💡 Ejecuta: await migrateMockDataToFirebase()')
console.log('🔍 Verifica: await verifyMigration()')