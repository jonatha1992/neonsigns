<template>
  <AdminLayout>
    <div class="gallery-form-page">
      <GalleryForm
        :is-visible="showForm"
        @close="handleClose"
        @success="handleSuccess"
        @error="handleError"
      />

      <div v-if="errorMessage" class="form-feedback">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import GalleryForm from '@/components/admin/GalleryForm.vue'
import type { GalleryItem } from '@/types/gallery.types'

const router = useRouter()
const showForm = ref(false)
const errorMessage = ref('')

const navigateBackToDashboard = () => {
  showForm.value = false
  router.push('/admin').catch(() => {})
}

const handleClose = () => {
  navigateBackToDashboard()
}

const handleSuccess = (_item: GalleryItem) => {
  errorMessage.value = ''
  navigateBackToDashboard()
}

const handleError = (message: string) => {
  errorMessage.value = message
}

onMounted(() => {
  showForm.value = true
})
</script>

<style scoped lang="scss">
.gallery-form-page {
  position: relative;
  min-height: 100%;
}

.form-feedback {
  position: fixed;
  bottom: $spacing-2xl;
  right: $spacing-2xl;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  border-radius: $border-radius-lg;
  background: rgba($dark-bg, 0.9);
  border: 1px solid rgba($neon-pink, 0.5);
  color: $text-primary;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  z-index: 1200;
  font-weight: 600;

  i {
    color: $neon-pink;
  }
}

@media (max-width: $tablet) {
  .form-feedback {
    left: $spacing-md;
    right: $spacing-md;
    bottom: $spacing-md;
    justify-content: center;
  }
}
</style>
