<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card class="elevation-12" max-width="500" width="100%">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="iniciarSesion">
          <v-text-field
            v-model="cedula"
            label="Cédula"
            prepend-icon="mdi-account"
            required
          ></v-text-field>
          <v-text-field
            v-model="clave"
            label="Contraseña"
            prepend-icon="mdi-lock"
            type="password"
            required
          ></v-text-field>
          <v-btn color="primary" type="submit" block>Iniciar Sesión</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useUsuarioStore } from '@/stores/usuario'
//import api from '@/services/api'

export default {
  data: () => ({
    cedula: '',
    clave: '',
  }),
  methods: {
    async iniciarSesion() {
      try {
        // const response = await api.post('/auth/login', { cedula: this.cedula, clave: this.clave })
        console.log('Intentando iniciar sesión con', { cedula: this.cedula, clave: this.clave })
        const response = { data: { rol: 'administrador', token: 'mock-token' } } // Simulación
        const usuarioStore = useUsuarioStore()
        usuarioStore.iniciarSesion({
          cedula: this.cedula,
          rol: response.data.rol,
          token: response.data.token,
        })
        this.$router.push('/')
      } catch (error) {
        console.error('Error al iniciar sesión:', error.message)
        alert(`Error al iniciar sesión: ${error.response?.data?.message || error.message}`)
      }
    },
  },
}
</script>
