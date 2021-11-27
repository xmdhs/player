
<template>
  <div class="container-lg px-3 my-5 markdown-body">
    <div id="in" v-if="!finish" style="display: flex;column-gap: 10px;">
      <input type="text" v-model="url" v-if="showUrlIn" />
      <button @click="Form">播放</button>
    </div>
    <div class="c" v-if="!root">
      <div id="dplayer" ref="dplayer"></div>
      <div id="info" v-if="!finish">
        <div style="display: flex;column-gap: 10px;">
          <input type="text" v-model="bilDanmaku" placeholder="弹幕 bvid" />
          <input type="text" v-model="bzimu" placeholder="字幕 bvid" />
        </div>
        <textarea
          v-model="danmaku"
          autocomplete="on"
          class="text"
          cols="5"
          rows="5"
          style="width: 100%;overflow: auto;word-break: break-all;"
          placeholder="dplayer 格式弹幕"
        ></textarea>
        <textarea
          v-model="zm"
          autocomplete="on"
          class="text"
          cols="5"
          rows="5"
          style="width: 100%;overflow: auto;word-break: break-all;"
          placeholder="vtt 格式字幕"
        ></textarea>
        <selVue msg="选择弹幕 cid" :list="dmcidlist" @set="dmCidset" v-if="dmcidlist.length != 0"></selVue>
        <selVue msg="选择字幕" :list="zmlist" @set="zmset" v-if="zmlist.length != 0"></selVue>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DPlayer, { DPlayerEvents, DPlayerOptions } from 'dplayer';
import { bilZm2vtt, getbilCidS, getBilZm, getDM, getZm } from './utils/bilapi';
import waitgroup from './utils/WaitGroup';
import selVue from './components/sel.vue';
const dplayer = ref(null)
const url = ref("")
const danmaku = ref("")
const bilDanmaku = ref("")
const bzimu = ref("")
const finish = ref(false)
const showUrlIn = ref(true)
const zm = ref("")
const root = ref(true)
const dmcidlist = ref([] as { v: string, key: string }[])
const zmlist = ref([] as { v: string, key: string }[])

onMounted(() => {
  let u = new URL(location.href)
  const file = u.searchParams.get('video')
  if (typeof file == "string" && file != "") {
    url.value = file
    showUrlIn.value = false
    root.value = false
  }
})

const wait = new waitgroup()

const Form = async () => {
  if (root.value) {
    let u = new URL(location.href)
    u.searchParams.set("video", url.value)
    location.href = u.toString()
    return
  }
  finish.value = true
  let has = false
  if (bilDanmaku.value != "") {
    has = true
    wait.add(1)
    const r = await getbilCidS(bilDanmaku.value)
    let l = [] as { v: string, key: string }[]
    r.forEach(v => {
      l.push({ v: String(v.cid), key: v.part })
    })
    dmcidlist.value = l
  }
  if (bzimu.value != "") {
    has = true
    wait.add(1)
    const r = await getbilCidS(bzimu.value)
    let l = [] as { v: string, key: string }[]
    r.forEach(v => {
      l.push({ v: String(v.cid), key: v.part })
    })
    zmlist.value = l
  }
  wait.wait()
  newPlayer(danmaku.value, zm.value, dplayer.value, url.value)
}

let zmsetdo = false
const zmset = async (v: string) => {
  if (!zmsetdo) {
    zmlist.value = []
    let r = await getZm(bzimu.value, v)
    let l = [] as { v: string, key: string }[]
    r.forEach(v => {
      l.push({ v: String(v.subtitle_url), key: v.lan_doc })
    })
    zmlist.value = l
    zmsetdo = true
  } else {
    zmsetdo = false
    let r = await getBilZm(v)
    zm.value = bilZm2vtt(r)
  }
  wait.done()
}

const dmCidset = async (cid: string) => {
  dmcidlist.value = []
  let dm = await getDM(cid)
  danmaku.value = dm
  wait.done()
}

function newPlayer(danmaku: string, vtt: string, dplayer: any, url: string) {
  let [dmlink, vttlink] = ["", ""]
  if (danmaku != "") {
    let blob = new Blob([danmaku])
    dmlink = URL.createObjectURL(blob)
  }
  if (vtt != "") {
    let blob = new Blob([vtt])
    vttlink = URL.createObjectURL(blob)
  }
  let d = newDp(dmlink, vttlink, dplayer, url)
  d.on(DPlayerEvents.play, () => {
    dmlink != "" ? URL.revokeObjectURL(dmlink) : ""
    vttlink != "" ? URL.revokeObjectURL(vttlink) : ""
  })
  function newDp(url: string, danmaku: string, vtt: string, dom: any): DPlayer {
    try {
      new URL(url)
    } catch (e) {
      url = "./files/" + url
    }
    let o = {
      container: dom,
      video: {
        url: url,
      },
    } as DPlayerOptions;
    if (danmaku != "") {
      o.danmaku = {
        addition: [danmaku],
        id: "",
        api: "",
      }
    }
    if (vtt != "") {
      o.subtitle = {
        url: vtt,
      }
    }
    return new DPlayer(o)
  }
}


</script>


<style scoped></style>
