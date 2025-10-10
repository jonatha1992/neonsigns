/**
 * Firebase Testing Script
 *
 * This script tests the Firebase configuration, authentication,
 * Firestore CRUD operations, and Storage service.
 *
 * Usage:
 * 1. Ensure .env.local is configured with Firebase credentials
 * 2. Start dev server: npm run dev
 * 3. Open browser console
 * 4. Copy and paste test functions into console
 * 5. Run: await runAllTests()
 */

import { firestoreService } from '../src/services/firestore.service'
import { storageService } from '../src/services/storage.service'
import { authService } from '../src/services/auth.service'
import type { CreateGalleryItemInput } from '../src/types/gallery.types'

// Test results tracker
const testResults: Array<{
  suite: string
  test: string
  passed: boolean
  message: string
}> = []

function logTest(suite: string, test: string, passed: boolean, message: string) {
  testResults.push({ suite, test, passed, message })
  const icon = passed ? '✅' : '❌'
  console.log(`${icon} [${suite}] ${test}: ${message}`)
}

// ============================================================================
// TEST SUITE 1: Firebase Configuration
// ============================================================================

async function testFirebaseConfig() {
  console.log('\n🔧 TEST SUITE 1: Firebase Configuration\n')

  try {
    // Test 1.1: Firebase initialized
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    if (projectId === 'neon-signs-app') {
      logTest('Config', '1.1 Project ID', true, `Project ID correct: ${projectId}`)
    } else {
      logTest('Config', '1.1 Project ID', false, `Project ID mismatch: ${projectId}`)
    }

    // Test 1.2: All env vars present
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ]

    const missingVars = requiredVars.filter(v => !import.meta.env[v])
    if (missingVars.length === 0) {
      logTest('Config', '1.2 Environment Variables', true, 'All required variables present')
    } else {
      logTest('Config', '1.2 Environment Variables', false, `Missing: ${missingVars.join(', ')}`)
    }
  } catch (error) {
    logTest('Config', '1.x Exception', false, (error as Error).message)
  }
}

// ============================================================================
// TEST SUITE 2: Authentication (Requires Manual Login First)
// ============================================================================

async function testAuthentication() {
  console.log('\n🔐 TEST SUITE 2: Authentication\n')

  try {
    // Test 2.1: Check if user is logged in
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      logTest('Auth', '2.1 Current User', true, `Logged in as: ${currentUser.email}`)

      // Test 2.2: Check if admin
      if (currentUser.email === 'tecnofusion.it@gmail.com') {
        logTest('Auth', '2.2 Admin Check', true, 'User is admin')
      } else {
        logTest('Auth', '2.2 Admin Check', false, 'User is not admin')
      }
    } else {
      logTest('Auth', '2.1 Current User', false, 'Not logged in. Please login first at /admin/login')
    }
  } catch (error) {
    logTest('Auth', '2.x Exception', false, (error as Error).message)
  }
}

// ============================================================================
// TEST SUITE 3: Firestore CRUD Operations
// ============================================================================

