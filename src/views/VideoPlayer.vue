<template>
    <p v-if="hasErr" style="color: red;font-weight: bolder;">{{ hasErr }}</p>
    <button @click="Form" style="max-width: 5em;" v-if="!finish">播放</button>
    <div>
        <div v-show="finish">
            <d-player :danmaku="danmaku" :vtt="zm" :url="url" v-if="videodone" />
            <br />
        </div>
        <div :class="$style.form" v-if="!finish">
            <div :class="$style.input">
                <input type="text" v-model.trim="bilDanmaku" placeholder="弹幕 bvid / epid" />
                <input type="tel" v-model.trim="bahaDm" placeholder="baha 弹幕 sn" />
                <input type="text" v-model.trim="bzimu" placeholder="字幕 bvid / epid" />
                <input type="text" v-model.trim="offset" placeholder="偏移（单位 ms）" />
            </div>
            <textarea
                v-model="danmaku"
                autocomplete="on"
                :class="$style.text"
                cols="5"
                rows="5"
                placeholder="dplayer 格式弹幕"
            ></textarea>
            <textarea
                v-model="zm"
                autocomplete="on"
                :class="$style.text"
                cols="5"
                rows="5"
                placeholder="vtt 格式字幕"
            ></textarea>
        </div>
        <selVue
            title="标题"
            value="cid"
            msg="选择弹幕 cid"
            :list="dmcidlist"
            @set="dmCidset"
            v-if="dmcidlist.length != 0"
        ></selVue>
        <selVue
            title="标题"
            value="cid"
            msg="选择字幕"
            :list="zmlist"
            @set="zmset"
            v-if="zmlist.length != 0"
        ></selVue>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { bilZm2vtt, getbilCidS, getBilZm, getDM, getZm } from '../utils/bilapi';
import { getDm as getBahaDm } from '../utils/baha';
import { dplayerDm } from '../utils/interface';
import waitgroup from '../utils/WaitGroup';
import selVue from '../components/sel.vue';
import { dmoffset, vttoffset } from '../utils/offset';

const bilDanmaku = ref('');
const bahaDm = ref("")
const bzimu = ref("")
const finish = ref(false)
const zm = ref("")
const dmcidlist = ref([] as { v: string, key: string }[])
const zmlist = ref([] as { v: string, key: string }[])
const danmaku = ref("")
const hasErr = ref("")
const videodone = ref(false)
const offset = ref("")


const props = defineProps<{
    url: string
}>();

watch(props, () => {
    if (props.url != "") {
        document.title = props.url
    }
})

const wait = new waitgroup()

const Form = warpErr(async () => {
    finish.value = true
    videodone.value = false
    if (bilDanmaku.value != "") {
        wait.add(1)
        const r = await getbilCidS(bilDanmaku.value)
        let l: { v: string, key: string }[] = []
        r.data.forEach(v => {
            l.push({ v: String(v.cid), key: v.part })
        })
        bilDanmaku.value = r.bvid
        dmcidlist.value = l
    }
    if (bzimu.value != "") {
        wait.add(1)
        const r = await getbilCidS(bzimu.value)
        let l: { v: string, key: string }[] = []
        r.data.forEach(v => {
            l.push({ v: String(v.cid), key: v.part })
        })
        bzimu.value = r.bvid
        zmlist.value = l
    }
    if (!isNaN(Number(bahaDm.value)) && Number(bahaDm.value) != 0) {
        let dm = await getBahaDm(Number(bahaDm.value))
        addDm(danmaku, dm)
    }
    await wait.wait()

    if (!isNaN(Number(offset.value)) && Number(offset.value) != 0) {
        if (danmaku.value != "") {
            danmaku.value = JSON.stringify(dmoffset(JSON.parse(danmaku.value), Number(offset.value)))
        }
        if (zm.value != "") {
            zm.value = vttoffset(zm.value, Number(offset.value))
        }
    }

    videodone.value = true
})

let zmsetdo = false
const zmset = warpErr(async (v: string) => {
    if (!zmsetdo) {
        zmlist.value = []
        let r = await getZm(bzimu.value, v)
        if (r.length == 0) {
            console.log("没有找到字幕")
            wait.done()
            zmsetdo = false
            return
        }
        let l: { v: string, key: string }[] = []
        r.forEach(v => {
            l.push({ v: String(v.subtitle_url), key: v.lan_doc })
        })
        zmlist.value = l
        zmsetdo = true
        return
    } else {
        zmlist.value = []
        zmsetdo = false
        let r = await getBilZm(v)
        zm.value = bilZm2vtt(r.body)
    }
    wait.done()
})

const dmCidset = warpErr(async (cid: string) => {
    dmcidlist.value = []
    let dm = await getDM(cid)
    let d = JSON.parse(dm) as dplayerDm
    if (d.code != 0 || !("data" in d)) {
        console.log("没有找到弹幕", d)
        wait.done()
        return
    }
    addDm(danmaku, d)
    wait.done()
})

function addDm(danmaku: Ref<string>, dm: dplayerDm) {
    let d: dplayerDm = {
        code: 0,
        data: []
    }
    if (danmaku.value != "") {
        d = JSON.parse(danmaku.value)
    }
    if (dm.data.length == 0) {
        return
    }
    d.data.push(...dm.data)
    danmaku.value = JSON.stringify(d)
}


function warpErr<F extends Function>(f: F): F {
    return async function (...args: any[]) {
        hasErr.value = ""
        try {
            return await f(...args)
        } catch (e) {
            console.error(e)
            hasErr.value = String(e)
        }
    } as any
}
</script>


<style module>
textarea.text {
    resize: none;
    max-height: 100px;
    width: 100%;
    overflow: auto;
    word-break: break-all;
}

.form {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.input {
    display: flex;
    column-gap: 10px;
    flex-wrap: wrap;
}

.input > input {
    max-width: 15em;
}
</style>

<style>
.dplayer-danmaku-item {
    font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
    font-weight: bold;
    text-shadow: rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px,
        rgb(0 0 0) 0px -1px 1px, rgb(0 0 0) -1px 0px 1px !important;
}
.dplayer-subtitle {
    text-shadow: rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px,
        rgb(0 0 0) 0px -1px 1px, rgb(0 0 0) -1px 0px 1px !important;
}
</style>
