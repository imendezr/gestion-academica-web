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
          item-title="codigo"
          item-value="codigo"
          @update:modelValue="cargarOferta"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="alumnoSeleccionado"
          :items="alumnos"
          label="Seleccionar Alumno"
          item-title="nombre"
          item-value="cedula"
        ></v-select>
      </v-col>
    </v-row>
    <TablaDatos
      :headers="headers"
      :items="ofertaFiltrada"
      titulo="Oferta Académica Disponible"
      :show-actions="false"
      :selectable="true"
      @update:selection="seleccionarCursos"
    />
    <v-btn
      color="primary"
      @click="matricular"
      :disabled="!alumnoSeleccionado || !cursosSeleccionados.length"
      >Matricular</v-btn
    >
  </v-container>
</template>

<script>
import TablaDatos from '@/components/ComponenteTablaDatos.vue'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'
import api from '@/services/api'

export default {
  components: { TablaDatos, ComponenteNotificacion },
  data: () => ({
    ciclos: [],
    alumnos: [],
    ofertaFiltrada: [],
    cicloSeleccionado: null,
    alumnoSeleccionado: null,
    cursosSeleccionados: [],
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
    await this.cargarDatosIniciales()
  },
  methods: {
    async cargarDatosIniciales() {
      try {
        const [ciclosResponse, alumnosResponse] = await Promise.all([
          api.get('/ciclos'),
          api.get('/alumnos'),
        ])
        this.ciclos = ciclosResponse.data
        this.alumnos = alumnosResponse.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar datos iniciales: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    async cargarOferta() {
      if (!this.cicloSeleccionado) return
      try {
        const response = await api.get(`/oferta-academica?ciclo=${this.cicloSeleccionado}`)
        this.ofertaFiltrada = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar la oferta académica: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    seleccionarCursos(cursos) {
      this.cursosSeleccionados = cursos
    },
    async matricular() {
      try {
        const matricula = {
          alumno: this.alumnoSeleccionado,
          cursos: this.cursosSeleccionados.map((item) => ({
            ciclo: item.ciclo,
            curso: item.curso,
          })),
        }
        await api.post('/matricula', matricula)
        this.mensajeNotificacion = 'Matrícula realizada exitosamente'
        this.colorNotificacion = 'success'
        this.cursosSeleccionados = []
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al realizar la matrícula: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
