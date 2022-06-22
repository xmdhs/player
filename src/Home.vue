<template>
    <n-layout>
        <n-layout-header bordered :class="$style.header">
            <n-space :class="$style.headerText" justify="center" align="center" :size="[30, 0]">
                <n-icon size="25" @click="router.back()">
                    <ArrowBack />
                </n-icon>
                <n-icon size="25" @click="router.forward()">
                    <ArrowForward />
                </n-icon>
                <n-icon size="25" @click="refresh">
                    <Refresh />
                </n-icon>
                <n-icon size="25" @click="router.push('/')">
                    <HomeOutline />
                </n-icon>
            </n-space>

            <router-link to="/setting" style="color: inherit;text-decoration: inherit;">
                <n-icon size="25">
                    <SettingsOutline />
                </n-icon>
            </router-link>
        </n-layout-header>
        <n-layout-content :class="$style.container" content-style="padding: 24px;">
            <router-view v-slot="{ Component, route }">
                <keep-alive>
                    <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
                </keep-alive>
                <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
            </router-view>
        </n-layout-content>
    </n-layout>
</template>


<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader, NIcon, NSpace } from 'naive-ui'
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { SettingsOutline, ArrowBack, ArrowForward, Refresh, HomeOutline } from '@vicons/ionicons5'

const router = useRouter()

function refresh() {
    location.reload()
}
</script>

<style module>
.container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
}

@media (min-width: 576px) {
    .container {
        max-width: 510px;
        padding-right: 0;
        padding-left: 0;
    }
}

@media (min-width: 768px) {
    .container {
        max-width: 700px;
    }
}

@media (min-width: 992px) {
    .container {
        max-width: 920px;
    }
}

@media (min-width: 1200px) {
    .container {
        max-width: 1130px;
    }
}

.headerText {
    padding: 1rem 0.5rem;
    font-size: 20px;
    cursor: pointer;
    color: inherit;
    text-decoration: inherit;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 1rem;
    padding-left: 1rem;
}
</style>