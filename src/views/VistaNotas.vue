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
          @update:modelValue="cargarCursos"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="cursoSeleccionado"
          :items="cursos"
          label="Seleccionar Curso"
          item-title="curso"
          item-value="curso"
          @update:modelValue="cargarMatriculas"
        ></v-select>
      </v-col>
    </v-row>
    <TablaDatos
      :headers="headers"
      :items="matriculas"
      titulo="Notas de Alumnos"
      @editar="editarNota"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="notaSeleccionada"
      titulo="Editar Nota"
      @guardar="guardarNota"
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
    ciclos: [],
    cursos: [],
    matriculas: [],
    cicloSeleccionado: null,
    cursoSeleccionado: null,
    dialog: false,
    notaSeleccionada: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Alumno', value: 'alumno' },
      { text: 'Curso', value: 'curso' },
      { text: 'Nota', value: 'nota' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarCiclos()
  },
  methods: {
    async cargarCiclos() {
      try {
        const response = await api.get('/ciclos')
        this.ciclos = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los ciclos: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    async cargarCursos() {
      if (!this.cicloSeleccionado) return
      try {
        const response = await api.get(`/oferta-academica?ciclo=${this.cicloSeleccionado}`)
        this.cursos = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los cursos: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    async cargarMatriculas() {
      if (!this.cicloSeleccionado || !this.cursoSeleccionado) return
      try {
        const response = await api.get(
          `/matricula?ciclo=${this.cicloSeleccionado}&curso=${this.cursoSeleccionado}`,
        )
        this.matriculas = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar las matrículas: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    editarNota(matricula) {
      this.notaSeleccionada = { ...matricula, nota: matricula.nota || 0 }
      this.dialog = true
    },
    async guardarNota(datos) {
      try {
        await api.put(`/matricula/${datos.alumno}/${datos.ciclo}/${datos.curso}`, {
          nota: datos.nota,
        })
        await this.cargarMatriculas()
        this.mensajeNotificacion = 'Nota actualizada exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al actualizar la nota: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
  },
}
</script>
