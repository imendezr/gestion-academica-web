<template>
  <v-app-bar app color="primary" dark>
    <!-- Ícono para abrir el drawer en usuarios autenticados -->
    <v-app-bar-nav-icon v-if="estaAutenticado" @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>

    <!-- Título -->
    <v-toolbar-title class="title-flex">Gestión Académica</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Botón de Cerrar Sesión -->
    <v-btn
      v-if="estaAutenticado"
      :icon="$vuetify.display.mdAndDown"
      @click="cerrarSesion"
      class="ml-2"
    >
      <v-icon>mdi-logout</v-icon>
      <span v-if="!$vuetify.display.mdAndDown" class="ml-1">Cerrar Sesión</span>
    </v-btn>
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

    const estaAutenticado = computed(() => !!usuarioStore.idUsuario)

    const cerrarSesion = () => {
      usuarioStore.cerrarSesion()
      router.push('/login')
    }

    return { cerrarSesion, estaAutenticado }
  },
}
</script>

<style scoped>
/* Estilo para el título */
.title-flex {
  white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  flex: 1 1 auto; /* Permite que el título crezca y se ajuste al espacio disponible */
  overflow: hidden; /* Oculta el desborde */
  text-overflow: ellipsis; /* Agrega "..." si el texto se desborda */
}

/* En pantallas pequeñas, damos más prioridad al título */
@media (max-width: 959px) {
  .title-flex {
    max-width: calc(100% - 120px); /* Ajusta según el espacio ocupado por íconos */
  }
}

/* En pantallas grandes, el título puede ocupar más espacio */
@media (min-width: 960px) {
  .title-flex {
    max-width: 50%; /* Limita el ancho máximo para mantener el diseño balanceado */
  }
}
</style>
