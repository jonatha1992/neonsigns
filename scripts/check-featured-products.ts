/**
 * Script para verificar productos destacados en Firestore
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

async function checkFeaturedProducts() {
    try {
        console.log('⭐ VERIFICACIÓN DE PRODUCTOS DESTACADOS')
        console.log('='.repeat(60))

        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Obtener todos los productos
        const allRef = collection(db, 'gallery_items')
        const allSnapshot = await getDocs(allRef)

        console.log(`\n📊 Total productos: ${allSnapshot.size}`)

        // Contar productos destacados
        let featuredCount = 0
        let notFeaturedCount = 0

        console.log('\n📋 LISTA DE PRODUCTOS:\n')

        allSnapshot.forEach(doc => {
            const data = doc.data()
            const isFeatured = data.isFeatured === true

            if (isFeatured) {
                featuredCount++
                console.log(`⭐ ${data.title}`)
                console.log(`   isFeatured: ${data.isFeatured}`)
            } else {
                notFeaturedCount++
                console.log(`   ${data.title}`)
                console.log(`   isFeatured: ${data.isFeatured}`)
            }
            console.log('')
        })

        console.log('='.repeat(60))
        console.log('\n📈 RESUMEN:\n')
        console.log(`   ⭐ Productos destacados: ${featuredCount}`)
        console.log(`      Productos normales: ${notFeaturedCount}`)
        console.log(`   📊 Total: ${allSnapshot.size}\n`)

        if (featuredCount === 0) {
            console.log('⚠️  No hay productos destacados (isFeatured: true)')
            console.log('\n💡 Sugerencia: Actualiza algunos productos para que sean destacados')
            console.log('   Puedes hacerlo desde Firebase Console o con un script\n')
        } else {
            console.log(`✅ Hay ${featuredCount} producto(s) destacado(s)`)
            console.log('   Estos deberían aparecer en la Home\n')
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message)
    }
}

checkFeaturedProducts()
