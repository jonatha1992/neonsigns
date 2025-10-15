/**
 * WARNING: Irreversible deletion of all documents in the 'gallery_items' collection.
 * This script uses the Firebase Admin SDK and the service account file
 * `cuadros-neon-firebase-adminsdk-fbsvc-c36c9c2366.json` located at the repo root.
 *
 * Run with: npx tsx scripts/delete-all-gallery-items.ts
 */
import * as path from 'path'
import * as fs from 'fs'
import admin from 'firebase-admin'

async function main() {
    try {
        const serviceAccountPath = path.join(process.cwd(), 'cuadros-neon-firebase-adminsdk-fbsvc-c36c9c2366.json')

        if (!fs.existsSync(serviceAccountPath)) {
            console.error('❌ Service account file not found at', serviceAccountPath)
            process.exit(2)
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
        })

        const db = admin.firestore()
        const collectionPath = 'gallery_items'

        console.log('⚠️  Iniciando borrado de la colección:', collectionPath)

        const snapshot = await db.collection(collectionPath).get()
        const total = snapshot.size

        if (total === 0) {
            console.log('ℹ️  No hay documentos para borrar. Colección vacía.')
            process.exit(0)
        }

        console.log(`📋 Documentos encontrados: ${total}`)

        const docs = snapshot.docs

        // Firestore batch limit is 500 operations per batch
        const BATCH_SIZE = 500
        let deleted = 0

        for (let i = 0; i < docs.length; i += BATCH_SIZE) {
            const batch = db.batch()
            const chunk = docs.slice(i, i + BATCH_SIZE)
            chunk.forEach(d => batch.delete(d.ref))
            await batch.commit()
            deleted += chunk.length
            console.log(`   ✓ Borrados hasta ahora: ${deleted}/${total}`)
        }

        console.log('\n✅ Borrado completado.')
        console.log(`📊 Total documentos eliminados: ${deleted}`)
        process.exit(0)

    } catch (error: any) {
        console.error('❌ Error durante el borrado:', error && error.message ? error.message : error)
        process.exit(1)
    }
}

main()
