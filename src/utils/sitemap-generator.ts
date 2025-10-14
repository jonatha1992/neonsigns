// Script para generar sitemap dinámico basado en productos de Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Configuración Firebase (reemplaza con tu configuración)
const firebaseConfig = {
    // Tu configuración aquí
}

// Generar sitemap XML dinámico
export async function generateSitemap() {
    try {
        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        // Obtener productos de Firestore
        const querySnapshot = await getDocs(collection(db, 'gallery_items'))
        const products: any[] = []

        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            })
        })

        // Construir sitemap XML
        const baseUrl = 'https://your-domain.firebaseapp.com'
        const today = new Date().toISOString().split('T')[0]

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <!-- Homepage -->
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Gallery Page -->
    <url>
        <loc>${baseUrl}/galeria</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- Contact Page -->
    <url>
        <loc>${baseUrl}/contacto</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`

        // Agregar productos dinámicamente
        products.forEach((product) => {
            const productUrl = `${baseUrl}/trabajo/${product.id}`
            const imageUrl = product.imageUrl || product.images?.[0] || ''

            sitemap += `    
    <!-- Product: ${product.name || product.title} -->
    <url>
        <loc>${productUrl}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>`

            if (imageUrl) {
                sitemap += `
        <image:image>
            <image:loc>${imageUrl}</image:loc>
            <image:caption>${product.name || product.title}</image:caption>
        </image:image>`
            }

            sitemap += `
    </url>`
        })

        sitemap += `
    
</urlset>`

        console.log('Sitemap generado exitosamente:')
        console.log(sitemap)

        return sitemap

    } catch (error) {
        console.error('Error generando sitemap:', error)
        return null
    }
}

// Función para usar en build time
export async function generateSitemapFile() {
    const sitemap = await generateSitemap()
    if (sitemap) {
        // En un entorno de build, aquí escribirías el archivo
        // fs.writeFileSync('public/sitemap.xml', sitemap)
        console.log('✅ Sitemap guardado en public/sitemap.xml')
    }
}

// Ejemplo de uso (descomentar cuando necesites generar)
// generateSitemapFile()