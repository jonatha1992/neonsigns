/**
 * Check whether the listed files exist in the Firebase Storage bucket
 * Run: npx tsx scripts/check-storage-files.ts
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
    admin.initializeApp({ credential: admin.credential.cert(sa), storageBucket: 'cuadros-neon.appspot.com' })
    const storage = admin.storage()
    const bucket = storage.bucket()

    const filesToCheck = [
        'gallery/nombre.jpeg',
        'gallery/pizza.jpeg',
        'gallery/harppit bithday.jpeg',
        'gallery/cerrajeria.jpeg',
        'gallery/lavadero.jpeg',
        'gallery/tecno alfa.jpeg'
    ]

    for (const f of filesToCheck) {
        const file = bucket.file(f)
        const [exists] = await file.exists()
        console.log(`${f} exists=${exists}`)
    }

    process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
