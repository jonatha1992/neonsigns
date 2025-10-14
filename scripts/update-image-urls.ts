/**
 * Script para actualizar URLs de imágenes en Firestore con las URLs de Storage
 * Ejecutar: npx tsx scripts/update-image-urls.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

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
const storage = getStorage(app)

// Mapeo de rutas locales a nombres de archivos en Storage
const imageMapping: Record<string, string> = {
    '/images/nombre.jpeg': 'nombre.jpeg',
    '/images/pizza.jpeg': 'pizza.jpeg',
    '/images/harppit bithday.jpeg': 'harppit bithday.jpeg',
    '/images/cerrajeria.jpeg': 'cerrajeria.jpeg',
    '/images/lavadero.jpeg': 'lavadero.jpeg',
    '/images/tecno alfa.jpeg': 'tecno alfa.jpeg'
}

async function updateImageUrls() {
    console.log('🔄 Actualizando URLs de imágenes en Firestore...\n')

    try {
        const galleryCollection = collection(db, 'gallery_items')
        const snapshot = await getDocs(galleryCollection)

        console.log(`📊 Documentos encontrados: ${snapshot.size}\n`)

        let updatedCount = 0

        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data()
            const productName = data.nombre
            const currentImages = data.imagenes || []

            console.log(`🔍 Procesando: ${productName}`)
            console.log(`   Imágenes actuales: ${JSON.stringify(currentImages)}`)

            // Obtener URLs de Storage para cada imagen
            const newImageUrls: string[] = []

            for (const imagePath of currentImages) {
                try {
                    // Verificar si ya es una URL de Firebase
                    if (imagePath.startsWith('http')) {
                        console.log(`   ✓ Ya es URL de Storage: ${imagePath.substring(0, 50)}...`)
                        newImageUrls.push(imagePath)
                        continue
                    }

                    // Obtener nombre del archivo desde el mapeo
                    const fileName = imageMapping[imagePath]

                    if (!fileName) {
                        console.log(`   ⚠️  No se encontró mapeo para: ${imagePath}`)
                        newImageUrls.push(imagePath)
                        continue
                    }

                    // Obtener URL de descarga desde Storage
                    const storageRef = ref(storage, `gallery/${fileName}`)
                    const downloadUrl = await getDownloadURL(storageRef)

                    console.log(`   ✅ Nueva URL obtenida para ${fileName}`)
                    newImageUrls.push(downloadUrl)

                } catch (error) {
                    console.error(`   ❌ Error obteniendo URL para ${imagePath}:`, error)
                    newImageUrls.push(imagePath) // Mantener la URL original si hay error
                }
            }

            // Actualizar documento solo si hay cambios
            if (JSON.stringify(currentImages) !== JSON.stringify(newImageUrls)) {
                const docRef = doc(db, 'gallery_items', docSnapshot.id)
                await updateDoc(docRef, {
                    imagenes: newImageUrls,
                    fecha_actualizacion: new Date()
                })

                console.log(`   💾 Actualizado con URLs de Storage`)
                updatedCount++
            } else {
                console.log(`   ⏭️  Sin cambios necesarios`)
            }

            console.log('') // Línea en blanco
        }

        console.log(`\n✅ Proceso completado!`)
        console.log(`📊 Documentos actualizados: ${updatedCount}/${snapshot.size}`)

        // Verificar resultados
        console.log('\n🔍 Verificando actualización...')
        const verifySnapshot = await getDocs(galleryCollection)

        verifySnapshot.forEach(doc => {
            const data = doc.data()
            const firstImage = data.imagenes?.[0] || 'Sin imagen'
            const isStorageUrl = firstImage.startsWith('https://firebasestorage')

            console.log(`${isStorageUrl ? '✅' : '❌'} ${data.nombre}`)
            console.log(`   ${firstImage.substring(0, 80)}${firstImage.length > 80 ? '...' : ''}`)
        })

        process.exit(0)

    } catch (error) {
        console.error('❌ Error durante la actualización:', error)
        process.exit(1)
    }
}

// Ejecutar
updateImageUrls()
