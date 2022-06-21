import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store/store'
import { CorsServer, ApiServer } from './wails/App'
import { setCors, setApiAddr, apiAddr } from './utils/interface'

(async () => {
    try {
        let n = await CorsServer()
        setCors(`http://127.0.0.1:${n}/`)
        let apip = await ApiServer()
        setApiAddr(`http://127.0.0.1:${apip}/`)
    } catch (e) {
        console.debug(e)
    }
    apiAddr != "" ? store.commit('setIsWeb', false) : store.commit('setIsWeb', true)
    const app = createApp(App)
    app.use(router)
    app.use(store, key)
    app.mount('#app')
})()
