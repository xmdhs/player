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
export let cors = 'https://cors.xmdhs.com/'

export function setCors(url: string) {
    cors = url
}