<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="cicloSeleccionado"
          :items="ciclos"
          label="Seleccionar Ciclo"
          item-title="label"
          item-value="idCiclo"
          @update:modelValue="cargarMatriculas"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="alumnoSeleccionado"
          :items="alumnos"
          label="Seleccionar Alumno"
          item-title="nombre"
          item-value="idAlumno"
          @update:modelValue="cargarMatriculas"
        ></v-select>
      </v-col>
    </v-row>
    <ComponenteTablaDatos
       :headers="headers"
      :items="gruposMatriculados"
      titulo="Grupos Matriculados"
      :show-actions="false"
      :custom-actions="['desmatricular']"
      @crear="abrirDialogoMatricula"
      @desmatricular="desmatricularAlumno"
    />
    <!-- Diálogo de Matrícula -->
    <v-dialog v-model="dialogMatricula" max-width="800">
      <v-card>
        <v-card-title>Matricular Alumno</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="cursoSeleccionado"
                :items="cursosDisponibles"
                label="Seleccionar Curso"
                item-title="nombre"
                item-value="idCurso"
                @update:modelValue="cargarGruposDisponibles"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Tabla de Grupos Disponibles -->
          <v-row v-if="gruposDisponibles.length > 0">
            <v-col cols="12">
              <v-card>
                <v-card-title>Grupos Disponibles</v-card-title>
                <v-data-table
                  :headers="headersGrupos"
                  :items="gruposDisponibles"
                  :items-per-page="5"
                  class="elevation-1"
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                      color="primary"
                      size="small"
                      @click="matricularEnGrupo(item)"
                      :loading="matriculandoGrupoId === item.idGrupo"
                    >
                      Matricular
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-else-if="cursoSeleccionado">
            <v-col cols="12">
              <v-alert type="info">
                No hay grupos disponibles para este curso.
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="cerrarDialogoMatricula">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import ComponenteTablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'

