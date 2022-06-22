<template>
    <selVue title="标题" value="id" msg="选择 cid" :list="list" @set="set" v-if="list.length != 0" />

</template>

<script setup lang="ts">
import { getbilCidS } from '@/utils/bilapi';
import { onMounted, ref, watch } from 'vue';
import { NError } from '@/utils/Nnotification'
import { useNotification, NH2 } from 'naive-ui';
import { useRouter } from 'vue-router';
import { apiAddr, cors } from '@/utils/interface'
import { useStore } from '@/store/store';
import selVue from '@/components/Sel.vue'

const props = defineProps<{
    videoID: string
}>()

const notification = useNotification()
const router = useRouter()
const store = useStore()
const list = ref([] as { label: string, value: string }[])


onMounted(start)

watch(props, start)

let bvid: string


async function start() {
    list.value = []
    let data: {
        cid: number
        part: string
    }[]
    try {
        let r = await getbilCidS(props.videoID)
        bvid = r.bvid
        data = r.data
    } catch (e) {
        NError(notification, String(e))
        return
    }
    if (data.length == 1) {
        set(String(data[0].cid))
        return
    }
    data.forEach(v => list.value.push({ label: v.part, value: String(v.cid) }))
}

async function set(s: string) {
    let u = ""
    try {
        u = await makeUrl(bvid, s)
    } catch (e) {
        NError(notification, String(e))
        return
    }
    router.push({ name: "player", query: { video: u } })
}

async function makeUrl(bvid: string, cid: string): Promise<string> {
    let u = new URL(apiAddr + "bilibili.flv")
    u.searchParams.set("qn", store.state.bilibili.resolution)
    u.searchParams.set("bvid", bvid)
    u.searchParams.set("cid", cid)
    u.searchParams.set("DedeUserID", store.state.bilibili.DedeUserID)
    u.searchParams.set("DedeUserID__ckMd5", store.state.bilibili.DedeUserID__ckMd5)
    u.searchParams.set("SESSDATA", store.state.bilibili.SESSDATA)
    u.searchParams.set("bili_jct", store.state.bilibili.bili_jct)
    let r = await fetch(u.toString())
    let rurl = await r.text()
    if (r.status != 200) {
        throw rurl
    }
    let ru = new URL(cors + rurl)
    ru.searchParams.set("_corsreferer", "https://www.bilibili.com")
    return ru.toString()
}

</script>
