
/**
 * Script para actualizar URLs de imágenes en Firestore con las URLs de Storage usando firebase-admin
 * Ejecutar: npx tsx scripts/update-image-urls.ts
 */


import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

// Compatibilidad __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de cuenta de servicio en formato file:// para import dinámico en Windows
const serviceAccountPath = path.resolve(__dirname, '../cuadros-neon-firebase-adminsdk-fbsvc-c36c9c2366.json');
const serviceAccountUrl = `file://${serviceAccountPath.replace(/\\/g, '/')}`;

// Inicializar firebase-admin usando import dinámico para la cuenta de servicio
let initialized = false;
async function initializeAdmin() {
    if (!initialized) {
        // Importar el archivo JSON de la cuenta de servicio dinámicamente usando file://
        const module = await import(serviceAccountUrl, { assert: { type: 'json' } });
        const sa = module.default || module;
        admin.initializeApp({
            credential: admin.credential.cert(sa),
            storageBucket: 'cuadros-neon.appspot.com',
        });
        initialized = true;
    }
}


// (Eliminada inicialización redundante y errónea)

let db: admin.firestore.Firestore;
let storage: admin.storage.Storage;

// Mapeo de rutas locales a nombres de archivos en Storage
const imageMapping: Record<string, string> = {
    '/images/nombre.jpeg': 'nombre.jpeg',
    '/images/pizza.jpeg': 'pizza.jpeg',
    '/images/harppit bithday.jpeg': 'harppit bithday.jpeg',
    '/images/cerrajeria.jpeg': 'cerrajeria.jpeg',
    '/images/lavadero.jpeg': 'lavadero.jpeg',
    '/images/tecno alfa.jpeg': 'tecno alfa.jpeg'
};



async function updateImageUrls() {
    await initializeAdmin();
    db = admin.firestore();
    storage = admin.storage();
    console.log('🔄 Actualizando URLs de imágenes en Firestore...\n');

    try {
        const galleryCollection = db.collection('gallery_items');
        const snapshot = await galleryCollection.get();

        console.log(`📊 Documentos encontrados: ${snapshot.size}\n`);

        let updatedCount = 0;

        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            const productName = data.nombre;
            const currentImages = data.imagenes || [];

            console.log(`🔍 Procesando: ${productName}`);
            console.log(`   Imágenes actuales: ${JSON.stringify(currentImages)}`);

            // Obtener URLs de Storage para cada imagen
            const newImageUrls: string[] = [];

            for (const imagePath of currentImages) {
                try {
                    // Verificar si ya es una URL de Firebase
                    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
                        console.log(`   ✓ Ya es URL de Storage: ${imagePath.substring(0, 50)}...`);
                        newImageUrls.push(imagePath);
                        continue;
                    }

                    // Obtener nombre del archivo desde el mapeo
                    const fileName = imageMapping[imagePath];

                    if (!fileName) {
                        console.log(`   ⚠️  No se encontró mapeo para: ${imagePath}`);
                        newImageUrls.push(imagePath);
                        continue;
                    }

                    // Obtener URL de descarga desde Storage
                    const bucket = storage.bucket();
                    const file = bucket.file(`gallery/${fileName}`);
                    // Generar URL firmada válida por 1 año
                    const [downloadUrl] = await file.getSignedUrl({
                        action: 'read',
                        expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
                    });

                    console.log(`   ✅ Nueva URL obtenida para ${fileName}`);
                    newImageUrls.push(downloadUrl);

                } catch (error) {
                    console.error(`   ❌ Error obteniendo URL para ${imagePath}:`, error);
                    newImageUrls.push(imagePath); // Mantener la URL original si hay error
                }
            }

            // Actualizar documento solo si hay cambios
            if (JSON.stringify(currentImages) !== JSON.stringify(newImageUrls)) {
                await galleryCollection.doc(docSnapshot.id).update({
                    imagenes: newImageUrls,
                    fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp(),
                });

                console.log(`   💾 Actualizado con URLs de Storage`);
                updatedCount++;
            } else {
                console.log(`   ⏭️  Sin cambios necesarios`);
            }

            console.log(''); // Línea en blanco
        }

        console.log(`\n✅ Proceso completado!`);
        console.log(`📊 Documentos actualizados: ${updatedCount}/${snapshot.size}`);

        // Verificar resultados
        console.log('\n🔍 Verificando actualización...');
        const verifySnapshot = await galleryCollection.get();

        verifySnapshot.forEach(doc => {
            const data = doc.data();
            const firstImage = data.imagenes?.[0] || 'Sin imagen';
            const isStorageUrl = typeof firstImage === 'string' && firstImage.startsWith('https://');

            console.log(`${isStorageUrl ? '✅' : '❌'} ${data.nombre}`);
            console.log(`   ${typeof firstImage === 'string' ? firstImage.substring(0, 80) : ''}${typeof firstImage === 'string' && firstImage.length > 80 ? '...' : ''}`);
        });

        process.exit(0);

    } catch (error) {
        console.error('❌ Error durante la actualización:', error);
        process.exit(1);
    }
}

// Ejecutar
updateImageUrls();
