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
      :custom-actions="['ver-cursos']"
      @crear="mostrarFormulario"
      @editar="editarCarrera"
      @eliminar="eliminarCarrera"
      @ver-cursos="verCursosCarrera"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="carreraSeleccionada"
      :fields="formFields"
      titulo="Gestionar Carrera"
      @guardar="guardarCarrera"
      @cancelar="dialog = false"
    />
    <!-- Diálogo para mostrar cursos de la carrera -->
    <ComponenteCursosCarrera
      v-model:dialog="dialogCursos"
      :carrera="carreraParaCursos"
      @cerrar="dialogCursos = false"
    />
  </v-container>
</template>

<script>
import ComponenteTablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteFormulario from '@/components/ComponenteFormulario.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import ComponenteCursosCarrera from '@/components/ComponenteCursosCarrera.vue'
import api from '@/services/api'

export default {
  components: { ComponenteTablaDatos, ComponenteFormulario, ComponenteNotificacion, ComponenteCursosCarrera },
  data: () => ({
    carreras: [],
    dialog: false,
    dialogCursos: false,
    carreraSeleccionada: null,
    carreraParaCursos: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Código', value: 'codigo' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Titulo', value: 'titulo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    formFields: [
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
        key: 'titulo',
        label: 'Titulo',
        type: 'text',
        required: true,
      },
    ],
  }),
  computed: {
    carrerasFiltradas() {
      if (!this.search) return this.carreras
      const searchLower = this.search.toLowerCase()
      return this.carreras.filter(
        (carrera) =>
          carrera.idCarrera.includes(searchLower) ||
          carrera.codigo.toLowerCase().includes(searchLower) ||
          carrera.nombre.toLowerCase().includes(searchLower) ||
          carrera.titulo.toLowerCase().includes(searchLower),
      )
    },
  },
  async created() {
    await this.cargarCarreras()
  },
  methods: {
    async cargarCarreras() {
    try {
    const response = await api.getCarreras()
    this.carreras = response.data
    } catch (error) {
      const mensaje = error.response?.data?.message || ''
      if (mensaje.includes('No hay datos')) {
        this.carreras = [] // <- Tratar como lista vacía
      } else {
        this.mensajeNotificacion = `Error al cargar las carreras: ${mensaje || error.message}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    }
    },
    mostrarFormulario() {
      this.carreraSeleccionada = { idCarrera: null, codigo: '', nombre: '', titulo: ''}
      this.dialog = true
    },
    editarCarrera(carrera) {
      this.carreraSeleccionada = { ...carrera }
      this.dialog = true
    },
     verCursosCarrera(carrera) {
      this.carreraParaCursos = carrera
      this.dialogCursos = true
    },
    async guardarCarrera(datos) {
      try {
        if (this.carreraSeleccionada && this.carreraSeleccionada.idCarrera) {
          await api.updateCarrera(datos)
        } else {
          await api.createCarrera(datos)
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
        await api.deleteCarrera(carrera.idCarrera)
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
