/**
 * 🔐 Auth Smoke Test
 * Quick way to verify Firebase Email/Password login works
 * Usage in browser console (with dev server running):
 *   const t = await import('/scripts/auth-smoke.ts')
 *   await t.runAuthSmoke('admin@admin.com','yourPassword')
 */

import AuthService from '@/services/auth.service'

export async function runAuthSmoke(email: string, password: string) {
    const pad = (s: string) => `%c${s}`
    const styleOk = 'color:#10B981;font-weight:700'
    const styleErr = 'color:#EF4444;font-weight:700'
    const styleInfo = 'color:#38BDF8'

    console.log('\n============================')
    console.log('🔐 AUTH SMOKE TEST')
    console.log('============================')

    try {
        console.log(pad('→ SignIn attempt:'), styleInfo, email)
        const user = await AuthService.signIn(email, password)
        console.log(pad('✅ Signed in as:'), styleOk, user.email || '(no-email)')

        const isAdmin = AuthService.isAdmin(user)
        console.log(pad('🔎 isAdmin:'), styleInfo, isAdmin)

        await AuthService.signOut()
        console.log(pad('🚪 Signed out'), styleOk)

        console.log('\n🎉 Smoke test OK')
    } catch (err: any) {
        console.error(pad('❌ Auth failed:'), styleErr, err?.message || err)
        console.warn('Tips:')
        console.warn('  • Verifica que el usuario exista en Firebase Authentication (Email/Password).')
        console.warn('  • Asegúrate de que la contraseña sea correcta.')
        console.warn('  • Ajusta .env.local: VITE_ADMIN_EMAILS y VITE_REQUIRE_ADMIN según tus pruebas.')
    }
}

export default { runAuthSmoke }
