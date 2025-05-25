<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card class="elevation-12" max-width="500" width="100%">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Registrar Usuario</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="registrar">
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
          <v-select
            v-model="rol"
            :items="roles"
            label="Rol"
            prepend-icon="mdi-account-group"
            required
          ></v-select>
          <v-btn color="primary" type="submit" block>Registrar</v-btn>
          <v-btn color="secondary" block class="mt-2" @click="volver">Volver al Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api'
import { useUsuarioStore } from '@/stores/usuario'

export default {
  data: () => ({
    cedula: '',
    clave: '',
    rol: '',
    roles: ['administrador', 'matriculador', 'profesor', 'alumno'],
  }),
  methods: {
    async registrar() {
      try {
        const response = await api.post('/auth/registro', {
          cedula: this.cedula,
          clave: this.clave,
          rol: this.rol,
        })
        const usuarioStore = useUsuarioStore()
        usuarioStore.iniciarSesion({
          cedula: this.cedula,
          rol: this.rol,
          token: response.data.token,
        })
        this.$router.push('/')
      } catch (error) {
        console.error('Error al registrar:', error.message)
        alert(`Error al registrar: ${error.response?.data?.message || error.message}`)
      }
    },
    volver() {
      this.$router.push('/login')
    },
  },
}
</script>
