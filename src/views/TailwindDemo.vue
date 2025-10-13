<template>
  <div class="min-h-screen bg-dark-bg p-8">
    <div class="max-w-6xl mx-auto space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-6xl font-neon text-gradient-neon-pink-purple text-neon-glow-lg">
          Tailwind CSS + Neon
        </h1>
        <p class="text-xl text-gray-400">
          Componentes personalizados con efectos de neón
        </p>
      </div>

      <!-- Botones Neon -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-pink text-neon-glow">Botones Neon</h2>
        <div class="flex flex-wrap gap-4">
          <button class="px-6 py-3 rounded-lg font-semibold transition-all duration-300
                         border-2 border-neon-pink text-neon-pink
                         hover:bg-neon-pink hover:text-white hover:scale-105 hover:shadow-neon-pink-lg
                         active:scale-95">
            Pink Button
          </button>

          <button class="px-6 py-3 rounded-lg font-semibold transition-all duration-300
                         border-2 border-neon-blue text-neon-blue
                         hover:bg-neon-blue hover:text-dark-bg hover:scale-105 hover:shadow-neon-blue-lg
                         active:scale-95">
            Blue Button
          </button>

          <button class="px-6 py-3 rounded-lg font-semibold transition-all duration-300
                         border-2 border-neon-purple text-neon-purple
                         hover:bg-neon-purple hover:text-white hover:scale-105 hover:shadow-neon-purple-lg
                         active:scale-95">
            Purple Button
          </button>
        </div>
      </section>

      <!-- Cards -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-blue text-neon-glow">Cards Neon</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-dark-card rounded-xl p-6 border border-neon-pink/20
                      hover:border-neon-pink/40 hover:shadow-neon-pink-md
                      transition-all duration-300">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="text-xl font-neon text-neon-pink mb-2">Diseño Creativo</h3>
            <p class="text-gray-400">
              Crea diseños únicos con efectos de neón personalizados
            </p>
          </div>

          <div class="bg-dark-card rounded-xl p-6 border border-neon-blue/20
                      hover:border-neon-blue/40 hover:shadow-neon-blue-md
                      transition-all duration-300">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-neon text-neon-blue mb-2">Alto Rendimiento</h3>
            <p class="text-gray-400">
              Bundle optimizado de solo ~15KB con PurgeCSS
            </p>
          </div>

          <div class="bg-dark-card rounded-xl p-6 border border-neon-purple/20
                      hover:border-neon-purple/40 hover:shadow-neon-purple-md
                      transition-all duration-300">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-xl font-neon text-neon-purple mb-2">Desarrollo Rápido</h3>
            <p class="text-gray-400">
              Utility-first classes para desarrollo 3x más rápido
            </p>
          </div>
        </div>
      </section>

      <!-- Inputs -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-purple text-neon-glow">Inputs Neon</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Email"
            class="w-full px-4 py-3 rounded-lg bg-dark-card border-2 border-gray-700
                   text-white placeholder-gray-400
                   focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50
                   transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            class="w-full px-4 py-3 rounded-lg bg-dark-card border-2 border-gray-700
                   text-white placeholder-gray-400
                   focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50
                   transition-all duration-300"
          />
        </div>
      </section>

      <!-- Badges -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-green text-neon-glow">Badges Neon</h2>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                       border border-neon-pink text-neon-pink bg-neon-pink/10
                       hover:bg-neon-pink/20 hover:shadow-neon-pink-sm transition-all">
            ✨ Featured
          </span>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                       border border-neon-blue text-neon-blue bg-neon-blue/10
                       hover:bg-neon-blue/20 hover:shadow-neon-blue-sm transition-all">
            🔥 Popular
          </span>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                       border border-neon-purple text-neon-purple bg-neon-purple/10
                       hover:bg-neon-purple/20 hover:shadow-neon-purple-sm transition-all">
            🆕 New
          </span>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                       border border-neon-green text-neon-green bg-neon-green/10
                       hover:bg-neon-green/20 transition-all">
            ✅ Verified
          </span>
        </div>
      </section>

      <!-- Animaciones -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-orange text-neon-glow">Animaciones</h2>
        <div class="flex flex-wrap gap-8 items-center justify-center p-8 bg-dark-card rounded-xl">
          <div class="text-4xl animate-neon-pulse text-neon-pink text-neon-glow-lg">
            💗 Pulse
          </div>
          <div class="text-4xl animate-neon-flicker text-neon-blue text-neon-glow-lg">
            ⚡ Flicker
          </div>
          <div class="text-4xl animate-spin text-neon-purple text-neon-glow-lg">
            🎯 Spin
          </div>
          <div class="text-4xl animate-bounce text-neon-green text-neon-glow-lg">
            🎈 Bounce
          </div>
        </div>
      </section>

      <!-- Gradientes de Texto -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-yellow text-neon-glow">Text Gradients</h2>
        <div class="space-y-4">
          <p class="text-5xl font-neon text-gradient-neon-pink-purple">
            Pink → Purple Gradient
          </p>
          <p class="text-5xl font-neon text-gradient-neon-blue-green">
            Blue → Green Gradient
          </p>
          <p class="text-5xl font-neon bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
            Rainbow Neon Gradient
          </p>
        </div>
      </section>

      <!-- Responsive Grid -->
      <section class="space-y-4">
        <h2 class="text-3xl font-neon text-neon-pink text-neon-glow">Responsive Grid</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="i in 12" :key="i"
               class="aspect-square bg-gradient-to-br from-neon-pink to-neon-purple rounded-lg
                      flex items-center justify-center text-white font-bold text-2xl
                      hover:scale-110 transition-transform duration-300 cursor-pointer
                      shadow-neon-pink-md hover:shadow-neon-pink-xl">
            {{ i }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Demo component - no logic needed
</script>
