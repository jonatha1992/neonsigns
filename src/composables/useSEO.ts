// SEO Composable for dynamic meta tags and structured data
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface SEOData {
    title?: string
    description?: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogUrl?: string
    canonicalUrl?: string
    structuredData?: object
}

export function useSEO() {
    const router = useRouter()
    const route = useRoute()

    const defaultSEO: SEOData = {
        title: 'Cuadros NEON LeD - Carteles de Neón Personalizados',
        description: 'Tienda profesional de carteles de neón personalizados. Diseños únicos con efectos luminosos para tu negocio o hogar.',
        keywords: 'carteles neón, letreros luminosos, señalética, diseño personalizado, carteles LED, neon signs',
        ogTitle: 'Cuadros NEON LeD - Carteles de Neón Personalizados',
        ogDescription: 'Diseños únicos de carteles de neón para tu negocio',
        ogImage: '/og-image.jpg',
        ogUrl: window.location.origin
    }

    // Update document head with SEO data
    const updateSEO = (seoData: Partial<SEOData>) => {
        const finalData = { ...defaultSEO, ...seoData }

        // Update title
        if (finalData.title) {
            document.title = finalData.title
        }

        // Update or create meta tags
        updateMetaTag('description', finalData.description || '')
        updateMetaTag('keywords', finalData.keywords || '')
        updateMetaTag('author', 'Tecnofusion.it')

        // Open Graph tags
        updateMetaProperty('og:title', finalData.ogTitle || finalData.title || '')
        updateMetaProperty('og:description', finalData.ogDescription || finalData.description || '')
        updateMetaProperty('og:image', finalData.ogImage || '')
        updateMetaProperty('og:url', finalData.ogUrl || window.location.href)
        updateMetaProperty('og:type', 'website')
        updateMetaProperty('og:site_name', 'Cuadros NEON LeD')

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image')
        updateMetaTag('twitter:title', finalData.ogTitle || finalData.title || '')
        updateMetaTag('twitter:description', finalData.ogDescription || finalData.description || '')
        updateMetaTag('twitter:image', finalData.ogImage || '')

        // Canonical URL
        updateCanonicalUrl(finalData.canonicalUrl || window.location.href)

        // Structured Data (JSON-LD)
        if (finalData.structuredData) {
            updateStructuredData(finalData.structuredData)
        }
    }

    // Helper function to update meta tags
    const updateMetaTag = (name: string, content: string) => {
        let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
        if (element) {
            element.content = content
        } else {
            element = document.createElement('meta')
            element.name = name
            element.content = content
            document.head.appendChild(element)
        }
    }

    // Helper function to update meta property tags (for Open Graph)
    const updateMetaProperty = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
        if (element) {
            element.content = content
        } else {
            element = document.createElement('meta')
            element.setAttribute('property', property)
            element.content = content
            document.head.appendChild(element)
        }
    }

    // Helper function to update canonical URL
    const updateCanonicalUrl = (url: string) => {
        let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
        if (element) {
            element.href = url
        } else {
            element = document.createElement('link')
            element.rel = 'canonical'
            element.href = url
            document.head.appendChild(element)
        }
    }

    // Helper function to update structured data
    const updateStructuredData = (data: object) => {
        // Remove existing structured data
        const existing = document.querySelector('script[type="application/ld+json"]')
        if (existing) {
            existing.remove()
        }

        // Add new structured data
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(data)
        document.head.appendChild(script)
    }

    // Generate business structured data
    const generateBusinessStructuredData = () => {
        return {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Cuadros NEON LeD",
            "alternateName": "Cruados Neon LeD Store",
            "description": "Tienda profesional de carteles de neón personalizados. Diseños únicos con efectos luminosos para tu negocio o hogar.",
            "url": window.location.origin,
            "telephone": "+54-XXX-XXXXXXX", // Replace with actual phone
            "email": "tecnofusion.it@gmail.com",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "AR",
                "addressLocality": "Argentina" // Replace with actual city
            },
            "openingHours": "Mo-Fr 09:00-18:00", // Replace with actual hours
            "sameAs": [
                // Add social media URLs here
                "https://facebook.com/your-page",
                "https://instagram.com/your-page"
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Carteles de Neón",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Product",
                            "name": "Carteles de Neón Personalizados",
                            "description": "Diseños únicos de carteles de neón para negocios y hogares"
                        }
                    }
                ]
            }
        }
    }

    // Generate product structured data
    const generateProductStructuredData = (product: any) => {
        return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name || product.title,
            "description": product.description,
            "image": product.imageUrl || product.image,
            "url": window.location.href,
            "brand": {
                "@type": "Brand",
                "name": "Cuadros NEON LeD"
            },
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "ARS",
                "price": product.price || "0",
                "seller": {
                    "@type": "Organization",
                    "name": "Cuadros NEON LeD"
                }
            }
        }
    }

    return {
        updateSEO,
        generateBusinessStructuredData,
        generateProductStructuredData,
        defaultSEO
    }
}