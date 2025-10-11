import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import { guestGuard, adminGuard } from '@/middleware/auth.guard'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
            title: 'Inicio - Neon Signs Store'
        }
    },
    {
        path: '/galeria',
        name: 'gallery',
        component: () => import('@/views/Products.vue'),
        meta: {
            title: 'Galería - Trabajos de Neón'
        }
    },
    {
        path: '/trabajos',
        redirect: '/galeria'
    },
    {
        path: '/trabajo/:id',
        name: 'work-detail',
        component: () => import('@/views/ProductDetail.vue'),
        meta: {
            title: 'Detalle del Trabajo'
        }
    },
    {
        path: '/contacto',
        name: 'contact',
        component: () => import('@/views/Contact.vue'),
        meta: {
            title: 'Contacto - Neon Signs Store'
        }
    },
    // Admin routes
    {
        path: '/admin/login',
        name: 'admin-login',
        component: () => import('@/views/admin/AdminLogin.vue'),
        // beforeEnter: guestGuard,
        meta: {
            title: 'Acceso Administrativo - Neon Signs Store',
            hideLayout: true
        }
    },
    {
        path: '/admin',
        redirect: '/admin/dashboard',
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        // beforeEnter: adminGuard,
        meta: {
            title: 'Panel de Administración - Neon Signs Store',
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/gallery',
        name: 'admin-gallery',
        component: () => import('@/views/admin/GalleryManager.vue'),
        // beforeEnter: adminGuard,
        meta: {
            title: 'Gestión de Galería - Admin',
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    // Data Manager (for development/admin)
    {
        path: '/data-manager',
        name: 'DataManager',
        component: () => import('@/views/DataManager.vue'),
        meta: {
            title: 'Administrador de Datos'
        }
    },
    // 404 - Not Found (Must be last)
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