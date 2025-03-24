import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: false },
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { requiresAuth: false },
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: { requiresAuth: false },
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/settings/profile',
            name: 'profile.edit',
            component: () => import('../views/settings/Profile.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/settings/password',
            name: 'password.edit',
            component: () => import('../views/settings/Password.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/settings/appearance',
            name: 'appearance',
            component: () => import('../views/settings/Appearance.vue'),
            meta: { requiresAuth: true },
        },
    ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const { check } = useAuth()

    try {
        // Check if user is authenticated
        const isAuthenticated = await check()

        // If authenticated and trying to access /login or /register, redirect to home
        if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
            next('/')
        }
        // If route requires authentication and user is not authenticated, redirect to /login
        else if (to.meta.requiresAuth && !isAuthenticated) {
            next('/login')
        }
        // Otherwise, proceed as normal
        else {
            next()
        }
    } catch (error) {
        console.error('Auth check error:', error)
        // If there's an error checking auth status, redirect to login
        next('/login')
    }
})

export default router
