import { InjectionKey } from "vue"
import { createStore, Store, useStore as baseUseStore } from "vuex"


export interface State {
    count: number,
    isWeb: boolean,
    resolution: string,
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
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
})

export function useStore() {
    return baseUseStore(key)
}

