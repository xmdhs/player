<template>
  <header :class="$style.header">
    <nav class="container-fluid">
      <ul>
        <li>
          <a href="/">
            <strong>播放器</strong>
          </a>
        </li>
      </ul>
      <ul></ul>
    </nav>
  </header>
  <main class="container">
    <div id="in" v-if="!finish" style="display: flex;column-gap: 10px;">
      <input type="text" v-model="url" v-if="showUrlIn" style="max-width: 20em;" />
      <button @click="Form" style="max-width: 5em;">播放</button>
    </div>
    <div v-if="!root">
      <div v-show="finish">
        <div ref="dplayer"></div>
        <br />
      </div>
      <div :class="$style.form" v-if="!finish">
        <div :class="$style.input">
          <input type="text" v-model.trim="bilDanmaku" placeholder="弹幕 bvid / epid" />
          <input type="tel" v-model.trim="bahaDm" placeholder="baha 弹幕 sn" />
          <input type="text" v-model.trim="bzimu" placeholder="字幕 bvid / epid" />
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
      <selVue msg="选择弹幕 cid" :list="dmcidlist" @set="dmCidset" v-if="dmcidlist.length != 0"></selVue>
      <selVue msg="选择字幕" :list="zmlist" @set="zmset" v-if="zmlist.length != 0"></selVue>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { bilZm2vtt, getbilCidS, getBilZm, getDM, getZm } from './utils/bilapi';
import { dplayerDm, getDm as getBahaDm } from './utils/baha';
import waitgroup from './utils/WaitGroup';
import selVue from './components/sel.vue';
import { DPlayer, DPlayerOptions, DPlayerEvents, dp } from './types/Dplayer';

const dplayer = ref<HTMLElement | null>(null);
const bilDanmaku = ref('');
const url = ref("")
const bahaDm = ref("")
const bzimu = ref("")
const finish = ref(false)
const showUrlIn = ref(true)
const zm = ref("")
const root = ref(true)
const dmcidlist = ref([] as { v: string, key: string }[])
const zmlist = ref([] as { v: string, key: string }[])
const danmaku = ref("")

let u = new URL(location.href)
const file = u.searchParams.get('video')
if (typeof file == "string" && file != "") {
  url.value = file
  showUrlIn.value = false
  root.value = false
  document.title = file
}

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
    let l: { v: string, key: string }[] = []
    r.data.forEach(v => {
      l.push({ v: String(v.cid), key: v.part })
    })
    bilDanmaku.value = r.bvid
    dmcidlist.value = l
  }
  if (bzimu.value != "") {
    has = true
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
  if (!(dplayer.value instanceof HTMLElement)) {
    console.warn("dplayer is not find")
    return
  }
  newPlayer(danmaku.value, zm.value, dplayer.value, url.value)
}

let zmsetdo = false
const zmset = async (v: string) => {
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
    zm.value = bilZm2vtt(r)
  }
  wait.done()
}

const dmCidset = async (cid: string) => {
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
}

function newPlayer(danmaku: string, vtt: string, dplayer: HTMLElement, url: string) {
  let [dmlink, vttlink] = ["", ""]
  if (danmaku != "") {
    let blob = new Blob([danmaku])
    dmlink = URL.createObjectURL(blob)
  }
  if (vtt != "") {
    let blob = new Blob([vtt])
    vttlink = URL.createObjectURL(blob)
  }
  let d = newDp(url, dmlink, vttlink, dplayer)
  d.on("play" as DPlayerEvents, () => {
    dmlink != "" && URL.revokeObjectURL(dmlink)
    vttlink != "" && URL.revokeObjectURL(vttlink)
  })
  function newDp(url: string, danmaku: string, vtt: string, dom: HTMLElement): dp {
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
        bottom: "5%",
        fontSize: "4vmin"
      }
    }
    return new DPlayer(o)
  }
}

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
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
}

.header {
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 30px;
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