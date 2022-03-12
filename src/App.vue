<template>
    <header :class="$style.header">
        <nav class="container-fluid">
            <ul>
                <li>
                    <RouterLink to="/">
                        <strong>播放器</strong>
                    </RouterLink>
                </li>
            </ul>
            <ul></ul>
        </nav>
    </header>
    <main class="container">
        <router-view v-slot="{ Component, route }">
            <keep-alive>
                <component :is="Component" v-if="route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.keepAlive" />
        </router-view>
    </main>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
</script>

<style module>
textarea.text {
    resize: none;
    max-height: 100px;
    width: 100%;
    overflow: auto;
    word-break: break-all;
}

.form {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.input {
    display: flex;
    column-gap: 10px;
    flex-wrap: wrap;
}

.input > input {
    max-width: 15em;
}

.header {
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 30px;
}
</style>