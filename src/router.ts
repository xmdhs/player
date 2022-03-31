import { KeepAlive } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        scrollToTop?: boolean
        keepAlive?: boolean
    }
}

import SetUrl from './views/SetUrl.vue'
import VideoPlayer from './views/VideoPlayer.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: SetUrl,
        meta: {
            scrollToTop: true,
            keepAlive: true
        }
    },
    {
        name: 'player',
        path: '/player',
        component: VideoPlayer,
        meta: {
            scrollToTop: true
        },
        props: route => ({ url: route.query.video })
    }
]

const hash = location.host == "auto.xmdhs.com" || location.host == "auto.xmdhs.top" ? true : false

const router = createRouter({
    history: hash ? createWebHashHistory("/tgdown/") : createWebHistory(),
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        let position: { left: number, top: number } = {
            left: 0,
            top: 0,
        }
        if (to.meta.scrollToTop) {
            position.left = 0
            position.top = 0
        } else {
            return false
        }
        return position
    },
    routes
})

export default router
