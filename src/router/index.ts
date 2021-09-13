import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'

import {getToken} from '../utils/auth';

const routes = [
    {
        path: '/',
        redirect: '/user'
    },
    {
        path: '/home',
        component: () => import ( /* webpackChunkName: "dashboard" */ '../views/Home.vue'),
        meta: {title: 'home'},
        children: [
            {
                path: '/user',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/User.vue'),

                meta: {title: 'user'}
            },
            {
                path: '/403',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/403.vue'),
                meta: {title: '403'}
            },

            {
                path: '/admin',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/Admin.vue'),

                meta: {title: 'admin'}
            },
            {
                path: '/permission',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/Permission.vue'),

                meta: { title: 'permission' }
            },
            {
                path: '/route',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/Route.vue'),

                meta: { title: 'route' }
            },
            {
                path: '/role',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/Role.vue'),

                meta: { title: 'role' }
            }
        ]
    },
    {
        path: '/login',
        component: () => import ( /* webpackChunkName: "dashboard" */ '../views/Login.vue'),
        meta: {title: 'login'}
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import ( /* webpackChunkName: "dashboard" */ '../views/404.vue'),
        meta: {title: '404'}

    },

];


const router = createRouter({
    history: createWebHashHistory(),
    routes
})


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    // document.title = `${i18n.t('title.' + to.meta.title)} || shard `;

    if (to.path === '/login') {
        next();
        return;

    }
    const token = getToken();
    if (!token && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
});

export default router
