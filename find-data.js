import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function findData() {
  console.log('🔍 Buscando datos en TODAS las colecciones posibles...\n');

  const collectionsToCheck = [
    'gallery',
    'gallery_items',
    'galleryItems',
    'products',
    'neon-signs',
    'items'
  ];

  for (const collectionName of collectionsToCheck) {
    try {
      console.log(`📂 Verificando "${collectionName}"...`);
      const snapshot = await getDocs(collection(db, collectionName));

      if (snapshot.size > 0) {
        console.log(`   ✅ ¡ENCONTRADO! ${snapshot.size} documentos\n`);

        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`   📄 ${data.title || data.name || 'Sin título'}`);
          console.log(`      ID: ${doc.id}`);
          if (data.neonColors) {
            console.log(`      Colores: ${JSON.stringify(data.neonColors)}`);
          }
          console.log('');
        });
      } else {
        console.log(`   ❌ Vacía (0 documentos)\n`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error: ${error.message}\n`);
    }
  }
}

findData().then(() => {
  console.log('\n✅ Búsqueda completada');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
