<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-text-field
      v-model="search"
      label="Buscar por código o nombre"
      prepend-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>
    <ComponenteTablaDatos
      :headers="headers"
      :items="carrerasFiltradas"
      titulo="Carreras"
      @crear="mostrarFormulario"
      @editar="editarCarrera"
      @eliminar="eliminarCarrera"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="carreraSeleccionada"
      :fields="[
        {
          key: 'codigo',
          label: 'Código',
          type: 'text',
          rules: [(v) => !!v || 'El código es requerido'],
          required: true,
        },
        {
          key: 'nombre',
          label: 'Nombre',
          type: 'text',
          rules: [(v) => !!v || 'El nombre es requerido'],
          required: true,
        },
        {
          key: 'duracion',
          label: 'Duración (años)',
          type: 'number',
          rules: [(v) => (v && v > 0) || 'La duración debe ser mayor a 0'],
          required: true,
        },
        {
          key: 'cursos',
          label: 'Cursos Asociados',
          type: 'select-multiple',
          items: cursosDisponibles,
        },
      ]"
      titulo="Gestionar Carrera"
      @guardar="guardarCarrera"
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
    carreras: [],
    dialog: false,
    carreraSeleccionada: { codigo: '', nombre: '', duracion: 0, cursos: [] },
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Código', value: 'codigo' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Duración (años)', value: 'duracion' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    carrerasFiltradas() {
      if (!this.search) return this.carreras
      const searchLower = this.search.toLowerCase()
      return this.carreras.filter(
        (carrera) =>
          carrera.codigo.toLowerCase().includes(searchLower) ||
          carrera.nombre.toLowerCase().includes(searchLower),
      )
    },
  },
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
          await api.put(`/carreras/${datos.codigo}`, { ...datos, cursos: datos.cursos })
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
