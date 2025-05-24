<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <TablaDatos
      :headers="headers"
      :items="alumnos"
      titulo="Alumnos"
      @crear="mostrarFormulario"
      @editar="editarAlumno"
      @eliminar="eliminarAlumno"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="alumnoSeleccionado"
      titulo="Gestionar Alumno"
      @guardar="guardarAlumno"
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
    alumnos: [],
    dialog: false,
    alumnoSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Cédula', value: 'cedula' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Carrera', value: 'carrera' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
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
