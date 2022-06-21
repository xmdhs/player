import VuexPersistence from 'vuex-persist'
import { AllState } from "./interface"


export const vuexLocal = new VuexPersistence<AllState>({
    storage: window.localStorage,
    reducer(state) {
        return state
    }
})