/**
 * Script para probar que el ProductsService está trayendo datos de Firebase
 */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Configurar path para importar el servicio
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

async function testProductsService() {
    try {
        console.log('🧪 PRUEBA DE ProductsService')
        console.log('='.repeat(60))
        console.log(`📦 Project: ${firebaseConfig.projectId}\n`)

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        console.log('✅ Firebase inicializado\n')

        // Importar dinámicamente el servicio
        const { ProductsService } = await import('../src/services/products.service.js')

        console.log('📥 Obteniendo todos los productos...\n')
        const products = await ProductsService.getAllProducts()

        console.log(`✅ Se obtuvieron ${products.length} productos\n`)

        if (products.length > 0) {
            console.log('📦 PRODUCTOS ENCONTRADOS:\n')
            products.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name}`)
                console.log(`   ID: ${product.id}`)
                console.log(`   Precio: $${product.price}`)
                console.log(`   Categoría: ${product.category}`)
                console.log(`   Imagen: ${product.images[0].substring(0, 70)}...`)
                console.log(`   Featured: ${product.featured ? '⭐' : '❌'}`)
                console.log(`   En Stock: ${product.inStock ? '✅' : '❌'}`)
                console.log('')
            })

            console.log('🌟 Productos destacados:')
            const featured = await ProductsService.getFeaturedProducts(4)
            console.log(`   Encontrados: ${featured.length} productos destacados\n`)

            console.log('✨ ¡ÉXITO! El servicio está trayendo datos de Firebase correctamente.')
            console.log('   - Datos desde: Firestore (gallery_items)')
            console.log('   - Adaptación: ✅ Funcionando')
            console.log('   - Imágenes: ' + (products[0].images[0].includes('firebase') ? '✅ Firebase Storage' : '⚠️  Local (/images/)'))
        } else {
            console.log('⚠️  No se encontraron productos en Firestore')
            console.log('   Verifica que la colección gallery_items tenga datos')
        }

    } catch (error: any) {
        console.error('\n❌ Error al probar ProductsService:', error.message)
        console.error('Stack:', error.stack)
    }
}

testProductsService()