export default {
  components: { ComponenteTablaDatos, ComponenteNotificacion },
  data: () => ({
    ciclos: [],
    alumnos: [],
    gruposMatriculados: [],
    cursosDisponibles: [],
    gruposDisponibles: [],
    cicloSeleccionado: null,
    alumnoSeleccionado: null,
    cursoSeleccionado: null,
    matriculandoGrupoId: null,
    desmatriculandoId: null,
    dialogMatricula: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Grupo', value: 'numeroGrupo' },
      { text: 'Curso', value: 'nombreCurso' },
      { text: 'Carrera', value: 'nombreCarrera' },
      { text: 'Profesor', value: 'nombreProfesor' },
      { text: 'Horario', value: 'horario' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersGrupos: [
      { text: 'Grupo', value: 'numeroGrupo' },
      { text: 'Horario', value: 'horario' },
      { text: 'Profesor', value: 'nombreProfesor' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarCiclos()
    await this.cargarAlumnos()
  },
  methods: {
    async cargarCiclos() {
      try {
        const response = await api.getCiclos()
        this.ciclos = response.data.map(ciclo => ({
        ...ciclo,
        label: `${ciclo.numero} - ${ciclo.anio} - ${ciclo.estado}`
        }))
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.ciclos = [] // <- Tratar como lista vacía
        } else {
          this.mensajeNotificacion = `Error al cargar los ciclos: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
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
          this.mensajeNotificacion = `Error al cargar las carreras: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },
    async cargarMatriculas() {
      if (!this.alumnoSeleccionado || !this.cicloSeleccionado) {
        this.gruposMatriculados = []
        return
      }

      try {
        const response = await api.getMatriculasPorAlumnoYCiclo(
          this.alumnoSeleccionado,
          this.cicloSeleccionado
        )
        this.gruposMatriculados = response.data

        if (this.gruposMatriculados.length === 0) {
          this.mensajeNotificacion = 'No se encontraron matrículas para el alumno y ciclo seleccionados'
          this.colorNotificacion = 'info'
          this.notificacionVisible = true
        }
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.gruposMatriculados = []
          this.mensajeNotificacion = 'No se encontraron matrículas para el alumno y ciclo seleccionados'
          this.colorNotificacion = 'info'
          this.notificacionVisible = true
        } else {
          this.mensajeNotificacion = `Error al cargar las matrículas: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },
        async abrirDialogoMatricula() {
      if (!this.alumnoSeleccionado || !this.cicloSeleccionado) {
        this.mostrarNotificacion('Debe seleccionar un alumno y un ciclo primero', 'warning')
        return
      }

      try {
        // Obtener la carrera del alumno seleccionado
        const alumno = this.alumnos.find(a => a.idAlumno === this.alumnoSeleccionado)
        if (!alumno) {
          this.mostrarNotificacion('No se pudo obtener la información del alumno', 'error')
          return
        }

        // Cargar cursos disponibles para la carrera del alumno y el ciclo seleccionado
        const response = await api.getCursosbyCarreraAndCiclo(alumno.pkCarrera, this.cicloSeleccionado)
        this.cursosDisponibles = response.data

        this.dialogMatricula = true
        this.cursoSeleccionado = null
        this.gruposDisponibles = []
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.cursosDisponibles = []
          this.mostrarNotificacion('No hay cursos disponibles para esta carrera en el ciclo seleccionado', 'info')
        } else {
          this.mostrarNotificacion(`Error al cargar cursos disponibles: ${mensaje || error.message}`, 'error')
        }
      }
    },

    async cargarGruposDisponibles() {
      if (!this.cursoSeleccionado) {
        this.gruposDisponibles = []
        return
      }

      try {
        // Obtener la carrera del alumno seleccionado
        const alumno = this.alumnos.find(a => a.idAlumno === this.alumnoSeleccionado)

        const response = await api.getGruposByCursoCicloAndCarrera(
          this.cursoSeleccionado,
          this.cicloSeleccionado,
          alumno.pkCarrera
        )
        this.gruposDisponibles = response.data

        if (this.gruposDisponibles.length === 0) {
          this.mostrarNotificacion('No hay grupos disponibles para este curso', 'info')
        }
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.gruposDisponibles = []
          this.mostrarNotificacion('No hay grupos disponibles para este curso', 'info')
        } else {
          this.mostrarNotificacion(`Error al cargar grupos disponibles: ${mensaje || error.message}`, 'error')
        }
      }
    },

    async matricularEnGrupo(grupo) {
      try {
        this.matriculandoGrupoId = grupo.idGrupo

        const datosMatricula = {
          pkAlumno: this.alumnoSeleccionado,
          pkGrupo: grupo.idGrupo,
          nota: null // Inicialmente sin nota
        }

        await api.matricular(datosMatricula)

        this.mostrarNotificacion('Alumno matriculado exitosamente', 'success')

        // Recargar las matrículas para mostrar la nueva matrícula
        await this.cargarMatriculas()

        // Cerrar el diálogo
        this.cerrarDialogoMatricula()

      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        this.mostrarNotificacion(`Error al matricular alumno: ${mensaje || error.message}`, 'error')
      } finally {
        this.matriculandoGrupoId = null
      }
    },
    async desmatricularAlumno(matricula) {
      try {
        this.desmatriculandoId = matricula.idMatricula

        await api.deleteMatricula(matricula.idMatricula)

        this.mostrarNotificacion('Alumno desmatriculado exitosamente', 'success')

        // Recargar las matrículas para actualizar la lista
        await this.cargarMatriculas()

      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        this.mostrarNotificacion(`Error al desmatricular alumno: ${mensaje || error.message}`, 'error')
      } finally {
        this.desmatriculandoId = null
      }
    },
    cerrarDialogoMatricula() {
      this.dialogMatricula = false
      this.cursoSeleccionado = null
      this.gruposDisponibles = []
      this.cursosDisponibles = []
    },

    mostrarNotificacion(mensaje, color) {
      this.mensajeNotificacion = mensaje
      this.colorNotificacion = color
      this.notificacionVisible = true
    },
  },
}
</script>
