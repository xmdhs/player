import { Module } from "vuex";
import { bilState, RootState } from "../interface"



export const bilibili: Module<bilState, RootState> = {
    namespaced: true,
    state: {
        DedeUserID: "",
        DedeUserID__ckMd5: "",
        SESSDATA: "",
        bili_jct: "",
        logined: false,
    },
    mutations: {
        setLogin(state, o: bilState) {
            state.DedeUserID = o.DedeUserID || "";
            state.DedeUserID__ckMd5 = o.DedeUserID__ckMd5 || "";
            state.SESSDATA = o.SESSDATA || "";
            state.bili_jct = o.bili_jct || "";
            state.logined = o.logined;
        },

    },
}
