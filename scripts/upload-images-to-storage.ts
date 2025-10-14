/**
 * Script para subir imágenes a Firebase Storage
 * Ejecutar: npx tsx scripts/upload-images-to-storage.ts
 */

import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import * as fs from 'fs'
import * as path from 'path'

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
const storage = getStorage(app)
const db = getFirestore(app)

// Mapeo de productos a imágenes
const productImages: Record<string, string[]> = {
    'cuadros-neon-1': ['nombre.jpeg'],
    'cuadros-neon-2': ['pizza.jpeg'],
    'cuadros-neon-3': ['harppit bithday.jpeg'],
    'cuadros-neon-4': ['cerrajeria.jpeg'],
    'cuadros-neon-5': ['lavadero.jpeg'],
    'cuadros-neon-6': ['tecno alfa.jpeg']
}

async function uploadImage(imageName: string): Promise<string> {
    const imagePath = path.join(process.cwd(), 'public', 'images', imageName)

    if (!fs.existsSync(imagePath)) {
        throw new Error(`Imagen no encontrada: ${imagePath}`)
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const storageRef = ref(storage, `gallery/${imageName}`)

    console.log(`📤 Subiendo ${imageName}...`)

    // Subir imagen
    await uploadBytes(storageRef, imageBuffer, {
        contentType: 'image/jpeg'
    })

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(storageRef)
    console.log(`✅ ${imageName} subida: ${downloadURL.substring(0, 60)}...`)

    return downloadURL
}

async function migrateImages() {
    console.log('🚀 Iniciando migración de imágenes a Firebase Storage...\n')

    try {
        const uploadedImages: Record<string, string> = {}

        // Subir todas las imágenes únicas
        const uniqueImages = new Set(Object.values(productImages).flat())

        for (const imageName of uniqueImages) {
            try {
                const downloadURL = await uploadImage(imageName)
                uploadedImages[imageName] = downloadURL
            } catch (error) {
                console.error(`❌ Error subiendo ${imageName}:`, error)
            }
        }

        console.log(`\n📊 Imágenes subidas: ${Object.keys(uploadedImages).length}/${uniqueImages.size}\n`)

        // Actualizar documentos en Firestore con las URLs
        console.log('🔄 Actualizando URLs en Firestore...\n')

        const galleryCollection = collection(db, 'gallery_items')

        for (const [productId, imageNames] of Object.entries(productImages)) {
            try {
                const imageUrls = imageNames
                    .map(name => uploadedImages[name])
                    .filter(url => url !== undefined)

                if (imageUrls.length > 0) {
                    const productRef = doc(galleryCollection, productId)
                    await updateDoc(productRef, {
                        imagenes: imageUrls,
                        fecha_actualizacion: new Date()
                    })

                    console.log(`✅ ${productId}: ${imageUrls.length} imagen(es) actualizada(s)`)
                }
            } catch (error) {
                console.error(`❌ Error actualizando ${productId}:`, error)
            }
        }

        console.log('\n🎉 Migración de imágenes completada!')

        // Verificar
        console.log('\n📋 Verificando productos...\n')
        const snapshot = await getDocs(galleryCollection)
        snapshot.forEach(doc => {
            const data = doc.data()
            const hasFirebaseUrl = data.imagenes?.[0]?.includes('firebasestorage.googleapis.com')
            console.log(`${hasFirebaseUrl ? '✅' : '❌'} ${data.nombre}: ${data.imagenes?.[0]?.substring(0, 60)}...`)
        })

        process.exit(0)

    } catch (error) {
        console.error('❌ Error durante la migración:', error)
        process.exit(1)
    }
}

// Ejecutar migración
migrateImages()
