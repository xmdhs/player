import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useStore = defineStore('root', () => {
    const isWeb = ref(false)
    return { isWeb }
})
