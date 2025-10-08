<template>
  <div id="app">
    <!-- Header/Navigation -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const productsStore = useProductsStore()

const isLoading = computed(() => productsStore.loading)

onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>

<style lang="scss">
.main-content {
  min-height: calc(100vh - 120px); // Ajustar según header y footer
  padding-top: 60px; // Altura del header fijo
}

// Transiciones suaves entre rutas
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
}
</style>