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
                <div class="neon-spinner">
                  <div class="spinner-ring"></div>
                  <div class="spinner-ring"></div>
                  <div class="spinner-ring"></div>
                  <div class="spinner-core">⚡</div>
                </div>
              </div>
            </div>
            
            <div class="modal-info">
              <div class="modal-badge">{{ categoryName }}</div>
              <h2 class="modal-title">{{ title }}</h2>
              <p class="modal-description">{{ description }}</p>
              
              <div class="modal-actions">
                <a 
                  :href="whatsappUrl" 
                  target="_blank" 
                  class="btn btn-neon btn-full-width"
                  @click="closeModal"
                >
                  <MessageCircle :size="18" />
                  Cotizar Similar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, MessageCircle } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  image: string
  title: string
  description: string
  category: string
  productId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const imageLoaded = ref(false)

const categoryName = computed(() => {
  const categories = {
    business: 'Negocios',
    home: 'Hogar',
    custom: 'Personalizado',
    decorative: 'Decorativo',
    signs: 'Señales',
    letters: 'Letras'
  }
  return categories[props.category as keyof typeof categories] || 'Trabajo'
})

const whatsappNumber = '+5491140916764'
const whatsappUrl = computed(() => {
  const message = `Hola! Me interesa el trabajo "${props.title}" (Zona Sur). ¿Podrían darme más información y disponibilidad? 🌟`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
})

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

// Prevent body scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<style lang="scss" scoped>
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
  padding: 1.5rem;
}

.modal-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 
    0 25px 50px rgba(10, 10, 10, 0.8),
    0 0 50px rgba(0, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 0, 128, 0.1);
  overflow: hidden;
  animation: modalScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (min-width: 768px) {
    max-width: 1000px;
    width: auto;
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
  
  &:hover {
    background: rgba(255, 0, 128, 0.2);
    border-color: #ff0080;
    color: #ff0080;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 0, 128, 0.4);
  }
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
    min-height: 500px;
  }
}

.modal-image-container {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  
  @media (min-width: 768px) {
    min-height: 500px;
  }
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease;
  
  @media (min-width: 768px) {
    object-fit: contain;
    max-height: 500px;
  }
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.neon-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  
  .spinner-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-radius: 50%;
    
    &:nth-child(1) {
      border-top-color: #ff0080;
      animation: spin 1.5s linear infinite;
      box-shadow: 0 0 10px rgba(255, 0, 128, 0.5);
    }
    
    &:nth-child(2) {
      border-right-color: #00ffff;
      animation: spin 1s linear infinite reverse;
      transform: scale(0.8);
      box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
    }
    
    &:nth-child(3) {
      border-bottom-color: #00ff00;
      animation: spin 0.8s linear infinite;
      transform: scale(0.6);
      box-shadow: 0 0 6px rgba(0, 255, 0, 0.3);
    }
  }
  
  .spinner-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: #ffff00;
    filter: drop-shadow(0 0 8px #ffff00);
    animation: pulse 1.2s ease-in-out infinite;
  }
}

.modal-info {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-badge {
  display: inline-block;
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.9), rgba(0, 255, 255, 0.7));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  width: fit-content;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  margin: 0;
  
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
}

.modal-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
  
  .btn {
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 1.1rem;
    padding: 1rem 2rem;
    
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 25px rgba(255, 0, 128, 0.4);
    }
  }
  
  .btn-full-width {
    width: 100%;
  }
}

// Transiciones del modal
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>