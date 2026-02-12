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
      <NeonSpinner size="large" color="cyan" />
      <p class="loading-message">Cargando productos...</p>
    </div>

    <!-- Products Cards -->
    <div v-else class="cards-container">
      <div class="products-cards">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image-wrapper">
            <img
              :src="product.images[0]"
              :alt="product.name"
              class="card-image"
              @load="imageLoading[product.id] = false"
              @error="imageLoading[product.id] = false"
              v-show="!imageLoading[product.id]"
            />
            <div v-if="imageLoading[product.id]" class="image-loading">
              <div class="admin-image-spinner"></div>
              <p class="loading-text">Cargando imagen...</p>
            </div>
          </div>
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ product.name }}</h3>
              <div class="card-badges">
                <span :class="['status-badge', product.featured ? 'featured' : '']">
                  {{ product.featured ? '⭐ Destacado' : '' }}
                </span>
              </div>
            </div>
            <div class="card-meta">
              <span class="category-badge">{{ getCategoryLabel(product.category) }}</span>
              <span class="price-text">${{ product.price?.toLocaleString() || 0 }}</span>
            </div>
            <p class="card-description" :title="formatCardDescription(product.description)">
              {{ formatCardDescription(product.description) }}
            </p>
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

        <form
          @submit.prevent="saveProduct"
          :class="['product-form', { 'form-complete': formCompleteAnimation }]"
        >
          <div :class="['form-layout', { 'ai-fill-highlight': aiAutofillHighlight }]">
            <div class="form-media-column">
              <div class="form-group media-group">
                <label>Imagen del Producto *</label>
                <div class="media-row">
                  <div class="image-upload-container">
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="handleImageUpload"
                      hidden
                    />
                    <div v-if="imagePreview" class="image-preview" @click="triggerFileInput">
                      <img :src="imagePreview" alt="Preview" />
                      <button
                        type="button"
                        @click.stop="removeImage"
                        class="btn-remove-image"
                        title="Quitar imagen"
                      >
                        <X :size="16" />
                      </button>
                    </div>
                    <div v-else class="upload-area" @click="triggerFileInput">
                      <Upload :size="30" />
                      <p>Click para subir imagen</p>
                      <small>Se convertira a WebP automaticamente</small>
                    </div>
                  </div>

                  <div class="ai-autofill">
                    <button
                      type="button"
                      :class="['btn-ai-autofill', { 'is-loading': aiAutofillLoading }]"
                      :disabled="aiAutofillLoading || (!selectedFile && !imagePreview) || saving"
                      @click="autofillFromImageWithAI"
                    >
                      <Sparkles :size="16" class="ai-icon" />
                      <span>{{ aiAutofillLoading ? 'Analizando imagen...' : 'Completar formulario con IA (Gemini 2.5 Flash)' }}</span>
                    </button>
                    <small class="ai-hint">
                      Sube una foto y la IA completa titulo, descripcion, categoria y precio sugerido.
                    </small>
                    <small v-if="aiSuggestedPrice" class="ai-hint ai-price">
                      Precio sugerido por IA: ${{ aiSuggestedPrice.toLocaleString() }} ARS
                    </small>
                  </div>
                </div>

                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                  <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                  <span>{{ uploadProgress }}%</span>
                </div>
              </div>
            </div>

            <div class="form-fields-column">
              <div :class="['form-group', { 'field-updated': aiFieldHighlights.title }]">
                <label>Título *</label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  placeholder="Nombre del producto"
                />
              </div>

              <div :class="['form-group', { 'field-updated': aiFieldHighlights.description }]">
                <label>Descripción *</label>
                <textarea
                  v-model="formData.description"
                  required
                  rows="2"
                  placeholder="Descripción del producto"
                ></textarea>
              </div>

              <div class="form-row">
                <div :class="['form-group', { 'field-updated': aiFieldHighlights.category }]">
                  <label>Categoría *</label>
                  <select v-model="formData.category" required>
                    <option value="personalizado">Personalizado</option>
                    <option value="negocios">Negocios</option>
                    <option value="hogar">Hogar</option>
                    <option value="eventos">Eventos</option>
                    <option value="decorativo">Decorativo</option>
                  </select>
                </div>

                <div :class="['form-group', { 'field-updated': aiFieldHighlights.price }]">
                  <label>Precio ($ARS)</label>
                  <input
                    v-model.number="formData.price"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div class="featured-checkbox-row">
                <label class="checkbox-label">
                  <input
                    v-model="formData.isFeatured"
                    type="checkbox"
                  />
                  <span>Producto Destacado</span>
                </label>
              </div>
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
import { ref, onMounted, reactive, watch } from 'vue'
import NeonSpinner from '@/components/common/NeonSpinner.vue'
import { Plus, Edit2, Trash2, X, Upload, Sparkles } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types'
import type { ProductCategory } from '@/types'
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
  getDownloadURL,
  getBlob
} from 'firebase/storage'
import { getDb, getStorageInstance } from '@/config/firebase'
import { generateProductAutofillFromImage } from '@/services/ai-autofill.service'
import { StorageService } from '@/services/storage.service'

