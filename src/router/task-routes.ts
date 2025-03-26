const taskRoutes = [
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('../views/tasks/Index.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/tasks/create',
        name: 'tasks.create',
        component: () => import('../views/tasks/Create.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/tasks/:uuid',
        name: 'tasks.show',
        component: () => import('../views/tasks/Show.vue'),
        meta: { requiresAuth: true },
    },
]

export default taskRoutes
