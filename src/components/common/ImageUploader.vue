<template>
  <div class="image-uploader">
    <div 
      class="upload-zone"
      :class="{ 
        'drag-over': isDragOver,
        'has-file': selectedFile || previewUrl,
        'uploading': uploading,
        'error': hasError
      }"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @click="triggerFileInput"
    >
      <!-- File Input -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        @change="onFileSelect"
        style="display: none"
      />

      <!-- Content based on state -->
      <div v-if="!selectedFile && !previewUrl" class="upload-prompt">
        <div class="upload-icon">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <h3>Arrastra tu imagen aquí</h3>
        <p>o haz clic para seleccionar un archivo</p>
        <div class="upload-specs">
          <small>Formatos: JPG, PNG, WebP</small>
          <small>Tamaño máximo: {{ formatFileSize(maxFileSize) }}</small>
          <small>Dimensiones recomendadas: {{ props.maxWidth }}x{{ props.maxHeight }}px</small>
        </div>
      </div>

      <!-- Preview -->
      <div v-else-if="previewUrl && !uploading" class="image-preview">
        <img :src="previewUrl" :alt="fileName" />
        <div class="image-overlay">
          <div class="image-actions">
            <button @click.stop="removeImage" class="action-btn delete" type="button">
              <i class="fas fa-trash"></i>
            </button>
            <button @click.stop="triggerFileInput" class="action-btn replace" type="button">
              <i class="fas fa-exchange-alt"></i>
            </button>
          </div>
        </div>
        <div class="image-info">
          <span class="file-name">{{ fileName }}</span>
          <span class="file-size">{{ formatFileSize(fileSize) }}</span>
        </div>
      </div>

      <!-- Upload Progress -->
      <div v-else-if="uploading" class="upload-progress">
        <div class="progress-circle">
          <div class="progress-ring">
            <svg width="80" height="80">
              <circle
                cx="40" 
                cy="40" 
                r="36"
                fill="transparent"
                stroke="#e5e7eb"
                stroke-width="4"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="transparent"
                stroke="#3b82f6"
                stroke-width="4"
                stroke-dasharray="226.19"
                :stroke-dashoffset="226.19 - (226.19 * progress.percentage) / 100"
                class="progress-bar"
              />
            </svg>
            <div class="progress-text">
              {{ Math.round(progress.percentage) }}%
            </div>
          </div>
        </div>
        <p>Subiendo imagen...</p>
        <div class="progress-bar-linear">
          <div 
            class="progress-fill" 
            :style="{ width: progress.percentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="hasError" class="upload-error">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h4>Error al subir imagen</h4>
        <p>{{ errorMessage }}</p>
        <button @click="retry" class="retry-btn" type="button">
          Intentar de nuevo
        </button>
      </div>
    </div>

    <!-- Advanced Options -->
    <div v-if="showAdvancedOptions" class="advanced-options">
      <div class="option-group">
        <label class="option-label">
          <input
            type="checkbox"
            v-model="compressImage"
            class="option-checkbox"
          />
          <span class="checkmark"></span>
          Comprimir y optimizar automáticamente
        </label>
        <small class="option-description">
          Convierte a WebP, reduce tamaño manteniendo calidad visual
        </small>
      </div>

      <div class="option-group" v-if="compressImage">
        <label class="slider-label">
          Calidad de compresión: {{ compressionQuality }}%
        </label>
        <input
          type="range"
          min="60"
          max="95"
          v-model="compressionQuality"
          class="quality-slider"
        />
      </div>

      <div class="option-group">
        <label class="option-label">
          <input
            type="checkbox"
            v-model="generateThumbnail"
            class="option-checkbox"
          />
          <span class="checkmark"></span>
          Generar miniatura ({{ props.thumbnailWidth }}x{{ props.thumbnailHeight }}px)
        </label>
        <small class="option-description">
          Crea versión optimizada para carga rápida en listas
        </small>
      </div>
    </div>

    <!-- Upload Button -->
    <div class="upload-actions" v-if="selectedFile && !uploading">
      <button
        @click="uploadImage"
        :disabled="uploading || hasError"
        class="upload-btn primary"
        type="button"
      >
        <i class="fas fa-upload"></i>
        Subir Imagen
      </button>
      
      <button
        @click="toggleAdvancedOptions"
        class="upload-btn secondary"
        type="button"
      >
        <i class="fas fa-cog"></i>
        {{ showAdvancedOptions ? 'Ocultar' : 'Opciones' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/config/firebase'

// Props
interface Props {
  maxFileSize?: number
  allowedTypes?: string[]
  autoUpload?: boolean
  folder?: string
  maxWidth?: number
  maxHeight?: number
  thumbnailWidth?: number
  thumbnailHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  autoUpload: false,
  folder: 'gallery',
  maxWidth: 1920,
  maxHeight: 1080,
  thumbnailWidth: 400,
  thumbnailHeight: 300
})

// Emits
interface Emits {
  (e: 'upload-start', file: File): void
  (e: 'upload-progress', progress: number): void
  (e: 'upload-success', result: { url: string; thumbnailUrl?: string }): void
  (e: 'upload-error', error: string): void
  (e: 'file-selected', file: File): void
  (e: 'file-removed'): void
}

const emit = defineEmits<Emits>()

// Composables
const { 
  progress, 
  uploading, 
  error: uploadError 
} = useFileUpload()

// Reactive state
const fileInputRef = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const isDragOver = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const showAdvancedOptions = ref(false)

// Advanced options
const compressImage = ref(true)
const compressionQuality = ref(85)
const generateThumbnail = ref(true)

// Computed properties
const fileName = computed(() => selectedFile.value?.name || '')
const fileSize = computed(() => selectedFile.value?.size || 0)

// Methods
const triggerFileInput = () => {
  if (uploading.value) return
  fileInputRef.value?.click()
}

const onFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    processFile(file)
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const onDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // Only set to false if we're leaving the drop zone completely
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false
  }
}

