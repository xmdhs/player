<template>
    <div v-show="finish" v-if="videodone">
        <DplayerVue :danmaku="danmaku" :vtt="zm" :url="url" :ass="asszm" />
        <br />
        <n-collapse v-if="danmaku">
            <n-collapse-item title="弹幕列表" name="1">
                <danmakuList :dmList="tempdm['data']" @addblockUser="(user) => _addblock('user', user)" />
            </n-collapse-item>
        </n-collapse>
        <br />
        <n-collapse v-if="danmaku">
            <n-collapse-item title="屏蔽列表" name="1">
                <blockList :blockUserList="blockUserList" :blockWordList="blockWordList"
                    @blockUserchange="(user) => delblock('user', user)"
                    @blockWordblockWord="(word) => delblock('word', word)"
                    @addBlockWord="(word) => _addblock('word', word)" />
            </n-collapse-item>
        </n-collapse>
        <br />
    </div>
    <n-space vertical v-if="!finish">
        <n-button @click="Form">播放</n-button>
        <n-space wrap>
            <n-input size="large" type="text" v-model:value.trim="bilDanmaku" placeholder="弹幕 bvid / epid" />
            <n-input-number size="large" v-model:value="bahaDm" :show-button="false" placeholder="baha 弹幕 sn" />
            <n-input size="large" type="text" v-model:value.trim="acplaySearchWord" placeholder="弹弹play 弹幕搜索" />
            <n-input size="large" type="text" v-model:value.trim="bzimu" placeholder="字幕 bvid / epid" />
            <n-input-number size="large" v-model:value="offset" :show-button="false" placeholder="偏移（单位 ms）" />
            <n-input-number size="large" v-model:value="dmlimit" :show-button="false" placeholder="弹幕数量上限" />
        </n-space>
        <n-input :autosize="{ maxRows: 5, minRows: 5 }" type="textarea" v-model:value="danmaku"
            placeholder="dplayer 格式弹幕" />
        <n-input :autosize="{ maxRows: 5, minRows: 5 }" type="textarea" v-model:value="zm" placeholder="vtt 格式字幕" />
        <n-input :autosize="{ maxRows: 5, minRows: 5 }" type="textarea" v-model:value="asszm" placeholder="ass 格式字幕" />
    </n-space>
    <n-space vertical>
        <n-button @click='reset' type="primary" v-if="finish && !videodone">重新输入</n-button>
        <selVue title="标题" value="cid" msg="选择弹幕 cid" :list="dmcidlist" @set="dmCidset" v-if="dmcidlist.length != 0" />
        <selVue title="标题" value="cid" msg="选择字幕" :list="zmlist" @set="zmset" v-if="zmlist.length != 0" />
        <selVue title="标题" value="id" msg="选择弹幕" :list="acplist" @set="acpSet" v-if="acplist.length != 0" />
    </n-space>
</template>

<script setup lang="ts">
import { Ref, ref, watchEffect } from 'vue'
import { bilZm2vtt, getbilCidS, getBilZm, getDM, getZm } from '@/utils/bilapi';
import { getDm as getBahaDm } from '@/utils/baha';
import { dplayerDm } from '@/utils/interface';
import waitgroup from '@/utils/WaitGroup';
import selVue from '@/components/Sel.vue';
import { dmoffset, vttoffset } from '@/utils/offset';
import { searchanime, getDm as getAcpDm, SearchObject } from '@/utils/acplay';
import DplayerVue from '@/components/Dplayer.vue';
import { NButton, NInput, NInputNumber, NSpace, NCollapse, NCollapseItem, useNotification } from 'naive-ui'
import danmakuList from '@/components/DanmakuList.vue';
import blockList from '@/components/BlockList.vue';
import { addblock, unblock, getBlocked, danmakuFilter } from '@/utils/block';
import { NError } from '@/utils/Nnotification';


const bilDanmaku = ref('');
const bahaDm = ref(null as number | null);
const bzimu = ref("")
const finish = ref(false)
const zm = ref("")
const asszm = ref("")
const dmcidlist = ref([] as { label: string, value: string }[])
const zmlist = ref([] as { label: string, value: string }[])
const danmaku = ref("")
const videodone = ref(false)
const offset = ref(null as number | null)

const acplaySearchWord = ref("")
const acplist = ref([] as { label: string, value: string }[])
const dmlimit = ref(null as number | null)

const tempdm = ref<dplayerDm>({ code: 0, data: [] })
const notification = useNotification()

const props = defineProps<{
    url: string
}>();

watchEffect(() => {
    if (props.url != "") {
        document.title = props.url
    }
})

let acpSearchO = {} as SearchObject
let oldDmdata: dplayerDm["data"] = []
const blockUserList = ref([] as string[]);
const blockWordList = ref([] as string[]);


const wait = new waitgroup()

