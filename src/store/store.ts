import { InjectionKey } from "vue"
import { createStore, Store, useStore as baseUseStore } from "vuex"
import { vuexLocal } from "./persist"
import { AllState, RootState } from "./interface"
import { bilibili } from "./modules/bilibili"

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
    state() {
        return {
            count: 0,
            isWeb: true,
            resolution: "120"
        }
    },
    mutations: {
        setIsWeb(state, isWeb: boolean) {
            state.isWeb = isWeb
        },
        setResolution(state, resolution: string) {
            state.resolution = resolution
        }
    },
    actions: {
        increment(context) {
            context.commit('increment')
        }
    },
    plugins: [
        vuexLocal.plugin as any
    ],
    modules: {
        bilibili: bilibili
    }
})

export function useStore<T = AllState>() {
    return baseUseStore<T>(key)
}

