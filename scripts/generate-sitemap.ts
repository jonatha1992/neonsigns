import fs from 'fs'
import path from 'path'

// This script generates a simple sitemap.xml in the public/ folder
// It uses the mock products from src/stores/products.ts by importing the file and calling getMockProducts
// If you have a real data source (Firestore), replace or extend this script to fetch real product IDs.

import { fileURLToPath } from 'url'

// Resolve project root
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Paths
const publicDir = path.join(projectRoot, 'public')
const sitemapPath = path.join(publicDir, 'sitemap.xml')

// Static routes to include
const staticRoutes = ['/', '/galeria', '/contacto']

// Import mock products by reading the products store and extracting mock IDs/names
// We will dynamically import the module to avoid bundler issues
async function getProductUrls() {
    try {
        const prodModulePath = path.join(projectRoot, 'src', 'stores', 'products.ts')
        const content = await fs.promises.readFile(prodModulePath, 'utf-8')

        // naive parse: find getMockProducts() return array and extract ids or names
        const match = content.match(/getMockProducts\(\)\s*:\s*Product\[]\s*{[\s\S]*?return\s*\[([\s\S]*?)\]\s*}/)
        const urls: string[] = []

        if (match && match[1]) {
            const arrayText = match[1]
            // Extract id and name from each object literal
            const itemRegex = /id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'/g
            let m
            while ((m = itemRegex.exec(arrayText)) !== null) {
                const id = m[1]
                const slug = slugify(m[2])
                urls.push(`/trabajo/${id}-${slug}`)
            }
        }

        // Fallback: if nothing parsed, include example product path
        if (urls.length === 0) {
            urls.push('/trabajo/mock-1-letrero-neon-personalizado')
        }

        return urls
    } catch (err) {
        console.error('[generate-sitemap] Error reading products store:', err)
        return ['/trabajo/mock-1-letrero-neon-personalizado']
    }
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

async function generate() {
    const hostname = process.env.SITE_HOSTNAME || 'https://cuadros-neon-led.web.app'
    const productUrls = await getProductUrls()
    const urls = [...staticRoutes, ...productUrls]

    const lastmod = new Date().toISOString().split('T')[0]

    const xmlParts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    ]

    for (const route of urls) {
        xmlParts.push('  <url>')
        xmlParts.push(`    <loc>${hostname}${route}</loc>`)
        xmlParts.push(`    <lastmod>${lastmod}</lastmod>`)
        xmlParts.push('    <changefreq>weekly</changefreq>')
        xmlParts.push('    <priority>0.7</priority>')
        xmlParts.push('  </url>')
    }

    xmlParts.push('</urlset>')

    try {
        await fs.promises.mkdir(publicDir, { recursive: true })
        await fs.promises.writeFile(sitemapPath, xmlParts.join('\n'), 'utf-8')
        console.log(`[generate-sitemap] Sitemap written to ${sitemapPath}`)
    } catch (err) {
        console.error('[generate-sitemap] Error writing sitemap:', err)
        process.exit(1)
    }
}

// If the script is executed directly, run generate()
generate().catch(err => {
    console.error('[generate-sitemap] Fatal error:', err)
    process.exit(1)
})

export default generate