const Form = warpErr(async () => {
    finish.value = true
    videodone.value = false

    if (danmaku.value){
        tempdm.value = JSON.parse(danmaku.value)
    }

    if (bilDanmaku.value != "") {
        wait.add(1)
        const r = await getbilCidS(bilDanmaku.value)
        bilDanmaku.value = r.bvid
        if (r.data.length == 1) {
            dmCidset(String(r.data[0].cid))
        } else if (r.data.length > 1) {
            let l: { label: string, value: string }[] = []
            r.data.forEach(v => {
                l.push({ value: String(v.cid), label: v.part })
            })
            dmcidlist.value = l
        }
    }
    if (bzimu.value != "") {
        wait.add(1)
        const r = await getbilCidS(bzimu.value)
        bzimu.value = r.bvid
        if (r.data.length == 1) {
            zmset(String(r.data[0].cid))
        } else {
            let l: { label: string, value: string }[] = []
            r.data.forEach(v => {
                l.push({ value: String(v.cid), label: v.part })
            })
            zmlist.value = l
        }
    }
    if (bahaDm.value) {
        let dm = await getBahaDm(bahaDm.value)
        addDm(tempdm.value, dm)
    }
    if (acplaySearchWord.value != "") {
        wait.add(1)
        acpSearchO = await searchanime(acplaySearchWord.value)
        let l: { label: string, value: string }[] = []
        acpSearchO.animes.forEach(v => {
            l.push({ value: String(v.animeId), label: String(v.animeTitle) })
        })
        acplist.value = l
        if (l.length == 0) {
            wait.done()
        }
    }
    await wait.wait()


    if (dmlimit.value) {
        tempdm.value = limitDm(tempdm.value, dmlimit.value)
    }
    if (offset.value) {
        dmoffset(tempdm.value, offset.value)
    }

    if (tempdm.value.data.length > 0) {
        await getBlockData()
        oldDmdata = tempdm.value.data.slice(0)
        tempdm.value = danmakuFilter({ code: 0, data: oldDmdata }, blockUserList.value, blockWordList.value)
        danmaku.value = JSON.stringify(tempdm.value)
    }
    if (zm.value != "" && offset.value != null) {
        zm.value = vttoffset(zm.value, Number(offset.value))
    }
    videodone.value = true
})


let acpSetDo = false
const acpSet = warpErr(async (v: string) => {
    if (!acpSetDo) {
        acplist.value = []
        let animeO = acpSearchO?.animes.find(vv => String(vv.animeId) == v)
        if (!animeO) {
            console.log("没有找到", acpSearchO)
            wait.done()
            return
        }
        let l: { label: string, value: string }[] = []
        animeO.episodes.forEach(v => {
            l.push({ value: String(v.episodeId), label: String(v.episodeTitle) })
        })
        acplist.value = l
        acpSetDo = true
        return
    } else {
        acpSetDo = false
        acplist.value = []
        let d = await getAcpDm(Number(v))
        addDm(tempdm.value, d)
        wait.done()
    }
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
        if (r.length == 1) {
            zmsetdo = true
            zmset(r[0].subtitle_url)
            return
        }
        let l: { label: string, value: string }[] = []
        r.forEach(v => {
            l.push({ value: String(v.subtitle_url), label: v.lan_doc })
        })
        zmlist.value = l
        zmsetdo = true
        return
    } else {
        zmlist.value = []
        zmsetdo = false
        let r = await getBilZm(v)
        zm.value = bilZm2vtt(r.body)
        wait.done()
    }
})

const dmCidset = warpErr(async (cid: string) => {
    dmcidlist.value = []
    let d = await getDM(cid)
    if (d?.code != 0 || !("data" in d)) {
        console.log("没有找到弹幕", d)
        wait.done()
        return
    }
    addDm(tempdm.value, d)
    wait.done()
})

function addDm(danmaku: dplayerDm, dm: dplayerDm) {
    danmaku.data.push(...dm.data)
}

function limitDm(danmaku: dplayerDm, limit: number): dplayerDm {
    if (danmaku.data.length < limit) {
        return danmaku
    }
    shuffle(danmaku.data)
    danmaku.data = danmaku.data.slice(0, limit)
    return danmaku
}

function shuffle(arr: any[]) {
    let length = arr.length;
    let random: number;
    while (0 != length) {
        random = Math.floor(Math.random() * length)
        length--;
        let temp = arr[length];
        arr[length] = arr[random];
        arr[random] = temp;
    }
    return arr;
}


function warpErr<F extends Function>(f: F): F {
    return async function (...args: any[]) {
        try {
            return await f(...args)
        } catch (e) {
            console.error(e)
            NError(notification, String(e))
        }
    } as any
}

function reset() {
    finish.value = false
    videodone.value = false
    acplist.value = []
    dmcidlist.value = []
    zmlist.value = []
    acpSetDo = false
    zmsetdo = false
    danmaku.value = ""
    wait.setZero()
}

async function getBlockData() {
    return warpErr(async () => {
        const warp = async (list: Ref<string[]>, key: string) => {
            list.value = await getBlocked(key) || []
        }
        await warp(blockUserList, "user")
        await warp(blockWordList, "word")
    })()
}

function _addblock(type: 'user' | 'word', v: string) {
    if (oldDmdata.length == 0) {
        oldDmdata = tempdm.value.data
    }
    addblock(type, v)
    let list: Ref<string[]>
    switch (type) {
        case 'user':
            list = blockUserList
            break
        case 'word':
            list = blockWordList
            break
    }
    list.value.push(v)
    tempdm.value = danmakuFilter(tempdm.value, type == 'user' ? list.value : [], type == 'word' ? list.value : [])
    danmaku.value = JSON.stringify(tempdm.value)
}

function delblock(type: 'user' | 'word', v: string) {
    if (oldDmdata.length == 0) {
        oldDmdata = tempdm.value.data
    }
    unblock(type, v)
    let list: Ref<string[]>
    switch (type) {
        case 'user':
            list = blockUserList
            break
        case 'word':
            list = blockWordList
            break
    }
    list.value = list.value.filter(vv => vv != v)
    tempdm.value = danmakuFilter({ code: 0, data: oldDmdata }, blockUserList.value, blockWordList.value)
    danmaku.value = JSON.stringify(tempdm.value)
}

</script>


<style module>
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
