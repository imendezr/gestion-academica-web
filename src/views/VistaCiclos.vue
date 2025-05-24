<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <TablaDatos
      :headers="headers"
      :items="ciclos"
      titulo="Ciclos Académicos"
      @crear="mostrarFormulario"
      @editar="editarCiclo"
      @eliminar="eliminarCiclo"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="cicloSeleccionado"
      titulo="Gestionar Ciclo"
      @guardar="guardarCiclo"
      @cancelar="dialog = false"
    />
  </v-container>
</template>

<script>
import TablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteFormulario from '@/components/ComponenteFormulario.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'

export default {
  components: { TablaDatos, ComponenteFormulario, ComponenteNotificacion },
  data: () => ({
    ciclos: [],
    dialog: false,
    cicloSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Código', value: 'codigo' },
      { text: 'Año', value: 'anio' },
      { text: 'Número', value: 'numero' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarCiclos()
  },
  methods: {
    async cargarCiclos() {
      try {
        const response = await api.get('/ciclos')
        this.ciclos = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los ciclos: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    mostrarFormulario() {
      this.cicloSeleccionado = { codigo: '', anio: 0, numero: 0 }
      this.dialog = true
    },
    editarCiclo(ciclo) {
      this.cicloSeleccionado = { ...ciclo }
      this.dialog = true
    },
    async guardarCiclo(datos) {
      try {
        if (this.cicloSeleccionado && this.cicloSeleccionado.codigo) {
          await api.put(`/ciclos/${datos.codigo}`, datos)
        } else {
          await api.post('/ciclos', datos)
        }
        await this.cargarCiclos()
        this.mensajeNotificacion = 'Ciclo guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el ciclo: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarCiclo(ciclo) {
      try {
        await api.delete(`/ciclos/${ciclo.codigo}`)
        await this.cargarCiclos()
        this.mensajeNotificacion = 'Ciclo eliminado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar el ciclo: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
