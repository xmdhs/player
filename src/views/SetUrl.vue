<template>
    <n-space :align="'baseline'">
        <n-input size="large" type="text" v-model:value="url" style="min-width: 50em;" />
        <n-button @click="Form">播放</n-button>
    </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NInput, NButton, NSpace } from 'naive-ui';

const url = ref('');

const router = useRouter();

function Form() {
    router.push("/player?video=" + encodeURIComponent(url.value));
    router.push({ name: "player", query: { video: url.value } });

}
</script>