async function testFirestoreCRUD() {
  console.log('\n📝 TEST SUITE 3: Firestore CRUD\n')

  let testItemId: string | null = null

  try {
    // Test 3.1: Create Item
    const testItem: CreateGalleryItemInput = {
      title: 'TEST: Automated Test Item',
      description: 'This item was created by the automated test script',
      category: 'eventos',
      imageUrl: 'https://via.placeholder.com/400x300.png?text=Test+Item',
      isFeatured: false,
      orderIndex: 9999,
      isActive: true,
      metadata: {
        colors: ['#FF0000'],
        dimensions: '40cm x 20cm',
        tags: ['test', 'automated']
      }
    }

    const createdItem = await firestoreService.createItem(testItem)
    testItemId = createdItem.id

    if (createdItem && createdItem.id) {
      logTest('Firestore', '3.1 Create Item', true, `Item created with ID: ${createdItem.id}`)
    } else {
      logTest('Firestore', '3.1 Create Item', false, 'Failed to create item')
      return // Can't continue without item
    }

    // Test 3.2: Read Item by ID
    const readItem = await firestoreService.getItemById(testItemId!)
    if (readItem && readItem.title === testItem.title) {
      logTest('Firestore', '3.2 Read Item', true, 'Item retrieved successfully')
    } else {
      logTest('Firestore', '3.2 Read Item', false, 'Failed to retrieve item')
    }

    // Test 3.3: Update Item
    await firestoreService.updateItem(testItemId!, {
      description: 'UPDATED: Description modified by test script'
    })

    const updatedItem = await firestoreService.getItemById(testItemId!)
    if (updatedItem && updatedItem.description?.includes('UPDATED')) {
      logTest('Firestore', '3.3 Update Item', true, 'Item updated successfully')
    } else {
      logTest('Firestore', '3.3 Update Item', false, 'Failed to update item')
    }

    // Test 3.4: Query Items
    const allItems = await firestoreService.getItems()
    if (allItems.length > 0) {
      logTest('Firestore', '3.4 Query All Items', true, `Found ${allItems.length} items`)
    } else {
      logTest('Firestore', '3.4 Query All Items', false, 'No items found')
    }

    // Test 3.5: Query by Category
    const eventosItems = await firestoreService.getItems('eventos')
    const hasTestItem = eventosItems.some(item => item.id === testItemId)
    if (hasTestItem) {
      logTest('Firestore', '3.5 Query by Category', true, `Found test item in 'eventos' category`)
    } else {
      logTest('Firestore', '3.5 Query by Category', false, 'Test item not found in category query')
    }

    // Test 3.6: Featured Items Query
    const featuredItems = await firestoreService.getFeaturedItems(4)
    if (featuredItems.length <= 4) {
      logTest('Firestore', '3.6 Featured Items Limit', true, `Featured items: ${featuredItems.length} (max 4)`)
    } else {
      logTest('Firestore', '3.6 Featured Items Limit', false, `Too many featured items: ${featuredItems.length}`)
    }

    // Test 3.7: Statistics
    const stats = await firestoreService.getStatistics()
    if (stats.total > 0) {
      logTest('Firestore', '3.7 Statistics', true, `Stats: ${stats.total} total, ${stats.featured} featured`)
    } else {
      logTest('Firestore', '3.7 Statistics', false, 'Statistics query failed')
    }

    // Test 3.8: Search
    const searchResults = await firestoreService.searchItems('TEST')
    if (searchResults.some(item => item.id === testItemId)) {
      logTest('Firestore', '3.8 Search', true, 'Search found test item')
    } else {
      logTest('Firestore', '3.8 Search', false, 'Search did not find test item')
    }

    // Test 3.9: Delete Item (Cleanup)
    await firestoreService.deleteItem(testItemId!)
    const deletedItem = await firestoreService.getItemById(testItemId!)
    if (!deletedItem) {
      logTest('Firestore', '3.9 Delete Item', true, 'Item deleted successfully')
    } else {
      logTest('Firestore', '3.9 Delete Item', false, 'Failed to delete item')
    }

  } catch (error) {
    logTest('Firestore', '3.x Exception', false, (error as Error).message)

    // Cleanup on error
    if (testItemId) {
      try {
        await firestoreService.deleteItem(testItemId)
        console.log('🧹 Cleanup: Deleted test item')
      } catch (cleanupError) {
        console.error('Failed to cleanup test item:', cleanupError)
      }
    }
  }
}

// ============================================================================
// TEST SUITE 4: Featured Limit Enforcement
// ============================================================================

async function testFeaturedLimit() {
  console.log('\n⭐ TEST SUITE 4: Featured Limit\n')

  const testItemIds: string[] = []

  try {
    // Get current featured count
    const currentFeatured = await firestoreService.getFeaturedItems()
    const initialCount = currentFeatured.length

    logTest('Featured', '4.0 Initial State', true, `Currently ${initialCount} featured items`)

    // Create 5 test items
    for (let i = 0; i < 5; i++) {
      const item = await firestoreService.createItem({
        title: `TEST: Featured Limit Test ${i + 1}`,
        description: 'Testing featured limit enforcement',
        category: 'decorativo',
        imageUrl: 'https://via.placeholder.com/400x300.png?text=Featured+Test',
        isFeatured: false,
        orderIndex: 10000 + i
      })
      testItemIds.push(item.id)
    }

    logTest('Featured', '4.1 Create Test Items', true, `Created 5 test items`)

    // Try to mark all as featured (should fail if already have 4)
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < 5; i++) {
      try {
        await firestoreService.updateFeaturedStatus(testItemIds[i], true)
        successCount++
      } catch (error) {
        failCount++
        if (i >= 4) {
          // Expected to fail after 4
          logTest('Featured', `4.2.${i + 1} Limit Enforcement`, true, `Item ${i + 1} correctly rejected`)
        } else {
          logTest('Featured', `4.2.${i + 1} Unexpected Failure`, false, (error as Error).message)
        }
      }
    }

    // Verify final count
    const finalFeatured = await firestoreService.getFeaturedItems()
    if (finalFeatured.length <= 4) {
      logTest('Featured', '4.3 Final Count', true, `Featured count: ${finalFeatured.length} (within limit)`)
    } else {
      logTest('Featured', '4.3 Final Count', false, `Featured count exceeds limit: ${finalFeatured.length}`)
    }

    // Cleanup
    for (const itemId of testItemIds) {
      await firestoreService.deleteItem(itemId)
    }
    logTest('Featured', '4.4 Cleanup', true, 'Test items deleted')

  } catch (error) {
    logTest('Featured', '4.x Exception', false, (error as Error).message)

    // Cleanup on error
    for (const itemId of testItemIds) {
      try {
        await firestoreService.deleteItem(itemId)
      } catch (cleanupError) {
        console.error(`Failed to cleanup item ${itemId}:`, cleanupError)
      }
    }
  }
}

