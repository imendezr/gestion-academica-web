<script setup>
import { RouterView } from 'vue-router'
import BarraNavegacion from './components/ComponenteBarraNavegacion.vue'
import MenuLateral from './components/ComponenteMenuLateral.vue'
import { useUsuarioStore } from '@/stores/usuario'
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

const usuarioStore = useUsuarioStore()
const estaAutenticado = computed(() => !!usuarioStore.token)
const { lgAndUp } = useDisplay()
const drawer = ref(false)

onMounted(() => {
  // Mostrar el sidebar por defecto en pantallas grandes
  if (lgAndUp.value) {
    drawer.value = true
  }
})
</script>

<template>
  <v-app>
    <BarraNavegacion @toggle-drawer="drawer = !drawer" />
    <v-navigation-drawer
      v-if="estaAutenticado"
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

<script>
export default {
  data: () => ({
    drawer: false, // Cerrado por defecto
  }),
}
</script>