const processFile = async (file: File) => {
  // Reset error state
  hasError.value = false
  errorMessage.value = ''

  // Validate file type
  if (!props.allowedTypes.includes(file.type)) {
    setError('Tipo de archivo no permitido. Use JPG, PNG o WebP.')
    return
  }

  // Validate file size
  if (file.size > props.maxFileSize) {
    setError(`El archivo es muy grande. Máximo permitido: ${formatFileSize(props.maxFileSize)}`)
    return
  }

  // Set selected file and create preview
  selectedFile.value = file
  createPreview(file)
  
  // Emit file selected event
  emit('file-selected', file)

  // Auto upload if enabled
  if (props.autoUpload) {
    await nextTick()
    uploadImage()
  }
}

const createPreview = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  hasError.value = false
  errorMessage.value = ''
  
  // Clear file input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }

  emit('file-removed')
}

const uploadImage = async () => {
  if (!selectedFile.value) return

  try {
    hasError.value = false
    emit('upload-start', selectedFile.value)

    // Preparar archivo optimizado
    let fileToUpload = selectedFile.value
    
    if (compressImage.value) {
      // Comprimir y optimizar imagen principal
      fileToUpload = await compressImageFile(
        selectedFile.value,
        compressionQuality.value / 100,
        props.maxWidth,
        props.maxHeight
      )
    }

    // Subir imagen principal
    const mainUrl = await uploadToFirebase(fileToUpload, props.folder)
    
    // Generar y subir thumbnail si está habilitado
    let thumbnailUrl: string | undefined
    if (generateThumbnail.value) {
      const thumbnail = await createThumbnail(
        selectedFile.value,
        props.thumbnailWidth,
        props.thumbnailHeight
      )
      thumbnailUrl = await uploadToFirebase(thumbnail, `${props.folder}/thumbnails`)
    }

    emit('upload-success', { 
      url: mainUrl, 
      thumbnailUrl
    })
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    setError(message)
    emit('upload-error', message)
  }
}

// Función para comprimir imagen usando Canvas
const compressImageFile = async (
  file: File,
  quality: number,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        // Crear canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo crear contexto de canvas'))
          return
        }

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir a blob con compresión
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir imagen'))
              return
            }

            // Crear nuevo archivo
            const compressedFile = new File(
              [blob], 
              file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
              { type: 'image/webp' }
            )

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Error al leer archivo'))
    reader.readAsDataURL(file)
  })
}

