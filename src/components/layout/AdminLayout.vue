<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <span v-if="!sidebarCollapsed" class="logo-text">NeonSigns Admin</span>
        </div>
        <button @click="toggleSidebar" class="sidebar-toggle" type="button">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/admin/dashboard" class="nav-link" active-class="active">
              <i class="fas fa-tachometer-alt"></i>
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/gallery" class="nav-link" active-class="active">
              <i class="fas fa-images"></i>
              <span v-if="!sidebarCollapsed">Galería</span>
            </router-link>
          </li>
          <li class="nav-item">
            <a href="#" @click="showSettings = true" class="nav-link">
              <i class="fas fa-cog"></i>
              <span v-if="!sidebarCollapsed">Configuración</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="user">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div v-if="!sidebarCollapsed" class="user-details">
            <p class="user-name">{{ user.email }}</p>
            <p class="user-role">Administrador</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn" type="button">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!sidebarCollapsed">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <!-- Notifications -->
          <div class="notifications">
            <button class="notification-btn" type="button">
              <i class="fas fa-bell"></i>
              <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
            </button>
          </div>
          
          <!-- User Menu -->
          <div class="user-menu" ref="userMenuRef">
            <button @click="toggleUserMenu" class="user-menu-btn" type="button">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <i class="fas fa-chevron-down"></i>
            </button>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <a href="#" @click="showProfile = true" class="dropdown-item">
                <i class="fas fa-user"></i>
                Perfil
              </a>
              <a href="#" @click="showSettings = true" class="dropdown-item">
                <i class="fas fa-cog"></i>
                Configuración
              </a>
              <hr class="dropdown-divider">
              <a href="#" @click="handleLogout" class="dropdown-item">
                <i class="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>

    <!-- Loading Overlay -->
    <LoadingOverlay v-if="loading" />

    <!-- Modals -->
    <div v-if="showProfile" class="modal-backdrop" @click="showProfile = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Perfil de Usuario</h3>
          <button @click="showProfile = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="profile-info">
            <div class="profile-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="profile-details">
              <p><strong>Email:</strong> {{ user?.email }}</p>
              <p><strong>Rol:</strong> Administrador</p>
              <p><strong>Última conexión:</strong> {{ formatDate(user?.metadata?.lastSignInTime) }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showProfile = false" class="btn btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>

    <div v-if="showSettings" class="modal-backdrop" @click="showSettings = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Configuración</h3>
          <button @click="showSettings = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="settings-section">
            <h4>Apariencia</h4>
            <div class="form-group">
              <label class="form-label">
                <input 
                  type="checkbox" 
                  v-model="sidebarCollapsed"
                  class="form-checkbox"
                >
                Contraer barra lateral por defecto
              </label>
            </div>
          </div>
          <div class="settings-section">
            <h4>Notificaciones</h4>
            <div class="form-group">
              <label class="form-label">
                <input 
                  type="checkbox" 
                  v-model="enableNotifications"
                  class="form-checkbox"
                >
                Activar notificaciones
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="saveSettings" class="btn btn-primary">Guardar</button>
          <button @click="showSettings = false" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

// Composables
const route = useRoute()
const router = useRouter()
const { user, signOut, loading } = useAuth()

// Reactive state
const sidebarCollapsed = ref(false)
const showUserMenu = ref(false)
const showProfile = ref(false)
const showSettings = ref(false)
const enableNotifications = ref(true)
const notificationCount = ref(0)
const userMenuRef = ref<HTMLElement>()

// Computed properties
const pageTitle = computed(() => {
  const routeName = route.name as string
  const titles: Record<string, string> = {
    'admin-dashboard': 'Dashboard',
    'admin-gallery': 'Gestión de Galería',
    AdminSettings: 'Configuración'
  }
  return titles[routeName] || 'Panel de Administración'
})

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('adminSidebarCollapsed', String(sidebarCollapsed.value))
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  try {
    await signOut()
    router.push('/admin/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const saveSettings = () => {
  // Save settings to localStorage
  localStorage.setItem('adminSidebarCollapsed', String(sidebarCollapsed.value))
  localStorage.setItem('adminNotifications', String(enableNotifications.value))
  showSettings.value = false
}

const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return 'Nunca'
  return new Date(timestamp).toLocaleString('es-ES')
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Load saved settings
  const savedSidebarState = localStorage.getItem('adminSidebarCollapsed')
  if (savedSidebarState !== null) {
    sidebarCollapsed.value = savedSidebarState === 'true'
  }

  const savedNotifications = localStorage.getItem('adminNotifications')
  if (savedNotifications !== null) {
    enableNotifications.value = savedNotifications === 'true'
  }

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Sidebar */
.admin-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);

  &.sidebar-collapsed {
    width: 70px;
  }
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  font-size: 1.125rem;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    border-left-color: #fbbf24;
  }

  i {
    width: 20px;
    text-align: center;
  }

  span {
    white-space: nowrap;
  }
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-details {
  overflow: hidden;
}

.user-name {
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

/* Main Content */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notifications {
  position: relative;
}

.notification-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    background-color: #e5e7eb;
    color: #6b7280;
  }
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  i {
    width: 16px;
    text-align: center;
  }
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0.25rem 0;
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.profile-info {
  display: flex;
  gap: 1rem;
  align-items: start;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background-color: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.profile-details {
  flex: 1;

  p {
    margin: 0.5rem 0;
    color: #374151;
  }
}

.settings-section {
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 1rem 0;
    color: #374151;
    font-size: 1rem;
    font-weight: 600;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  cursor: pointer;
}

.form-checkbox {
  width: 1rem;
  height: 1rem;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &.btn-primary {
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  }

  &.btn-secondary {
    background-color: #e5e7eb;
    color: #374151;

    &:hover {
      background-color: #d1d5db;
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;

    &:not(.sidebar-collapsed) {
      width: 280px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 40;
    }
  }

  .admin-header {
    padding: 1rem;
  }

  .admin-content {
    padding: 1rem;
  }
}
</style>