// Per-product image loading state
const imageLoading = reactive<Record<string, boolean>>({})

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
  category: 'personalizado',
  price: 0,
  isFeatured: false
})

// Image upload
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')
const selectedFile = ref<File | null>(null)
const uploadProgress = ref(0)
const aiAutofillLoading = ref(false)
const aiSuggestedPrice = ref<number | null>(null)
const formCompleteAnimation = ref(false)
const aiAutofillHighlight = ref(false)

type AutofillFieldKey = 'title' | 'description' | 'category' | 'price'
const aiFieldHighlights = reactive<Record<AutofillFieldKey, boolean>>({
  title: false,
  description: false,
  category: false,
  price: false
})

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
    // Initialize image loading state for each product
    products.value.forEach(product => {
      imageLoading[product.id] = true
    })
  } catch (error) {
    console.error('Error loading products:', error)
    showToast('Error al cargar productos', 'error')
  } finally {
    loading.value = false
  }
}

// Watch for products change (e.g. after add/delete) and re-initialize imageLoading
watch(products, (newProducts) => {
  newProducts.forEach(product => {
    if (!(product.id in imageLoading)) {
      imageLoading[product.id] = true
    }
  })
})

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

  // Map Firestore/DB category to select value (handle both Spanish and English)

  // Map English to Spanish if needed, always fallback to 'personalizado'
  const categoryMap: Record<string, string> = {
    'custom': 'personalizado',
    'business': 'negocios',
    'home': 'hogar',
    'events': 'eventos',
    'decorative': 'decorativo',
    'personalizado': 'personalizado',
    'negocios': 'negocios',
    'hogar': 'hogar',
    'eventos': 'eventos',
    'decorativo': 'decorativo'
  };
  let categoryValue = categoryMap[product.category ?? ''] ?? 'personalizado';

  formData.value = {
    title: product.name,
    description: product.description,
    imageUrl: product.images[0] || '',
    category: categoryValue as ProductCategory,
    price: product.price || 0,
    isFeatured: product.featured || false
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
    category: 'personalizado',
    price: 0,
    isFeatured: false
  }
  imagePreview.value = ''
  selectedFile.value = null
  uploadProgress.value = 0
  aiSuggestedPrice.value = null
  aiAutofillHighlight.value = false
  resetAiFieldHighlights()
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
  aiSuggestedPrice.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const toAutofillFile = (blob: Blob): File | null => {
  if (!blob.size) return null
  const mimeType = blob.type || 'image/jpeg'
  const extension = mimeType.split('/')[1] || 'jpg'
  return new File([blob], `product-autofill.${extension}`, { type: mimeType })
}

const fetchImageBlob = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null
    const blob = await response.blob()
    return blob.size ? blob : null
  } catch {
    return null
  }
}

const getAutofillSourceFile = async (): Promise<File | null> => {
  if (selectedFile.value) return selectedFile.value
  const previewUrl = imagePreview.value?.trim()
  if (!previewUrl) return null

  const directBlob = await fetchImageBlob(previewUrl)
  const directFile = directBlob ? toAutofillFile(directBlob) : null
  if (directFile) return directFile

  try {
    const storageInstance = await getStorageInstance()
    let blob: Blob | null = null

    const firebasePath = StorageService.extractPathFromUrl(previewUrl)
    if (firebasePath) {
      blob = await getBlob(storageRef(storageInstance, firebasePath))
    } else if (previewUrl.startsWith('http://') || previewUrl.startsWith('https://') || previewUrl.startsWith('gs://')) {
      blob = await getBlob(storageRef(storageInstance, previewUrl))
    }

    const storageFile = blob ? toAutofillFile(blob) : null
    if (storageFile) return storageFile

    if (firebasePath) {
      const refreshedUrl = await getDownloadURL(storageRef(storageInstance, firebasePath))
      const refreshedBlob = await fetchImageBlob(refreshedUrl)
      const refreshedFile = refreshedBlob ? toAutofillFile(refreshedBlob) : null
      if (refreshedFile) return refreshedFile
    }
  } catch (error) {
    console.error('Error preparing image for AI autofill:', error)
  }

  return null
}

