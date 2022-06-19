import { LocalStore, RemoteStore } from "./store";
import { apiAddr, dplayerDm } from "./interface";

const store = (() => {
    if ((globalThis as any)?._player?.api as string) {
        return new RemoteStore<string[]>(() => (globalThis as any)?._player?.cors as string)
    }

    if ((window as any)["runtime"]) {
        return new RemoteStore<string[]>(() => apiAddr)
    }

    return new LocalStore<string[]>();
})()


export async function addblock(key: string, value: string) {
    let l: string[] = []
    try {
        l = await store.get(key);
    } catch (e) { }
    if (l.includes(value)) {
        return;
    }
    l.push(value)
    await store.set(key, l);
}

export async function unblock(key: string, value: string) {
    let l = await store.get(key);
    if (l) {
        await store.set(key, l.filter(x => x != value));
    }
}

export async function getBlocked(key: string) {
    return await store.get(key);
}

export function danmakuFilter(danmaku: dplayerDm, blockUser: string[], blockWord: string[]) {
    let d: dplayerDm = { code: 0, data: [] }
    d.data.push(...danmaku.data)
    if (blockUser.length > 0) {
        d.data = d.data.filter(x => !blockUser.includes(x[3]))
    }
    if (blockWord.length > 0) {
        d.data = d.data.filter(x => !blockWord.some(y => new RegExp(y).test(x[4])))
    }
    return d
}