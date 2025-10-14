/**
 * Script para verificar si Storage está habilitado
 * Ejecutar: npx tsx scripts/check-storage.ts
 */

import { initializeApp } from 'firebase/app'
import { getStorage, ref, listAll } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDQnZBwoPU8gCOE33JfOxAPQGXU5t6v5dk",
    authDomain: "cuadros-neon.firebaseapp.com",
    projectId: "cuadros-neon",
    storageBucket: "cuadros-neon.firebasestorage.app",
    messagingSenderId: "253134077329",
    appId: "1:253134077329:web:b387aa58fd811a19432e30"
}

const app = initializeApp(firebaseConfig)

async function checkStorage() {
    try {
        console.log('🔍 Verificando Firebase Storage...\n')

        const storage = getStorage(app)
        console.log(`✅ Storage inicializado: ${storage.app.options.storageBucket}\n`)

        const storageRef = ref(storage, '/')
        const result = await listAll(storageRef)

        console.log(`📂 Carpetas encontradas: ${result.prefixes.length}`)
        result.prefixes.forEach(folder => {
            console.log(`   - ${folder.name}`)
        })

        console.log(`📄 Archivos en raíz: ${result.items.length}`)

        console.log('\n✅ Storage está habilitado y funcionando!')
        process.exit(0)

    } catch (error: any) {
        console.error('❌ Error al verificar Storage:', error.message)
        console.log('\n💡 Solución: Habilita Storage en Firebase Console')
        console.log('   https://console.firebase.google.com/project/cuadros-neon/storage')
        process.exit(1)
    }
}

checkStorage()