// ============================================================================
// TEST SUITE 5: Storage Service (File Validation Only - No Upload)
// ============================================================================

async function testStorageService() {
  console.log('\n📤 TEST SUITE 5: Storage Service\n')

  try {
    // Test 5.1: Valid image file
    const validImage = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' })
    const validResult = storageService.validateFile(validImage)

    if (validResult.valid) {
      logTest('Storage', '5.1 Valid Image', true, 'JPEG file validated successfully')
    } else {
      logTest('Storage', '5.1 Valid Image', false, validResult.error || 'Unknown error')
    }

    // Test 5.2: Invalid file type
    const invalidFile = new File(['fake-data'], 'test.exe', { type: 'application/x-msdownload' })
    const invalidResult = storageService.validateFile(invalidFile)

    if (!invalidResult.valid && invalidResult.error) {
      logTest('Storage', '5.2 Invalid Type', true, 'Invalid file type correctly rejected')
    } else {
      logTest('Storage', '5.2 Invalid Type', false, 'Should reject non-image files')
    }

    // Test 5.3: File too large (>10MB)
    const largeFile = new File(
      [new ArrayBuffer(11 * 1024 * 1024)],
      'large.jpg',
      { type: 'image/jpeg' }
    )
    const largeResult = storageService.validateFile(largeFile)

    if (!largeResult.valid && largeResult.error?.includes('demasiado grande')) {
      logTest('Storage', '5.3 File Too Large', true, 'Large file correctly rejected')
    } else {
      logTest('Storage', '5.3 File Too Large', false, 'Should reject files >10MB')
    }

    // Test 5.4: Valid PNG
    const pngFile = new File(['fake-png-data'], 'test.png', { type: 'image/png' })
    const pngResult = storageService.validateFile(pngFile)

    if (pngResult.valid) {
      logTest('Storage', '5.4 Valid PNG', true, 'PNG file validated successfully')
    } else {
      logTest('Storage', '5.4 Valid PNG', false, pngResult.error || 'Unknown error')
    }

    // Test 5.5: Valid WebP
    const webpFile = new File(['fake-webp-data'], 'test.webp', { type: 'image/webp' })
    const webpResult = storageService.validateFile(webpFile)

    if (webpResult.valid) {
      logTest('Storage', '5.5 Valid WebP', true, 'WebP file validated successfully')
    } else {
      logTest('Storage', '5.5 Valid WebP', false, webpResult.error || 'Unknown error')
    }

    console.log('\nℹ️  Note: Actual image upload/delete tests require manual testing with real files')

  } catch (error) {
    logTest('Storage', '5.x Exception', false, (error as Error).message)
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

export async function runAllTests() {
  console.clear()
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║          🧪 FIREBASE TESTING SUITE - NEON SIGNS          ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('\n🚀 Starting automated tests...\n')

  // Clear previous results
  testResults.length = 0

  // Run all test suites
  await testFirebaseConfig()
  await testAuthentication()
  await testFirestoreCRUD()
  await testFeaturedLimit()
  await testStorageService()

  // Print summary
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║                    📊 TEST SUMMARY                         ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  const passed = testResults.filter(r => r.passed).length
  const failed = testResults.filter(r => !r.passed).length
  const total = testResults.length

  console.log(`Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    testResults
      .filter(r => !r.passed)
      .forEach(r => console.log(`   [${r.suite}] ${r.test}: ${r.message}`))
  }

  console.log('\n✨ Testing complete!\n')

  return {
    total,
    passed,
    failed,
    results: testResults
  }
}

// Export individual test suites for manual testing
export {
  testFirebaseConfig,
  testAuthentication,
  testFirestoreCRUD,
  testFeaturedLimit,
  testStorageService
}

// Instructions
console.log(`
╔════════════════════════════════════════════════════════════╗
║         🧪 Firebase Testing Script Loaded                  ║
╚════════════════════════════════════════════════════════════╝

To run tests, use the browser console:

1. Full test suite:
   await runAllTests()

2. Individual test suites:
   await testFirebaseConfig()
   await testAuthentication()
   await testFirestoreCRUD()
   await testFeaturedLimit()
   await testStorageService()

⚠️  Prerequisites:
- .env.local configured with Firebase credentials
- Firebase project created (neon-signs-app)
- Admin user created (tecnofusion.it@gmail.com)
- Firestore and Storage rules deployed

📝 Note: Some tests require authentication.
   Login first at /admin/login before running tests.
`)
