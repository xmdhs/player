<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
        <n-notification-provider>
            <n-message-provider>
                <HomeVue />
            </n-message-provider>
        </n-notification-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import { NNotificationProvider, NMessageProvider, NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import HomeVue from '@/Home.vue'
</script>
