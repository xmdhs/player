export interface dplayerDm {
    code: number,
    /** second, position, color, sn, text */
    data: [
        number,
        number,
        number,
        string,
        string,
    ][]
}
export let cors = (globalThis as any)?._player?.cors as string || 'https://cors.xmdhs.com/'

export let apiAddr = (globalThis as any)?._player?.api as string || ''

export function setCors(url: string) {
    cors = url
}

export function setApiAddr(url: string) {
    apiAddr = url
}