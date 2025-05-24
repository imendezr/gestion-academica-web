<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon v-if="estaAutenticado" @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
    <v-toolbar-title>Gestión Académica</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="estaAutenticado" text @click="cerrarSesion">Cerrar Sesión</v-btn>
  </v-app-bar>
</template>

<script>
import { useUsuarioStore } from '@/stores/usuario'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  setup() {
    const usuarioStore = useUsuarioStore()
    const router = useRouter()

    const estaAutenticado = computed(() => !!usuarioStore.token)

    const cerrarSesion = () => {
      usuarioStore.cerrarSesion()
      router.push('/login')
    }

    return { cerrarSesion, estaAutenticado }
  },
}
</script>
