import { createApp, defineCustomElement } from 'vue'
import App from './App.vue'
import '@picocss/pico'
import router from './router'


import Dplayer from './components/Dplayer.ce.vue'

const DplayerElement = defineCustomElement(Dplayer)
customElements.define('d-player', DplayerElement)

const app = createApp(App)
app.use(router)
app.mount('#app')
