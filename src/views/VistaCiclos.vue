<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-text-field
      v-model="search"
      label="Buscar por año"
      prepend-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>
    <ComponenteTablaDatos
      :headers="headers"
      :items="ciclosFiltrados"
      :custom-actions="['marcar-activo']"
      titulo="Ciclos Académicos"
      @crear="mostrarFormulario"
      @editar="editarCiclo"
      @eliminar="eliminarCiclo"
      @marcar-activo="marcarCicloActivo"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="cicloSeleccionado"
      :fields="formFields"
      titulo="Gestionar Ciclo"
      @guardar="guardarCiclo"
      @cancelar="dialog = false"
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
    ciclos: [],
    cicloSeleccionado: null,
    dialog: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Año', value: 'anio' },
      { text: 'Número', value: 'numero' },
      { text: 'Fecha de Inicio', value: 'fechaInicio' },
      { text: 'Fecha de Final', value: 'fechaFin' },
      { text: 'Estado', value: 'estado' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    formFields: [
    {
      key: 'anio',
      label: 'Año',
      type: 'text',
      rules: [(v) => !!v || 'El año es requerido'],
      required: true,
    },
    {
      key: 'numero',
      label: 'Numero',
      type: 'select',
      items: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
      rules: [(v) => !!v || 'El numero de ciclo es requerido'],
      required: true,
    },
    {
      key: 'fechaInicio',
      label: 'Fecha de inicio',
      type: 'date',
      rules: [(v) => !!v || 'La fecha de inicio es requerida'],
      required: true,
    },
    {
      key: 'fechaFin',
      label: 'Fecha final',
      type: 'date',
      rules: [(v) => !!v || 'La fecha final es requerida'],
      required: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      type: 'select',
      items: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' },
      ],
      rules: [(v) => !!v || 'El estado es requerido'],
      required: true,
    },
    ],
  }),
  async created() {
    await this.cargarCiclos()
  },
  computed: {
    ciclosFiltrados() {
      if (!this.search) return this.ciclos
      const searchLower = this.search.toLowerCase()
      return this.ciclos.filter((ciclo) => ciclo.anio.toString().includes(searchLower))
    },
  },
  methods: {
    async cargarCiclos() {
      try {
        const response = await api.getCiclos()
        this.ciclos = response.data
      } catch (error) {
        const mensaje = error.response?.data?.message || ''
        if (mensaje.includes('No hay datos')) {
          this.ciclos = []
        } else {
          this.mensajeNotificacion = `Error al cargar los ciclos: ${mensaje || error.message}`
          this.colorNotificacion = 'error'
          this.notificacionVisible = true
        }
      }
    },
    async marcarCicloActivo(ciclo) {
      try {
        await api.setCicloActivo(ciclo.idCiclo)
        this.mensajeNotificacion = 'Ciclo marcado como activo exitosamente'
        this.colorNotificacion = 'success'
         await this.cargarCiclos()
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al marcar el ciclo como activo: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
    async guardarCiclo(datos) {
      try {
        if (this.cicloSeleccionado && this.cicloSeleccionado.idCiclo) {
          await api.updateCiclo(datos)
        } else {
          await api.createCiclo(datos)
        }
        await this.cargarCiclos()
        this.mensajeNotificacion = 'Ciclo guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el ciclo: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    editarCiclo(ciclo) {
      this.cicloSeleccionado = { ...ciclo }
      this.dialog = true
    },
    async eliminarCiclo(ciclo) {
      try {
        await api.deleteCiclo(ciclo.idCiclo)
        await this.cargarCiclos()
        this.mensajeNotificacion = 'Ciclo eliminado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar el ciclo: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
     mostrarFormulario() {
      this.cicloSeleccionado = {
        idCiclo: null,
        anio: null,
        numero: null,
        fechaInicio: null,
        fechaFin: null,
        estado: null
      }
      this.dialog = true
    },
  },
}
</script>
