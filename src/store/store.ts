import { InjectionKey } from "vue"
import { createStore, Store, useStore as baseUseStore } from "vuex"
import { vuexLocal } from "@/store/persist"
import { AllState, RootState } from "@/store/interface"
import { bilibili } from "@/store/modules/bilibili"

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
    state() {
        return {
            count: 0,
            isWeb: true,
        }
    },
    mutations: {
        setIsWeb(state, isWeb: boolean) {
            state.isWeb = isWeb
        },
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

