<template>
    <selVue title="标题" value="id" msg="选择弹幕" :list="list" @set="set" v-if="list.length != 0" />

</template>

<script setup lang="ts">
import { getbilCidS } from '@/utils/bilapi';
import { onMounted, ref, watch } from 'vue';
import { NError } from '@/utils/Nnotification'
import { useNotification, NH2 } from 'naive-ui';
import { useRouter } from 'vue-router';
import { apiAddr } from '@/utils/interface'
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

function set(s: string) {
    router.push({ name: "player", query: { video: makeUrl(bvid, s) } })
}

function makeUrl(bvid: string, cid: string): string {
    let u = new URL(apiAddr + "bilibili.flv")
    u.searchParams.set("qn", store.state.bilibili.resolution)
    u.searchParams.set("bvid", bvid)
    u.searchParams.set("cid", cid)
    u.searchParams.set("DedeUserID", store.state.bilibili.DedeUserID)
    u.searchParams.set("DedeUserID__ckMd5", store.state.bilibili.DedeUserID__ckMd5)
    u.searchParams.set("SESSDATA", store.state.bilibili.SESSDATA)
    u.searchParams.set("bili_jct", store.state.bilibili.bili_jct)
    return u.toString()
}

</script>