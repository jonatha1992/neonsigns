<template>
  <div id="app">
    <!-- Header/Navigation -->
    <AppHeader v-if="showLayout" />
    
    <!-- Main Content -->
    <main :class="showLayout ? 'main-content' : 'full-page'">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    
    <!-- Footer -->
    <AppFooter v-if="showLayout" />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// import { useProductsStore } from '@/stores/products'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const route = useRoute()
// const productsStore = useProductsStore()

// const isLoading = computed(() => productsStore.loading)
const isLoading = computed(() => false) // Temporarily disabled
const showLayout = computed(() => !route.meta.hideLayout)

// onMounted(async () => {
//   await productsStore.fetchProducts() // Temporarily disabled
// })
</script>

<style>
.main-content {
  min-height: calc(100vh - 120px);
  padding-top: 60px;
}

.full-page {
  min-height: 100vh;
  padding: 0;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
