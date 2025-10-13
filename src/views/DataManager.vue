<template>
  <div class="data-manager">
    <div class="container">
      <div class="header">
        <h1>🔄 Administrador de Datos</h1>
        <p>Panel de administración de datos — las herramientas de migración se retiraron del panel.</p>
      </div>

      <!-- Estado del Sistema -->
      <div class="status-card">
        <h2>📊 Estado del Sistema</h2>
        <div v-if="systemStats" class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Fuente de Datos</div>
            <div class="stat-value" :class="`source-${systemStats.source}`">
              {{ systemStats.source === 'firebase' ? '🔥 Firebase' : '📦 Mock Data' }}
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Total Items</div>
            <div class="stat-value">{{ systemStats.totalItems }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Items Destacados</div>
            <div class="stat-value">{{ systemStats.featuredItems }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Firebase Disponible</div>
            <div class="stat-value" :class="systemStats.firebaseAvailable ? 'success' : 'error'">
              {{ systemStats.firebaseAvailable ? '✅ Sí' : '❌ No' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración -->
      <div class="config-card">
        <h2>⚙️ Configuración</h2>
        <div class="config-options">
          <button
            @click="setDataSource('auto')"
            :class="['btn', currentSource === 'auto' ? 'btn-primary' : 'btn-secondary']"
          >
            🔄 Automático
          </button>
          <button
            @click="setDataSource('firebase')"
            :class="['btn', currentSource === 'firebase' ? 'btn-primary' : 'btn-secondary']"
          >
            🔥 Solo Firebase
          </button>
          <button
            @click="setDataSource('mock')"
            :class="['btn', currentSource === 'mock' ? 'btn-primary' : 'btn-secondary']"
          >
            📦 Solo Mock
          </button>
        </div>
      </div>

      <!-- Mensaje informativo sobre migraciones -->
      <div class="migration-card">
        <h2>🛠️ Herramientas de Administración</h2>
        <p class="muted">Las operaciones de migración han sido retiradas del panel. Si necesitás ejecutar scripts de migración, están disponibles como scripts CLI o deben ejecutarse manualmente fuera del panel.</p>
      </div>

      <!-- Previsualización de Datos -->
      <div v-if="previewData.length > 0" class="preview-card">
        <h2>👀 Previsualización de Datos ({{ dataSource }})</h2>
        <div class="preview-grid">
          <div
            v-for="item in previewData"
            :key="item.id"
            class="preview-item"
          >
            <div class="preview-image">
              <img :src="item.imageUrl || item.images?.[0]" :alt="item.title || item.name" />
            </div>
            <div class="preview-content">
              <h4>{{ item.title || item.name }}</h4>
              <p>{{ (item.description || '').substring(0, 100) }}...</p>
              <div class="preview-meta">
                <span class="category">{{ item.category }}</span>
                <span v-if="item.isFeatured || item.featured" class="featured">⭐ Destacado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enlaces de Navegación -->
      <div class="navigation-card">
        <h2>🔗 Enlaces Útiles</h2>
        <div class="nav-links">
          <a href="/admin/login" target="_blank" class="btn btn-outline">🔐 Login Admin</a>
          <a href="/admin/gallery" target="_blank" class="btn btn-outline">🖼️ Gallery Manager</a>
          <a href="/" target="_blank" class="btn btn-outline">🏠 Home</a>
          <a href="/productos" target="_blank" class="btn btn-outline">📦 Productos</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHybridGallery } from '@/services/hybrid-gallery.service'

// Estado reactivo simplificado
const { service, getAllItems, getSystemStats } = useHybridGallery()
const systemStats = ref<any>(null)
const previewData = ref<any[]>([])
const dataSource = ref<'firebase' | 'mock'>('mock')
const currentSource = ref<'auto' | 'firebase' | 'mock'>('auto')

const loadSystemStats = async () => {
  try {
    systemStats.value = await getSystemStats()
  } catch (err) {
    console.error('Error loading system stats:', err)
  }
}

const loadPreviewData = async () => {
  try {
    const { items, source } = await getAllItems()
    previewData.value = items.slice(0, 6)
    dataSource.value = source
  } catch (err) {
    console.error('Error loading preview data:', err)
  }
}

const setDataSource = (source: 'auto' | 'firebase' | 'mock') => {
  currentSource.value = source
  service.setDataSource(source)

  setTimeout(() => {
    loadSystemStats()
    loadPreviewData()
  }, 100)
}

onMounted(() => {
  loadSystemStats()
  loadPreviewData()
})
</script>

<style scoped>
.data-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}
/* Cards */
.status-card,
.config-card,
.migration-card,
.preview-card,
.navigation-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.status-card h2,
.config-card h2,
.migration-card h2,
.preview-card h2,
.navigation-card h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item .stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.stat-item .stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.stat-item .stat-value.source-firebase {
  color: #ff6b35;
}

.stat-item .stat-value.source-mock {
  color: #4ecdc4;
}

.stat-item .stat-value.success {
  color: #28a745;
}

.stat-item .stat-value.error {
  color: #dc3545;
}

/* Configuration */
.config-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Migration Actions */
.migration-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.migration-status {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.migration-status.status-info {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.migration-status.status-success {
  background: #e8f5e8;
  border-left: 4px solid #4caf50;
}

.migration-status.status-error {
  background: #ffebee;
  border-left: 4px solid #f44336;
}

.migration-status.status-warning {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
}

.migration-status .status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.migration-status .status-details {
  margin-top: 0.5rem;
  background: rgba(0,0,0,0.05);
  padding: 0.75rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  overflow-x: auto;
}

/* Preview Grid */
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.preview-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.preview-item .preview-image {
  height: 150px;
  overflow: hidden;
}

.preview-item .preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item .preview-content {
  padding: 1rem;
}

.preview-item .preview-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.preview-item .preview-content p {
  margin: 0 0 0.75rem 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
}

.preview-item .preview-content .preview-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.preview-item .preview-content .preview-meta .category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.preview-item .preview-content .preview-meta .featured {
  background: #fff3e0;
  color: #f57c00;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.btn-primary {
  background: #007bff;
  color: white;
}

.btn.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn.btn-info {
  background: #17a2b8;
  color: white;
}

.btn.btn-info:hover:not(:disabled) {
  background: #138496;
}

.btn.btn-outline {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn.btn-outline:hover {
  background: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .config-options,
  .migration-actions,
  .nav-links {
    flex-direction: column;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>