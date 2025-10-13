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

async function verifyNeonColors() {
  console.log('🔍 Verificando colores neon en Firebase...\n');

  try {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const items = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title,
        neonColors: data.neonColors || null,
        hasColors: !!(data.neonColors && data.neonColors.length > 0)
      });
    });

    // Ordenar por título
    items.sort((a, b) => a.title.localeCompare(b.title));

    console.log('📊 Resumen de Items:\n');
    items.forEach(item => {
      const status = item.hasColors ? '✅' : '❌';
      const colors = item.neonColors ? `[${item.neonColors.join(', ')}]` : 'SIN COLORES';
      console.log(`${status} ${item.title}`);
      console.log(`   Colores: ${colors}`);
      console.log(`   ID: ${item.id}\n`);
    });

    const withColors = items.filter(i => i.hasColors).length;
    const withoutColors = items.filter(i => !i.hasColors).length;

    console.log('\n📈 Estadísticas:');
    console.log(`   Total items: ${items.length}`);
    console.log(`   ✅ Con colores: ${withColors}`);
    console.log(`   ❌ Sin colores: ${withoutColors}`);

    // Identificar items que deberían tener colores
    const shouldHaveColors = ['café', 'coffee', 'open', '24/7', '247'];
    const problematic = items.filter(item => {
      const titleLower = item.title.toLowerCase();
      return shouldHaveColors.some(keyword => titleLower.includes(keyword)) && !item.hasColors;
    });

    if (problematic.length > 0) {
      console.log('\n⚠️  Items problemáticos (deberían tener colores):');
      problematic.forEach(item => {
        console.log(`   - ${item.title} (ID: ${item.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyNeonColors().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