const isFormFullyCompleted = () => {
  const hasTitle = formData.value.title.trim().length > 0
  const hasDescription = formData.value.description.trim().length > 0
  const hasCategory = Boolean(formData.value.category)
  const hasValidPrice = Number.isFinite(formData.value.price)
  const hasImage = Boolean(imagePreview.value || formData.value.imageUrl || selectedFile.value)

  return hasTitle && hasDescription && hasCategory && hasValidPrice && hasImage
}

const resetAiFieldHighlights = () => {
  aiFieldHighlights.title = false
  aiFieldHighlights.description = false
  aiFieldHighlights.category = false
  aiFieldHighlights.price = false
}

const triggerAiAutofillAnimation = (updatedFields: AutofillFieldKey[]) => {
  aiAutofillHighlight.value = false
  resetAiFieldHighlights()

  requestAnimationFrame(() => {
    aiAutofillHighlight.value = true
    updatedFields.forEach((field) => {
      aiFieldHighlights[field] = true
    })
  })

  setTimeout(() => {
    aiAutofillHighlight.value = false
    resetAiFieldHighlights()
  }, 1400)
}

const triggerFormCompleteAnimation = () => {
  formCompleteAnimation.value = false
  requestAnimationFrame(() => {
    formCompleteAnimation.value = true
  })

  setTimeout(() => {
    formCompleteAnimation.value = false
  }, 1200)
}

const autofillFromImageWithAI = async () => {
  if (!selectedFile.value && !imagePreview.value) {
    showToast('Primero sube una imagen para usar autocompletado con IA', 'error')
    return
  }

  aiAutofillLoading.value = true
  try {
    const sourceFile = await getAutofillSourceFile()
    if (!sourceFile) {
      showToast('No se pudo leer la imagen actual. Vuelve a subirla para usar IA.', 'error')
      return
    }

    const suggestion = await generateProductAutofillFromImage(sourceFile)
    const previousTitle = formData.value.title.trim()
    const previousDescription = formData.value.description.trim()
    const previousCategory = formData.value.category
    const previousPrice = Number(formData.value.price) || 0

    formData.value.title = suggestion.title || formData.value.title
    formData.value.description = suggestion.description || formData.value.description
    formData.value.category = suggestion.category

    const updatedFields: AutofillFieldKey[] = []
    if (suggestion.title && suggestion.title.trim() !== previousTitle) {
      updatedFields.push('title')
    }
    if (suggestion.description && suggestion.description.trim() !== previousDescription) {
      updatedFields.push('description')
    }
    if (suggestion.category && suggestion.category !== previousCategory) {
      updatedFields.push('category')
    }

    if (suggestion.priceArs && suggestion.priceArs > 0) {
      formData.value.price = suggestion.priceArs
      aiSuggestedPrice.value = suggestion.priceArs
      if (suggestion.priceArs !== previousPrice) {
        updatedFields.push('price')
      }
    }

    triggerAiAutofillAnimation(updatedFields)

    if (isFormFullyCompleted()) {
      triggerFormCompleteAnimation()
      showToast('Formulario completado por IA. Revisa y guarda.', 'success')
    } else {
      showToast('IA aplicada. Revisa los datos antes de guardar.', 'success')
    }
  } catch (error) {
    console.error('AI autofill error:', error)
    const message = error instanceof Error ? error.message : 'No se pudo completar con IA'
    showToast(message, 'error')
  } finally {
    aiAutofillLoading.value = false
  }
}

