/**
 * Script de Migración: Subir imágenes locales a Firebase Storage
 * y actualizar los documentos de Firestore con las URLs de Firebase
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

console.log('🚀 MIGRACIÓN DE IMÁGENES A FIREBASE STORAGE')
console.log('='.repeat(60))
console.log(`📦 Project: ${firebaseConfig.projectId}`)
console.log(`🗂️  Storage: ${firebaseConfig.storageBucket}\n`)

interface GalleryItem {
    id: string
    title: string
    imageUrl: string
}

async function migrateImages() {
    try {
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)
        const storage = getStorage(app)

        console.log('✅ Conectado a Firebase\n')

        // 1. Obtener todos los documentos de gallery_items
        console.log('📋 Paso 1: Obteniendo documentos de Firestore...')
        const collectionRef = collection(db, 'gallery_items')
        const snapshot = await getDocs(collectionRef)

        const items: GalleryItem[] = []
        snapshot.forEach(doc => {
            const data = doc.data()
            items.push({
                id: doc.id,
                title: data.title,
                imageUrl: data.imageUrl
            })
        })

        console.log(`   ✓ Encontrados ${items.length} documentos\n`)

        // 2. Procesar cada imagen
        console.log('📤 Paso 2: Subiendo imágenes a Firebase Storage...\n')

        let successCount = 0
        let errorCount = 0
        let skippedCount = 0

        for (const item of items) {
            try {
                // Verificar si la imagen ya está en Firebase
                if (item.imageUrl.includes('firebasestorage.googleapis.com')) {
                    console.log(`⏭️  [${item.id}] Ya está en Firebase, saltando...`)
                    skippedCount++
                    continue
                }

                // Extraer el nombre del archivo de la URL local
                const imageName = item.imageUrl.replace('/images/', '')
                const localImagePath = path.join(process.cwd(), 'public', 'images', imageName)

                // Verificar que el archivo existe
                if (!fs.existsSync(localImagePath)) {
                    console.log(`❌ [${item.id}] Archivo no encontrado: ${imageName}`)
                    errorCount++
                    continue
                }

                console.log(`📤 [${item.id}] Subiendo: ${imageName}`)
                console.log(`   Título: ${item.title}`)

                // Leer el archivo
                const imageBuffer = fs.readFileSync(localImagePath)

                // Crear referencia en Storage (en la carpeta gallery/)
                const storageRef = ref(storage, `gallery/${imageName}`)

                // Determinar el tipo de contenido
                const contentType = imageName.toLowerCase().endsWith('.png')
                    ? 'image/png'
                    : 'image/jpeg'

                // Subir la imagen
                await uploadBytes(storageRef, imageBuffer, {
                    contentType,
                    customMetadata: {
                        'originalName': imageName,
                        'galleryItemId': item.id,
                        'title': item.title
                    }
                })

                // Obtener la URL de descarga
                const downloadURL = await getDownloadURL(storageRef)

                console.log(`   ✓ Subida exitosa`)
                console.log(`   🔗 URL: ${downloadURL.substring(0, 60)}...`)

                // Actualizar el documento en Firestore
                const docRef = doc(db, 'gallery_items', item.id)
                await updateDoc(docRef, {
                    imageUrl: downloadURL,
                    updatedAt: new Date()
                })

                console.log(`   ✓ Documento actualizado en Firestore\n`)
                successCount++

            } catch (error: any) {
                console.error(`❌ [${item.id}] Error: ${error.message}\n`)
                errorCount++
            }
        }

        // Resumen
        console.log('='.repeat(60))
        console.log('\n📊 RESUMEN DE LA MIGRACIÓN\n')
        console.log(`   ✅ Exitosas:  ${successCount}`)
        console.log(`   ⏭️  Saltadas:   ${skippedCount}`)
        console.log(`   ❌ Errores:    ${errorCount}`)
        console.log(`   📋 Total:      ${items.length}\n`)

        if (successCount > 0) {
            console.log('✨ ¡Migración completada exitosamente!')
            console.log('   Ahora todas las imágenes están en Firebase Storage')
            console.log('   y los documentos tienen las URLs actualizadas.\n')
        }

        if (errorCount > 0) {
            console.log('⚠️  Algunos archivos tuvieron errores.')
            console.log('   Revisa los mensajes arriba para más detalles.\n')
        }

    } catch (error: any) {
        console.error('\n❌ Error crítico:', error.message)
        console.error('\nVerifica que:')
        console.error('1. Las credenciales de Firebase sean correctas')
        console.error('2. Firebase Storage esté habilitado en tu proyecto')
        console.error('3. Las reglas de Storage permitan escritura (temporalmente)\n')
    }
}

// Ejecutar migración
console.log('⚠️  IMPORTANTE: Este script subirá imágenes a Firebase Storage')
console.log('   y actualizará los documentos en Firestore.\n')
console.log('Iniciando en 2 segundos...\n')

setTimeout(() => {
    migrateImages()
}, 2000)
