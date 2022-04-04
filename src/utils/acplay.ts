import { dplayerDm, cors } from "./interface"

const commentApiAddr = cors + `https://api.acplay.net/api/v2/comment`
const searchApiAddr = cors + `https://api.acplay.net/api/v2/search/episodes?`

export async function searchanime(key: string): Promise<SearchObject> {
    let u = new URLSearchParams()
    u.append('anime', key)
    let f = await fetch(searchApiAddr + u.toString(), {
        referrerPolicy: "origin"
    })
    let j = await f.json() as SearchObject
    return j
}

export async function getDm(episodeId: number): Promise<dplayerDm> {
    const f = await fetch(`${commentApiAddr}/${episodeId}?withRelated=true&chConvert=1`, {
        referrerPolicy: "origin"
    })
    const j = await f.json() as CommentObject
    let dm: dplayerDm = {
        code: 0,
        data: []
    }
    for (const v of j.comments) {
        const [second, type, color, name] = v.p.split(',')
        let dptype = 0
        switch (type) {
            case "1":
                dptype = 0
                break
            case "4":
                dptype = 2
                break
            case "5":
                dptype = 1
                break
        }
        const d = [Number(second), dptype, Number(color), String(v.cid), v.m] as dplayerDm['data'][0]
        dm.data.push(d)
    }
    return dm
}

interface Episode {
    episodeId: number;
    episodeTitle: string;
}

interface Anime {
    animeId: number;
    animeTitle: string;
    type: string;
    typeDescription: string;
    episodes: Episode[];
}

export interface SearchObject {
    hasMore: boolean;
    animes: Anime[];
    errorCode: number;
    success: boolean;
    errorMessage: string;
}

export interface Comment {
    cid: number;
    p: string;
    m: string;
}

export interface CommentObject {
    count: number;
    comments: Comment[];
}