/**
 * Script para verificar los datos actualizados después de la migración
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
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

async function verifyMigration() {
    try {
        console.log('✅ VERIFICACIÓN POST-MIGRACIÓN')
        console.log('='.repeat(60))

        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        const collectionRef = collection(db, 'gallery_items')
        const snapshot = await getDocs(collectionRef)

        console.log(`\n📊 Total documentos: ${snapshot.size}\n`)

        let firebaseStorageCount = 0
        let localImageCount = 0

        snapshot.forEach(doc => {
            const data = doc.data()
            const isFirebase = data.imageUrl.includes('firebasestorage.googleapis.com')

            if (isFirebase) {
                firebaseStorageCount++
                console.log(`✅ ${data.title}`)
                console.log(`   📸 Firebase Storage: ${data.imageUrl.substring(0, 80)}...`)
            } else {
                localImageCount++
                console.log(`⚠️  ${data.title}`)
                console.log(`   📸 Local: ${data.imageUrl}`)
            }
            console.log('')
        })

        console.log('='.repeat(60))
        console.log('\n📈 RESULTADOS:\n')
        console.log(`   ✅ Imágenes en Firebase Storage: ${firebaseStorageCount}`)
        console.log(`   ⚠️  Imágenes locales: ${localImageCount}`)
        console.log(`   📊 Total: ${snapshot.size}\n`)

        if (firebaseStorageCount === snapshot.size) {
            console.log('🎉 ¡PERFECTO! Todas las imágenes están en Firebase Storage')
            console.log('   La aplicación puede cargar los datos 100% desde Firebase\n')
            console.log('✨ Próximos pasos:')
            console.log('   1. Abre http://localhost:3001')
            console.log('   2. Ve a /galeria')
            console.log('   3. Verifica que las imágenes se cargan correctamente')
            console.log('   4. Abre DevTools > Console para ver los logs del ProductsService\n')
        } else if (localImageCount > 0) {
            console.log('⚠️  Algunas imágenes todavía son locales')
            console.log('   Ejecuta: npm run migrate-images\n')
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message)
    }
}

verifyMigration()
