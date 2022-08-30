import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useBilibili = defineStore('bilibili', () => {
    const DedeUserID = ref("")
    const DedeUserID__ckMd5 = ref("")
    const SESSDATA = ref("")
    const bili_jct = ref("")
    const logined = ref(false)
    const resolution = ref("120")

    return {
        DedeUserID,
        DedeUserID__ckMd5,
        SESSDATA,
        bili_jct,
        logined,
        resolution
    }
}, {
    persist: true
})

