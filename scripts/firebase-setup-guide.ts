/**
 * 🔧 CONFIGURADOR RÁPIDO DE FIREBASE
 * ==================================
 * 
 * Script interactivo para configurar Firebase fácilmente.
 * Te guía paso a paso para obtener las credenciales correctas.
 */

console.log('🔧 CONFIGURADOR DE FIREBASE - CUADROS NEON LD');
console.log('============================================\n');

console.log('📋 PASOS PARA CONFIGURAR FIREBASE:\n');

console.log('1️⃣ **Crear Proyecto Firebase**');
console.log('   • Ve a: https://console.firebase.google.com');
console.log('   • Clic en "Agregar proyecto"');
console.log('   • Nombre: "neon-signs-ld" (o el que prefieras)');
console.log('   • Ubicación: tu región preferida\n');

console.log('2️⃣ **Configurar Autenticación**');
console.log('   • En el menú lateral: Authentication > Get started');
console.log('   • Sign-in method > Email/Password > Habilitar');
console.log('   • Users > Add user > tecnofusion.it@gmail.com\n');

console.log('3️⃣ **Configurar Firestore Database**');
console.log('   • En el menú lateral: Firestore Database > Create database');
console.log('   • Start in test mode (temporalmente)');
console.log('   • Ubicación: tu región preferida\n');

console.log('4️⃣ **Configurar Storage**');
console.log('   • En el menú lateral: Storage > Get started');
console.log('   • Start in test mode (temporalmente)');
console.log('   • Ubicación: misma que Firestore\n');

console.log('5️⃣ **Obtener credenciales de la app web**');
console.log('   • Project Settings (ícono de engranaje)');
console.log('   • General > Your apps > Add app > Web (icono </>)');
console.log('   • App nickname: "neon-signs-web"');
console.log('   • ✅ También configurar Firebase Hosting');
console.log('   • Register app > Copiar el objeto firebaseConfig\n');

console.log('6️⃣ **Actualizar .env.local**');
console.log('   • Edita el archivo .env.local en la raíz del proyecto');
console.log('   • Reemplaza los valores con los de tu firebaseConfig:\n');

console.log('   VITE_FIREBASE_API_KEY=tu_api_key_aqui');
console.log('   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com');
console.log('   VITE_FIREBASE_PROJECT_ID=tu-proyecto-id');
console.log('   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app');
console.log('   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789');
console.log('   VITE_FIREBASE_APP_ID=1:123456789:web:abc123\n');

console.log('7️⃣ **Verificar configuración**');
console.log('   • Ejecuta: npm run test-firebase');
console.log('   • Si todo está OK, ejecuta: npm run migrate-firestore\n');

console.log('8️⃣ **Configurar reglas de seguridad (después de migrar)**');
console.log('   • Firestore: firebase deploy --only firestore:rules');
console.log('   • Storage: firebase deploy --only storage\n');

console.log('✅ **Ejemplo de firebaseConfig que verás en Firebase Console:**');
console.log('```javascript');
console.log('const firebaseConfig = {');
console.log('  apiKey: "AIzaSyC5_ejemplo123456789",');
console.log('  authDomain: "neon-signs-ld.firebaseapp.com",');
console.log('  projectId: "neon-signs-ld",');
console.log('  storageBucket: "neon-signs-ld.firebasestorage.app",');
console.log('  messagingSenderId: "123456789012",');
console.log('  appId: "1:123456789012:web:abcdef123456"');
console.log('};');
console.log('```\n');

console.log('🚨 **IMPORTANTE:** Cada valor debe ser único para TU proyecto.');
console.log('    NO uses los valores de ejemplo, obtén los reales de Firebase Console.\n');

console.log('💡 **Consejos:**');
console.log('   • El Storage Bucket puede terminar en .appspot.com o .firebasestorage.app');
console.log('   • NO incluyas gs:// en el Storage Bucket');
console.log('   • Guarda las credenciales en un lugar seguro');
console.log('   • Nunca subas .env.local a Git (ya está en .gitignore)\n');

console.log('🎯 **Una vez configurado, ejecuta:**');
console.log('   1. npm run test-firebase  (verificar conexión)');
console.log('   2. npm run migrate-firestore  (migrar datos)');
console.log('   3. npm run dev  (probar la aplicación)\n');

console.log('¿Necesitas ayuda? Revisa FIREBASE_CONFIG.md para más detalles.\n');

export { };