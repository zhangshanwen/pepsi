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
        component: () => import ( /* webpackChunkName: "dashboard" */ '../views/home/index.vue'),
        meta: {title: 'home'},
        children: [
            {
                path: '/user',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/user/index.vue'),

                meta: {title: 'user'}
            },
            {
                path: '/403',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/403.vue'),
                meta: {title: '403'}
            },

            {
                path: '/admin',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/admin/index.vue'),

                meta: {title: 'admin'}
            },
            {
                path: '/permission',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/permission/index.vue'),

                meta: {title: 'permission'}
            },
            {
                path: '/route',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/route/index.vue'),

                meta: {title: 'route'}
            },
            {
                path: '/role',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/role/index.vue'),
                meta: {title: 'role'}
            },
            {
                path: '/file',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/file/index.vue'),
                meta: {title: 'file'}
            },
            {
                path: '/host',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/host/index.vue'),
                meta: {title: 'host'}
            },
            {
                path: '/log',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/log/index.vue'),
                meta: {title: 'log'}
            },
            {
                path: '/task',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/task/index.vue'),
                meta: {title: 'task'}

            },
            {
                path: '/live',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/live/index.vue'),
                meta: {title: 'live'}
            }, {
                path: '/watch',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/watch/index.vue'),
                meta: {title: 'watch'}
            }, {
                path: '/three',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/three/index.vue'),
                meta: {title: 'three'}
            },
            {
                path: '/wechat',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/wechat/index.vue'),
                meta: {title: 'wechat'}
            },
            {
                path: '/rule',
                component: () => import ( /* webpackChunkName: "dashboard" */ '../views/wechat/rule/index.vue'),
                meta: {title: 'rule'}
            }
        ]
    },
    {
        path: '/login',
        component: () => import ( /* webpackChunkName: "dashboard" */ '../views/login/index.vue'),
        meta: {title: 'login'}
    },
    {
        path: '/term',
        component: () => import ( /* webpackChunkName: "dashboard" */ '../views/term/index.vue'),
        meta: {title: 'term'}
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
