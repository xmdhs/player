export interface AllState extends RootState {
    bilibili: bilState
}


export interface RootState {
    isWeb: boolean,
}

export interface bilState {
    DedeUserID: string,
    DedeUserID__ckMd5: string,
    SESSDATA: string,
    bili_jct: string,
    logined: boolean,
    resolution: string,
}
