<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <TablaDatos
      :headers="headers"
      :items="ofertas"
      titulo="Oferta Académica"
      @crear="mostrarFormulario"
      @editar="editarOferta"
      @eliminar="eliminarOferta"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="ofertaSeleccionada"
      titulo="Gestionar Oferta Académica"
      @guardar="guardarOferta"
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
    ofertas: [],
    dialog: false,
    ofertaSeleccionada: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Ciclo', value: 'ciclo' },
      { text: 'Curso', value: 'curso' },
      { text: 'Profesor', value: 'profesor' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarOfertas()
  },
  methods: {
    async cargarOfertas() {
      try {
        const response = await api.get('/oferta-academica')
        this.ofertas = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar la oferta académica: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    mostrarFormulario() {
      this.ofertaSeleccionada = { ciclo: '', curso: '', profesor: '' }
      this.dialog = true
    },
    editarOferta(oferta) {
      this.ofertaSeleccionada = { ...oferta }
      this.dialog = true
    },
    async guardarOferta(datos) {
      try {
        if (
          this.ofertaSeleccionada &&
          this.ofertaSeleccionada.ciclo &&
          this.ofertaSeleccionada.curso
        ) {
          await api.put(`/oferta-academica/${datos.ciclo}/${datos.curso}`, datos)
        } else {
          await api.post('/oferta-academica', datos)
        }
        await this.cargarOfertas()
        this.mensajeNotificacion = 'Oferta académica guardada exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar la oferta académica: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarOferta(oferta) {
      try {
        await api.delete(`/oferta-academica/${oferta.ciclo}/${oferta.curso}`)
        await this.cargarOfertas()
        this.mensajeNotificacion = 'Oferta académica eliminada exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar la oferta académica: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
