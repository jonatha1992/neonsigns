import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔧 Configuración de Firebase:');
console.log('   Project ID:', firebaseConfig.projectId);
console.log('   Auth Domain:', firebaseConfig.authDomain);
console.log('   Storage Bucket:', firebaseConfig.storageBucket);
console.log('');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkConnection() {
  console.log('🔍 Verificando conexión a Firestore...\n');

  try {
    // Intentar obtener documentos de la colección 'gallery'
    console.log('📂 Intentando leer colección "gallery"...');
    const galleryRef = collection(db, 'gallery');
    const q = query(galleryRef, limit(10));
    const snapshot = await getDocs(q);

    console.log(`   ✅ Colección accesible`);
    console.log(`   📊 Documentos encontrados: ${snapshot.size}\n`);

    if (snapshot.size > 0) {
      console.log('📄 Primeros documentos:\n');
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`   ID: ${doc.id}`);
        console.log(`   Título: ${data.title || 'N/A'}`);
        console.log(`   Colores: ${data.neonColors ? JSON.stringify(data.neonColors) : 'N/A'}`);
        console.log(`   Activo: ${data.isActive}`);
        console.log(`   Destacado: ${data.isFeatured}`);
        console.log('');
      });
    } else {
      console.log('⚠️  La colección está vacía o no existe');
    }

    // Listar todas las colecciones
    console.log('\n📚 Verificando estructura de la base de datos...');
    console.log('   (Esta operación puede fallar en web, pero funciona en Admin SDK)');

  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    console.error('   Código:', error.code);
    if (error.stack) {
      console.error('   Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
    }
  }
}

checkConnection().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
