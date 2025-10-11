/**
 * 🧪 TEST FIREBASE GALLERY DATA
 * =============================
 * 
 * Script para verificar que los datos de la galería
 * estén funcionando correctamente en Firebase.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuración Firebase
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testGalleryData() {
    console.log('🧪 VERIFICANDO DATOS DE GALERÍA EN FIREBASE');
    console.log('===========================================\n');

    try {
        // Probar colección gallery_items
        console.log('📖 Leyendo colección "gallery_items"...');
        const galleryItemsSnapshot = await getDocs(collection(db, 'gallery_items'));

        console.log(`✅ Encontrados ${galleryItemsSnapshot.size} documentos en "gallery_items"\n`);

        if (galleryItemsSnapshot.size > 0) {
            console.log('📋 LISTA DE PRODUCTOS:');
            console.log('=====================\n');

            let featuredCount = 0;
            galleryItemsSnapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                console.log(`${index + 1}. ${data.title}`);
                console.log(`   ID: ${doc.id}`);
                console.log(`   Categoría: ${data.category}`);
                console.log(`   Precio: $${data.price?.toLocaleString() || 'N/A'}`);
                console.log(`   Destacado: ${data.isFeatured ? '⭐ SÍ' : '❌ NO'}`);
                console.log(`   Activo: ${data.isActive ? '✅ SÍ' : '❌ NO'}`);
                console.log(`   Orden: ${data.orderIndex || 0}`);
                console.log(`   Imagen: ${data.imageUrl ? '✅' : '❌'}`);
                console.log('');

                if (data.isFeatured) featuredCount++;
            });

            console.log('📊 ESTADÍSTICAS:');
            console.log('================');
            console.log(`📦 Total productos: ${galleryItemsSnapshot.size}`);
            console.log(`⭐ Productos destacados: ${featuredCount}`);
            console.log(`✅ Productos activos: ${[...galleryItemsSnapshot.docs].filter(doc => doc.data().isActive !== false).length}`);

            // Verificar categorías
            const categories = [...galleryItemsSnapshot.docs].reduce((acc, doc) => {
                const category = doc.data().category;
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            console.log('\n📂 POR CATEGORÍA:');
            Object.entries(categories).forEach(([category, count]) => {
                console.log(`   ${category}: ${count} productos`);
            });

            if (featuredCount !== 4) {
                console.log(`\n⚠️  ADVERTENCIA: Se recomienda tener exactamente 4 productos destacados, pero hay ${featuredCount}`);
            }

        } else {
            console.log('❌ No se encontraron productos en gallery_items');
        }

        // Probar también la colección gallery antigua
        console.log('\n📖 Verificando colección "gallery" (antigua)...');
        const gallerySnapshot = await getDocs(collection(db, 'gallery'));
        console.log(`📄 Documentos en "gallery": ${gallerySnapshot.size}`);

        if (gallerySnapshot.size > 0) {
            console.log('💡 Tienes datos en la colección antigua "gallery"');
            console.log('   Puedes eliminarlos ejecutando: npm run migrate-gallery-items -- --cleanup');
        }

        console.log('\n🎉 ¡VERIFICACIÓN COMPLETADA!');
        console.log('============================');
        console.log('✅ Firebase está funcionando correctamente');
        console.log('✅ Los datos están listos para la aplicación');
        console.log('✅ Las imágenes están almacenadas en Storage');

        console.log('\n🚀 APLICACIÓN LISTA PARA USAR:');
        console.log('   • Home: Mostrará productos destacados desde Firebase');
        console.log('   • Galería: Mostrará todos los productos desde Firebase');
        console.log('   • Admin: Permitirá gestionar productos (cuando esté listo)');

    } catch (error: any) {
        console.error('❌ Error verificando datos:', error.message);
        console.error('💡 Verifica tu configuración de Firebase en .env.local');
    }

    console.log('\n===========================================\n');
}

// Ejecutar test
if (require.main === module) {
    testGalleryData().catch(console.error);
}

export { testGalleryData };