const uploadImageToStorage = async (): Promise<string> => {
  if (!selectedFile.value) {
    throw new Error('No hay imagen seleccionada')
  }
  
  try {
    // Mostrar progreso inicial
    uploadProgress.value = 5
    showToast('Procesando imagen...', 'success')
    
    // Convertir a WebP
    uploadProgress.value = 15
    showToast('Optimizando imagen a WebP...', 'success')
    const webpBlob = await convertToWebP(selectedFile.value)
    
    // Generar nombre único
    uploadProgress.value = 25
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const fileName = `product-${timestamp}-${randomStr}.webp`
    
    // Subir a Firebase Storage
    uploadProgress.value = 30
    showToast('Subiendo a servidor...', 'success')
    const storageInstance = await getStorageInstance()
    const imageRef = storageRef(storageInstance, `gallery/${fileName}`)
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
    // Validaciones
    if (!formData.value.title.trim()) {
      showToast('El título es requerido', 'error')
      saving.value = false
      return
    }

    if (!formData.value.description.trim()) {
      showToast('La descripción es requerida', 'error')
      saving.value = false
      return
    }

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
    
    // Preparar datos completos para Firestore
    const optionValue = formData.value.category
    const normalizedCategory = mapOptionValueToCategory(optionValue)

    const productData = {
      title: formData.value.title,
      description: formData.value.description,
      imageUrl: imageUrl,
      category: normalizedCategory,
      categoria: optionValue,
      price: formData.value.price || 0,
      isFeatured: formData.value.isFeatured,
      updatedAt: Timestamp.now()
    }

    if (isEditMode.value && currentProductId.value) {
      // Update existing product
      const dbInstance = getDb()
      const docRef = doc(dbInstance, 'gallery_items', currentProductId.value)
      await updateDoc(docRef, productData)
      showToast('Producto actualizado exitosamente', 'success')
    } else {
      // Create new product
      const dbInstance = getDb()
      await addDoc(collection(dbInstance, 'gallery_items'), {
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
    const dbInstance = getDb()
    const docRef = doc(dbInstance, 'gallery_items', productToDelete.value.id)
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
const formatCardDescription = (text?: string) => {
  if (!text) return 'Sin descripcion'

  return text
    .replace(/\s*⚡\s*/g, ' • ')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*•\s*•+\s*/g, ' • ')
    .replace(/\s+/g, ' ')
    .trim()
}

import { getCategoryLabel } from '@/composables/useCategory'
import { mapCategoryToOptionValue, mapOptionValueToCategory } from '@/utils/categories'

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
.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 145px;
  background: #181818;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  overflow: hidden;
}

.product-image-wrapper .card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%);
  backdrop-filter: blur(4px);
  z-index: 2;
  text-align: center;
  pointer-events: none;
}

.admin-image-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 128, 0, 0.1);
  border-top: 3px solid #ff8000;
  border-radius: 50%;
  animation: admin-spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 20px rgba(255, 128, 0, 0.3);
}

@keyframes admin-spin {
  0% {
    transform: rotate(0deg);
    box-shadow: 0 0 20px rgba(255, 128, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 128, 0, 0.5);
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 0 0 20px rgba(255, 128, 0, 0.3);
  }
}

