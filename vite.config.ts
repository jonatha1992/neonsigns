import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const imageProxyPlugin = (): Plugin => ({
    name: 'firebase-image-proxy',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/__image_proxy', async (req, res, next) => {
            if (req.method !== 'GET') {
                res.statusCode = 405
                res.end('Method not allowed')
                return
            }

            try {
                const requestUrl = new URL(req.url || '', 'http://localhost')
                const targetParam = requestUrl.searchParams.get('url')

                if (!targetParam) {
                    res.statusCode = 400
                    res.end('Missing url param')
                    return
                }

                const targetUrl = new URL(targetParam)
                const hostname = targetUrl.hostname.toLowerCase()
                const isAllowedHost = hostname === 'firebasestorage.googleapis.com' || hostname.endsWith('.firebasestorage.app')

                if (targetUrl.protocol !== 'https:' || !isAllowedHost) {
                    res.statusCode = 403
                    res.end('Target host not allowed')
                    return
                }

                const upstream = await fetch(targetUrl.toString())
                const body = Buffer.from(await upstream.arrayBuffer())

                res.statusCode = upstream.status
                const contentType = upstream.headers.get('content-type')
                const cacheControl = upstream.headers.get('cache-control')

                if (contentType) res.setHeader('Content-Type', contentType)
                if (cacheControl) res.setHeader('Cache-Control', cacheControl)

                res.end(body)
            } catch (error) {
                next(error)
            }
        })
    }
})

export default defineConfig({
    plugins: [vue(), imageProxyPlugin()],
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
