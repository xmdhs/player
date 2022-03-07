<template>
  <p>{{ msg }}</p>
  <table>
    <thead>
      <tr>
        <th>{{ title }}</th>
        <th>{{ value }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="v in list" :key="v.key">
        <td>{{ v.key }}</td>
        <td @click="set(v.v)">
          <button style="max-width: 15em;">{{ v.v }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup lang="ts">
const props = defineProps<{
  msg: string
  list: { v: string, key: string }[]
  title: string
  value: string
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
