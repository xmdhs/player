<template>
    <div ref="dplayer"></div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue';
import { DPlayer, DPlayerOptions, dp } from '../types/Dplayer';

const dplayer = ref<HTMLElement | null>(null);

const props = defineProps<{
    danmaku: string
    vtt: string
    url: string
}>();

let d: dp
let dmlink: string
let vttlink: string
let hls: any

watchEffect(() => {
    clean()
    if (dplayer.value) {
        dplayer.value.className = ""
        d = newPlayer(props.danmaku, props.vtt, dplayer.value, props.url);
    }
})

onUnmounted(() => {
    clean()
});


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
        if (url.endsWith(".m3u8") && Hls.isSupported()) {
            o.video!.type = "customHls"
            o.video!.customType = {
                customHls: function (video: HTMLVideoElement, player: any) {
                    hls = new Hls();
                    hls.loadSource(video.src);
                    hls.attachMedia(video);
                },

            }
        }

        return new DPlayer(o)
    }
}


</script>

<script lang="ts">
declare var Hls: {
    isSupported: () => boolean
    new (): any
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