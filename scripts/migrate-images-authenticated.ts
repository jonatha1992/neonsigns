/**
 * Script para autenticarse y ejecutar la migración de imágenes
 */
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as readline from 'readline'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function question(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve))
}

interface GalleryItem {
    id: string
    title: string
    imageUrl: string
}

async function migrateImages() {
    try {
        console.log('🚀 MIGRACIÓN DE IMÁGENES A FIREBASE STORAGE')
        console.log('='.repeat(60))
        console.log(`📦 Project: ${firebaseConfig.projectId}`)
        console.log(`🗂️  Storage: ${firebaseConfig.storageBucket}\n`)

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig)
        const auth = getAuth(app)
        const db = getFirestore(app)
        const storage = getStorage(app)

        // Autenticación
        console.log('🔐 Autenticación requerida para subir archivos\n')
        const email = await question('Email de admin: ')
        const password = await question('Contraseña: ')

        console.log('\n🔄 Autenticando...')
        await signInWithEmailAndPassword(auth, email, password)
        console.log('✅ Autenticado correctamente\n')

        // 1. Obtener todos los documentos de gallery_items
        console.log('📋 Paso 1: Obteniendo documentos de Firestore...')
        const collectionRef = collection(db, 'gallery_items')
        const snapshot = await getDocs(collectionRef)

        const items: GalleryItem[] = []
        snapshot.forEach(docSnapshot => {
            const data = docSnapshot.data()
            items.push({
                id: docSnapshot.id,
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
                    console.log(`⏭️  [${item.title}] Ya está en Firebase, saltando...`)
                    skippedCount++
                    continue
                }

                // Extraer el nombre del archivo de la URL local
                const imageName = item.imageUrl.replace('/images/', '')
                const localImagePath = path.join(process.cwd(), 'public', 'images', imageName)

                // Verificar que el archivo existe
                if (!fs.existsSync(localImagePath)) {
                    console.log(`❌ [${item.title}] Archivo no encontrado: ${imageName}`)
                    errorCount++
                    continue
                }

                console.log(`📤 Subiendo: ${imageName}`)
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

                // Actualizar el documento en Firestore
                const docRef = doc(db, 'gallery_items', item.id)
                await updateDoc(docRef, {
                    imageUrl: downloadURL,
                    updatedAt: new Date()
                })

                console.log(`   ✓ Documento actualizado en Firestore`)
                console.log(`   🔗 ${downloadURL.substring(0, 70)}...\n`)
                successCount++

            } catch (error: any) {
                console.error(`❌ [${item.title}] Error: ${error.message}\n`)
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
            console.log('💡 Próximo paso: Ejecuta tu aplicación con:')
            console.log('   npm run dev\n')
        }

        if (errorCount > 0) {
            console.log('⚠️  Algunos archivos tuvieron errores.')
            console.log('   Revisa los mensajes arriba para más detalles.\n')
        }

        rl.close()
        process.exit(0)

    } catch (error: any) {
        console.error('\n❌ Error crítico:', error.message)
        if (error.code === 'auth/invalid-credential') {
            console.error('   Email o contraseña incorrectos\n')
        } else if (error.code === 'auth/user-not-found') {
            console.error('   Usuario no encontrado\n')
        } else {
            console.error('\nVerifica que:')
            console.error('1. Las credenciales de Firebase sean correctas')
            console.error('2. Firebase Storage esté habilitado en tu proyecto')
            console.error('3. El usuario tenga permisos de admin\n')
        }
        rl.close()
        process.exit(1)
    }
}

migrateImages()
