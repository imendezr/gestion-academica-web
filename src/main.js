import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#B0BEC5',
          accent: '#4CAF50',
          error: '#D32F2F',
          background: '#F5F5F5',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
