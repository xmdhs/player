import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { CorsServer, ApiServer } from '@/wails/App'
import { setCors, setApiAddr, apiAddr } from '@/utils/interface'
import { createWebHashHistory } from 'vue-router'
import { useStore } from '@/store/store'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

(async () => {
    try {
        let n = await CorsServer()
        setCors(`http://127.0.0.1:${n}/`)
        let apip = await ApiServer()
        setApiAddr(`http://127.0.0.1:${apip}/`)
    } catch (e) {
        console.debug(e)
    }
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)

    const app = createApp(App)
    app.use(pinia)

    const store = useStore()
    apiAddr != "" ? store.isWeb = false : store.isWeb = true


    if ((window as any)["runtime"]) {
        app.use(router(createWebHashHistory()))
    } else {
        app.use(router())
    }
    app.mount('#app')
})()
