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
          v-model="carreraSeleccionada"
          :items="carreras"
          label="Seleccionar Carrera"
          item-title="nombre"
          item-value="idCarrera"
          @update:modelValue="cargarCursos"
        ></v-select>
      </v-col>
         <v-col cols="12" md="6">
        <v-select
          v-model="cicloSeleccionado"
          :items="ciclos"
          label="Seleccionar Ciclo"
          item-title="label"
          item-value="idCiclo"
          @update:modelValue="cargarCursos"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Tabla de cursos -->
    <ComponenteTablaDatos
      v-if="vistaActual === 'cursos'"
      :headers="headersCursos"
      :items="cursos"
      :custom-actions="['ver-grupos-curso']"
      :show-actions="false"
      :titulo="tituloTabla"
      :mostrar-boton-nuevo="false"
      @ver-grupos-curso="verGruposDelCurso"
    />

    <!-- Tabla de grupos -->
    <ComponenteTablaDatos
    v-if="vistaActual === 'grupos'"
    :headers="headersGrupos"
    :items="grupos"
    :show-actions="true"
    :titulo="tituloTabla"
    :mostrar-boton-nuevo="true"
    @crear="mostrarFormulario"
    @editar="editarGrupo"
    @eliminar="eliminarGrupo"
    />

    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="grupoSeleccionado"
      :fields="formFields"
      :titulo="tituloFormulario"
      @guardar="guardarGrupo"
      @cancelar="dialog = false"
    />

    <v-btn v-if="vistaActual === 'grupos'" @click="volverACursos" class="mt-4" color="secondary">
    Volver
    </v-btn>

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
    carreras: [],
    ciclos: [],
    cursos: [],
    grupos: [],
    profesores: [],
    carreraSeleccionada: null,
    cicloSeleccionado: null,
    profesorSeleccionado: null,
    grupoSeleccionado: null,
    cursoActual: null,
    vistaActual: 'cursos',
    tituloTabla: 'Oferta Académica',
    dialog: false,
    modoEdicion: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    dialogConfirmarEliminar: false,
    headersCursos: [
      { text: 'Codigo', value: 'codigo' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
     headersGrupos: [
      { text: 'Número de Grupo', value: 'numeroGrupo' },
      { text: 'Horario', value: 'horario' },
      { text: 'Profesor', value: 'nombreProfesor' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    formFields() {
      return [
        {
          key: 'numeroGrupo',
          label: 'Número de Grupo',
          type: 'number',
          rules: [(v) => !!v || 'El número de grupo es requerido'],
          required: true,
        },
        {
          key: 'horario',
          label: 'Horario',
          type: 'text',
          rules: [(v) => !!v || 'El horario es requerido'],
          required: true,
        },
        {
          key: 'profesor',
          label: 'Profesor',
          type: 'select',
          items: this.profesores,
          itemTitle: 'label',
          itemValue: 'value',
          rules: [(v) => !!v || 'El profesor es requerido'],
          required: true,
        },
      ]
    }
  },
  async created() {
    await this.cargarCarreras()
    await this.cargarCiclos()
    await this.cargarProfesores()
  },
  methods: {
    async cargarCarreras() {
      try {
        const response = await api.getCarreras()
        this.carreras = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar las carreras: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
        console.error('Error en cargarCarreras:', errorMessage)
      }
    },
    async cargarCiclos() {
      try {
        const response = await api.getCiclos()
        this.ciclos = response.data.map(ciclo => ({
        ...ciclo,
        label: `${ciclo.numero} - ${ciclo.anio}`
        }))
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar las carreras: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
        console.error('Error en cargarCiclos:', errorMessage)
      }
    },
    async cargarCursos() {
      if (!this.carreraSeleccionada || !this.cicloSeleccionado) {
        this.cursos = []
        return
      }
      try {
        const response = await api.getCursosbyCarreraAndCiclo(this.carreraSeleccionada, this.cicloSeleccionado)
        this.cursos = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los cursos: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
        console.error('Error en cargarCursos:', errorMessage)
      }
    },
    async cargarProfesores() {
        try {
          const response = await api.getProfesores()
          this.profesores = response.data.map(p => ({
            label: p.nombre,
            value: p.idProfesor
          }))
          console.log('Profesores cargados:', this.profesores)
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
          this.mensajeNotificacion = `Error al cargar los profesores: ${errorMessage}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
          console.error('Error en cargarProfesores:', errorMessage)
        }
      },
      async verGruposDelCurso(curso) {
        try {
          this.cursoActual = curso;

          // Siempre cambiar la vista primero
          this.vistaActual = 'grupos';
          this.tituloTabla = `Grupos de ${curso.nombre}`;
          console.log(this.carreraSeleccionada, curso.idCurso);

          const response = await api.getGruposByCarreraAndCurso(this.carreraSeleccionada, curso.idCurso);
          this.grupos = response.data;
          console.log(response.data);
        } catch (error) {
          this.grupos = [];
          const mensaje = error.response?.data?.message || error.message || 'Error al cargar grupos';
          if (!mensaje.includes('No hay datos') && !mensaje.includes('No se encontraron')) {
            this.mensajeNotificacion = `Error al cargar los grupos: ${mensaje}`;
            this.colorNotificacion = 'error';
            this.notificacionVisible = true;
            console.error('Error en verGruposDelCurso:', mensaje);
          }
          this.vistaActual = 'grupos';
          this.tituloTabla = `Grupos de ${curso.nombre}`;
        }
    },
    async guardarGrupo(datosGrupo) {
        try {
        if (this.modoEdicion) {
          // Actualizar grupo existente
          const grupoData = {
            idGrupo: this.grupoSeleccionado.idGrupo,
            idCarreraCurso: this.cursoActual.idCarreraCurso,
            numeroGrupo: parseInt(datosGrupo.numeroGrupo),
            horario: datosGrupo.horario,
            idProfesor: datosGrupo.profesor
          };

          await api.updateGrupo(grupoData);
          this.mensajeNotificacion = 'Grupo actualizado exitosamente';
          this.colorNotificacion = 'success';
          this.notificacionVisible = true;

        } else {
          // Crear nuevo grupo
          const grupoData = {
            idCarreraCurso: this.cursoActual.idCarreraCurso,
            numeroGrupo: parseInt(datosGrupo.numeroGrupo),
            horario: datosGrupo.horario,
            idProfesor: datosGrupo.profesor
          };

          await api.createGrupo(grupoData);
          this.mensajeNotificacion = 'Grupo creado exitosamente';
          this.colorNotificacion = 'success';
          this.notificacionVisible = true;
        }

        this.dialog = false;
        this.modoEdicion = false;
        await this.verGruposDelCurso(this.cursoActual);

      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error al procesar el grupo';
        const accion = this.modoEdicion ? 'actualizar' : 'crear';
        this.mensajeNotificacion = `Error al ${accion} el grupo: ${errorMessage}`;
        this.colorNotificacion = 'error';
        this.notificacionVisible = true;
        console.error(`Error en guardarGrupo (${accion}):`, errorMessage);
      }
    },
    async eliminarGrupo(grupo) {
      try {
        await api.deleteGrupo(grupo.idGrupo);
        this.mensajeNotificacion = 'Grupo eliminado exitosamente';
        this.colorNotificacion = 'success';
        this.notificacionVisible = true;
        this.dialogConfirmarEliminar = false;
        await this.verGruposDelCurso(this.cursoActual);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar el grupo';
        this.mensajeNotificacion = `Error al eliminar el grupo: ${errorMessage}`;
        this.colorNotificacion = 'error';
        this.notificacionVisible = true;
        console.error('Error en eliminarGrupo:', errorMessage);
      }
    },
    editarGrupo(grupo) {
      this.modoEdicion = true;
      this.grupoSeleccionado = {
        idGrupo: grupo.idGrupo,
        numeroGrupo: grupo.numeroGrupo,
        horario: grupo.horario,
        profesor: grupo.idProfesor
      };
      this.dialog = true;
    },
    volverACursos() {
      this.vistaActual = 'cursos'
      this.tituloTabla = 'Oferta Académica'
    },
    mostrarFormulario() {
      this.modoEdicion = false;
      this.grupoSeleccionado = {
        numeroGrupo: null,
        horario: null,
        profesor: null
      };
      this.dialog = true;
    },
  },
}
</script>
