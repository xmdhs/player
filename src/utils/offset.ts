import { dplayerDm } from './interface'
import { parse } from '@plussub/srt-vtt-parser'
import { bilZm2vtt, bilZmR } from './bilapi'

export function dmoffset(dm: dplayerDm, offset: number): dplayerDm {
    for (const v of dm.data) {
        v[0] += offset / 1000
    }
    return dm
}

export function vttoffset(vtt: string, offset: number): string {
    const data = parse(vtt)
    let v: bilZmR["body"] = []
    let i = 0
    for (const e of data.entries) {
        v.push({
            content: e.text,
            from: e.from += offset,
            to: e.to += offset,
            location: i++
        })
    }
    return bilZm2vtt(v)
}
