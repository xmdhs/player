<template>
    <n-message-provider>
        <n-layout>
            <n-layout-header bordered :class="$style.header">
                <router-link to="/" :class="$style.headerText">
                    <strong>播放器</strong>
                </router-link>
                <router-link to="/setting" style="color: inherit;text-decoration: inherit;">
                    <n-icon size="30">
                        <SettingsOutline />
                    </n-icon>
                </router-link>
            </n-layout-header>
            <n-layout-content :class="$style.container" content-style="padding: 24px;">
                <router-view v-slot="{ Component, route }">
                    <keep-alive>
                        <component :is="Component" v-if="route.meta.keepAlive" />
                    </keep-alive>
                    <component :is="Component" v-if="!route.meta.keepAlive" />
                </router-view>
            </n-layout-content>
        </n-layout>
    </n-message-provider>
</template>

<script setup lang="ts">
import { NMessageProvider, NLayout, NLayoutContent, NLayoutHeader, NIcon } from 'naive-ui'
import { RouterView, RouterLink } from 'vue-router'
import { SettingsOutline } from '@vicons/ionicons5'
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