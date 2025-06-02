<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-text-field
      v-model="search"
      label="Buscar por cédula o nombre"
      prepend-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>
    <ComponenteTablaDatos
      :headers="headers"
      :items="profesoresFiltrados"
      titulo="Profesores"
      @crear="mostrarFormulario"
      @editar="editarProfesor"
      @eliminar="eliminarProfesor"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="profesorSeleccionado"
      :fields="formFields"
      titulo="Gestionar Profesor"
      @guardar="guardarProfesor"
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
    profesores: [],
    profesorSeleccionado: null,
    dialog: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { title: 'Cédula', key: 'cedula' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Telefono', key: 'telefono' },
      { title: 'Email', key: 'email' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    formFields: [
      {
        key: 'cedula',
        label: 'Cédula',
        type: 'text',
        rules: [(v) => !!v || 'La cédula es requerida'],
      },
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        rules: [(v) => !!v || 'El nombre es requerido'],
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        type: 'text',
        rules: [(v) => !!v || 'El teléfono es requerido'],
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        rules: [(v) => !!v || 'El email es requerido'],
      },
    ],
  }),
  async created() {
    await this.cargarProfesores()
  },
  computed: {
    profesoresFiltrados() {
      if (!this.search) return this.profesores
      const searchLower = this.search.toLowerCase()
      return this.profesores.filter(
        (profesor) =>
          profesor.cedula.toLowerCase().includes(searchLower) ||
          profesor.nombre.toLowerCase().includes(searchLower) ||
          profesor.telefono.toLowerCase().includes(searchLower) ||
          profesor.email.toLowerCase().includes(searchLower)
      )
    },
  },
  methods: {
    async cargarProfesores() {
      try {
        const response = await api.getProfesores()
        this.profesores = response.data
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.profesores = [] // <- Tratar como lista vacía
        } else {
          this.mensajeNotificacion = `Error al cargar las carreras: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },
    async guardarProfesor(datos) {
      try {
        if (this.profesorSeleccionado && this.profesorSeleccionado.idProfesor) {
          await api.updateProfesor(datos)
        } else {
          await api.createProfesor(datos)
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
    editarProfesor(profesor) {
      this.profesorSeleccionado = { ...profesor }
      this.dialog = true
    },
      async eliminarProfesor(profesor) {
      try {
        await api.deleteProfesor(profesor.idProfesor)
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
    mostrarFormulario() {
      this.profesorSeleccionado = { idProfesor: null , cedula: null, nombre: null, telefono: null, email: null }
      this.dialog = true
    },
  },
}
</script>
