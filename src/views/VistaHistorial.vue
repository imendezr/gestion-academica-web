<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <TablaDatos
      :headers="headers"
      :items="historial"
      titulo="Historial Académico"
      :show-actions="false"
    />
  </v-container>
</template>

<script>
import TablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'
import { useUsuarioStore } from '@/stores/usuario'

export default {
  components: { TablaDatos, ComponenteNotificacion },
  data: () => ({
    historial: [],
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Ciclo', value: 'ciclo' },
      { text: 'Curso', value: 'curso' },
      { text: 'Nota', value: 'nota' },
    ],
  }),
  async created() {
    await this.cargarHistorial()
  },
  methods: {
    async cargarHistorial() {
      try {
        const usuarioStore = useUsuarioStore()
        const cedula = usuarioStore.cedula
        const response = await api.get(`/historial/${cedula}`)
        this.historial = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar el historial: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
  },
}
</script>
