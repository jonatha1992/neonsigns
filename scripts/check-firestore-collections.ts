/**
 * Script para verificar colecciones y datos en Firestore
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Cargar variables de entorno
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

console.log('🔍 VERIFICACIÓN DE FIRESTORE')
console.log('============================\n')
console.log('📋 Configuración Firebase:')
console.log(`   Project ID: ${firebaseConfig.projectId}`)
console.log(`   Auth Domain: ${firebaseConfig.authDomain}\n`)

async function checkCollections() {
    try {
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        console.log('✅ Conexión a Firebase establecida\n')

        // Lista de colecciones a verificar
        const collectionsToCheck = [
            'products',
            'gallery',
            'gallery_items',
            'orders',
            'users'
        ]

        console.log('🔍 Verificando colecciones...\n')

        for (const collectionName of collectionsToCheck) {
            try {
                const collectionRef = collection(db, collectionName)
                const snapshot = await getDocs(collectionRef)

                if (snapshot.empty) {
                    console.log(`❌ ${collectionName}: VACÍA (0 documentos)`)
                } else {
                    console.log(`✅ ${collectionName}: ${snapshot.size} documentos`)

                    // Mostrar primeros 3 documentos
                    let count = 0
                    snapshot.forEach(doc => {
                        if (count < 3) {
                            console.log(`   📄 ID: ${doc.id}`)
                            const data = doc.data()
                            if (data.name) console.log(`      Nombre: ${data.name}`)
                            if (data.title) console.log(`      Título: ${data.title}`)
                            if (data.description) {
                                const desc = data.description.substring(0, 50)
                                console.log(`      Descripción: ${desc}${data.description.length > 50 ? '...' : ''}`)
                            }
                            if (data.category) console.log(`      Categoría: ${data.category}`)
                            if (data.price) console.log(`      Precio: $${data.price}`)
                            console.log('')
                            count++
                        }
                    })

                    if (snapshot.size > 3) {
                        console.log(`   ... y ${snapshot.size - 3} documentos más\n`)
                    }
                }
            } catch (error: any) {
                console.log(`⚠️  ${collectionName}: Error al acceder - ${error.message}`)
            }
        }

        console.log('\n📊 RESUMEN')
        console.log('==========')
        console.log('Verifica que las colecciones tengan datos.')
        console.log('Si todas están vacías, necesitas migrar los datos mock a Firestore.\n')

    } catch (error: any) {
        console.error('❌ Error al conectar con Firestore:', error.message)
        console.error('\nVerifica que:')
        console.error('1. Las credenciales en .env.local sean correctas')
        console.error('2. El proyecto Firebase esté activo')
        console.error('3. Firestore esté habilitado en la consola de Firebase')
    }
}

checkCollections()
