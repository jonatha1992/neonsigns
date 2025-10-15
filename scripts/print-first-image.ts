/**
 * Prints the first image URL for every document in gallery_items.
 * Run: npx tsx scripts/print-first-image.ts
 */

import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.resolve(__dirname, '../cuadros-neon-firebase-adminsdk-fbsvc-c36c9c2366.json')
const serviceAccountUrl = `file://${serviceAccountPath.replace(/\\/g, '/')}`

async function main() {
    const module = await import(serviceAccountUrl, { assert: { type: 'json' } })
    const sa = module.default || module
    admin.initializeApp({
        credential: admin.credential.cert(sa),
        storageBucket: 'cuadros-neon.appspot.com'
    })

    const db = admin.firestore()
    const snapshot = await db.collection('gallery_items').get()
    console.log(`Documents: ${snapshot.size}`)
    snapshot.forEach(doc => {
        const data = doc.data()
        const name = data.nombre || data.title || data.name || '(sin nombre)'
        const first = (data.imagenes && data.imagenes[0]) || (data.imageUrl) || null
        console.log(`- id=${doc.id} name=${name}`)
        console.log(`  firstImage=${first}`)
    })
    process.exit(0)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
