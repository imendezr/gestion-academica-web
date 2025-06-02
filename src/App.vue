<script setup>
import { RouterView } from 'vue-router'
import BarraNavegacion from './components/ComponenteBarraNavegacion.vue'
import MenuLateral from './components/ComponenteMenuLateral.vue'
import { useUsuarioStore } from '@/stores/usuario'
import { computed, ref, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

const usuarioStore = useUsuarioStore()
const route = useRoute()

// Mejorar la condición de autenticación
const estaAutenticado = computed(() => {
  return usuarioStore.idUsuario &&
         usuarioStore.idUsuario !== null &&
         usuarioStore.idUsuario !== undefined &&
         usuarioStore.idUsuario !== ''
})

// Ocultar menú en rutas públicas
const esRutaPublica = computed(() => {
  const rutasPublicas = ['/login', '/register']
  return rutasPublicas.includes(route.path)
})

// Mostrar menú solo si está autenticado Y no es ruta pública
const mostrarMenu = computed(() => {
  return estaAutenticado.value && !esRutaPublica.value
})

const { lgAndUp } = useDisplay()
const drawer = ref(false)

onMounted(() => {
  // Solo mostrar el sidebar si está autenticado y en pantallas grandes
  if (lgAndUp.value && estaAutenticado.value) {
    drawer.value = true
  }
})

// Observar cambios en autenticación para controlar el drawer
watch(estaAutenticado, (nuevoValor) => {
  if (!nuevoValor) {
    drawer.value = false
  } else if (lgAndUp.value) {
    drawer.value = true
  }
})

// Debug - remover en producción
watch([estaAutenticado, esRutaPublica, mostrarMenu], ([auth, publica, menu]) => {
  console.log('Debug - Auth:', auth, 'Ruta pública:', publica, 'Mostrar menú:', menu)
})
</script>

<template>
  <v-app>
    <BarraNavegacion @toggle-drawer="drawer = !drawer" />
    <v-navigation-drawer
      v-if="mostrarMenu"
      v-model="drawer"
      app
      :temporary="$vuetify.display.mdAndDown"
    >
      <MenuLateral />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
