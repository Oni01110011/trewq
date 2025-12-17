import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './registerServiceWorker'

loadFonts().then(() => {
    createApp(App)
        .use(vuetify)
        .mount('#app')
})
