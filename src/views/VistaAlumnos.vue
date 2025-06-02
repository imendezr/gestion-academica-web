<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />

    <!-- Controles de vista -->
    <v-row class="mb-4">
      <v-col cols="8">
        <v-text-field
          v-model="search"
          :label="vistaActual === 'alumnos' ? 'Buscar por cédula, nombre o carrera' : 'Buscar en historial'"
          prepend-icon="mdi-magnify"
        ></v-text-field>
      </v-col>

    </v-row>

    <!-- Tabla de Alumnos -->
    <ComponenteTablaDatos
      v-if="vistaActual === 'alumnos'"
      :headers="headers"
      :items="alumnosFiltrados"
      :custom-actions="['ver-historial']"
      titulo="Alumnos"
      @crear="mostrarFormulario"
      @editar="editarAlumno"
      @eliminar="eliminarAlumno"
      @ver-historial="verHistorial"
    />

    <!-- Tabla de Historial -->
    <ComponenteTablaDatos
      v-else-if="vistaActual === 'historial'"
      :headers="headersHistorial"
      :items="historialFiltrado"
      :titulo="`Historial Académico de ${alumnoSeleccionadoHistorial?.nombre} (${alumnoSeleccionadoHistorial?.cedula})`"
      :show-crear="false"
      :show-editar="false"
      :show-eliminar="false"
    />

    <!-- Formulario de Alumno -->
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="alumnoSeleccionado"
      :fields="formFields"
      titulo="Gestionar Alumno"
      @guardar="guardarAlumno"
      @cancelar="dialog = false"
    />

    <v-col cols="4" v-if="vistaActual === 'historial'">
        <v-btn
          @click="volverAAlumnos"
          color="secondary"
          class="mt-2"
        >
          Volver a Alumnos
        </v-btn>
      </v-col>

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
    vistaActual: 'alumnos', // 'alumnos' o 'historial'
    alumnos: [],
    carreras: [],
    historialMatriculas: [],
    alumnoSeleccionado: null,
    alumnoSeleccionadoHistorial: null,
    dialog: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',

    // Headers para tabla de alumnos
    headers: [
      { title: 'Cédula', key: 'cedula' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Teléfono', key: 'telefono' },
      { title: 'Email', key: 'email' },
      { title: 'Fecha de Nacimiento', key: 'fechaNacimiento' },
      { title: 'Carrera', key: 'nombreCarrera' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],

    // Headers para tabla de historial
    headersHistorial: [
      { title: 'Código Curso', key: 'codigoCurso' },
      { title: 'Nombre Curso', key: 'nombreCurso' },
      { title: 'Grupo', key: 'numeroGrupo' },
      { title: 'Horario', key: 'horario' },
      { title: 'Profesor', key: 'nombreProfesor' },
      { title: 'Cédula Profesor', key: 'cedulaProfesor' },
      { title: 'Carrera', key: 'nombreCarrera' },
      { title: 'Código Carrera', key: 'codigoCarrera' },
      { title: 'Nota', key: 'nota' },
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

    historialFiltrado() {
      if (!this.search) return this.historialMatriculas
      const searchLower = this.search.toLowerCase()
      return this.historialMatriculas.filter(
        (matricula) =>
          matricula.codigoCurso.toLowerCase().includes(searchLower) ||
          matricula.nombreCurso.toLowerCase().includes(searchLower) ||
          matricula.numeroGrupo.toLowerCase().includes(searchLower) ||
          matricula.nombreProfesor.toLowerCase().includes(searchLower) ||
          matricula.nombreCarrera.toLowerCase().includes(searchLower) ||
          matricula.codigoCarrera.toLowerCase().includes(searchLower) ||
          (matricula.nota && matricula.nota.toString().includes(searchLower))
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
          this.alumnos = []
        } else {
          this.mensajeNotificacion = `Error al cargar los alumnos: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },

    async verHistorial(alumno) {
      try {
        this.search = '' // Limpiar búsqueda
        this.alumnoSeleccionadoHistorial = alumno
        const response = await api.getMatriculasPorAlumno(alumno.cedula)
        this.historialMatriculas = response.data
        this.vistaActual = 'historial'

        this.mensajeNotificacion = `Historial cargado para ${alumno.nombre}`
        this.colorNotificacion = 'success'
        this.notificacionVisible = true
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.historialMatriculas = []
          this.vistaActual = 'historial'
          this.mensajeNotificacion = `${alumno.nombre} no tiene historial académico registrado`
          this.colorNotificacion = 'info'
        } else {
          this.mensajeNotificacion = `Error al cargar el historial: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
        }
        this.notificacionVisible = true
      }
    },

    volverAAlumnos() {
      this.vistaActual = 'alumnos'
      this.search = ''
      this.alumnoSeleccionadoHistorial = null
      this.historialMatriculas = []
    },

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
        nombreCarrera: null
      }
      this.dialog = true
    },
  },
}
</script>
