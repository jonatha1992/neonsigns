/**
 * Script para ver el esquema completo de los datos en gallery_items
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

async function showSampleData() {
    try {
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        console.log('📄 DATOS DE EJEMPLO DE GALLERY_ITEMS\n')
        console.log('='

            .repeat(50))

        const collectionRef = collection(db, 'gallery_items')
        const q = query(collectionRef, limit(2))
        const snapshot = await getDocs(q)

        let index = 0
        snapshot.forEach((doc) => {
            console.log(`\n📦 Documento ${index + 1} (ID: ${doc.id})`)
            console.log('-'.repeat(50))
            const data = doc.data()
            console.log(JSON.stringify(data, null, 2))
            index++
        })

    } catch (error: any) {
        console.error('❌ Error:', error.message)
    }
}

showSampleData()
