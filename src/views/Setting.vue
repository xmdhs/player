<template>
    <div :class="$style.grid">
        <div :class="[$style['grid-area'], $style['flex-centered']]" @click="(e) => e.preventDefault()"
            style="z-index: 1;" v-if="store.isWeb">
            <n-h1>web 端不可用</n-h1>
        </div>
        <div :class="[$style['grid-area'], store.isWeb ? $style.blur : '']">
            <n-h2>b站相关设置</n-h2>
            <n-space vertical :size="[0, 20]">
                <n-space justify="space-between">
                    <n-p>账户</n-p>
                    <n-p v-if="!bstore.logined">
                        <n-button @click="router.push('/login')">还没有登录，去登录</n-button>
                    </n-p>
                    <n-popconfirm v-if="bstore.logined"
                        @positive-click="bstore.logined = false">
                        <template #trigger>
                            <n-button>退出登录</n-button>
                        </template>
                        一切都将一去杳然，任何人都无法将其捕获。
                    </n-popconfirm>
                </n-space>
                <n-space justify="space-between">
                    <n-p>视频最大分辨率</n-p>
                    <n-select v-model:value="bstore.resolution" :options="options" style="width: 8em;" />
                </n-space>
            </n-space>
        </div>
    </div>

</template>

<script setup lang="ts">
import { NH1, NH2, NP, NSpace, NSelect, NButton, NPopconfirm } from 'naive-ui'
import { ref, watch, computed } from 'vue';
import { useBilibili } from '@/store/bilibili';
import { useStore } from '@/store/store';
import { useRouter } from 'vue-router'

const bstore = useBilibili();
const router = useRouter()
const store = useStore()


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
    }
])


</script>


<style module>
.grid {
    display: grid;
}

.grid-area {
    grid-area: 1 / 1 / 1 / 1;
}

.flex-centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

.blur {
    filter: blur(5px);
}
</style>