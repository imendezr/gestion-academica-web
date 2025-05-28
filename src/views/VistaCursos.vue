<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-text-field
      v-model="search"
      label="Buscar curso por nombre código"
      prepend-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>
    <ComponenteTablaDatos
      :headers="headers"
      :items="cursosFiltrados"
      titulo="Cursos"
      @crear="mostrarFormulario"
      @editar="editarCurso"
      @eliminar="eliminarCurso"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="cursoSeleccionado"
      :fields="formFields"
      titulo="Gestionar Curso"
      @guardar="guardarCurso"
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
    cursos: [],
    dialog: false,
    cursoSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Código', value: 'codigo' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Créditos', value: 'creditos' },
      { text: 'Horas Semanales', value: 'horasSemanales' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    formFields: [
    {
      key: 'codigo',
      label: 'Código del curso',
      type: 'text',
      required: true,
      rules: [(v) => !!v || 'El código es requerido'],
    },
    {
      key: 'nombre',
      label: 'Nombre del curso',
      type: 'text',
      required: true,
      rules: [(v) => !!v || 'El nombre es requerido'],
    },
    {
      key: 'creditos',
      label: 'Créditos',
      type: 'number',
      required: true,
      rules: [(v) => v >= 0 || 'Debe ser un número válido'],
    },
    {
      key: 'horasSemanales',
      label: 'Horas semanales',
      type: 'number',
      required: true,
      rules: [(v) => v >= 0 || 'Debe ser un número válido'],
    },
    ]
  }),
  computed: {
    cursosFiltrados() {
      if (!this.search) return this.cursos
      const searchLower = this.search.toLowerCase()
      return this.cursos.filter(
        (curso) =>
          curso.codigo.toString().toLowerCase().includes(searchLower) ||
          curso.nombre.toString().toLowerCase().includes(searchLower) ||
          curso.creditos.toString().includes(searchLower) ||
          curso.horasSemanales.toString().includes(searchLower),
      )
    },
  },
  async created() {
   await this.cargarCursos()
  },
  methods: {
    async cargarCursos() {
      try {
        const response = await api.getCursos()
        this.cursos = response.data
        console.log('Cursos cargados:', this.cursos)
      } catch (error) {
      const mensaje = error.response?.data?.message || ''
      if (mensaje.includes('No hay datos')) {
        this.cursos = [] // <- Tratar como lista vacía
      } else {
        this.mensajeNotificacion = `Error al cargar los cursos: ${mensaje || error.message}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    }
    },
    mostrarFormulario() {
      this.cursoSeleccionado = {idCurso: null, codigo: null, nombre: null, creditos: null, horasSemanales: null }
      this.dialog = true
    },
    editarCurso(curso) {
      this.cursoSeleccionado = {...curso}
      this.dialog = true
    },
    async guardarCurso(datos) {
      try {
        if (this.cursoSeleccionado && this.cursoSeleccionado.idCurso) {
          console.log('Actualizando curso:', datos)
          await api.updateCurso(datos)
        } else {
          console.log('Creando Curso:', datos)
          await api.createCurso(datos)
        }
        await this.cargarCursos()
        this.mensajeNotificacion = 'Curso guardado exitosamente'
        this.colorNotificacion = 'success'
        this.notificacionVisible = true
        this.dialog = false
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el curso: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    async eliminarCurso(curso) {
      try {
        await api.deleteCurso(curso.idCurso)
        await this.cargarCursos()
        console.log('Cursos cargados:', this.cursos)
        this.mensajeNotificacion = 'Curso eliminado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar el curso: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
