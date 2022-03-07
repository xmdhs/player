import { createApp, defineCustomElement } from 'vue'
import App from './App.vue'
import '@picocss/pico'


import Dplayer from './components/Dplayer.ce.vue'

const DplayerElement = defineCustomElement(Dplayer)
customElements.define('d-player', DplayerElement)

createApp(App).mount('#app')
