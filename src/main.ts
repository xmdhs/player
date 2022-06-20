import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { CorsServer,ApiServer } from './wails/App'
import { setCors,setApiAddr } from './utils/interface'

(async () => {
    try {
        let n = await CorsServer()
        setCors(`http://127.0.0.1:${n}/`)
        let apip = await ApiServer()
        setApiAddr(`http://127.0.0.1:${apip}/`)
    } catch (e) {
        console.debug(e)
    }
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
})()
