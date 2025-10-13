import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    base: '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@views': path.resolve(__dirname, './src/views'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@stores': path.resolve(__dirname, './src/stores')
        }
    },

    server: {
        port: 3000,
        open: true,
        hmr: {
            overlay: false
        },
        fs: {
            strict: false
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['vue', 'vue-router', 'pinia'],
                    'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
                    'ui': ['lucide-vue-next']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', 'firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage', 'lucide-vue-next']
    }
})