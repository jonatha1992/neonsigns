// Test Firebase básico
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Configuración mínima para test
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
}

console.log('Iniciando Firebase con configuración:', firebaseConfig)

try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('✅ Firebase inicializado correctamente:', app)
    console.log('✅ Firestore inicializado correctamente:', db)
} catch (error) {
    console.error('❌ Error inicializando Firebase:', error)
}