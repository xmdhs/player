import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useSetting = defineStore('setting', () => {
    const useProxy = ref(false)

    return {
        useProxy
    }
}, {
    persist: true
})

