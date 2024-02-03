import { cors, dplayerDm } from "@/utils/interface"
import { vtttime } from "@/utils/vtt"

const cidapi = () => (cors + `https://api.bilibili.com/x/player/pagelist?`)
const zmapi = () => (cors + `https://api.bilibili.com/x/player/v2?`)
const dmapi = () => (cors + "https://api.bilibili.com/x/v1/dm/list.so?")
const ep2cid = () => (cors + `https://api.bilibili.com/pgc/view/web/season?`)

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
    let f = await fetch(cidapi() + uq.toString())
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
    let f = await fetch(ep2cid() + uq.toString())
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

export async function getDM(cid: string): Promise<dplayerDm> {
    let q = new URLSearchParams()
    q.set("oid", cid)
    let f = await fetch(dmapi() + q.toString())
    let t = await f.text()
    return bil2dp(t)
}

function bil2dp(t: string): dplayerDm {
    let parser = new DOMParser();
    let dom = parser.parseFromString(t, "application/xml");
    let dlist = dom.getElementsByTagName("d")

    let d: dplayerDm = { code: 0, data: [] }


    f: for (const v of Array.from(dlist)) {
        let l: dplayerDm["data"][0] = [0, 0, 0, "", ""]
        const t = v.getAttribute("p")?.split(",")
        if (!t || v.textContent == null) {
            continue
        }
        l[0] = parseFloat(t[0])
        switch (parseInt(t[1])) {
            case 1:
            case 2:
            case 3:
                l[1] = 0
                break;
            case 4:
                l[1] = 2
                break;
            case 5:
                l[1] = 1
                break;
            default:
                l[1] = 0
                break;
        }
        l[2] = parseFloat(t[3])
        l[3] = "[BiliBili]" + t[6]
        l[4] = v.textContent
        d.data.push(l)
    }
    return d
}

export async function getZm(bvid: string, cid: string): Promise<{ lan_doc: string, subtitle_url: string }[]> {
    let q = new URLSearchParams()
    q.set("cid", cid)
    q.set("bvid", bvid)
    let f = await fetch(zmapi() + q.toString())
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


export function dp2bili(d: dplayerDm): string {
    const parser = new DOMParser();
    const dom = parser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?><i></i>`, "application/xml");
    const idom = dom.querySelector("i")

    for (const v of d.data) {
        const d = document.createElement("d")
        const attr = []
        attr.push(String(v[0])) //0
        switch (v[1]) {
            case 0:
                attr.push("1") //1
                break
            case 1:
                attr.push("5") //1
                break
            case 2:
                attr.push("4") //1
                break
            default:
                attr.push("1") //1
        }
        attr.push("25") //2
        attr.push(v[2]) //3
        attr.push("0") //4
        attr.push("0") //5
        attr.push("0") //6
        attr.push("0") //7

        d.setAttribute("p", attr.join(","))
        d.textContent = v[4]
        idom?.appendChild(d)
    }
    
    return new XMLSerializer().serializeToString(dom)
}