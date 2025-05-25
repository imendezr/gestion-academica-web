<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-text-field
      v-model="search"
      label="Buscar por cédula, nombre o carrera"
      prepend-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>
    <ComponenteTablaDatos
      :headers="headers"
      :items="alumnosFiltrados"
      :custom-actions="['ver-historial']"
      titulo="Alumnos"
      @crear="mostrarFormulario"
      @editar="editarAlumno"
      @eliminar="eliminarAlumno"
      @ver-historial="verHistorial"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="alumnoSeleccionado"
      :fields="[
        {
          key: 'cedula',
          label: 'Cédula',
          type: 'text',
          rules: [(v) => !!v || 'La cédula es requerida'],
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
          key: 'carrera',
          label: 'Carrera',
          type: 'text',
          rules: [(v) => !!v || 'La carrera es requerida'],
          required: true,
        },
      ]"
      titulo="Gestionar Alumno"
      @guardar="guardarAlumno"
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
    alumnos: [],
    dialog: false,
    alumnoSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Cédula', value: 'cedula' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Carrera', value: 'carrera' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    alumnosFiltrados() {
      if (!this.search) return this.alumnos
      const searchLower = this.search.toLowerCase()
      return this.alumnos.filter(
        (alumno) =>
          alumno.cedula.toLowerCase().includes(searchLower) ||
          alumno.nombre.toLowerCase().includes(searchLower) ||
          (alumno.carrera && alumno.carrera.toLowerCase().includes(searchLower)),
      )
    },
  },
  async created() {
    await this.cargarAlumnos()
  },
  methods: {
    async cargarAlumnos() {
      try {
        const response = await api.get('/alumnos')
        this.alumnos = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los alumnos: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    verHistorial(alumno) {
      this.$router.push(`/historial?cedula=${alumno.cedula}`)
    },
    mostrarFormulario() {
      this.alumnoSeleccionado = { cedula: '', nombre: '', carrera: '' }
      this.dialog = true
    },
    editarAlumno(alumno) {
      this.alumnoSeleccionado = { ...alumno }
      this.dialog = true
    },
    async guardarAlumno(datos) {
      try {
        if (this.alumnoSeleccionado && this.alumnoSeleccionado.cedula) {
          await api.put(`/alumnos/${datos.cedula}`, datos)
        } else {
          await api.post('/alumnos', datos)
        }
        await this.cargarAlumnos()
        this.mensajeNotificacion = 'Alumno guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el alumno: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarAlumno(alumno) {
      try {
        await api.delete(`/alumnos/${alumno.cedula}`)
        await this.cargarAlumnos()
        this.mensajeNotificacion = 'Alumno eliminado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar el alumno: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
