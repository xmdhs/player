import { dplayerDm } from './interface'
import { parse } from '@plussub/srt-vtt-parser'
import { vtttime } from "./vtt"

export function dmoffset(dm: dplayerDm, offset: number): dplayerDm {
    for (const v of dm.data) {
        v[0] += offset / 1000
    }
    return dm
}

export function vttoffset(vtt: string, offset: number): string {
    const data = parse(vtt)
    let s = "WEBVTT\n\n"
    for (const e of data.entries) {
        s += `${vtttime(e.from + offset)} --> ${vtttime(e.to + offset)}\n${e.text}\n\n`
    }
    return s
}