// Función para crear thumbnail
const createThumbnail = async (
  file: File,
  thumbWidth: number,
  thumbHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calcular dimensiones para thumbnail (crop al centro)
        const canvas = document.createElement('canvas')
        canvas.width = thumbWidth
        canvas.height = thumbHeight
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo crear contexto de canvas'))
          return
        }

        // Calcular crop (center crop)
        const sourceRatio = img.width / img.height
        const targetRatio = thumbWidth / thumbHeight
        
        let sourceWidth = img.width
        let sourceHeight = img.height
        let sourceX = 0
        let sourceY = 0

        if (sourceRatio > targetRatio) {
          // Imagen más ancha - crop horizontalmente
          sourceWidth = img.height * targetRatio
          sourceX = (img.width - sourceWidth) / 2
        } else {
          // Imagen más alta - crop verticalmente
          sourceHeight = img.width / targetRatio
          sourceY = (img.height - sourceHeight) / 2
        }

        // Dibujar thumbnail con crop
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          thumbWidth,
          thumbHeight
        )

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear thumbnail'))
              return
            }

            const thumbnailFile = new File(
              [blob],
              `thumb_${file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`,
              { type: 'image/webp' }
            )

            resolve(thumbnailFile)
          },
          'image/webp',
          0.8 // Calidad fija para thumbnails
        )
      }

      img.onerror = () => reject(new Error('Error al cargar imagen para thumbnail'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Error al leer archivo'))
    reader.readAsDataURL(file)
  })
}

// Función para subir a Firebase Storage
const uploadToFirebase = async (file: File, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const fileRef = storageRef(storage, `${folder}/${fileName}`)
    
    const uploadTask = uploadBytesResumable(fileRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        progress.value = {
          loaded: snapshot.bytesTransferred,
          total: snapshot.totalBytes,
          percentage: progressValue,
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes
        }
        uploading.value = true
      },
      (error) => {
        uploading.value = false
        reject(error)
      },
      async () => {
        uploading.value = false
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadUrl)
      }
    )
  })
}

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  uploadImage()
}

const setError = (message: string) => {
  hasError.value = true
  errorMessage.value = message
}

