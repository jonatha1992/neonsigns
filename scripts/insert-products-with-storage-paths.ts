/**
 * Insert mock products into Firestore's `gallery_items` collection using
 * storage paths for images (e.g. 'gallery/nombre.jpeg').
 * This script uses the Admin SDK and the service account file in the repo root.
 * Run: npx tsx scripts/insert-products-with-storage-paths.ts
 */
import * as path from 'path'
import * as fs from 'fs'
import admin from 'firebase-admin'

const serviceAccountPath = path.join(process.cwd(), 'cuadros-neon-firebase-adminsdk-fbsvc-c36c9c2366.json')

if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account file not found at', serviceAccountPath)
    process.exit(2)
}

const sa = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

admin.initializeApp({ credential: admin.credential.cert(sa) })
const db = admin.firestore()

const categoryMapping: Record<string, string> = {
    'custom': 'personalizado',
    'business': 'negocios',
    'home': 'hogar'
}

const products = [
    {
        id: 'cuadros-neon-1',
        name: 'Letrero Neon Personalizado',
        description: 'Letrero de neón LED personalizable para negocios y eventos especiales.',
        price: 25000,
        images: ['gallery/nombre.jpeg'],
        category: 'custom',
        featured: true
    },
    {
        id: 'cuadros-neon-2',
        name: 'Cartel Comercial LED',
        description: 'Cartel luminoso para negocios con alta visibilidad nocturna.',
        price: 35000,
        images: ['gallery/pizza.jpeg'],
        category: 'business',
        featured: true
    },
    {
        id: 'cuadros-neon-3',
        name: 'Decoración Hogar Neón',
        description: 'Elementos decorativos de neón para ambientar espacios del hogar.',
        price: 18000,
        images: ['gallery/harppit bithday.jpeg'],
        category: 'home',
        featured: true
    },
    {
        id: 'cuadros-neon-4',
        name: 'Cerrajería LED',
        description: 'Cartel luminoso para cerrajerías y servicios. Perfecto para alta visibilidad.',
        price: 12000,
        images: ['gallery/cerrajeria.jpeg'],
        category: 'business',
        featured: false
    },
    {
        id: 'cuadros-neon-5',
        name: 'Cartel para Lavadero',
        description: 'Señalética luminosa para lavaderos y servicios de limpieza.',
        price: 8500,
        images: ['gallery/lavadero.jpeg'],
        category: 'business',
        featured: false
    },
    {
        id: 'cuadros-neon-6',
        name: 'Logo Empresarial LED',
        description: 'Logo de tu empresa en neón LED de alta calidad. Impacto visual garantizado.',
        price: 45000,
        images: ['gallery/tecno alfa.jpeg'],
        category: 'business',
        featured: true
    }
]

async function run() {
    try {
        console.log('Inserting products into Firestore collection: gallery_items')
        const collectionRef = db.collection('gallery_items')

        // Use batch to write all documents
        const batch = db.batch()

        for (const p of products) {
            const docRef = collectionRef.doc(p.id)
            const firestoreDoc = {
                nombre: p.name,
                descripcion: p.description,
                precio: p.price,
                imagenes: p.images,
                categoria: categoryMapping[p.category] || p.category,
                destacado: p.featured,
                fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
                fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp()
            }
            batch.set(docRef, firestoreDoc)
            console.log(`  - Prepared: ${p.id} (${p.images.join(',')})`)
        }

        await batch.commit()
        console.log('\n✅ Batch commit completed.')

        // Verify inserted docs
        const snapshot = await collectionRef.get()
        console.log(`\n📊 Total documents now in gallery_items: ${snapshot.size}`)
        snapshot.forEach(doc => {
            const data = doc.data()
            console.log(` - ${doc.id}: ${data.nombre} images=${JSON.stringify(data.imagenes)}`)
        })

        process.exit(0)
    } catch (err: any) {
        console.error('Error inserting products:', err && err.message ? err.message : err)
        process.exit(1)
    }
}

run()
