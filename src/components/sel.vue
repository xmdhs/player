<template>
  <n-h2>{{ msg }}</n-h2>
  <n-select :class="$style.selete" v-model:value="v" :placeholder="msg" :options="list" />
</template>


<script setup lang="ts">
import { NH2, NSelect } from 'naive-ui';
import { ref, watch } from 'vue';

const props = defineProps<{
  msg: string
  list: { label: string, value: string }[]
  title: string
  value: string
}>()

const v = ref(null as string | null);

const emit = defineEmits<{
  (e: 'set', r: string): void
}>()

const set = (v: string) => {
  emit('set', v)
}

watch(v, (v) => {
  v && set(v)
})

watch(props, () => {
  v.value = null
})

</script>

<style module>
@media (max-width: 400px) {
  .selete {
    width: 85%;
  }
}

@media (min-width: 768px) {
  .selete {
    width: 50%;
  }
}
</style>
