<template>
  <p>{{ msg }}</p>
  <table>
    <thead>
      <tr>
        <th>key</th>
        <th>v</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="v in list" :key="v.key">
        <td>{{ v.v }}</td>
        <td @click="set(v.v)">
          <button>{{ v.v }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  msg: string
  list: { v: string, key: string }[]
}>()

const emit = defineEmits<{
  (e: 'set', r: string): void
}>()

const set = (v: string) => {
  emit('set', v)
}
</script>

<style scoped>
</style>