const toggleAdvancedOptions = () => {
  showAdvancedOptions.value = !showAdvancedOptions.value
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Watch for external upload progress updates
watch(progress, (prog) => {
  emit('upload-progress', prog.percentage)
})

watch(uploadError, (error) => {
  if (error) {
    setError(error)
  }
})
</script>

<style scoped>
.image-uploader {
  width: 100%;
  max-width: 600px;
}

.upload-zone {
  border: 3px dashed rgba(var(--neon-pink-rgb), 0.3);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95));
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.upload-zone:hover {
  border-color: var(--neon-pink);
  background: linear-gradient(145deg, #ffffff, #fef3f9);
  box-shadow: 
    0 0 20px rgba(var(--neon-pink-rgb), 0.2),
    0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.upload-zone.drag-over {
  border-color: var(--neon-pink);
  background: linear-gradient(145deg, #fff0f9, #ffe6f5);
  transform: scale(1.02);
  box-shadow: 
    0 0 30px rgba(var(--neon-pink-rgb), 0.4),
    inset 0 0 20px rgba(var(--neon-pink-rgb), 0.1);
}

.upload-zone.has-file {
  border-color: var(--neon-purple);
  background: white;
  box-shadow: 
    0 0 20px rgba(var(--neon-purple-rgb), 0.15),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

.upload-zone.uploading {
  border-color: var(--neon-blue);
  background: linear-gradient(145deg, #f0f9ff, #e0f2fe);
  cursor: not-allowed;
  box-shadow: 
    0 0 25px rgba(var(--neon-blue-rgb), 0.3),
    inset 0 0 15px rgba(var(--neon-blue-rgb), 0.05);
}

.upload-zone.error {
  border-color: #ef4444;
  background: linear-gradient(145deg, #fef2f2, #fee2e2);
  box-shadow: 
    0 0 20px rgba(239, 68, 68, 0.2),
    0 4px 12px rgba(239, 68, 68, 0.15);
}

.upload-prompt {
  color: #6b7280;
}

.upload-prompt h3 {
  color: #1f2937;
  margin: 1.5rem 0 0.75rem 0;
  font-size: 1.375rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.upload-prompt p {
  margin: 0 0 2rem 0;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.upload-icon {
  font-size: 4rem;
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(var(--neon-pink-rgb), 0.3));
}

.upload-specs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(var(--neon-pink-rgb), 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(var(--neon-pink-rgb), 0.1);
}

.upload-specs small {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.upload-specs small:first-child {
  color: var(--neon-purple);
  font-weight: 600;
}

.image-preview {
  position: relative;
  max-width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 20px rgba(var(--neon-purple-rgb), 0.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(var(--neon-pink-rgb), 0.8), 
    rgba(var(--neon-purple-rgb), 0.8));
  border-radius: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-btn.delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.action-btn.delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.15);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
}

.action-btn.replace {
  background: linear-gradient(135deg, var(--neon-blue), #2563eb);
  color: white;
}

.action-btn.replace:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: scale(1.15);
  box-shadow: 0 0 20px rgba(var(--neon-blue-rgb), 0.6);
}

.image-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  border-radius: 0.5rem;
  border: 2px solid rgba(var(--neon-purple-rgb), 0.1);
  font-size: 0.9rem;
}

.image-info .file-name {
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
}

.image-info .file-size {
  color: var(--neon-purple);
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: rgba(var(--neon-purple-rgb), 0.1);
  border-radius: 1rem;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.upload-progress p {
  color: var(--neon-blue);
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(var(--neon-blue-rgb), 0.3);
}

.progress-circle {
  position: relative;
  filter: drop-shadow(0 0 15px rgba(var(--neon-blue-rgb), 0.4));
}

.progress-ring {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-bar {
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.3s ease;
  stroke: var(--neon-blue);
  filter: drop-shadow(0 0 8px rgba(var(--neon-blue-rgb), 0.6));
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  color: var(--neon-blue);
  font-size: 1.25rem;
  text-shadow: 0 0 10px rgba(var(--neon-blue-rgb), 0.5);
}

.progress-bar-linear {
  width: 250px;
  height: 6px;
  background: rgba(var(--neon-blue-rgb), 0.1);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(var(--neon-blue-rgb), 0.5);
}

.upload-error {
  color: #dc2626;
}

.upload-error .error-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #ef4444;
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.3));
}

.upload-error h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #991b1b;
}

.upload-error p {
  margin: 0 0 2rem 0;
  color: #7f1d1d;
  font-weight: 500;
}

.retry-btn {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
}

.advanced-options {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(145deg, #ffffff, #f9fafb);
  border: 2px solid rgba(var(--neon-purple-rgb), 0.15);
  border-radius: 1rem;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 0 20px rgba(var(--neon-purple-rgb), 0.03);
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
}

.option-label:hover {
  color: var(--neon-purple);
}

.option-checkbox {
  display: none;
}

.option-checkbox:checked + .checkmark {
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  border-color: var(--neon-purple);
  box-shadow: 0 0 10px rgba(var(--neon-purple-rgb), 0.4);
}

.option-checkbox:checked + .checkmark::after {
  opacity: 1;
}

.checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  position: relative;
  background: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkmark::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.option-description {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
  padding-left: 2rem;
}

.slider-label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.quality-slider {
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, 
    rgba(var(--neon-pink-rgb), 0.2), 
    rgba(var(--neon-purple-rgb), 0.2));
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.quality-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(var(--neon-purple-rgb), 0.4);
  transition: transform 0.2s ease;
}

.quality-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.quality-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(var(--neon-purple-rgb), 0.4);
  transition: transform 0.2s ease;
}

.quality-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.upload-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.upload-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1rem;
}

.upload-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(0.5);
}

.upload-btn.primary {
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
  color: white;
  box-shadow: 
    0 4px 12px rgba(var(--neon-purple-rgb), 0.3),
    0 0 20px rgba(var(--neon-pink-rgb), 0.2);
}

.upload-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(var(--neon-purple-rgb), 0.4),
    0 0 30px rgba(var(--neon-pink-rgb), 0.3);
}

.upload-btn.primary:active:not(:disabled) {
  transform: translateY(0);
}

.upload-btn.secondary {
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  color: #374151;
  border: 2px solid rgba(var(--neon-purple-rgb), 0.2);
}

.upload-btn.secondary:hover:not(:disabled) {
  background: linear-gradient(145deg, #e5e7eb, #d1d5db);
  border-color: var(--neon-purple);
  color: var(--neon-purple);
}

@media (max-width: 640px) {
  .upload-zone {
    padding: 2rem 1.5rem;
    min-height: 300px;
  }

  .upload-actions {
    flex-direction: column;
  }

  .upload-btn {
    width: 100%;
    justify-content: center;
  }

  .image-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .image-info .file-name {
    max-width: 100%;
  }
}
/* Añadir variables CSS para colores neon si no existen */
:root {
  --neon-pink: #ff0080;
  --neon-pink-rgb: 255, 0, 128;
  --neon-blue: #00ffff;
  --neon-blue-rgb: 0, 255, 255;
  --neon-purple: #b24bf3;
  --neon-purple-rgb: 178, 75, 243;
}
</style>