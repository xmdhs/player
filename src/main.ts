import { createApp, defineCustomElement } from 'vue'
import App from './App.vue'
import router from './router'
import { CorsServer } from './utils/wails/App'
import { setCors } from './utils/interface'

(async () => {
    try {
        let n = await CorsServer()
        setCors(`http://127.0.0.1:${n}/`)
    } catch (e) {
        console.debug(e)
    }
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
})()
