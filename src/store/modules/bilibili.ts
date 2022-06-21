import { Module } from "vuex";
import { bilState, RootState } from "@/store/interface"



export const bilibili: Module<bilState, RootState> = {
    namespaced: true,
    state: {
        DedeUserID: "",
        DedeUserID__ckMd5: "",
        SESSDATA: "",
        bili_jct: "",
        logined: false,
        resolution: "120"
    },
    mutations: {
        setLogin(state, o: {
            DedeUserID: string,
            DedeUserID__ckMd5: string,
            SESSDATA: string,
            bili_jct: string,
            logined: boolean,
        }) {
            state.DedeUserID = o.DedeUserID || "";
            state.DedeUserID__ckMd5 = o.DedeUserID__ckMd5 || "";
            state.SESSDATA = o.SESSDATA || "";
            state.bili_jct = o.bili_jct || "";
            state.logined = o.logined;
        },
        setResolution(state, resolution: string) {
            state.resolution = resolution
        }
    },
}
