/**
 * Test script para verificar que los precios se muestren correctamente
 * Ejecutar desde la consola del navegador: await import('/scripts/test-pricing.ts')
 */

export async function testPricing() {
    console.log('🔍 Testing pricing display...')

    // Test 1: Verificar que las cards muestren precios
    const productCards = document.querySelectorAll('.product-card')
    console.log(`Found ${productCards.length} product cards`)

    let cardsWithPrice = 0
    let cardsWithDiscount = 0

    productCards.forEach((card, index) => {
        const priceElement = card.querySelector('.current-price')
        const originalPriceElement = card.querySelector('.original-price')
        const discountBadge = card.querySelector('.badge.discount')

        if (priceElement) {
            cardsWithPrice++
            const priceText = priceElement.textContent
            console.log(`  Card ${index + 1}: ${priceText}`)

            if (originalPriceElement) {
                cardsWithDiscount++
                console.log(`    ↳ Original price: ${originalPriceElement.textContent}`)
            }

            if (discountBadge) {
                console.log(`    ↳ Discount: ${discountBadge.textContent}`)
            }
        } else {
            console.log(`  ❌ Card ${index + 1}: No price found`)
        }
    })

    // Test 2: Verificar formato de precios
    const priceElements = document.querySelectorAll('.current-price')
    priceElements.forEach((el, index) => {
        const text = el.textContent || ''
        const hasDollarSign = text.startsWith('$')
        const hasValidNumber = /\$[\d.,]+/.test(text)

        console.log(`  Price ${index + 1}: ${text} - ${hasDollarSign && hasValidNumber ? '✅' : '❌'}`)
    })

    // Test 3: Verificar CSS y estilos
    const testPriceElement = document.querySelector('.current-price')
    if (testPriceElement) {
        const styles = window.getComputedStyle(testPriceElement)
        console.log(`  Price styling:`)
        console.log(`    Color: ${styles.color}`)
        console.log(`    Font size: ${styles.fontSize}`)
        console.log(`    Font weight: ${styles.fontWeight}`)
    }

    console.log(`\n📊 Summary:`)
    console.log(`  - Cards with prices: ${cardsWithPrice}/${productCards.length}`)
    console.log(`  - Cards with discounts: ${cardsWithDiscount}`)
    console.log(`  - Success rate: ${((cardsWithPrice / productCards.length) * 100).toFixed(1)}%`)

    return {
        totalCards: productCards.length,
        cardsWithPrice,
        cardsWithDiscount,
        successRate: (cardsWithPrice / productCards.length) * 100
    }
}

export async function testProductDetail() {
    console.log('🔍 Testing product detail pricing...')

    const currentUrl = window.location.href
    if (!currentUrl.includes('/trabajo/')) {
        console.log('❌ Not in product detail page')
        return false
    }

    const priceElement = document.querySelector('.product-pricing .current-price')
    const originalPriceElement = document.querySelector('.product-pricing .original-price')

    if (priceElement) {
        console.log(`✅ Price found: ${priceElement.textContent}`)

        if (originalPriceElement) {
            console.log(`✅ Original price found: ${originalPriceElement.textContent}`)
        }

        return true
    } else {
        console.log('❌ No price found in product detail')
        return false
    }
}

export async function runAllPricingTests() {
    console.log('🚀 Running all pricing tests...\n')

    // Test en página principal/galería
    if (window.location.pathname === '/' || window.location.pathname === '/galeria') {
        await testPricing()
    }

    // Test en detalle de producto
    if (window.location.pathname.includes('/trabajo/')) {
        await testProductDetail()
    }

    console.log('\n✅ All pricing tests completed!')
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('💰 Pricing test script loaded. Run with: await runAllPricingTests()')
}