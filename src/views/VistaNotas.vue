<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />

    <!-- Tabla de Grupos -->
    <ComponenteTablaDatos
      v-if="!mostrandoAlumnos"
      :headers="headers"
      :items="grupos"
      titulo="Grupos a Cargo"
      :mostrar-boton-nuevo="false"
      :loading="cargando"
      :custom-actions="['ver-alumnos']"
      :show-actions="false"
      @ver-alumnos="verAlumnos"
    />

    <!-- Tabla de Alumnos -->
    <ComponenteTablaDatos
      v-if="mostrandoAlumnos"
      :headers="headersAlumnos"
      :items="alumnos"
      :titulo="`Alumnos del Grupo ${grupoSeleccionado?.numeroGrupo} - ${grupoSeleccionado?.nombreCurso}`"
      :mostrar-boton-nuevo="false"
      :loading="cargandoAlumnos"
      :show-actions="false"
      :custom-actions="['modificar-nota']"
      @modificar-nota="abrirFormularioNota"
    />

    <!-- Botón para volver a la lista de grupos -->
    <v-btn
      v-if="mostrandoAlumnos"
      color="secondary"
      @click="volverAGrupos"
      class="mt-4"
    >
      <v-icon left>mdi-arrow-left</v-icon>
      Volver a Grupos
    </v-btn>

    <!-- Formulario para modificar nota -->
    <FormularioDialogo
      v-model:dialog="dialogNota"
      :datos="datosNota"
      titulo="Modificar Nota"
      :fields="camposNota"
      @guardar="guardarNota"
      @cancelar="cerrarFormularioNota"
    />
  </v-container>
</template>

<script>
import ComponenteTablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import FormularioDialogo from '@/components/ComponenteFormulario.vue'
import { useUsuarioStore } from '@/stores/usuario'
import api from '@/services/api'

export default {
  components: {
    ComponenteTablaDatos,
    ComponenteNotificacion,
    FormularioDialogo
  },
  data: () => ({
    grupos: [],
    alumnos: [],
    cargando: false,
    cargandoAlumnos: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    mostrandoAlumnos: false,
    grupoSeleccionado: null,

    // Variables para el formulario de nota
    dialogNota: false,
    datosNota: {},
    alumnoSeleccionado: null,

    headers: [
      { title: 'Numero de grupo', key: 'numeroGrupo' },
      { title: 'Horario', key: 'horario' },
      { title: 'Codigo del Curso', key: 'codigoCurso' },
      { title: 'Nombre del Curso', key: 'nombreCurso' },
      { title: 'Codigo de Carrera', key: 'codigoCarrera' },
      { title: 'Nombre de Carrera', key: 'nombreCarrera' },
      { title: 'Año', key: 'anio' },
      { title: 'Numero de ciclo', key: 'numeroCiclo' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headersAlumnos: [
      { title: 'Cédula', key: 'cedula' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Email', key: 'email' },
      { title: 'Nota', key: 'nota' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    camposNota: [
      {
        key: 'nombre',
        label: 'Estudiante',
        type: 'display',
        required: false,
      },
      {
        key: 'nota',
        label: 'Nota',
        type: 'number',
        required: true,
        rules: [
          v => !!v || 'La nota es requerida',
          v => (v >= 0 && v <= 100) || 'La nota debe estar entre 0 y 100'
        ]
      }
    ],
  }),
  setup() {
    const usuarioStore = useUsuarioStore()
    return { usuarioStore }
  },
  async created() {
    await this.cargarGruposProfesor()
  },
  methods: {
    async cargarGruposProfesor() {
      try {
        this.cargando = true

        // Obtener la cédula del profesor desde el store
        const cedulaProfesor = this.usuarioStore.cedula

        if (!cedulaProfesor) {
          this.mostrarNotificacion('Error: No se encontró la cédula del profesor', 'error')
          return
        }

        // Llamar al endpoint para obtener los grupos del profesor
        const response = await api.getGruposByProfesorAndCicloActivo(cedulaProfesor)

        this.grupos = response.data || []
        console.log('Grupos del profesor:', this.grupos)
        if (this.grupos.length === 0) {
          this.mostrarNotificacion('No tienes grupos asignados en el ciclo activo', 'info')
        } else {
          this.mostrarNotificacion(`Se cargaron ${this.grupos.length} grupos`, 'success')
        }

      } catch (error) {
        console.error('Error al cargar grupos del profesor:', error)
        this.mostrarNotificacion('Error al cargar los grupos del profesor', 'error')
        this.grupos = []
      } finally {
        this.cargando = false
      }
    },

    async verAlumnos(grupo) {
      try {
        this.cargandoAlumnos = true
        this.grupoSeleccionado = grupo

        const response = await api.getAlumnosByGrupo(grupo.idGrupo)
        console.log('Alumnos del grupo:', response.data)
        this.alumnos = response.data || []
        this.mostrandoAlumnos = true

        if (this.alumnos.length === 0) {
          this.mostrarNotificacion('No hay alumnos matriculados en este grupo', 'info')
        } else {
          this.mostrarNotificacion(`Se cargaron ${this.alumnos.length} alumnos`, 'success')
        }

      } catch (error) {
        console.error('Error al cargar alumnos del grupo:', error)
        this.mostrarNotificacion('Error al cargar los alumnos del grupo', 'error')
        this.alumnos = []
      } finally {
        this.cargandoAlumnos = false
      }
    },

    abrirFormularioNota(alumno) {
      this.alumnoSeleccionado = alumno
      this.datosNota = {
        nombre: alumno.nombre,
        nota: alumno.nota || 0,
        idMatricula: alumno.idMatricula
      }
      this.dialogNota = true
    },

    async guardarNota(datosFormulario) {
      try {
        const idMatricula = this.datosNota.idMatricula
        const idAlumno = this.alumnoSeleccionado.idAlumno
        const nota = datosFormulario.nota

        // Llamar al API para actualizar la nota
        await api.actualizarNota(idMatricula, idAlumno, nota)

        // Actualizar la nota en el array local para reflejar el cambio inmediatamente
        const index = this.alumnos.findIndex(alumno => alumno.idMatricula === idMatricula)
        if (index !== -1) {
          this.alumnos[index].nota = nota
        }

        this.mostrarNotificacion('Nota actualizada correctamente', 'success')
        this.cerrarFormularioNota()

      } catch (error) {
        console.error('Error al actualizar la nota:', error)
        this.mostrarNotificacion('Error al actualizar la nota', 'error')
      }
    },

    cerrarFormularioNota() {
      this.dialogNota = false
      this.datosNota = {}
      this.alumnoSeleccionado = null
    },

    volverAGrupos() {
      this.mostrandoAlumnos = false
      this.alumnos = []
      this.grupoSeleccionado = null
    },

    mostrarNotificacion(mensaje, color = 'info') {
      this.mensajeNotificacion = mensaje
      this.colorNotificacion = color
      this.notificacionVisible = true
    },

    // Método para refrescar los datos si es necesario
    async refrescarDatos() {
      await this.cargarGruposProfesor()
    }
  },
}
</script>
