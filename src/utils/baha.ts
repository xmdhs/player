import { cors } from "./bilapi"


const dmapi = cors + `https://ani.gamer.com.tw/ajax/danmuGet.php?`

export async function getDm(sn: number): Promise<dplayerDm> {
    let u = new URLSearchParams()
    u.append('sn', sn.toString())
    let f = await fetch(dmapi, {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "referrer": "https://ani.gamer.com.tw/animeVideo.php?" + u.toString(),
        body: u.toString(),
        method: "POST",
    });
    let j = await f.json() as bahaDM[]
    let dm = {} as dplayerDm
    dm.code = 0
    dm.data = []
    for (const v of j) {
        dm.data.push([
            v.time / 10,
            v.position ? v.position : 0,
            color2Number(v.color),
            String(v.sn),
            v.text
        ])
    }
    return dm
}

interface bahaDM {
    text: string,
    color: string,
    position: number,
    time: number,
    sn: number,
}

interface dplayerDm {
    code: number,
    data: [
        number,
        number,
        number,
        string,
        string,
    ][]
}



function color2Number(color: string) {
    if (color[0] === '#') {
        color = color.substr(1);
    }
    if (color.length === 3) {
        color = `${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`;
    }
    return (parseInt(color, 16) + 0x000000) & 0xffffff;
}