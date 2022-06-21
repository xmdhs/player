export interface AllState extends RootState {
    bilibili: bilState
}


export interface RootState {
    count: number,
    isWeb: boolean,
    resolution: string,
}

export interface bilState {
    DedeUserID: string,
    DedeUserID__ckMd5: string,
    SESSDATA: string,
    bili_jct: string,
    logined: boolean,
}
