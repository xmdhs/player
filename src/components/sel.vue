<template>
  <n-h2>{{ msg }}</n-h2>
  <n-radio-group v-model:value="v">
    <n-space vertical>
      <n-radio-button v-for="v in list" :key="v.key" :value="v.v" :label="v.key" />
    </n-space>
  </n-radio-group>
</template>


<script setup lang="ts">
import { NRadioGroup, NRadioButton, NH2, NSpace } from 'naive-ui';
import { ref, watch } from 'vue';

const props = defineProps<{
  msg: string
  list: { v: string, key: string }[]
  title: string
  value: string
}>()

const v = ref('');

const emit = defineEmits<{
  (e: 'set', r: string): void
}>()

const set = (v: string) => {
  emit('set', v)
}

watch(v, set)

</script>

<style scoped>
</style>
