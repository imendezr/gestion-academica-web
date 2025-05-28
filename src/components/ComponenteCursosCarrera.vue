<template>
  <v-dialog v-model="dialogLocal" max-width="900px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2">mdi-book-open-page-variant</v-icon>
        <span>Cursos de {{ carrera?.nombre }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="cerrarDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle v-if="carrera">
        Código: {{ carrera.codigo }} | Título: {{ carrera.titulo }}
      </v-card-subtitle>

      <v-card-text>
        <ComponenteNotificacion
          v-model:visible="notificacionVisible"
          :mensaje="mensajeNotificacion"
          :color="colorNotificacion"
        />

        <!-- Combobox para seleccionar curso -->
        <v-row class="mb-4" justify="start" dense>
          <v-col cols="6">
            <v-select
              v-model="cursoSeleccionado"
              :items="cursosFormateados"
              item-title="display"
              item-value="idCurso"
              label="Selecciona un curso"
              dense
              clearable
              :loading="cargandoCursosDisponibles"
              return-object
            ></v-select>
          </v-col>

          <!-- Combobox para seleccionar ciclo -->
          <v-col cols="4">
            <v-select
              v-model="cicloSeleccionado"
              :items="ciclosFormateados"
              item-title="display"
              item-value="idCiclo"
              label="Selecciona un ciclo"
              dense
              clearable
              :loading="cargandoCiclos"
              return-object
            ></v-select>
          </v-col>

          <v-col cols="2" class="d-flex align-center">
            <v-btn
              color="primary"
              :disabled="!cursoSeleccionado || !cicloSeleccionado"
              @click="agregarCursoACarrera"
            >
              Agregar
            </v-btn>
          </v-col>
        </v-row>

        <!-- Tabla de cursos -->
        <v-data-table
          :headers="headersCursos"
          :items="cursosFiltrados"
          :items-per-page="5"
          class="elevation-1"
          :loading="cargandoCursos"
          loading-text="Cargando cursos..."
        >
          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon size="64" color="grey">mdi-book-open-blank-variant</v-icon>
              <p class="text-h6 mt-2">No hay cursos registrados</p>
              <p class="text-body-2">Esta carrera no tiene cursos asignados.</p>
            </div>
          </template>

          <template v-slot:[`item.creditos`]="{ item }">
            <v-chip size="small" color="primary">
              {{ item.creditos }} créditos
            </v-chip>
          </template>

          <template v-slot:[`item.ciclo`]="{ item }">
            <v-chip size="small" color="secondary">
              {{ item.anio }} - {{ item.numero }}
            </v-chip>
          </template>

          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn
              icon
              size="small"
              color="error"
              @click="eliminarCursoDeCarrera(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="cerrarDialog">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'

export default {
  components: {
    ComponenteNotificacion
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    carrera: {
      type: Object,
      default: null
    }
  },
  emits: ['update:dialog', 'cerrar'],
  data() {
    return {
      cursos: [],
      todosCursos: [],
      todosCiclos: [],
      cursoSeleccionado: null,
      cicloSeleccionado: null,
      cargandoCursos: false,
      cargandoCursosDisponibles: false,
      cargandoCiclos: false,
      notificacionVisible: false,
      mensajeNotificacion: '',
      colorNotificacion: 'info',
      headersCursos: [
        { text: 'Código', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Créditos', value: 'creditos' },
        { text: 'Ciclo', value: 'ciclo' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      searchCursos: '',
    }
  },
  computed: {
    dialogLocal: {
      get() {
        return this.dialog
      },
      set(value) {
        this.$emit('update:dialog', value)
      }
    },
    cursosFiltrados() {
      if (!this.searchCursos) return this.cursos
      const searchLower = this.searchCursos.toLowerCase()
      return this.cursos.filter(curso =>
        curso.codigo.toLowerCase().includes(searchLower) ||
        curso.nombre.toLowerCase().includes(searchLower)
      )
    },
    cursosFormateados() {
      return this.todosCursos.map(curso => ({
        ...curso,
        display: `${curso.codigo} - ${curso.nombre}`
      }))
    },
    ciclosFormateados() {
      return this.todosCiclos.map(ciclo => ({
        ...ciclo,
        display: `${ciclo.anio} - ${ciclo.numero}`
      }))
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal && this.carrera) {
        this.cargarCursosCarrera()
        this.cargarTodosCursos()
        this.cargarTodosCiclos()
      }
    }
  },
  methods: {
    async cargarCursosCarrera() {
      if (!this.carrera?.idCarrera) return
      this.cargandoCursos = true
      try {
        const response = await api.getCursosbyCarrera(this.carrera.idCarrera)
        this.cursos = response.data
      } catch (error) {
        console.error(error)
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.cursos = []
        } else {
          this.mensajeNotificacion = `Error al cargar los cursos de la carrera: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      } finally {
        this.cargandoCursos = false
      }
    },
    async cargarTodosCursos() {
      this.cargandoCursosDisponibles = true
      try {
        const response = await api.getCursos()
        this.todosCursos = response.data || []
      } catch (error) {
        this.mostrarError('Error al cargar lista de cursos', error)
      } finally {
        this.cargandoCursosDisponibles = false
      }
    },
    async cargarTodosCiclos() {
      this.cargandoCiclos = true
      try {
        const response = await api.getCiclos()
        this.todosCiclos = response.data || []
      } catch (error) {
        this.mostrarError('Error al cargar lista de ciclos', error)
      } finally {
        this.cargandoCiclos = false
      }
    },
    async agregarCursoACarrera() {
      if (!this.carrera?.idCarrera || !this.cursoSeleccionado || !this.cicloSeleccionado) return
      try {
        await api.addCursoToCarrera(
          this.carrera.idCarrera,
          this.cursoSeleccionado.idCurso,
          this.cicloSeleccionado.idCiclo,
        )
        this.mensajeNotificacion = 'Curso agregado a la carrera con éxito.'
        this.colorNotificacion = 'success'
        this.notificacionVisible = true

        // Recarga la tabla para mostrar el nuevo curso asignado
        this.cargarCursosCarrera()

        // Limpiar selección
        this.cursoSeleccionado = null
        this.cicloSeleccionado = null
      } catch (error) {
        this.mostrarError('Error al agregar curso a la carrera', error)
      }
    },
    async eliminarCursoDeCarrera(curso) {
      try {
        await api.removeCursoFromCarrera(this.carrera.idCarrera, curso.idCurso)
        this.mensajeNotificacion = 'Curso eliminado de la carrera con éxito.'
        this.colorNotificacion = 'success'
        this.notificacionVisible = true

        // Recargar la tabla
        this.cargarCursosCarrera()
      } catch (error) {
        this.mostrarError('Error al eliminar curso de la carrera', error)
      }
    },
    mostrarError(msg) {
      this.mensajeNotificacion = msg
      this.colorNotificacion = 'error'
      this.notificacionVisible = true
    },
    cerrarDialog() {
      this.$emit('update:dialog', false)
      this.$emit('cerrar')
      this.cursos = []
      this.searchCursos = ''
      this.notificacionVisible = false
      this.cursoSeleccionado = null
      this.cicloSeleccionado = null
    }
  }
}
</script>
