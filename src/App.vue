<template>
  <div id="app">
    <!-- Header/Navigation -->
    <AppHeader v-if="showLayout" />
    
    <!-- Main Content -->
    <main :class="showLayout ? 'main-content' : 'full-page'">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <AppFooter v-if="showLayout" />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const route = useRoute()
const productsStore = useProductsStore()

const isLoading = computed(() => productsStore.loading)
const showLayout = computed(() => !route.meta.hideLayout)

onMounted(async () => {
  await productsStore.fetchProducts()
})
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
</style>