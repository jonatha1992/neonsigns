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

async function checkNeonColors() {
  console.log('🎨 Verificando colores NEON en gallery_items...\n');

  try {
    const snapshot = await getDocs(collection(db, 'gallery_items'));

    console.log(`📊 Total items: ${snapshot.size}\n`);

    const items = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title,
        neonColors: data.neonColors || null,
        hasColors: !!(data.neonColors && Array.isArray(data.neonColors) && data.neonColors.length > 0)
      });
    });

    // Mostrar cada item
    items.forEach(item => {
      const status = item.hasColors ? '✅' : '❌';
      console.log(`${status} ${item.title}`);
      console.log(`   ID: ${item.id}`);
      if (item.neonColors) {
        console.log(`   🎨 Colores: [${item.neonColors.join(', ')}]`);
      } else {
        console.log(`   ⚠️  SIN COLORES NEON`);
      }
      console.log('');
    });

    // Estadísticas
    const withColors = items.filter(i => i.hasColors).length;
    const withoutColors = items.filter(i => !i.hasColors).length;

    console.log('\n📈 RESUMEN:');
    console.log(`   ✅ Con colores neon: ${withColors}/${items.length}`);
    console.log(`   ❌ Sin colores neon: ${withoutColors}/${items.length}`);

    if (withoutColors > 0) {
      console.log('\n⚠️  Items que necesitan colores neon:');
      items.filter(i => !i.hasColors).forEach(item => {
        console.log(`   - ${item.title} (ID: ${item.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkNeonColors().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
