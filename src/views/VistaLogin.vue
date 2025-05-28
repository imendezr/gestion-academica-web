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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario'
import api from '@/services/api'

const router = useRouter()
const usuarioStore = useUsuarioStore()
usuarioStore.cargarUsuarioLocalStorage()

const cedula = ref('')
const clave = ref('')

const iniciarSesion = async () => {
  try {
    console.log('Intentando iniciar sesión con', { cedula: cedula.value, clave: clave.value })

    const response = await api.login(cedula.value, clave.value)
    console.log('Respuesta del servidor:', response)

    if (!response.data || !response.data.idUsuario) {
      throw new Error('Datos de usuario no válidos')
    }

    usuarioStore.iniciarSesion({
      idUsuario: response.data.idUsuario,
      cedula: cedula.value,
      clave: clave.value,
      tipo: response.data.tipo,
    })

    router.push('/')
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
    alert(`Error al iniciar sesión: ${error.response?.data?.message || error.message}`)
  }
}
</script>
