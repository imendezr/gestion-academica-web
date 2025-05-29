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
    />
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
    cicloSeleccionado: null,
    alumnoSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Ciclo', value: 'ciclo' },
      { text: 'Curso', value: 'curso' },
      { text: 'Profesor', value: 'profesor' },
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
  },
}
</script>
