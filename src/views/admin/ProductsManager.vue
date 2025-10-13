<template>
  <div class="products-manager">
    <div class="manager-header">
      <h1>Gestión de Productos</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        <Plus :size="20" />
        Nuevo Producto
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <!-- Products Table -->
    <div v-else class="table-container">
      <!-- Desktop Table View -->
      <table class="products-table desktop-view">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img 
                :src="product.images[0]" 
                :alt="product.name"
                class="product-thumbnail"
              />
            </td>
            <td>{{ product.name }}</td>
            <td class="description-cell">{{ truncateText(product.description, 50) }}</td>
            <td>
              <span :class="['status-badge', product.featured ? 'featured' : '']">
                {{ product.featured ? '⭐ Destacado' : 'No Destacado' }}
              </span>
            </td>
            <td class="actions-cell">
              <button 
                @click="openEditModal(product)" 
                class="btn-icon btn-edit"
                title="Editar"
              >
                <Edit2 :size="18" />
              </button>
              <button 
                @click="confirmDelete(product)" 
                class="btn-icon btn-delete"
                title="Eliminar"
              >
                <Trash2 :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Card View -->
      <div class="products-cards mobile-view">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img 
            :src="product.images[0]" 
            :alt="product.name"
            class="card-image"
          />
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ product.name }}</h3>
              <span :class="['status-badge', product.featured ? 'featured' : '']">
                {{ product.featured ? '⭐ Destacado' : 'No' }}
              </span>
            </div>
            <p class="card-description">{{ truncateText(product.description, 80) }}</p>
            <div class="card-actions">
              <button 
                @click="openEditModal(product)" 
                class="btn-card btn-edit"
              >
                <Edit2 :size="18" />
                Editar
              </button>
              <button 
                @click="confirmDelete(product)" 
                class="btn-card btn-delete"
              >
                <Trash2 :size="18" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="products.length === 0" class="empty-state">
        <p>No hay productos registrados</p>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <button @click="closeModal" class="btn-close">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-group">
            <label>Título *</label>
            <input 
              v-model="formData.title" 
              type="text" 
              required 
              placeholder="Nombre del producto"
            />
          </div>

          <div class="form-group">
            <label>Descripción *</label>
            <textarea 
              v-model="formData.description" 
              required 
              rows="2"
              placeholder="Descripción del producto"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Imagen del Producto *</label>
            <div class="image-upload-container">
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
                <button 
                  type="button" 
                  @click="removeImage" 
                  class="btn-remove-image"
                  title="Quitar imagen"
                >
                  <X :size="16" />
                </button>
              </div>
              <div v-else class="upload-area" @click="triggerFileInput">
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="image/*"
                  @change="handleImageUpload"
                  hidden
                />
                <Upload :size="32" />
                <p>Click para subir imagen</p>
                <small>Se convertirá a WebP automáticamente</small>
              </div>
              <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                <span>{{ uploadProgress }}%</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  v-model="formData.isFeatured" 
                  type="checkbox"
                />
                <span>Producto Destacado</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content modal-small" @click.stop>
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button @click="showDeleteModal = false" class="btn-close">
            <X :size="24" />
          </button>
        </div>

        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
          <p class="product-name">{{ productToDelete?.name }}</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>

        <div class="form-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="deleteProduct" class="btn btn-danger" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { ProductsService } from '@/services/products.service'
