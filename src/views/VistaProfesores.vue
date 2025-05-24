<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <TablaDatos
      :headers="headers"
      :items="profesores"
      titulo="Profesores"
      @crear="mostrarFormulario"
      @editar="editarProfesor"
      @eliminar="eliminarProfesor"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="profesorSeleccionado"
      titulo="Gestionar Profesor"
      @guardar="guardarProfesor"
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
    profesores: [],
    dialog: false,
    profesorSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Cédula', value: 'cedula' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Email', value: 'email' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarProfesores()
  },
  methods: {
    async cargarProfesores() {
      try {
        const response = await api.get('/profesores')
        this.profesores = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los profesores: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    mostrarFormulario() {
      this.profesorSeleccionado = { cedula: '', nombre: '', email: '' }
      this.dialog = true
    },
    editarProfesor(profesor) {
      this.profesorSeleccionado = { ...profesor }
      this.dialog = true
    },
    async guardarProfesor(datos) {
      try {
        if (this.profesorSeleccionado && this.profesorSeleccionado.cedula) {
          await api.put(`/profesores/${datos.cedula}`, datos)
        } else {
          await api.post('/profesores', datos)
        }
        await this.cargarProfesores()
        this.mensajeNotificacion = 'Profesor guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el profesor: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarProfesor(profesor) {
      try {
        await api.delete(`/profesores/${profesor.cedula}`)
        await this.cargarProfesores()
        this.mensajeNotificacion = 'Profesor eliminado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar el profesor: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
