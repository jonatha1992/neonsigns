import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
            title: 'Inicio - Neon Signs Store'
        }
    },
    {
        path: '/galeria',
        name: 'Gallery',
        component: () => import('@/views/Products.vue'),
        meta: {
            title: 'Galería - Trabajos de Neón'
        }
    },
    {
        path: '/trabajo/:id',
        name: 'WorkDetail',
        component: () => import('@/views/ProductDetail.vue'),
        meta: {
            title: 'Detalle del Trabajo'
        }
    },
    {
        path: '/contacto',
        name: 'Contact',
        component: () => import('@/views/Contact.vue'),
        meta: {
            title: 'Contacto - Neon Signs Store'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: 'Página no encontrada'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// Global navigation guard for page titles
router.beforeEach((to, _from, next) => {
    document.title = to.meta.title as string || 'Neon Signs Store'
    next()
})

export default router