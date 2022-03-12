<template>
    <div :class="$style.sel">
        <input type="text" v-model="url" style="max-width: 20em;" />
        <button @click="Form" style="max-width: 5em;">播放</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const url = ref('');

const router = useRouter();

function Form() {
    router.push("/player?video=" + encodeURIComponent(url.value));
    router.push({ name: "player", query: { video: url.value } });

}
</script>

<style module>
.sel {
    display: flex;
    column-gap: 10px;
}
</style>