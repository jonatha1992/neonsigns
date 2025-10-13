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
            <span class="neon-text pink">NEON</span>
            <span class="text-white">Signs</span>
            <span class="text-white">LD</span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="nav-links desktop-only">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
            <RouterLink to="/galeria" class="nav-link">Galería</RouterLink>
            <RouterLink to="/contacto" class="nav-link">Contacto</RouterLink>
          </div>

          <!-- Actions -->
          <div class="navbar-actions">
            <!-- WhatsApp Button -->
            <a
              :href="whatsappUrl"
              target="_blank"
              class="btn btn-neon whatsapp-btn desktop-only"
            >
              <MessageCircle :size="20" />
              <span>WhatsApp</span>
            </a>

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
                    <RouterLink
                      v-if="isAdmin"
                      to="/admin/dashboard"
                      class="dropdown-item"
                      @click="closeUserMenu"
                    >
                      <LayoutDashboard :size="16" />
                      <span>Panel Admin</span>
                    </RouterLink>

                    <RouterLink
                      v-if="isAdmin"
                      to="/admin/gallery"
                      class="dropdown-item"
                      @click="closeUserMenu"
                    >
                      <Images :size="16" />
                      <span>Gestión Galería</span>
                    </RouterLink>

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
          <RouterLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Inicio</RouterLink>
          <RouterLink to="/galeria" class="mobile-nav-link" @click="closeMobileMenu">Galería</RouterLink>
          <RouterLink to="/contacto" class="mobile-nav-link" @click="closeMobileMenu">Contacto</RouterLink>

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
              <RouterLink
                v-if="isAdmin"
                to="/admin/dashboard"
                class="mobile-nav-link admin-link"
                @click="closeMobileMenu"
              >
                <LayoutDashboard :size="18" />
                <span>Panel Admin</span>
              </RouterLink>
              <RouterLink
                v-if="isAdmin"
                to="/admin/gallery"
                class="mobile-nav-link admin-link"
                @click="closeMobileMenu"
              >
                <Images :size="18" />
                <span>Gestión Galería</span>
              </RouterLink>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  MessageCircle, Menu, X, User, ChevronDown, LogIn, LogOut,
  LayoutDashboard, Images
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const isMobileMenuOpen = ref(false)
const router = useRouter()

// Auth state
const { user, signOut } = useAuth()
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// Admin check
const isAdmin = computed(() => {
  if (!user.value?.email) return false
  return user.value.email === 'tecnofusion.it@gmail.com'
})

// User display name
const userDisplayName = computed(() => {
  if (!user.value?.email) return ''
  return user.value.email.split('@')[0]
})

// Admin access logic - require 5 clicks within 3 seconds
const clickCount = ref(0)
let clickTimer: NodeJS.Timeout | null = null

// WhatsApp configuration
const whatsappNumber = '+5491140916764'
const whatsappMessage = 'Hola! Me interesa información sobre sus carteles de neón (Zona Sur) 🌟'
const whatsappUrl = computed(() =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
)

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

// Click outside to close user menu
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
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

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #cccccc;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.125rem 0.25rem;
  border-radius: 8px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #ff0080;
  background: rgba(255, 0, 128, 0.1);
}

.whatsapp-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.25rem;
}

.whatsapp-btn:hover {
  transform: translateY(-2px);
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
  gap: 0.25rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 0, 128, 0.2);
  margin-top: 0.5rem;
}

.mobile-nav-link {
  text-decoration: none;
  color: #cccccc;
  font-weight: 500;
  padding: 0.25rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #ff0080;
  background: rgba(255, 0, 128, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
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
  border-top: 1px solid rgba(255, 0, 128, 0.2);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

.mobile-auth .mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(128, 0, 255, 0.1));
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.mobile-auth .mobile-user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff0080, #8000ff);
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
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
}

.mobile-auth .mobile-user-details .mobile-user-role {
  font-size: 0.75rem;
  color: #cccccc;
  margin: 0;
}

.mobile-auth .admin-link {
  color: #8000ff !important;
  font-weight: 600;
}

.mobile-auth .logout-link,
.mobile-auth .login-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: inherit;
  font-weight: 600;
}

.mobile-auth .logout-link {
  color: #ef4444 !important;
}

.mobile-auth .login-link {
  color: #ff0080 !important;
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