import type { Product } from '@/types'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore'
import { 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage'
import { db, storage } from '@/config/firebase'

const productsStore = useProductsStore()

// State
const products = ref<Product[]>([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const productToDelete = ref<Product | null>(null)

// Form data
const formData = ref({
  title: '',
  description: '',
  imageUrl: '',
  isFeatured: false
})

// Image upload
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')
const selectedFile = ref<File | null>(null)
const uploadProgress = ref(0)

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const currentProductId = ref<string | null>(null)

// Load products
const loadProducts = async () => {
  loading.value = true
  try {
    await productsStore.fetchProducts()
    products.value = productsStore.products
  } catch (error) {
    console.error('Error loading products:', error)
    showToast('Error al cargar productos', 'error')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openCreateModal = () => {
  isEditMode.value = false
  currentProductId.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (product: Product) => {
  isEditMode.value = true
  currentProductId.value = product.id
  
  // Get original data from Firestore format
  formData.value = {
    title: product.name,
    description: product.description,
    imageUrl: product.images[0] || '',
    isFeatured: product.featured
  }
  
  // Mostrar imagen actual como preview
  imagePreview.value = product.images[0] || ''
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    imageUrl: '',
    isFeatured: false
  }
  imagePreview.value = ''
  selectedFile.value = null
  uploadProgress.value = 0
}

// Image upload functions
const triggerFileInput = () => {
  fileInput.value?.click()
}

const convertToWebP = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    img.onload = () => {
      // Mantener proporciones pero limitar el tamaño máximo
      const maxWidth = 1200
      const maxHeight = 1200
      let width = img.width
      let height = img.height
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Error al convertir imagen'))
          }
        },
        'image/webp',
        0.85 // Calidad 85%
      )
    }
    
    img.onerror = () => reject(new Error('Error al cargar imagen'))
    img.src = URL.createObjectURL(file)
  })
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    showToast('Por favor selecciona una imagen válida', 'error')
    return
  }
  
  // Validar tamaño (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('La imagen no puede pesar más de 5MB', 'error')
    return
  }
  
  selectedFile.value = file
  
  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadImageToStorage = async (): Promise<string> => {
  if (!selectedFile.value) {
    throw new Error('No hay imagen seleccionada')
  }
  
  try {
    // Convertir a WebP
    showToast('Convirtiendo imagen a WebP...', 'success')
    const webpBlob = await convertToWebP(selectedFile.value)
    
    // Generar nombre único
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const fileName = `product-${timestamp}-${randomStr}.webp`
    
    // Subir a Firebase Storage
    const imageRef = storageRef(storage, `gallery/${fileName}`)
    const uploadTask = uploadBytesResumable(imageRef, webpBlob, {
      contentType: 'image/webp'
    })
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          uploadProgress.value = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
        },
        (error) => {
          console.error('Error uploading:', error)
          reject(error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          uploadProgress.value = 0
          resolve(downloadURL)
        }
      )
    })
  } catch (error) {
    console.error('Error converting image:', error)
    throw new Error('Error al procesar la imagen')
  }
}

// Save product (create or update)
const saveProduct = async () => {
  saving.value = true
  try {
    let imageUrl = formData.value.imageUrl
    
    // Si hay una nueva imagen seleccionada, subirla
    if (selectedFile.value) {
      imageUrl = await uploadImageToStorage()
    }
    
    // Validar que haya una URL de imagen
    if (!imageUrl) {
      showToast('Debes seleccionar una imagen', 'error')
      saving.value = false
      return
    }
    
    const productData = {
      title: formData.value.title,
      description: formData.value.description,
      imageUrl: imageUrl,
      isFeatured: formData.value.isFeatured,
      updatedAt: Timestamp.now()
    }

    if (isEditMode.value && currentProductId.value) {
      // Update existing product
      const docRef = doc(db, 'gallery_items', currentProductId.value)
      await updateDoc(docRef, productData)
      showToast('Producto actualizado exitosamente', 'success')
    } else {
      // Create new product
      await addDoc(collection(db, 'gallery_items'), {
        ...productData,
        createdAt: Timestamp.now(),
        orderIndex: products.value.length
      })
      showToast('Producto creado exitosamente', 'success')
    }

    closeModal()
    await loadProducts()
  } catch (error) {
    console.error('Error saving product:', error)
    showToast('Error al guardar el producto', 'error')
  } finally {
    saving.value = false
  }
}

// Delete product
const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  deleting.value = true
  try {
    const docRef = doc(db, 'gallery_items', productToDelete.value.id)
    await deleteDoc(docRef)
    
    showToast('Producto eliminado exitosamente', 'success')
    showDeleteModal.value = false
    await loadProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    showToast('Error al eliminar el producto', 'error')
  } finally {
    deleting.value = false
    productToDelete.value = null
  }
}

// Helper functions
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const showToast = (message: string, type: 'success' | 'error') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.products-manager {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .products-manager {
    padding: 1rem;
  }
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .manager-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .manager-header .btn {
    width: 100%;
    justify-content: center;
  }
}

.manager-header h1 {
  font-size: 1.75rem;
  color: #fff;
  margin: 0;
}

