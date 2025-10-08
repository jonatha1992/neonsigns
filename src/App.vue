<template>
  <div id="app">
    <!-- Header/Navigation -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="page"
          mode="out-in"
          @enter="onPageEnter"
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
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

const onPageEnter = () => {
  // Scroll suave al cambiar de página
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
.page-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  filter: blur(2px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.02);
  filter: blur(1px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

// Efecto de transición con brillo neón
.page-enter-active::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    rgba($neon-blue, 0.05), 
    rgba($neon-pink, 0.05)
  );
  opacity: 0;
  animation: pageGlow 0.6s ease-out;
  pointer-events: none;
  z-index: -1;
}

@keyframes pageGlow {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>