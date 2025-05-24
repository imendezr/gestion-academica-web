<script setup>
import { RouterView } from 'vue-router'
import BarraNavegacion from './components/ComponenteBarraNavegacion.vue'
import MenuLateral from './components/ComponenteMenuLateral.vue'
import { useUsuarioStore } from '@/stores/usuario'
import { computed } from 'vue'

const usuarioStore = useUsuarioStore()
const estaAutenticado = computed(() => !!usuarioStore.token)
</script>

<template>
  <v-app>
    <BarraNavegacion @toggle-drawer="drawer = !drawer" />
    <v-navigation-drawer v-if="estaAutenticado" v-model="drawer" app temporary>
      <MenuLateral />
    </v-navigation-drawer>
    <v-main>
      <v-container fluid class="fill-height pa-0 ma-0">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false, // Cerrado por defecto
  }),
}
</script>

<style scoped>
.v-app {
  width: 100vw; /* Forzar el ancho completo */
}

.v-main {
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 100%;
  padding: 0;
}

.v-container {
  height: 100%;
  width: 100%;
  margin: 0;
}

/* Ajustar el drawer para que no interfiera */
@media (min-width: 960px) {
  .v-navigation-drawer {
    display: none;
  }
}
</style>