.loading-text {
  color: #00ffff;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.8;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.products-manager {
  padding: 1.2rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .products-manager {
    padding: 0.75rem;
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
  font-size: 1.45rem;
  color: #fff;
  margin: 0;
}

@media (max-width: 768px) {
  .manager-header h1 {
    font-size: 1.2rem;
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
  gap: 1.5rem;
}

.loading-message {
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffff;
  text-shadow:
    0 0 6px rgba(0, 255, 255, 0.8),
    0 0 18px rgba(0, 180, 255, 0.6),
    0 0 32px rgba(255, 0, 128, 0.4);
  animation: neonPulse 2.2s ease-in-out infinite;
  font-weight: 600;
}

@keyframes neonPulse {
  0%, 100% {
    text-shadow:
      0 0 6px rgba(0, 255, 255, 0.9),
      0 0 20px rgba(0, 180, 255, 0.7),
      0 0 36px rgba(255, 0, 128, 0.5);
  }
  50% {
    text-shadow:
      0 0 8px rgba(255, 0, 128, 0.9),
      0 0 26px rgba(255, 0, 180, 0.7),
      0 0 42px rgba(0, 255, 255, 0.6);
  }
}

@keyframes neonSpin {
  0% { 
    transform: rotate(0deg);
    border-top-color: #00ffff;
    border-right-color: #ff0080;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  }
  25% { 
    border-top-color: #ff0080;
    border-right-color: #ffff00;
    box-shadow: 0 0 25px rgba(255, 0, 128, 0.5);
  }
  50% { 
    transform: rotate(180deg);
    border-top-color: #ffff00;
    border-right-color: #00ff00;
    box-shadow: 0 0 20px rgba(255, 255, 0, 0.4);
  }
  75% { 
    border-top-color: #00ff00;
    border-right-color: #00ffff;
    box-shadow: 0 0 25px rgba(0, 255, 0, 0.5);
  }
  100% { 
    transform: rotate(360deg);
    border-top-color: #00ffff;
    border-right-color: #ff0080;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  }
}

/* Cards Container */
.cards-container {
  background: transparent;
}

.category-badge {
  display: inline-block;
  padding: 0.24rem 0.7rem;
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 0.24rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
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

/* Empty State */
.empty-state {
  padding: 4rem;
  text-align: center;
  color: #888;
}

/* Product Cards */
.products-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.1rem;
  padding: 0.85rem 0;
}

/* Force grid items to stretch so card heights are equal per row */
.products-cards {
  align-items: stretch;
}

@media (min-width: 1200px) {
  .products-cards {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .products-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.product-card {
  background: #1a1a1a;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* ensure it fills the grid cell */
}

.card-image {
  width: 100%;
  height: 162px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.card-content {
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

/* Ensure the content area grows so actions can be pushed to the bottom */
.product-card .card-content {
  flex: 1 1 auto;
}

.card-actions {
  margin-top: auto; /* push actions to bottom */
  display: flex;
  gap: 0.6rem;
  justify-content: flex-start;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  flex: 1;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.card-badges {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
}

.price-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #00ffff;
  white-space: nowrap;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.025em;
  background: rgba(0, 255, 255, 0.1);
  padding: 0.18rem 0.42rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.card-description {
  color: #ccc;
  font-size: 0.84rem;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.6rem;
  /* ensure actions are pushed to the bottom of the card regardless of description length */
  margin-top: auto;
}

.btn-card {
  flex: 1;
  padding: 0.58rem 0.48rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.34rem;
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
  padding: 0.5rem;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  width: 100%;
  max-width: 540px;
  max-height: calc(100vh - 0.6rem);
  overflow-y: auto;
  margin-top: 0;
}

.modal-small {
  max-width: 350px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.modal-header h2 {
  margin: 0;
  color: #00ffff;
  font-size: 1.1rem;
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
  padding: 0.35rem 0.78rem 0.62rem;
}

.product-form.form-complete {
  border-radius: 8px;
  animation: formCompletePulse 1.2s ease;
}

.form-layout {
  display: grid;
  grid-template-columns: minmax(185px, 210px) minmax(0, 1fr);
  gap: 0.72rem;
  align-items: start;
}

.form-media-column,
.form-fields-column {
  min-width: 0;
}

.form-layout.ai-fill-highlight .form-fields-column {
  animation: aiFieldsPanelPulse 1.1s ease;
}

.form-group {
  margin-bottom: 0.58rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.62rem;
  align-items: end;
}

.form-group label {
  display: block;
  margin-bottom: 0.28rem;
  color: #00ffff;
  font-weight: 500;
  font-size: 0.84rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.52rem 0.62rem;
  /* darker, opaque background to avoid bleed-through from overlays */
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid rgba(0, 255, 255, 0.12);
  border-radius: 4px;
  color: #fff;
  font-size: 0.82rem;
  line-height: 1.35;
  -webkit-appearance: none;
  appearance: none;
}

.form-group textarea {
  min-height: 56px;
}

.form-group select {
  /* ensure native dropdown uses the same foreground/background where possible */
  background-image: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.05) 50%), linear-gradient(135deg, rgba(255,255,255,0.05) 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  padding-right: 2.25rem;
}

/* Remove default IE/Edge arrow */
.form-group select::-ms-expand {
  display: none;
}

.form-group select:focus {
  outline: none;
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.04);
  color: #fff;
}

/* Options should have explicit dark background and white text for contrast */
.form-group select option {
  background: #1a1a1a;
  color: #fff;
}

/* On some browsers the highlighted option uses selection color; ensure readability */
.form-group select option:checked,
.form-group select option:focus {
  background: #00aabf;
  color: #000;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #888;
  font-size: 0.72rem;
}

.field-updated label {
  color: #8ffcff;
}

.field-updated input,
.field-updated textarea,
.field-updated select {
  border-color: rgba(0, 255, 200, 0.72);
  box-shadow: 0 0 0 1px rgba(0, 255, 200, 0.2), 0 0 16px rgba(0, 255, 200, 0.14);
  animation: aiFieldPulse 1.1s ease;
}

/* Image Upload */
.media-group {
  margin-top: 0;
  margin-bottom: 0;
}

.media-row {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-items: stretch;
}

.image-upload-container {
  position: relative;
  width: 100%;
  min-width: 0;
  margin-bottom: 0;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 92px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(0, 255, 255, 0.3);
  cursor: pointer;
  background: rgba(0, 255, 255, 0.04);
}

.image-preview img {
  width: 100%;
  height: 100%;
  min-height: 92px;
  object-fit: cover;
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
  padding: 0.45rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(0, 255, 255, 0.05);
  min-height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
}

.upload-area svg {
  color: #00ffff;
  margin: 0 auto 0.35rem;
}

.upload-area p {
  color: #fff;
  margin: 0.25rem 0 0.12rem;
  font-weight: 500;
  font-size: 0.8rem;
}

.upload-area small {
  color: #888;
  font-size: 0.66rem;
}

.upload-progress {
  margin-top: 0.35rem;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  height: 22px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff0080);
  transition: width 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  animation: neonFlow 2s ease-in-out infinite alternate;
}

.upload-progress span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;
  z-index: 1;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.ai-autofill {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 0 0 auto;
  justify-content: flex-start;
  min-width: 0;
}

.btn-ai-autofill {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.62rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 0, 128, 0.35);
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.18), rgba(128, 0, 255, 0.22));
  color: #fff;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ai-autofill:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(255, 0, 128, 0.7);
  box-shadow: 0 0 16px rgba(255, 0, 128, 0.3);
}

.btn-ai-autofill:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-ai-autofill.is-loading .ai-icon {
  animation: aiIconSpin 0.95s linear infinite;
}

.ai-hint {
  color: #a7a7a7;
  font-size: 0.66rem;
  line-height: 1.3;
}

.ai-price {
  color: #9af5ff;
}

@keyframes neonFlow {
  from {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
  to {
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.8), 0 0 35px rgba(255, 0, 128, 0.5);
  }
}

@keyframes aiFieldsPanelPulse {
  0% {
    box-shadow: 0 0 0 rgba(0, 255, 200, 0);
  }
  45% {
    box-shadow: 0 0 0 1px rgba(0, 255, 200, 0.24), 0 0 26px rgba(0, 255, 200, 0.18);
  }
  100% {
    box-shadow: 0 0 0 rgba(0, 255, 200, 0);
  }
}

@keyframes aiFieldPulse {
  0% {
    transform: translateY(0);
  }
  35% {
    transform: translateY(-1px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes aiIconSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes formCompletePulse {
  0% {
    box-shadow: 0 0 0 rgba(0, 255, 200, 0);
    transform: translateY(0);
  }
  40% {
    box-shadow: 0 0 0 1px rgba(0, 255, 200, 0.45), 0 0 24px rgba(0, 255, 200, 0.35);
    transform: translateY(-1px);
  }
  100% {
    box-shadow: 0 0 0 rgba(0, 255, 200, 0);
    transform: translateY(0);
  }
}

.featured-checkbox-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.45rem;
  margin-top: 0.05rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: #00ffff;
  font-size: 0.84rem;
  min-height: 28px;
  margin: 0;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 6px;
  margin-left: 0;
  vertical-align: middle;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  background: #111;
  display: inline-block;
  position: relative;
}

/* Visual check mark */
.checkbox-label input[type="checkbox"]:checked {
  background: linear-gradient(90deg, #00ffff, #0088ff);
  border-color: rgba(0,255,255,0.6);
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 7px;
  border: solid #002b2b;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.62rem 0.85rem;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
}

/* Buttons */
.btn {
  padding: 0.45rem 0.85rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.42rem;
  font-size: 0.84rem;
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

  .form-layout {
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  .media-row {
    gap: 0.55rem;
  }

  .image-upload-container {
    width: min(190px, 100%);
    min-width: 0;
    margin-inline: auto;
  }

  .image-preview,
  .image-preview img,
  .upload-area {
    min-height: 88px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-width: 95vw;
    max-height: calc(100vh - 0.35rem);
    margin: 0.15rem;
  }
  
  .product-form {
    padding: 0.45rem 0.62rem 0.62rem;
  }
  
  .modal-header {
    padding: 0.7rem 0.85rem;
  }
  
  .modal-header h2 {
    font-size: 1rem;
  }
  
  .form-actions {
    padding: 0.58rem 0.72rem;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>


