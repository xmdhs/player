<template>
    <n-dropdown :options="options" size="large" placement="bottom-start" trigger="click" @select="handleSelect">
        <n-button>设置</n-button>
    </n-dropdown>
</template>

<script setup lang="ts">
import { NDropdown, NButton } from 'naive-ui'

const options = [
    {
        label: 'b站视频解析',
        key: 'bilibili',
        children: [
            {
                label: '登录',
                key: 'b-login'
            },
            {
                label: '退出登录',
                key: 'b-logout'
            }
        ]
    }
]

function handleSelect(key: string | number) {
    console.log(key)
}
</script>

<style module>
</style>