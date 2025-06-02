<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />

    <ComponenteTablaDatos
      :headers="headers"
      :items="matriculas"
      titulo="Mi Historial Académico"
      :show-actions="false"
      :mostrar-boton-nuevo="false"
    />
  </v-container>
</template>

<script>
import ComponenteTablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'
import { useUsuarioStore } from '@/stores/usuario'

export default {
  name: 'VistaHistorialAlumno',
  components: {
    ComponenteTablaDatos,
    ComponenteNotificacion
  },

  data() {
    return {
      matriculas: [],
      notificacionVisible: false,
      mensajeNotificacion: '',
      colorNotificacion: 'info',
      headers: [
        {title: 'Carrera', value: 'nombreCarrera',},
        {title: 'Curso', value: 'nombreCurso',},
        {title: 'Código', value: 'codigoCurso',},
        {title: 'Grupo',value: 'numeroGrupo',},
        {title: 'Profesor',value: 'nombreProfesor',},
        {title: 'Horario',value: 'horario',},
        {title: 'Nota',value: 'notaFormateada',},
        {title: 'Estado',value: 'estadoCurso',}
      ]
    }
  },

  async created() {
    await this.cargarHistorialMatriculas()
  },

  methods: {
    async cargarHistorialMatriculas() {
      try {
        const usuarioStore = useUsuarioStore()

        // Verificar que el usuario esté autenticado
        if (!usuarioStore.estaAutenticado || !usuarioStore.cedula) {
          this.mostrarNotificacion('No se encontró información del usuario logueado', 'error')
          return
        }

        const response = await api.getMatriculasPorAlumno(usuarioStore.cedula)

        if (response.data && Array.isArray(response.data)) {
          // Procesar los datos para mostrar información adicional
          this.matriculas = response.data.map(matricula => ({
            ...matricula,
            // Formatear la nota
            notaFormateada: this.formatearNota(matricula.nota),
            // Determinar el estado del curso
            estadoCurso: this.determinarEstadoCurso(matricula.nota)
          }))

          if (this.matriculas.length === 0) {
            this.mostrarNotificacion('No se encontraron matrículas para este alumno', 'info')
          }
        } else {
          this.matriculas = []
          this.mostrarNotificacion('No se encontraron matrículas para este alumno', 'info')
        }

      } catch (error) {
        console.error('Error al cargar historial:', error)
        const errorMessage = this.obtenerMensajeError(error)
        this.mostrarNotificacion(`Error al cargar el historial: ${errorMessage}`, 'error')
      }
    },

    formatearNota(nota) {
      if (nota === null || nota === undefined) {
        return 'Sin calificar'
      }
      return typeof nota === 'number' ? nota.toFixed(1) : nota.toString()
    },

    determinarEstadoCurso(nota) {
      if (nota === null || nota === undefined) {
        return 'En curso'
      }

      const notaNum = typeof nota === 'number' ? nota : parseFloat(nota)

      if (isNaN(notaNum)) {
        return 'Sin evaluar'
      }

      return notaNum >= 70 ? 'Aprobado' : 'Reprobado'
    },

    obtenerMensajeError(error) {
      if (error.response?.data?.message) {
        return error.response.data.message
      }
      if (error.message) {
        return error.message
      }
      return 'Error desconocido al cargar los datos'
    },

    mostrarNotificacion(mensaje, color = 'info') {
      this.mensajeNotificacion = mensaje
      this.colorNotificacion = color
      this.notificacionVisible = true
    }
  }
}
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
</style>
