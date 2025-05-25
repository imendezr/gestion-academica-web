<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-text-field
      v-model="search"
      label="Buscar curso por nombre, código o carrera"
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
  }),
  computed: {
    cursosFiltrados() {
      if (!this.search) return this.cursos
      const searchLower = this.search.toLowerCase()
      return this.cursos.filter(
        (curso) =>
          curso.codigo.toLowerCase().includes(searchLower) ||
          curso.nombre.toLowerCase().includes(searchLower) ||
          (curso.carrera && curso.carrera.toLowerCase().includes(searchLower)),
      )
    },
  },
  async created() {
    const response = await api.getCursos()
    this.cursos = response.data
  },
  methods: {
    mostrarFormulario() {
      this.cursoSeleccionado = { codigo: '', nombre: '', creditos: 0, horasSemanales: 0 }
      this.dialog = true
    },
    editarCurso(curso) {
      this.cursoSeleccionado = { ...curso }
      this.dialog = true
    },
    async guardarCurso(datos) {
      try {
        if (this.cursoSeleccionado && this.cursoSeleccionado.codigo) {
          await api.put(`/cursos/${datos.codigo}`, datos)
        } else {
          await api.post('/cursos', datos)
        }
        const response = await api.getCursos()
        this.cursos = response.data
        this.mensajeNotificacion = 'Curso guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el curso: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarCurso(curso) {
      try {
        await api.delete(`/cursos/${curso.codigo}`)
        const response = await api.getCursos()
        this.cursos = response.data
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
