# 🧪 Testing & Migration Scripts

This folder contains scripts for testing Firebase functionality and migrating data.

## 📝 Available Scripts

### 1. `test-firebase.ts` - Firebase Testing Suite

Comprehensive automated tests for Firebase configuration, authentication, Firestore CRUD operations, and Storage service.

#### Prerequisites
- `.env.local` configured with Firebase credentials
- Firebase project created (ID: `neon-signs-app`)
- Admin user created in Firebase Authentication (`tecnofusion.it@gmail.com`)
- Firestore and Storage rules deployed

#### Usage

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12 or Cmd/Ctrl+Shift+I)

3. **Import the test module**:
   ```javascript
   const tests = await import('/scripts/test-firebase.ts')
   ```

4. **Run all tests**:
   ```javascript
   await tests.runAllTests()
   ```

5. **Or run individual test suites**:
   ```javascript
   await tests.testFirebaseConfig()      // Test Firebase initialization
   await tests.testAuthentication()      // Test auth (requires login first)
   await tests.testFirestoreCRUD()       // Test CRUD operations
   await tests.testFeaturedLimit()       // Test featured items limit
   await tests.testStorageService()      // Test file validation
   ```

#### Test Suites

| Suite | Tests | Description |
|-------|-------|-------------|
| **Firebase Config** | 2 tests | Verify Firebase initialization and env variables |
| **Authentication** | 2 tests | Check login status and admin validation |
| **Firestore CRUD** | 9 tests | Create, read, update, delete, query, search, stats |
| **Featured Limit** | 4 tests | Validate max 4 featured items enforcement |
| **Storage Service** | 5 tests | File type and size validation |

#### Expected Output

```
╔════════════════════════════════════════════════════════════╗
║          🧪 FIREBASE TESTING SUITE - NEON SIGNS          ║
╚════════════════════════════════════════════════════════════╝

🔧 TEST SUITE 1: Firebase Configuration
✅ [Config] 1.1 Project ID: Project ID correct: neon-signs-app
✅ [Config] 1.2 Environment Variables: All required variables present

🔐 TEST SUITE 2: Authentication
✅ [Auth] 2.1 Current User: Logged in as: tecnofusion.it@gmail.com
✅ [Auth] 2.2 Admin Check: User is admin

📝 TEST SUITE 3: Firestore CRUD
✅ [Firestore] 3.1 Create Item: Item created with ID: abc123
✅ [Firestore] 3.2 Read Item: Item retrieved successfully
...

╔════════════════════════════════════════════════════════════╗
║                    📊 TEST SUMMARY                         ║
╚════════════════════════════════════════════════════════════╝

Total Tests: 22
✅ Passed: 22
❌ Failed: 0
Success Rate: 100.0%

✨ Testing complete!
```

#### Important Notes

- **Authentication Required**: Login at `/admin/login` before running tests that require auth
- **Test Cleanup**: Tests automatically clean up created items
- **Non-Destructive**: Tests only create temporary items with "TEST:" prefix
- **Storage Tests**: File upload/delete require manual testing with real files

---

### 2. `migrate-to-firestore.ts` - Data Migration Script (Coming Soon)

This script will migrate existing mock product data to Firestore.

#### Features (Planned)
- Read mock data from `src/stores/products.ts`
- Transform to Firestore schema
- Map categories appropriately
- Mark first 4 items as featured
- Assign sequential order indexes
- Upload to Firestore collection
- Create backup of original data

#### Usage (When Available)
```bash
# Run migration
npm run migrate

# Or with backup
npm run migrate -- --backup
```

---

## 🔧 Setup Instructions

### Step 1: Firebase Project Setup

1. **Create Firebase project** (if not exists):
   - Go to https://console.firebase.google.com/
   - Create new project with ID: `neon-signs-app`

2. **Enable services**:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create database in production mode
   - **Storage**: Enable Firebase Storage

3. **Get Firebase config**:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy Firebase configuration

### Step 2: Environment Variables

1. **Create `.env.local` file** in project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add Firebase credentials**:
   ```env
   VITE_FIREBASE_API_KEY=AIza...your_key
   VITE_FIREBASE_AUTH_DOMAIN=neon-signs-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=neon-signs-app
   VITE_FIREBASE_STORAGE_BUCKET=neon-signs-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### Step 3: Deploy Security Rules

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (select existing project):
   ```bash
   firebase init
   ```
   - Select: Firestore, Storage
   - Use existing `firestore.rules` and `storage.rules` files

4. **Deploy rules**:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

### Step 4: Create Admin User

1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `tecnofusion.it@gmail.com`
4. Password: [Choose a strong password]
5. Click "Add user"

### Step 5: Verify Setup

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test login**:
   - Navigate to http://localhost:5173/admin/login
   - Login with admin credentials
   - Should redirect to admin dashboard

3. **Run tests**:
   - Open browser console
   - Import and run test suite (see Usage above)
   - All tests should pass ✅

---

## 📊 Test Results Log

Keep track of test runs here:

| Date | Tester | Results | Notes |
|------|--------|---------|-------|
| 2025-10-10 | Initial Setup | ⏳ Pending | Awaiting Firebase setup |
| | | | |

---

## 🐛 Troubleshooting

### "Firebase not initialized" Error
- Check `.env.local` exists and has all variables
- Restart dev server
- Clear browser cache

### "Permission denied" in Firestore
- Deploy Firestore rules: `firebase deploy --only firestore:rules`
- Verify rules in Firebase Console

### "Authentication failed"
- Verify admin user exists in Firebase Console
- Check email matches: `tecnofusion.it@gmail.com`
- Try password reset if needed

### Tests fail with "Not logged in"
- Login at `/admin/login` first
- Tests require authenticated session
- Refresh browser after login

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Main Implementation Plan](../IMPLEMENTATION_PLAN.md)

---

*Last Updated: 2025-10-10*
