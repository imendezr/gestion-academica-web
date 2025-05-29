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
      :fields="formFields"
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
    carreras: [],
    alumnoSeleccionado: null,
    dialog: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Cédula', value: 'cedula' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Teléfono', value: 'telefono' },
      { text: 'Email', value: 'email' },
      { text: 'Fecha de Nacimiento', value: 'fechaNacimiento' },
      { text: 'Carrera', value: 'nombreCarrera' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    formFields: [
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
        key: 'telefono',
        label: 'Telefono',
        type: 'text',
        rules: [(v) => !!v || 'El telefono es requerido'],
        required: true,
      },
       {
        key: 'email',
        label: 'Email',
        type: 'email',
        rules: [(v) => !!v || 'El email es requerido'],
        required: true,
      },
       {
        key: 'fechaNacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        rules: [(v) => !!v || 'La fecha de nacimiento es requerida'],
        required: true,
      },
      {
        key: 'pkCarrera',
        label: 'Carrera',
        type: 'select',
        items: [],
        itemTitle: 'nombre',
        itemValue: 'idCarrera',
        rules: [(v) => !!v || 'La carrera es requerida'],
        required: true,
      },
    ],
  }),
  async created() {
    await this.cargarCarreras()
    await this.cargarAlumnos()
  },
  computed: {
    alumnosConCarrera() {
      return this.alumnos.map(alumno => ({
        ...alumno,
        nombreCarrera: this.obtenerNombreCarrera(alumno.pkCarrera)
      }))
    },
    alumnosFiltrados() {
      const alumnosBase = this.alumnosConCarrera;
      if (!this.search) return alumnosBase
      const searchLower = this.search.toLowerCase()
      return alumnosBase.filter(
        (alumno) =>
          alumno.cedula.toLowerCase().includes(searchLower) ||
          alumno.nombre.toLowerCase().includes(searchLower) ||
          alumno.telefono.toLowerCase().includes(searchLower) ||
          alumno.email.toLowerCase().includes(searchLower) ||
          alumno.fechaNacimiento.toLowerCase().includes(searchLower) ||
          alumno.nombreCarrera.toLowerCase().includes(searchLower),
      )
    },
  },

  methods: {
    async cargarCarreras() {
      try {
        const response = await api.getCarreras()
        this.carreras = response.data
        const carreraField = this.formFields.find(field => field.key === 'pkCarrera')
        if (carreraField) {
          carreraField.items = this.carreras
        }
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.carreras = []
        } else {
          this.mensajeNotificacion = `Error al cargar las carreras: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },
    obtenerNombreCarrera(idCarrera) {
      const carrera = this.carreras.find(c => c.idCarrera === idCarrera)
      return carrera ? carrera.nombre : 'Carrera no encontrada'
    },

    async cargarAlumnos() {
      try {
        const response = await api.getAlumnos()
        this.alumnos = response.data
      } catch (error) {
         const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.alumnos = [] // <- Tratar como lista vacía
        } else {
          this.mensajeNotificacion = `Error al cargar los cursos: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },
    /*verHistorial(alumno) {
      this.$router.push(`/historial?cedula=${alumno.cedula}`)
    },*/
    async guardarAlumno(datos) {
      try {
        if (this.alumnoSeleccionado && this.alumnoSeleccionado.idAlumno) {
          await api.updateAlumno(datos)
        } else {
          await api.createAlumno(datos)
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
     editarAlumno(alumno) {
      this.alumnoSeleccionado = { ...alumno }
      this.dialog = true
    },
    async eliminarAlumno(alumno) {
      try {
        await api.deleteAlumno(alumno.idAlumno)
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
    mostrarFormulario() {
      this.alumnoSeleccionado = {
        idAlumno: null,
        cedula: null,
        nombre: null,
        telefono: null,
        email: null,
        fechaNacimiento: null,
        pkCarrera: null,
        nombreCarrera: null}
      this.dialog = true
    },
  },
}
</script>
