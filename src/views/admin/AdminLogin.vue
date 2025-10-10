<template>
  <div class="min-h-screen bg-dark flex items-center justify-center p-4">
    <div class="w-full max-w-6xl flex items-center justify-between gap-12">
      <!-- Left side - Branding -->
      <div class="hidden lg:block flex-1">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-4">
            <span class="text-primary">Neon</span>
            <span class="text-light">Signs</span>
          </h1>
          <p class="text-gray-400 text-lg mb-8">
            Panel de Administración
          </p>
          <div class="relative w-full max-w-md mx-auto">
            <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=500"
              alt="Neon Sign"
              class="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      <!-- Right side - Login form -->
      <div class="flex-1">
        <LoginForm />
      </div>
    </div>

    <!-- Mobile branding -->
    <div class="lg:hidden fixed top-8 left-0 right-0 text-center">
      <h1 class="text-3xl font-bold">
        <span class="text-primary">Neon</span>
        <span class="text-light">Signs</span>
      </h1>
      <p class="text-gray-400 text-sm mt-2">Panel de Administración</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
</script>
