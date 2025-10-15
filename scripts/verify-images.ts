/**
 * Script para verificar URLs de imágenes en Firestore
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDQnZBwoPU8gCOE33JfOxAPQGXU5t6v5dk",
    authDomain: "cuadros-neon.firebaseapp.com",
    projectId: "cuadros-neon",
    storageBucket: "cuadros-neon.firebasestorage.app",
    messagingSenderId: "253134077329",
    appId: "1:253134077329:web:b387aa58fd811a19432e30"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function verifyImages() {
    console.log('🔍 Verificando URLs de imágenes en Firestore...\n')

    const snapshot = await getDocs(collection(db, 'gallery_items'))

    snapshot.forEach(doc => {
        const data = doc.data()
        const imageUrl = data.imagenes?.[0] || 'N/A'
        const isFirebase = imageUrl.includes('firebasestorage.googleapis.com')

        console.log(`${isFirebase ? '✅' : '❌'} ${data.nombre}`)
        console.log(`   ${imageUrl}\n`)
    })

    process.exit(0)
}

verifyImages()
