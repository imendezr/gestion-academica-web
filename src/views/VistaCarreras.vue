<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <TablaDatos
      :headers="headers"
      :items="carreras"
      titulo="Carreras"
      @crear="mostrarFormulario"
      @editar="editarCarrera"
      @eliminar="eliminarCarrera"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="carreraSeleccionada"
      titulo="Gestionar Carrera"
      @guardar="guardarCarrera"
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
    carreras: [],
    dialog: false,
    carreraSeleccionada: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Código', value: 'codigo' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Duración (años)', value: 'duracion' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarCarreras()
  },
  methods: {
    async cargarCarreras() {
      try {
        const response = await api.get('/carreras') // Ajusta el endpoint según tu API
        this.carreras = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar las carreras: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    mostrarFormulario() {
      this.carreraSeleccionada = { codigo: '', nombre: '', duracion: 0 }
      this.dialog = true
    },
    editarCarrera(carrera) {
      this.carreraSeleccionada = { ...carrera }
      this.dialog = true
    },
    async guardarCarrera(datos) {
      try {
        if (this.carreraSeleccionada && this.carreraSeleccionada.codigo) {
          await api.put(`/carreras/${datos.codigo}`, datos)
        } else {
          await api.post('/carreras', datos)
        }
        await this.cargarCarreras()
        this.mensajeNotificacion = 'Carrera guardada exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar la carrera: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarCarrera(carrera) {
      try {
        await api.delete(`/carreras/${carrera.codigo}`)
        await this.cargarCarreras()
        this.mensajeNotificacion = 'Carrera eliminada exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar la carrera: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
