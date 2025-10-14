/**
 * Script para probar la conexión con el nuevo proyecto 'cuadros-neon'
 * Ejecutar desde la consola del navegador
 */

import { getDb } from '../src/config/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

export async function testFirebaseConnection() {
    console.log('🔗 Probando conexión con cuadros-neon...')

    try {
        const db = getDb()
        console.log('✅ Database conectada:', db.app.options.projectId)

        // Probar lectura
        const snapshot = await getDocs(collection(db, 'gallery_items'))
        console.log(`📖 Documentos existentes: ${snapshot.size}`)

        // Probar escritura
        const testDoc = {
            test: true,
            timestamp: new Date(),
            message: 'Prueba de conexión'
        }

        const docRef = await addDoc(collection(db, 'test'), testDoc)
        console.log('✅ Documento de prueba creado:', docRef.id)

        return {
            success: true,
            projectId: db.app.options.projectId,
            existingDocs: snapshot.size,
            testDocId: docRef.id
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

// Auto-ejecutar
console.log('🧪 Script de prueba cargado.')
console.log('💡 Ejecuta: await testFirebaseConnection()')

export default testFirebaseConnection