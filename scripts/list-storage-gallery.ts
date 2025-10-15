/**
 * List all files under the `gallery/` prefix in the Firebase Storage bucket.
 * Run: npx tsx scripts/list-storage-gallery.ts
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
    // Try the commonly used forms of the bucket name. First attempt uses
    // the .firebasestorage.app hostname which some scripts reference.
    const knownBuckets = ['cuadros-neon.firebasestorage.app', 'cuadros-neon.appspot.com']
    let lastErr: any = null
    let files: any[] = []

    for (const bucketName of knownBuckets) {
        try {
            admin.initializeApp({ credential: admin.credential.cert(sa), storageBucket: bucketName })
            const storage = admin.storage()
            const bucket = storage.bucket()
            console.log(`Trying bucket: ${bucketName}`)
            const res = await bucket.getFiles({ prefix: 'gallery/' })
            files = res[0] || []
            if (files.length > 0) {
                console.log(`Found ${files.length} files in bucket ${bucketName}`)
                for (const f of files) {
                    const [meta] = await f.getMetadata()
                    console.log(`- ${f.name}  size=${meta.size} bytes  contentType=${meta.contentType || 'unknown'}`)
                }
                process.exit(0)
            } else {
                console.log(`No files found under gallery/ in bucket ${bucketName}`)
                // Clean up initialized app before trying next
                try { admin.app().delete().catch(() => { }) } catch (_) { }
            }
        } catch (err) {
            lastErr = err
            console.warn(`Bucket ${bucketName} failed:`, err && err.message ? err.message : err)
            try { admin.app().delete().catch(() => { }) } catch (_) { }
        }
    }

    if (lastErr) {
        console.error('All bucket attempts failed. Last error:')
        console.error(lastErr)
        process.exit(1)
    }

    console.log('ℹ️  No files found in known buckets under gallery/')
    process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
