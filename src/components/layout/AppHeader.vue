<template>
  <header class="header">
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <!-- Logo -->
          <RouterLink
            to="/"
            class="logo"
            @click.prevent="handleLogoClick"
          >
            <span class="neon-text pink glitch-effect">
              <span class="glitch-layer" data-text="Cuadros">Cuadros</span>
            </span>
            <span class="text-white">NEON</span>
            <span class="text-white">LeD</span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="nav-links desktop-only">
            <RouterLink to="/" class="nav-link" @click="clearActiveSection">
              <Home :size="18" />
              <span>Inicio</span>
            </RouterLink>
            <button class="nav-link" :class="{ active: activeSection === 'destacados' }" @click="scrollToFeatured">
              <Star :size="18" />
              <span>Destacados</span>
            </button>
            <RouterLink to="/galeria" class="nav-link" @click="clearActiveSection">
              <Images :size="18" />
              <span>Galería</span>
            </RouterLink>
            <RouterLink to="/contacto" class="nav-link" @click="clearActiveSection">
              <Mail :size="18" />
              <span>Contacto</span>
            </RouterLink>
               <!-- Admin Navigation Links (prominent when admin access is available) -->
            <template v-if="isAdmin">
              <RouterLink to="/admin/dashboard" class="nav-link admin-nav-link" @click="clearActiveSection">
                <LayoutDashboard :size="18" />
                <span>Panel de Control</span>
              </RouterLink>
            </template>
          </div>

          <!-- Actions -->
          <div class="navbar-actions">
            <!-- Auth Section -->
            <div v-if="user" class="user-menu" ref="userMenuRef">
              <button @click="toggleUserMenu" class="btn btn-neon logout-btn">
                <User :size="20" />
                <span class="desktop-only">{{ userDisplayName }}</span>
                <ChevronDown :size="16" class="desktop-only chevron-icon" />
              </button>

              <!-- User Dropdown -->
              <Transition name="dropdown">
                <div v-if="showUserMenu" class="user-dropdown">
                  <div class="dropdown-header">
                    <div class="user-info">
                      <div class="user-avatar-lg">
                        <User :size="24" />
                      </div>
                      <div class="user-details">
                        <p class="user-email">{{ user.email }}</p>
                        <p class="user-role">{{ isAdmin ? 'Administrador' : 'Usuario' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="dropdown-divider"></div>

                  <div class="dropdown-menu">
                    <button @click="handleLogout" class="dropdown-item logout-item">
                      <LogOut :size="16" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Login Button (when not authenticated) -->
            <RouterLink
              v-else
              to="/admin/login"
              class="btn btn-neon login-btn desktop-only"
            >
              <LogIn :size="20" />
              <span>LOGIN</span>
            </RouterLink>

            <!-- Mobile Menu Toggle -->
            <button @click="toggleMobileMenu" class="mobile-menu-btn mobile-only">
              <Menu v-if="!isMobileMenuOpen" :size="24" />
              <X v-else :size="24" />
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-show="isMobileMenuOpen" class="mobile-nav">
          <RouterLink to="/" class="mobile-nav-link" @click="handleMobileNavClick">
            <Home :size="18" />
            <span>Inicio</span>
          </RouterLink>
          <button class="mobile-nav-link" :class="{ active: activeSection === 'destacados' }" @click="handleFeaturedClick">
            <Star :size="18" />
            <span>Destacados</span>
          </button>
          <RouterLink to="/galeria" class="mobile-nav-link" @click="handleMobileNavClick">
            <Images :size="18" />
            <span>Galería</span>
          </RouterLink>
          
          <!-- Admin Navigation in Mobile Hamburger (prominent placement) -->
          <template v-if="isAdmin">
            <div class="mobile-nav-separator"></div>
            <div class="mobile-admin-section">
              <span class="mobile-section-title">Administrador</span>
              <RouterLink to="/admin/dashboard" class="mobile-nav-link admin-mobile-link" @click="handleMobileNavClick">
                <LayoutDashboard :size="18" />
                <span>Panel de Control</span>
              </RouterLink>
            </div>
            <div class="mobile-nav-separator"></div>
          </template>
          
          <RouterLink to="/contacto" class="mobile-nav-link" @click="handleMobileNavClick">
            <Mail :size="18" />
            <span>Contacto</span>
          </RouterLink>

          <!-- Mobile Auth Actions -->
          <div class="mobile-auth">
            <template v-if="user">
              <div class="mobile-user-info">
                <div class="mobile-user-avatar">
                  <User :size="20" />
                </div>
                <div class="mobile-user-details">
                  <p class="mobile-user-email">{{ user.email }}</p>
                  <p class="mobile-user-role">{{ isAdmin ? 'Administrador' : 'Usuario' }}</p>
                </div>
              </div>
              <button @click="handleLogout" class="mobile-nav-link logout-link">
                <LogOut :size="18" />
                <span>LOGOUT</span>
              </button>
            </template>
            <RouterLink v-else to="/admin/login" class="mobile-nav-link login-link" @click="closeMobileMenu">
              <LogIn :size="18" />
              <span>LOGIN</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu, X, User, ChevronDown, LogIn, LogOut,
  LayoutDashboard, Images, Home, Mail, Star
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const isMobileMenuOpen = ref(false)
const router = useRouter()

// Active section tracking
const activeSection = ref<string>('')

// Auth state
const { user, signOut, isAdmin } = useAuth()
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// User display name
const userDisplayName = computed(() => {
  if (!user.value?.email) return ''
  return user.value.email.split('@')[0]
})

// Admin access logic - require 5 clicks within 3 seconds
const clickCount = ref(0)
let clickTimer: NodeJS.Timeout | null = null

const handleLogoClick = (event: Event) => {
  event.preventDefault()
  clickCount.value++
  
  // Reset timer on first click
  if (clickCount.value === 1) {
    clickTimer = setTimeout(() => {
      clickCount.value = 0
    }, 2000) // Reset after 2 seconds
  }
  
  // Show feedback for multiple clicks
  if (clickCount.value >= 2 && clickCount.value < 5) {
    console.log(`Admin access: ${clickCount.value}/5 clicks`)
  }
  
  // Check for admin access (5 clicks within 2 seconds)
  if (clickCount.value >= 5) {
    if (clickTimer) {
      clearTimeout(clickTimer)
    }
    clickCount.value = 0
    console.log('🎉 Acceso admin activado!')
    
    // Navigate to admin login
    router.push('/admin/login')
    return
  }
  
  // Normal navigation after single click delay (only if it's truly a single click)
  if (clickCount.value === 1) {
    setTimeout(() => {
      if (clickCount.value === 1) {
        router.push('/')
      }
    }, 500)
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  // Clear active section when navigating from mobile menu
  if (activeSection.value) {
    activeSection.value = ''
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  try {
    await signOut()
    closeUserMenu()
    closeMobileMenu()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Función para scroll a destacados
const scrollToFeatured = () => {
  activeSection.value = 'destacados'
  
  // Si estamos en la página de inicio, hacer scroll
  if (router.currentRoute.value.path === '/') {
    setTimeout(() => {
      const featuredSection = document.getElementById('destacados')
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  } else {
    // Si no estamos en inicio, navegar y luego hacer scroll
    router.push('/').then(() => {
      setTimeout(() => {
        const featuredSection = document.getElementById('destacados')
        if (featuredSection) {
          featuredSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    })
  }
}

// Función para manejar click en destacados desde móvil
const handleFeaturedClick = () => {
  closeMobileMenu()
  scrollToFeatured()
}

// Función para limpiar estado activo
const clearActiveSection = () => {
  activeSection.value = ''
}

// Función para manejar navegación móvil
const handleMobileNavClick = () => {
  closeMobileMenu()
  clearActiveSection()
}

// Watch route changes to reset active section
watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath !== '/') {
    activeSection.value = ''
  }
})

// Click outside to close user menu
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Watch for auth changes
watch([user, isAdmin], ([newUser, newIsAdmin]) => {
  console.log('🔄 [AppHeader] Auth state changed:')
  console.log('   - User:', newUser?.email || 'None')
  console.log('   - Is Admin:', newIsAdmin)
}, { immediate: true })

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Debug authentication and admin status
  console.log('🔧 [AppHeader] Mounted - Current user:', user.value?.email)
  console.log('🔧 [AppHeader] Mounted - Is admin:', isAdmin.value)
  console.log('🔧 [AppHeader] VITE_REQUIRE_ADMIN:', import.meta.env.VITE_REQUIRE_ADMIN)
  console.log('🔧 [AppHeader] VITE_ADMIN_EMAILS:', import.meta.env.VITE_ADMIN_EMAILS)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 0, 128, 0.2);
}

.navbar {
  padding: 0.75rem 0;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 900;
  text-decoration: none;
  font-family: 'Orbitron', monospace;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logo .logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
  margin-left: 0.25rem;
  animation: neon-pulse 2s ease-in-out infinite alternate;
  transition: all 0.3s ease;
}

.logo .logo-icon:hover {
  filter: brightness(1.5) saturate(1.5) drop-shadow(0 0 20px rgba(255, 20, 147, 1));
  transform: scale(1.1);
}

.logo:hover .neon-text {
  animation: neon-flicker 0.5s;
}

/* Glitch Effect */
.glitch-effect {
  position: relative;
  display: inline-block;
}

.glitch-layer {
  position: relative;
  display: inline-block;
}

.glitch-layer::before,
.glitch-layer::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.glitch-layer::before {
  color: #00ffff;
  animation: glitch-1 3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-2px, -2px);
}

.glitch-layer::after {
  color: #ff00ff;
  animation: glitch-2 3s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
  transform: translate(2px, 2px);
}

.logo:hover .glitch-layer::before,
.logo:hover .glitch-layer::after {
  animation-duration: 0.5s;
}

@keyframes glitch-1 {
  0%, 90%, 100% {
    opacity: 0;
    transform: translate(-2px, -2px);
  }
  91%, 94% {
    opacity: 0.8;
    transform: translate(-4px, -1px);
  }
  92%, 93% {
    opacity: 0;
    transform: translate(2px, 1px);
  }
  95%, 96% {
    opacity: 0.7;
    transform: translate(-3px, 2px);
  }
}

@keyframes glitch-2 {
  0%, 90%, 100% {
    opacity: 0;
    transform: translate(2px, 2px);
  }
  91%, 93% {
    opacity: 0.8;
    transform: translate(3px, -2px);
  }
  92%, 94% {
    opacity: 0;
    transform: translate(-2px, 1px);
  }
  95%, 97% {
    opacity: 0.7;
    transform: translate(4px, -1px);
  }
}

/* Intensificar cortocircuito cada 5 segundos */
.glitch-effect {
  animation: intense-glitch 5s infinite;
}

@keyframes intense-glitch {
  0%, 96%, 100% {
    opacity: 1;
  }
  97%, 98% {
    opacity: 0.8;
    filter: brightness(1.5) saturate(2);
  }
  97.5% {
    opacity: 0.3;
    transform: translate(-1px, 0);
  }
  98.5% {
    opacity: 1;
    transform: translate(1px, 0);
  }
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #cccccc;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover,
.nav-link.router-link-active,
.nav-link.active {
  color: #ff0080;
  background: rgba(255, 0, 128, 0.1);
}

.mobile-menu-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.25rem;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(255, 0, 128, 0.2);
  margin-top: 0.25rem;
  background: rgba(26, 26, 26, 0.5);
  border-radius: 8px;
  margin: 0.5rem 0;
}

.mobile-nav-link {
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  position: relative;
}

.mobile-nav-link svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active,
.mobile-nav-link.active {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
  border-left: 3px solid #00ffff;
  padding-left: 1.25rem;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  
  .mobile-nav {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 255, 255, 0.2);
  }
  
  .navbar {
    padding: 0.5rem 0;
  }
  
  .logo {
    font-size: 1.25rem;
  }
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}

/* User Menu Styles */
.user-menu {
  position: relative;
}

.logout-btn {
  position: relative;
}

.logout-btn .chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logout-btn:hover .chevron-icon {
  transform: translateY(2px);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(10, 10, 10, 0.98);
  border: 1px solid rgba(128, 0, 255, 0.3);
  border-radius: 12px;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(128, 0, 255, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(128, 0, 255, 0.1));
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar-lg {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ff0080, #8000ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-details .user-email {
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-details .user-role {
  font-size: 0.85rem;
  color: #cccccc;
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(128, 0, 255, 0.3), transparent);
}

.dropdown-menu {
  padding: 0.25rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #cccccc;
  text-decoration: none;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: rgba(128, 0, 255, 0.1);
  color: #8000ff;
}

.dropdown-item.logout-item {
  color: #ef4444;
}

.dropdown-item.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.login-btn,
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.login-btn span,
.logout-btn span {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Mobile Auth */
.mobile-auth {
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  margin-top: 0;
  padding-top: 0;
}

.mobile-auth .mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 0;
  margin-bottom: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-auth .mobile-user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #00ffff, #0088ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.mobile-auth .mobile-user-details {
  flex: 1;
  min-width: 0;
}

.mobile-auth .mobile-user-details .mobile-user-email {
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
}

.mobile-auth .mobile-user-details .mobile-user-role {
  font-size: 0.7rem;
  color: #00ffff;
  margin: 0;
  font-weight: 600;
}

.mobile-auth .admin-link {
  color: #00ffff !important;
  font-weight: 600;
}

.mobile-auth .logout-link,
.mobile-auth .login-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.mobile-auth .logout-link {
  color: #ff6b6b !important;
}

.mobile-auth .logout-link:hover {
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #ff6b6b;
  padding-left: 1.25rem;
}

.mobile-auth .login-link {
  color: #00ffff !important;
}

.mobile-auth .login-link:hover {
  background: rgba(0, 255, 255, 0.1);
  border-left: 3px solid #00ffff;
  padding-left: 1.25rem;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile menu transition */
.mobile-nav {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}

/* Admin Navigation Styles */
.admin-nav-link {
  color: #8000ff !important;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.admin-nav-link:hover {
  color: #9933ff !important;
  background: rgba(128, 0, 255, 0.1) !important;
  transform: translateY(-1px);
}

.mobile-nav-separator {
  height: 1px;
  background: rgba(0, 255, 255, 0.3);
  margin: 0;
}

.mobile-admin-section {
  background: rgba(0, 255, 255, 0.05);
  border-radius: 0;
  padding: 0;
  margin: 0;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.mobile-section-title {
  display: block;
  color: #00ffff;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  padding: 0.5rem 1rem 0.25rem 1rem;
  background: rgba(0, 255, 255, 0.1);
}

.admin-mobile-link {
  color: #00ffff !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem !important;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-mobile-link:hover {
  color: #00ffff !important;
  background: rgba(0, 255, 255, 0.15) !important;
  border-left: 3px solid #00ffff;
  padding-left: 1.25rem !important;
}

/* Animations */
@keyframes neon-pulse {
  0% {
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
  }
  100% {
    filter: brightness(1.4) saturate(1.5) drop-shadow(0 0 15px rgba(255, 20, 147, 1));
  }
}
</style>