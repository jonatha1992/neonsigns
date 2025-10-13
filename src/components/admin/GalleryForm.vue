<template>
  <div class="gallery-form-modal" v-if="isVisible">
    <div class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-plus" v-if="!editItem"></i>
            <i class="fas fa-edit" v-else></i>
            {{ editItem ? 'Editar Item de Galería' : 'Agregar Nuevo Item' }}
          </h2>
          <button @click="closeModal" class="close-btn" type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="gallery-form">
            <!-- Image Upload Section -->
            <div class="form-section">
              <label class="section-label">
                <i class="fas fa-image"></i>
                Imagen
              </label>
              <div class="image-upload-container">
                <ImageUploader
                  :max-file-size="5 * 1024 * 1024"
                  :auto-upload="false"
                  folder="gallery"
                  @upload-success="onImageUploaded"
                  @upload-error="onImageError"
                  @file-selected="onFileSelected"
                  @file-removed="onFileRemoved"
                />
                
                <!-- Current Image Preview (for editing) -->
                <div v-if="editItem && !pendingImageFile" class="current-image">
                  <img :src="editItem.imageUrl" :alt="editItem.title" />
                  <div class="image-overlay">
                    <p>Imagen actual</p>
                    <small>Selecciona una nueva imagen para reemplazarla</small>
                  </div>
                </div>
              </div>
              <div v-if="errors.imageUrl" class="field-error">
                {{ errors.imageUrl }}
              </div>
            </div>

            <!-- Basic Information -->
            <div class="form-section">
              <label class="section-label">
                <i class="fas fa-info-circle"></i>
                Información Básica
              </label>
              
              <div class="form-grid">
                <div class="form-field">
                  <label class="field-label" for="title">
                    Título <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    v-model="formData.title"
                    :class="['field-input', { error: errors.title }]"
                    placeholder="Ej: Letrero de Neón Café"
                    maxlength="100"
                  />
                  <div v-if="errors.title" class="field-error">
                    {{ errors.title }}
                  </div>
                  <small class="field-hint">{{ formData.title.length }}/100 caracteres</small>
                </div>

                <div class="form-field">
                  <label class="field-label" for="category">
                    Categoría <span class="required">*</span>
                  </label>
                  <select
                    id="category"
                    v-model="formData.category"
                    :class="['field-select', { error: errors.category }]"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option 
                      v-for="category in categoryOptions" 
                      :key="category.value" 
                      :value="category.value"
                    >
                      {{ category.label }}
                    </option>
                  </select>
                  <div v-if="errors.category" class="field-error">
                    {{ errors.category }}
                  </div>
                </div>
              </div>

              <div class="form-field">
                <label class="field-label" for="description">
                  Descripción <span class="required">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  :class="['field-textarea', { error: errors.description }]"
                  placeholder="Describe el letrero de neón: características, colores, estilo..."
                  rows="4"
                  maxlength="500"
                ></textarea>
                <div v-if="errors.description" class="field-error">
                  {{ errors.description }}
                </div>
                <small class="field-hint">{{ formData.description.length }}/500 caracteres</small>
              </div>

              <div class="form-field">
                <label class="field-label" for="price">
                  Precio (opcional)
                </label>
                <div class="price-input-wrapper">
                  <span class="currency-symbol">$</span>
                  <input
                    type="number"
                    id="price"
                    v-model.number="formData.price"
                    class="field-input price-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <small class="field-hint">Deja vacío si no quieres mostrar precio</small>
              </div>
            </div>

            <!-- Display Options -->
            <div class="form-section">
              <label class="section-label">
                <i class="fas fa-eye"></i>
                Opciones de Visualización
              </label>
              
              <div class="options-grid">
                <div class="option-card">
                  <div class="option-header">
                    <i class="fas fa-star option-icon featured"></i>
                    <div>
                      <h4>Item Destacado</h4>
                      <p>Aparecerá en la página principal</p>
                    </div>
                  </div>
                  <div class="option-control">
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        v-model="formData.isFeatured"
                        :disabled="!canSetFeatured"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div v-if="!canSetFeatured && !formData.isFeatured" class="option-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Máximo 4 items destacados permitidos
                  </div>
                </div>

                <div class="option-card">
                  <div class="option-header">
                    <i class="fas fa-toggle-on option-icon active"></i>
                    <div>
                      <h4>Estado Activo</h4>
                      <p>Visible para los visitantes</p>
                    </div>
                  </div>
                  <div class="option-control">
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        v-model="formData.isActive"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="footer-info">
            <small v-if="editItem">
              <i class="fas fa-clock"></i>
              Creado: {{ formatDate(editItem.createdAt) }}
            </small>
          </div>
          
          <div class="footer-actions">
            <button
              @click="closeModal"
              type="button"
              class="btn btn-secondary"
              :disabled="isSubmitting"
            >
              Cancelar
            </button>
            
            <button
              @click="handleSubmit"
              type="submit"
              :class="['btn', 'btn-primary', { loading: isSubmitting }]"
              :disabled="!isFormValid || isSubmitting"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else-if="editItem" class="fas fa-save"></i>
              <i v-else class="fas fa-plus"></i>
              {{ isSubmitting ? 'Guardando...' : (editItem ? 'Actualizar' : 'Crear Item') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useGallery } from '@/composables/useGallery'
import ImageUploader from '@/components/common/ImageUploader.vue'
import type { GalleryItem, GalleryItemFormData, GalleryCategory, CreateGalleryItemData, UpdateGalleryItemData } from '@/types/gallery.types'

// Props
interface Props {
  isVisible: boolean
  editItem?: GalleryItem | null
}

const props = withDefaults(defineProps<Props>(), {
  editItem: null
})

// Emits
interface Emits {
  (e: 'close'): void
  (e: 'success', item: GalleryItem): void
  (e: 'error', message: string): void
}

const emit = defineEmits<Emits>()

// Composables
const { 
  createItem, 
  updateItem, 
  loading, 
  error: galleryError,
  featuredItems,
  getNextOrderIndex
} = useGallery()

// Reactive state
const isSubmitting = ref(false)
const pendingImageFile = ref<File | null>(null)
const uploadedImageUrl = ref<string>('')
const featuredCount = ref(0)

// Form data
const formData = reactive<GalleryItemFormData>({
  title: '',
  description: '',
  imageUrl: '',
  category: '' as GalleryCategory,
  price: undefined,
  isFeatured: false,
  isActive: true
})

// Form validation errors
const errors = reactive({
  title: '',
  description: '',
  category: '',
  imageUrl: ''
})

// Category options
const categoryOptions = [
  { value: 'negocios', label: 'Negocios' },
  { value: 'personalizado', label: 'Personalizado' },
  { value: 'hogar', label: 'Hogar' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'decorativo', label: 'Decorativo' }
]

// Computed properties
const canSetFeatured = computed(() => {
  // Can set featured if:
  // 1. We're editing and the item is already featured
  // 2. We have less than 4 featured items
  if (props.editItem?.isFeatured) return true
  return featuredCount.value < 4
})

const isFormValid = computed(() => {
  return formData.title && 
         formData.description && 
         formData.category && 
         (formData.imageUrl || uploadedImageUrl.value) &&
         !Object.values(errors).some(error => error !== '')
})

// Methods
const initializeForm = () => {
  if (props.editItem) {
    // Populate form with existing data
    formData.title = props.editItem.title
    formData.description = props.editItem.description
    formData.imageUrl = props.editItem.imageUrl
    formData.category = props.editItem.category
    formData.price = props.editItem.price
    formData.isFeatured = props.editItem.isFeatured
    formData.isActive = props.editItem.isActive
  } else {
    // Reset form for new item
    resetForm()
  }
  
  // Reset upload state
  pendingImageFile.value = null
  uploadedImageUrl.value = ''
  clearErrors()
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.imageUrl = ''
  formData.category = '' as GalleryCategory
  formData.price = undefined
  formData.isFeatured = false
  formData.isActive = true
}

const clearErrors = () => {
  errors.title = ''
  errors.description = ''
  errors.category = ''
  errors.imageUrl = ''
}

const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  if (!formData.title.trim()) {
    errors.title = 'El título es requerido'
    isValid = false
  } else if (formData.title.length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres'
    isValid = false
  }

  if (!formData.description.trim()) {
    errors.description = 'La descripción es requerida'
    isValid = false
  } else if (formData.description.length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres'
    isValid = false
  }

  if (!formData.category) {
    errors.category = 'Selecciona una categoría'
    isValid = false
  }

  const hasImage = formData.imageUrl || uploadedImageUrl.value
  if (!hasImage) {
    errors.imageUrl = 'Debes subir una imagen'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isSubmitting.value = true

    // Use uploaded image URL if available, otherwise keep existing
    const finalImageUrl = uploadedImageUrl.value || formData.imageUrl

    if (props.editItem) {
      // Update existing item
      const updateData: UpdateGalleryItemData = {
        title: formData.title,
        description: formData.description,
        imageUrl: finalImageUrl,
        category: formData.category,
        price: formData.price,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive
      }

      const success = await updateItem(props.editItem.id, updateData)
      if (success) {
        // Return updated item (we'll need to fetch it or construct it)
        const updatedItem = { ...props.editItem, ...updateData }
        emit('success', updatedItem)
        closeModal()
      } else {
        throw new Error('Error al actualizar el item')
      }
    } else {
      // Create new item
      const orderIndex = await getNextOrderIndex()
      const createData: CreateGalleryItemData = {
        ...formData,
        imageUrl: finalImageUrl,
        orderIndex
      }

      const result = await createItem(createData)
      if (result) {
        emit('success', result)
        closeModal()
      } else {
        throw new Error('Error al crear el item')
      }
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al guardar el item'
    emit('error', message)
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Image upload handlers
const onFileSelected = (file: File) => {
  pendingImageFile.value = file
  clearErrors()
}

const onFileRemoved = () => {
  pendingImageFile.value = null
  uploadedImageUrl.value = ''
}

const onImageUploaded = (result: { url: string; thumbnailUrl?: string }) => {
  uploadedImageUrl.value = result.url
  clearErrors()
}

const onImageError = (message: string) => {
  errors.imageUrl = message
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadFeaturedCount = async () => {
  try {
    // Calculate featured count from current featured items
    featuredCount.value = featuredItems.value.length
  } catch (error) {
    console.error('Error loading featured count:', error)
  }
}

// Watchers
watch(() => props.isVisible, async (newValue) => {
  if (newValue) {
    await nextTick()
    initializeForm()
    loadFeaturedCount()
  }
})

watch(() => props.editItem, () => {
  if (props.isVisible) {
    initializeForm()
  }
})

// Watch for changes that might affect featured status
watch(() => formData.isFeatured, (newValue) => {
  if (newValue && !canSetFeatured.value) {
    // Prevent setting featured if limit reached
    formData.isFeatured = false
  }
})
</script>

<style scoped>
.gallery-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
}

.modal-title {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  i {
    color: #3b82f6;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;

  i {
    color: #3b82f6;
  }
}

.image-upload-container {
  position: relative;
}

.current-image {
  margin-top: 1rem;
  position: relative;

  img {
    width: 100%;
    max-width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 2px solid #e5e7eb;
  }
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem;
  border-radius: 0 0 0.5rem 0.5rem;

  p {
    margin: 0 0 0.25rem 0;
    font-weight: 500;
  }

  small {
    opacity: 0.9;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.form-field {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.field-input, .field-select, .field-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  z-index: 1;
}

.price-input {
  padding-left: 2rem;
}

.field-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '⚠';
  }
}

.field-hint {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.option-card {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fafafa;
  transition: border-color 0.2s;

  &:hover {
    border-color: #d1d5db;
  }
}

.option-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  h4 {
    margin: 0 0 0.25rem 0;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.75rem;
  }
}

.option-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;

  &.featured {
    color: #f59e0b;
  }

  &.active {
    color: #10b981;
  }
}

.option-control {
  display: flex;
  justify-content: flex-end;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .toggle-slider {
    background-color: #3b82f6;
  }

  &:checked + .toggle-slider:before {
    transform: translateX(26px);
  }

  &:disabled + .toggle-slider {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: .4s;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }
}

.option-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d97706;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fef3c7;
  border-radius: 0.25rem;

  i {
    color: #f59e0b;
  }
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.footer-info {
  small {
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.footer-actions {
  display: flex;
  gap: 0.75rem;

  @media (max-width: 640px) {
    width: 100%;

    .btn {
      flex: 1;
    }
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
    }

    &.loading {
      background: #93c5fd;
    }
  }

  &.btn-secondary {
    background: #e5e7eb;
    color: #374151;

    &:hover:not(:disabled) {
      background: #d1d5db;
    }
  }
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 0.5rem;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header, .modal-body, .modal-footer {
    padding: 1rem;
  }

  .form-grid, .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>