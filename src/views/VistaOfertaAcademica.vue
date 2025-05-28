<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />

    <!-- Filtros de selección -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-select
          v-model="carreraSeleccionada"
          :items="carreras"
          label="Seleccionar Carrera"
          item-title="nombre"
          item-value="codigo"
          @update:modelValue="onCarreraChange"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="cicloSeleccionado"
          :items="ciclos"
          label="Seleccionar Ciclo"
          item-title="nombre"
          item-value="codigo"
          @update:modelValue="cargarCursos"
          :disabled="!carreraSeleccionada"
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <!-- Tabla de Cursos -->
    <ComponenteTablaDatos
      v-if="mostrarCursos"
      :headers="headersCursos"
      :items="cursos"
      titulo="Cursos Disponibles"
      :mostrar-boton-crear="false"
      @ver-grupos="verGruposCurso"
    />

    <!-- Tabla de Grupos -->
    <ComponenteTablaDatos
      v-if="mostrarGrupos"
      :headers="headersGrupos"
      :items="grupos"
      :titulo="`Grupos del curso: ${cursoSeleccionado?.nombre || ''}`"
      @crear="mostrarFormularioGrupo"
      @editar="editarGrupo"
      @eliminar="eliminarGrupo"
    >
      <template #toolbar-actions>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="volverACursos"
          class="mr-2"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Volver a Cursos
        </v-btn>
      </template>
    </ComponenteTablaDatos>

    <!-- Formulario para Grupos -->
    <ComponenteFormulario
      v-model:dialog="dialogGrupo"
      :datos="grupoSeleccionado"
      titulo="Gestionar Grupo"
      @guardar="guardarGrupo"
      @cancelar="dialogGrupo = false"
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
    // Estados de vista
    mostrarCursos: false,
    mostrarGrupos: false,

    // Datos de filtros
    carreraSeleccionada: null,
    cicloSeleccionado: null,
    cursoSeleccionado: null,

    // Listas de datos
    carreras: [],
    ciclos: [],
    cursos: [],
    grupos: [],

    // Formulario de grupos
    dialogGrupo: false,
    grupoSeleccionado: null,

    // Notificaciones
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',

    // Headers para las tablas
    headersCursos: [
      { text: 'Código', value: 'codigo' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Créditos', value: 'creditos' },
      { text: 'Grupos', value: 'grupos_count' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersGrupos: [
      { text: 'Número', value: 'numero' },
      { text: 'Profesor', value: 'profesor' },
      { text: 'Horario', value: 'horario' },
      { text: 'Aula', value: 'aula' },
      { text: 'Cupo', value: 'cupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),

  async created() {
    await this.cargarCarreras()
    await this.cargarCiclos()
  },

  methods: {
    async cargarCarreras() {
      try {
        const response = await api.get('/carreras')
        this.carreras = response.data
      } catch (error) {
        this.mostrarError('Error al cargar las carreras', error)
      }
    },

    async cargarCiclos() {
      try {
        const response = await api.get('/ciclos')
        this.ciclos = response.data
      } catch (error) {
        this.mostrarError('Error al cargar los ciclos', error)
      }
    },

    onCarreraChange() {
      this.cicloSeleccionado = null
      this.resetearVistas()
    },

    async cargarCursos() {
      if (!this.carreraSeleccionada || !this.cicloSeleccionado) {
        this.resetearVistas()
        return
      }

      try {
        const response = await api.get(`/oferta-academica/cursos`, {
          params: {
            carrera: this.carreraSeleccionada,
            ciclo: this.cicloSeleccionado
          }
        })
        this.cursos = response.data
        this.mostrarCursos = true
        this.mostrarGrupos = false
      } catch (error) {
        this.mostrarError('Error al cargar los cursos', error)
        this.resetearVistas()
      }
    },

    async verGruposCurso(curso) {
      this.cursoSeleccionado = curso
      try {
        const response = await api.get(`/oferta-academica/grupos`, {
          params: {
            carrera: this.carreraSeleccionada,
            ciclo: this.cicloSeleccionado,
            curso: curso.codigo
          }
        })
        this.grupos = response.data
        this.mostrarGrupos = true
        this.mostrarCursos = false
      } catch (error) {
        this.mostrarError('Error al cargar los grupos', error)
      }
    },

    volverACursos() {
      this.mostrarGrupos = false
      this.mostrarCursos = true
      this.cursoSeleccionado = null
      this.grupos = []
    },

    mostrarFormularioGrupo() {
      this.grupoSeleccionado = {
        numero: '',
        profesor: '',
        horario: '',
        aula: '',
        cupo: '',
        carrera: this.carreraSeleccionada,
        ciclo: this.cicloSeleccionado,
        curso: this.cursoSeleccionado?.codigo
      }
      this.dialogGrupo = true
    },

    editarGrupo(grupo) {
      this.grupoSeleccionado = { ...grupo }
      this.dialogGrupo = true
    },

    async guardarGrupo(datos) {
      try {
        const esEdicion = this.grupoSeleccionado && this.grupoSeleccionado.id

        if (esEdicion) {
          await api.put(`/oferta-academica/grupos/${datos.id}`, datos)
          this.mostrarExito('Grupo actualizado exitosamente')
        } else {
          await api.post('/oferta-academica/grupos', {
            ...datos,
            carrera: this.carreraSeleccionada,
            ciclo: this.cicloSeleccionado,
            curso: this.cursoSeleccionado.codigo
          })
          this.mostrarExito('Grupo creado exitosamente')
        }

        await this.verGruposCurso(this.cursoSeleccionado)
        this.dialogGrupo = false
      } catch (error) {
        this.mostrarError('Error al guardar el grupo', error)
      }
    },

    async eliminarGrupo(grupo) {
      try {
        await api.delete(`/oferta-academica/grupos/${grupo.id}`)
        await this.verGruposCurso(this.cursoSeleccionado)
        this.mostrarExito('Grupo eliminado exitosamente')
      } catch (error) {
        this.mostrarError('Error al eliminar el grupo', error)
      }
    },

    resetearVistas() {
      this.mostrarCursos = false
      this.mostrarGrupos = false
      this.cursos = []
      this.grupos = []
      this.cursoSeleccionado = null
    },

    mostrarError(mensaje, error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido'
      this.mensajeNotificacion = `${mensaje}: ${errorMessage}`
      this.colorNotificacion = 'error'
      this.notificacionVisible = true
      console.error(mensaje, errorMessage)
    },

    mostrarExito(mensaje) {
      this.mensajeNotificacion = mensaje
      this.colorNotificacion = 'success'
      this.notificacionVisible = true
    }
  },
}
</script>
