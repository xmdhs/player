import { cors } from "./interface"
import { vtttime } from "./vtt"

const cidapi = cors + `https://api.bilibili.com/x/player/pagelist?`
const zmapi = cors + `https://api.bilibili.com/x/player/v2?`
const dmapi = `https://auto.xmdhs.com/getdm?`
const ep2cid = cors + `https://api.bilibili.com/pgc/view/web/season?`

export async function getbilCidS(b: string): Promise<{ data: bilCidR["data"], bvid: string }> {
    let q = ""
    if (b.startsWith("BV")) {
        q = "bvid"
    } else if (b.startsWith("av")) {
        q = "aid"
        b = b.substring(2)
    } else if (b.startsWith("ep")) {
        return getepidCid(Number(b.substring(2)))
    }
    let uq = new URLSearchParams()
    uq.set(q, b)
    let f = await fetch(cidapi + uq.toString())
    let j = await f.json() as bilCidR
    if (j.code != 0) {
        throw ["api 报错", j]
    }
    return { data: j.data, bvid: b }
}

interface bilCidR extends apiData {
    data: {
        cid: number
        part: string
    }[]
}

interface apiData {
    code: number
    message: string
}

interface epidR extends apiData {
    result: {
        episodes: {
            cid: number
            long_title: string
            id: number
            bvid: string
        }[]
    }
}

async function getepidCid(epid: number): Promise<{ data: bilCidR["data"], bvid: string }> {
    let uq = new URLSearchParams()
    uq.set("ep_id", epid.toString())
    let f = await fetch(ep2cid + uq.toString())
    let j = await f.json() as epidR
    if (j.code != 0) {
        throw ["api 报错", j]
    }
    let o = [] as bilCidR["data"]
    let bvid = ""
    for (let i of j.result.episodes) {
        if (i.id == epid) {
            o.push({ cid: i.cid, part: i.long_title })
            bvid = i.bvid
            break
        }
    }
    return { data: o, bvid: bvid }
}

export async function getDM(cid: string): Promise<string> {
    await fetchAndInstantiate()
    let q = new URLSearchParams()
    q.set("cid", cid)
    let f = await fetch(dmapi + q.toString())
    let t = await f.text()
    let s = bil2dp(t)
    if (typeof (s as { err: string }).err != "undefined") {
        throw (s as { err: string }).err
    }
    return s as string;
}

let go = new Go();
let has = false;
async function fetchAndInstantiate() {
    if (has) {
        return
    }
    const response = await fetch("https://static.xmdhs.com/ip@1.wasm");
    const buffer = await response.arrayBuffer();
    const obj = await WebAssembly.instantiate(buffer, go.importObject)
    go.run(obj.instance);
    has = true
}
fetchAndInstantiate();

declare function bil2dp(s: string): { err: string } | string

export async function getZm(bvid: string, cid: string): Promise<{ lan_doc: string, subtitle_url: string }[]> {
    let q = new URLSearchParams()
    q.set("cid", cid)
    q.set("bvid", bvid)
    let f = await fetch(zmapi + q.toString())
    let j = await f.json()
    if (j.code != 0) {
        throw ["api 报错", j]
    }
    return j.data.subtitle.subtitles
}

export async function getBilZm(url: string): Promise<bilZmR> {
    if (url.startsWith("//")) {
        url = "https:" + url
    }
    let f = await fetch(cors + url)
    let j = await f.json() as bilZmR
    return j
}

export interface bilZmR {
    body: {
        content: string
        from: number
        to: number
        location: number
    }[]
}

export function bilZm2vtt(zm: bilZmR["body"]): string {
    let s = "WEBVTT\n\n"
    zm.forEach(b => {
        s += `${vtttime(b.from * 1000)} --> ${vtttime(b.to * 1000)}\n${b.content}\n\n`
    })
    return s
}


