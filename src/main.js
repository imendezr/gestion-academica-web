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
//import webSocketService from './services/websocket'
//import { useUsuarioStore } from './stores/usuario'

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

/* // Configurar WebSocket después de que la store esté disponible
const usuarioStore = useUsuarioStore()

// Conectar WebSocket si el usuario está autenticado al iniciar
if (usuarioStore.token) {
  webSocketService.connect()
}

// Escuchar cambios en el token para conectar/desconectar WebSocket
usuarioStore.$subscribe((mutation, state) => {
  if (state.token && !webSocketService.socket) {
    webSocketService.connect()
  } else if (!state.token && webSocketService.socket) {
    webSocketService.disconnect()
  }
}) */

app.mount('#app')