@media (max-width: 768px) {
  .manager-header h1 {
    font-size: 1.5rem;
    text-align: center;
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #ccc;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 255, 255, 0.3);
  border-top-color: #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Table */
.table-container {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.desktop-view {
  display: table;
}

.mobile-view {
  display: none;
}

@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  
  .mobile-view {
    display: block;
  }
  
  .table-container {
    background: transparent;
    border: none;
    overflow-x: visible;
  }
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.products-table thead {
  background: rgba(0, 255, 255, 0.1);
}

.products-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #00ffff;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  font-size: 0.9rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .products-table th {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}

.products-table td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .products-table td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}

.products-table tbody tr:hover {
  background: rgba(0, 255, 255, 0.05);
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .product-thumbnail {
    width: 40px;
    height: 40px;
  }
}

.description-cell {
  max-width: 300px;
  color: #ccc;
}

.price-cell {
  font-weight: 600;
  color: #00ffff;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  border-radius: 12px;
  font-size: 0.875rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .status-badge {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
}

.status-badge.featured {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.status-badge.active {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.status-badge.inactive {
  background: rgba(255, 0, 0, 0.2);
  color: #ff6b6b;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .actions-cell {
    gap: 0.5rem;
    min-width: 100px;
  }
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 36px;
  min-height: 36px;
}

@media (max-width: 768px) {
  .btn-icon {
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
    background: rgba(255, 255, 255, 0.15);
  }
  
  .btn-icon svg {
    width: 18px;
    height: 18px;
  }
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-edit {
  background: rgba(0, 255, 255, 0.15);
}

.btn-edit:hover {
  background: rgba(0, 255, 255, 0.3);
  color: #00ffff;
}

.btn-delete {
  background: rgba(255, 0, 0, 0.15);
}

.btn-delete:hover {
  background: rgba(255, 0, 0, 0.3);
  color: #ff6b6b;
}

/* Empty State */
.empty-state {
  padding: 4rem;
  text-align: center;
  color: #888;
}

/* Mobile Cards */
.products-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.product-card {
  background: #1a1a1a;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  flex: 1;
}

.card-description {
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-card {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-card.btn-edit {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  border: 1px solid rgba(0, 255, 255, 0.4);
}

.btn-card.btn-edit:hover {
  background: rgba(0, 255, 255, 0.3);
}

.btn-card.btn-delete {
  background: rgba(255, 0, 0, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 0, 0, 0.4);
}

.btn-card.btn-delete:hover {
  background: rgba(255, 0, 0, 0.3);
}


/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-small {
  max-width: 350px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.modal-header h2 {
  margin: 0;
  color: #00ffff;
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1.25rem;
  color: #fff;
}

.product-name {
  font-weight: 600;
  color: #00ffff;
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.warning-text {
  color: #ff6b6b;
  font-size: 0.8rem;
}

/* Form */
.product-form {
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.35rem;
  color: #00ffff;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  color: #fff;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #888;
  font-size: 0.75rem;
}

/* Image Upload */
.image-upload-container {
  position: relative;
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(0, 255, 255, 0.3);
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 0, 0, 0.8);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-remove-image:hover {
  background: #ff0000;
  transform: scale(1.1);
}

.upload-area {
  border: 2px dashed rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(0, 255, 255, 0.05);
}

.upload-area:hover {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
}

.upload-area svg {
  color: #00ffff;
  margin: 0 auto 0.5rem;
}

.upload-area p {
  color: #fff;
  margin: 0.5rem 0 0.25rem;
  font-weight: 500;
}

.upload-area small {
  color: #888;
}

.upload-progress {
  margin-top: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(45deg, #00ffff, #0088ff);
  transition: width 0.3s;
  border-radius: 4px;
}

.upload-progress span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: 600;
  font-size: 0.75rem;
  z-index: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #fff !important;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(45deg, #00ffff, #0088ff);
  color: #000;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: #ff4444;
  color: #fff;
}

.btn-danger:hover {
  background: #ff0000;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: #00ff00;
  color: #000;
}

.toast.error {
  background: #ff4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .products-table {
    font-size: 0.875rem;
  }
  
  .product-thumbnail {
    width: 50px;
    height: 50px;
  }
  
  .description-cell {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .products-manager {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .products-table {
    min-width: 800px;
  }
}
</style>
