<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <button @click="closeModal" class="modal-close">
            <X :size="24" />
          </button>
          
          <div class="modal-content">
            <div class="modal-image-container">
              <img 
                :src="image" 
                :alt="title"
                class="modal-image"
                @load="onImageLoad"
              />
              <div v-if="!imageLoaded" class="image-loading">
                <NeonSpinner size="medium" color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import NeonSpinner from './NeonSpinner.vue'

interface Props {
  isOpen: boolean
  image: string
  title: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const imageLoaded = ref(false)

const closeModal = () => {
  emit('close')
}

const onImageLoad = () => {
  imageLoaded.value = true
}

// Reset image loaded state when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    imageLoaded.value = false
  }
})

// Close modal with ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Handle keyboard events
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
  animation: modalScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin: auto;
}

@media (min-width: 768px) {
  .modal-container {
    max-width: 90vw;
    max-height: 90vh;
  }
}

@media (min-width: 1024px) {
  .modal-container {
    max-width: 1200px;
  }
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid rgba(255, 0, 128, 0.4);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-close:hover {
  background: rgba(255, 0, 128, 0.2);
  border-color: #ff0080;
  color: #ff0080;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 0, 128, 0.4);
}

.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  overflow: hidden;
}

.modal-image {
  max-width: 100%;
  max-height: 95vh;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .modal-image {
    max-height: 80vh;
    width: 100%;
    height: auto;
  }
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Spinner styles removed - now using NeonSpinner component */

/* Estilos removidos ya que el modal ahora solo muestra la imagen */

/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.8) translateY(50px);
}

@keyframes modalScale {
  0% {
    transform: scale(0.8) translateY(50px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Keyframes removed - now using NeonSpinner component */
</style>