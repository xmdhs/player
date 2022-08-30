<template>
    <n-space justify="center" align="center">
        <div style="width: 25em;max-width: 100%;">
            <n-card title="B站扫码登录" size="large">
                <n-skeleton :repeat="7" text v-if="qrLoading"></n-skeleton>
                <div v-show="!qrLoading" style="height: 15em;max-height:100%">
                    <n-space justify="center" align="center">
                        <canvas style="height: 100%;width:100%;" ref="canvasRef"></canvas>
                    </n-space>
                </div>
                <n-p>扫码登录 b 站以解析 b 站视频流。这不会把你的密码等信息发送到任何除 b 站以外的地方。</n-p>
            </n-card>
        </div>
    </n-space>
</template>

<script setup lang="ts">
import { NCard, NSkeleton, NSpace, useNotification, NP, useMessage } from 'naive-ui'
import { onMounted, onUnmounted, ref } from 'vue';
import QRCode from 'qrcode'
import { cors } from '@/utils/interface'
import { NError } from '@/utils/Nnotification'
import { useRouter } from 'vue-router';
import { useBilibili } from '@/store/bilibili';

const qrLoading = ref(true);
const notification = useNotification()
const canvasRef = ref<HTMLElement | null>(null);
const message = useMessage()
const router = useRouter()
const store = useBilibili()

onMounted(start)

let out = false

onUnmounted(() => {
    out = true
})

async function start() {
    out = false
    let oauthKey = ""
    let url: string;
    try {
        let f = await fetch(cors + "https://passport.bilibili.com/qrcode/getLoginUrl")
        let r = await f.json() as apiRoot<Data>
        url = r?.data?.url
        oauthKey = r?.data?.oauthKey
    } catch (e) {
        ErrMsg(String(e))
        console.error(e)
        return
    }
    if (url == "") {
        ErrMsg("获取登录二维码失败")
        return
    }
    await QRCode.toCanvas(canvasRef.value, url, function (error) {
        if (error) {
            ErrMsg("生成二维码失败")
            console.error(error)
            return
        }
    })
    qrLoading.value = false
    check(oauthKey)
}

async function check(oauthKey: string): Promise<void> {
    if (out) return;
    let f = await fetch(cors + "https://passport.bilibili.com/qrcode/getLoginInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            oauthKey: oauthKey
        })
    })
    let r = await f.json() as apiRoot<{ url: string } | number>
    const data = r?.data
    if (r.code == 0 && typeof data == "object" && "url" in data) {
        let u = new URL(data.url)
        store.$patch({
            DedeUserID: u.searchParams.get("DedeUserID") ?? "",
            DedeUserID__ckMd5: u.searchParams.get("DedeUserID__ckMd5") ?? "",
            SESSDATA: u.searchParams.get("SESSDATA") ?? "",
            bili_jct: u.searchParams.get("bili_jct") ?? "",
            logined: true
        })
        router.back()
        return
    }
    if (data === -5 || data === -4) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return check(oauthKey)
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.warning("二维码失效，请重新扫码")
    return start()
}

function ErrMsg(msg: string) {
    return NError(notification, msg)
}

interface apiRoot<T> {
    code: number
    status: boolean
    ts: number
    data: T
}

interface Data {
    url: string
    oauthKey: string
}

</script>