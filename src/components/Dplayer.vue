<template>
    <div ref="dplayer"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { DPlayerOptions, DPlayerEvents } from 'dplayer';
import DPlayer from 'dplayer';
import { WindowFullscreen, WindowUnfullscreen } from '@/wails/runtime/runtime'
import { NError } from '@/utils/Nnotification'
import { useNotification } from 'naive-ui';
import Hls from 'hls.js'
import mpegts from 'mpegts.js'
import ASS from 'assjs';

const dplayer = ref<HTMLElement | null>(null);
const nontification = useNotification()

const props = defineProps<{
    danmaku: string
    vtt: string
    url: string
    ass?: string
}>();

let d: DPlayer
let dmlink: string
let vttlink: string
let hls: any

let oldanmaku: string
let oldurl: string

watch(props, v => {
    if (v.danmaku != oldanmaku) {
        oldanmaku = v.danmaku
        dmlink != "" && URL.revokeObjectURL(dmlink)
        let blob = new Blob([v.danmaku])
        dmlink = URL.createObjectURL(blob);
        (d.danmaku as any).reload({
            addition: [dmlink],
            id: "",
            api: "",
        })
    }
    if (v.url == oldurl) {
        return
    }
    start()
})


function start() {
    clean()
    oldanmaku = props.danmaku
    oldurl = props.url
    if (dplayer.value) {
        try {
            dplayer.value.className = ""
            let vtt = props.vtt
            if (props.ass && props.ass != "") {
                vtt = "WEBVTT"
            }
            d = newPlayer(props.danmaku, vtt, dplayer.value, props.url);
            if ((window as any)["runtime"]) {
                d.on('fullscreen' as DPlayerEvents.fullscreen, () => {
                    WindowFullscreen()
                })
                d.on('fullscreen_cancel' as DPlayerEvents.fullscreen_cancel, () => {
                    WindowUnfullscreen()
                })
            }
            if (props.ass && props.ass != "") {
                d.video.removeAttribute("crossorigin")
            }
            d.on('loadeddata' as DPlayerEvents, async () => {
                if (props.ass && props.ass != "") {
                    let ass: ASS
                    let div: HTMLElement;
                    const parent = d.video.parentNode! as Element
                    const change = async () => {
                        parent.contains(div) && parent.removeChild(div)
                        div = document.createElement("div");
                        parent.appendChild(div)
                        await nextTick()
                        ass = new ASS(props.ass as string, d.video, {
                            container: div,
                            resampling: 'video_width',
                        });
                        div.style.position = "absolute"
                        div.style.top = "0px"
                    }
                    change()
                    d.on("fullscreen" as DPlayerEvents, () => {
                        (window as any)["runtime"] && WindowFullscreen()
                        change()
                    })
                    d.on("fullscreen_cancel" as DPlayerEvents, () => {
                        (window as any)["runtime"] && WindowUnfullscreen()
                        change()
                    })
                    d.on("subtitle_hide" as DPlayerEvents, () => parent.contains(div) && parent.removeChild(div))
                    d.on("subtitle_show" as DPlayerEvents, change)
                }

            })
        } catch (e) {
            NError(nontification, String(e))
            console.warn(e)
        }
    }
}

onMounted(start)
onUnmounted(clean);



function clean() {
    hls?.destroy();
    d?.destroy();
    dmlink != "" && URL.revokeObjectURL(dmlink)
    vttlink != "" && URL.revokeObjectURL(vttlink)
}


function newPlayer(danmaku: string, vtt: string, dplayer: HTMLElement, url: string) {
    [dmlink, vttlink] = ["", ""]
    if (danmaku != "") {
        let blob = new Blob([danmaku])
        dmlink = URL.createObjectURL(blob)
    }
    if (vtt != "") {
        let blob = new Blob([vtt])
        vttlink = URL.createObjectURL(blob)
    }
    let d = newDp(url, dmlink, vttlink, dplayer)
    return d
    function newDp(url: string, danmaku: string, vtt: string, dom: HTMLElement): DPlayer {
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
        const pathname = new URL(url).pathname
        if (pathname.endsWith(".m3u8") && Hls.isSupported()) {
            o.video!.type = "customHls"
            o.video!.customType = {
                customHls: function (video: HTMLVideoElement, player: any) {
                    hls = new Hls();
                    hls.loadSource(video.src);
                    hls.attachMedia(video);
                },

            }
        }
        if (pathname.endsWith(".flv")) {
            o.video!.type = "customflv"
            o.video!.customType = {
                customflv: function (video: HTMLVideoElement, player: any) {
                    const p = mpegts.createPlayer({
                        type: 'flv',
                        url: video.src,
                    }, {
                        stashInitialSize: 5000,
                    });
                    p.attachMediaElement(video);
                    p.load();
                },

            }
        }
        return new DPlayer(o)
    }
}


</script>

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