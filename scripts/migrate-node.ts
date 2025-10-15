/**
 * Script de migración ejecutable desde Node.js
 * Ejecutar: npx tsx scripts/migrate-node.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore'

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDQnZBwoPU8gCOE33JfOxAPQGXU5t6v5dk",
    authDomain: "cuadros-neon.firebaseapp.com",
    projectId: "cuadros-neon",
    storageBucket: "cuadros-neon.firebasestorage.app",
    messagingSenderId: "253134077329",
    appId: "1:253134077329:web:b387aa58fd811a19432e30"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Mapeo de categorías
const categoryMapping: Record<string, string> = {
    'custom': 'personalizado',
    'business': 'negocios',
    'home': 'hogar'
}

// Datos a migrar
const mockProducts = [
    {
        id: 'cuadros-neon-1',
        name: 'Letrero Neon Personalizado',
        description: 'Letrero de neón LED personalizable para negocios y eventos especiales.',
        price: 25000,
        images: ['/images/nombre.jpeg'],
        category: 'custom',
        featured: true
    },
    {
        id: 'cuadros-neon-2',
        name: 'Cartel Comercial LED',
        description: 'Cartel luminoso para negocios con alta visibilidad nocturna.',
        price: 35000,
        images: ['/images/pizza.jpeg'],
        category: 'business',
        featured: true
    },
    {
        id: 'cuadros-neon-3',
        name: 'Decoración Hogar Neón',
        description: 'Elementos decorativos de neón para ambientar espacios del hogar.',
        price: 18000,
        images: ['/images/harppit bithday.jpeg'],
        category: 'home',
        featured: true
    },
    {
        id: 'cuadros-neon-4',
        name: 'Cerrajería LED',
        description: 'Cartel luminoso para cerrajerías y servicios. Perfecto para alta visibilidad.',
        price: 12000,
        images: ['/images/cerrajeria.jpeg'],
        category: 'business',
        featured: false
    },
    {
        id: 'cuadros-neon-5',
        name: 'Cartel para Lavadero',
        description: 'Señalética luminosa para lavaderos y servicios de limpieza.',
        price: 8500,
        images: ['/images/lavadero.jpeg'],
        category: 'business',
        featured: false
    },
    {
        id: 'cuadros-neon-6',
        name: 'Logo Empresarial LED',
        description: 'Logo de tu empresa en neón LED de alta calidad. Impacto visual garantizado.',
        price: 45000,
        images: ['/images/tecno alfa.jpeg'],
        category: 'business',
        featured: true
    }
]

async function migrate() {
    console.log('🚀 Iniciando migración a cuadros-neon...\n')

    try {
        const galleryCollection = collection(db, 'gallery_items')

        // Limpiar colección existente
        console.log('🧹 Limpiando colección existente...')
        const existingDocs = await getDocs(galleryCollection)

        if (!existingDocs.empty) {
            const deleteBatch = writeBatch(db)
            existingDocs.forEach((docSnapshot) => {
                deleteBatch.delete(docSnapshot.ref)
            })
            await deleteBatch.commit()
            console.log(`✅ Eliminados ${existingDocs.size} documentos existentes\n`)
        }

        // Migrar productos
        console.log('📦 Migrando productos...')
        const insertBatch = writeBatch(db)
        let migratedCount = 0

        for (const product of mockProducts) {
            const firestoreDoc = {
                nombre: product.name,
                descripcion: product.description,
                precio: product.price,
                imagenes: product.images,
                categoria: categoryMapping[product.category] || product.category,
                destacado: product.featured,
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            }

            const docRef = doc(galleryCollection, product.id)
            insertBatch.set(docRef, firestoreDoc)

            console.log(`✅ ${product.name}`)
            migratedCount++
        }

        // Ejecutar batch
        await insertBatch.commit()
        console.log(`\n🎉 Migración completada: ${migratedCount}/${mockProducts.length} productos\n`)

        // Verificar
        const finalDocs = await getDocs(galleryCollection)
        console.log(`📊 Total documentos en Firestore: ${finalDocs.size}`)

        const featuredProducts: string[] = []
        finalDocs.forEach(doc => {
            const data = doc.data()
            if (data.destacado) {
                featuredProducts.push(data.nombre)
            }
        })

        console.log(`⭐ Productos destacados: ${featuredProducts.length}`)
        featuredProducts.forEach(name => console.log(`   - ${name}`))

        console.log('\n✅ Migración exitosa!')
        process.exit(0)

    } catch (error) {
        console.error('❌ Error durante la migración:', error)
        process.exit(1)
    }
}

// Ejecutar migración
migrate()
