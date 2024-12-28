import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './registerServiceWorker'
import axios from 'axios'
import { getToken } from './services/authService'

// Füge bei jedem Request automatisch das JWT-Token hinzu (falls vorhanden)
axios.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

loadFonts().then(() => {
    createApp(App)
        .use(vuetify)
        .mount('#app')
})
