<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="carreraSeleccionada"
          :items="carreras"
          label="Seleccionar Carrera"
          item-title="nombre"
          item-value="codigo"
          @update:modelValue="cargarOfertasFiltradas"
        ></v-select>
      </v-col>
    </v-row>
    <ComponenteTablaDatos
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
import ComponenteTablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteFormulario from '@/components/ComponenteFormulario.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'

export default {
  components: { ComponenteTablaDatos, ComponenteFormulario, ComponenteNotificacion },
  data: () => ({
    ofertas: [],
    dialog: false,
    ofertaSeleccionada: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    carreraSeleccionada: null,
    carreras: [],
    headers: [
      { text: 'Ciclo', value: 'ciclo' },
      { text: 'Curso', value: 'curso' },
      { text: 'Profesor', value: 'profesor' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarCarreras()
    await this.cargarOfertas()
  },
  methods: {
    async cargarCarreras() {
      try {
        const response = await api.get('/carreras')
        this.carreras = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar las carreras: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
        console.error('Error en cargarCarreras:', errorMessage)
      }
    },
    async cargarOfertasFiltradas() {
      if (!this.carreraSeleccionada) {
        this.ofertas = []
        return
      }
      try {
        const response = await api.get(`/oferta-academica?carrera=${this.carreraSeleccionada}`)
        this.ofertas = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar las ofertas filtradas: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
        console.error('Error en cargarOfertasFiltradas:', errorMessage)
      }
    },
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
