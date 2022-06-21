<template>
    <n-h2>b站相关设置</n-h2>
    <n-space vertical :size="[0, 20]">
        <n-space justify="space-between">
            <n-p>账户</n-p>
            <n-p>还没有登录</n-p>
        </n-space>
        <n-space justify="space-between">
            <n-p>视频最大分辨率</n-p>
            <n-select v-model:value="resolution" :options="options" style="width: 8em;" />
        </n-space>
    </n-space>

</template>

<script setup lang="ts">
import { NH2, NP, NSpace, NSelect } from 'naive-ui'
import { ref } from 'vue';

const resolution = ref('120');

const options = ref([
    {
        label: '4k',
        value: '120',
    },
    {
        label: '1080P60',
        value: '116',
    },
    {
        label: '1080P+',
        value: '112',
    },
    {
        label: '1080P',
        value: '80',
    },
    {
        label: '720P60',
        value: '74',
    },
    {
        label: '720P',
        value: '64',
    },
    {
        label: '480P',
        value: '32',
    },
    {
        label: '360P',
        value: '16',
    },
    {
        label: '240P',
        value: '240',
    },
    {
        label: '144P',
        value: '144',
    },
])

</script>