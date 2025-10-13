// Test Firebase Connection
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDCM_wl88lBAQmnIfoRC_FrBlfWlKkZTJU",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "neon-signs-app.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "neon-signs-app",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "neon-signs-app.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1041546373071",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:1041546373071:web:3387b5f9cc81e5bdca54ba"
};

console.log('🔍 Iniciando prueba de conexión a Firebase...\n');
console.log('📋 Configuración:');
console.log('   Project ID:', firebaseConfig.projectId);
console.log('   Auth Domain:', firebaseConfig.authDomain);
console.log('   Storage Bucket:', firebaseConfig.storageBucket);
console.log('');

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado correctamente\n');

    // Get Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore conectado\n');

    // Try to get gallery_items collection
    console.log('🔍 Intentando leer colección "gallery_items"...\n');
    const querySnapshot = await getDocs(collection(db, 'gallery_items'));

    console.log(`📊 Total de items encontrados: ${querySnapshot.size}\n`);

    if (querySnapshot.size > 0) {
        console.log('📝 Items en la base de datos:\n');
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`   - ID: ${doc.id}`);
            console.log(`     Título: ${data.title || 'Sin título'}`);
            console.log(`     Categoría: ${data.category || 'Sin categoría'}`);
            console.log(`     Activo: ${data.isActive ? 'Sí' : 'No'}`);
            console.log(`     Destacado: ${data.isFeatured ? 'Sí' : 'No'}`);
            console.log('');
        });
    } else {
        console.log('⚠️  La colección está vacía. No hay items en la galería.');
        console.log('');
        console.log('💡 Sugerencia:');
        console.log('   1. Ve a /admin/gallery');
        console.log('   2. Haz clic en "Agregar Item"');
        console.log('   3. Llena el formulario y guarda');
        console.log('');
    }

    console.log('✅ Prueba completada exitosamente!');
    process.exit(0);

} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Stack:', error.stack);
    process.exit(1);
}
