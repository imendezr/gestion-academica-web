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
    dialog: false,
    cicloSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    search: '',
    headers: [
      { text: 'Código', value: 'codigo' },
      { text: 'Año', value: 'anio' },
      { text: 'Número', value: 'numero' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    ciclosFiltrados() {
      if (!this.search) return this.ciclos
      const searchLower = this.search.toLowerCase()
      return this.ciclos.filter((ciclo) => ciclo.anio.toString().includes(searchLower))
    },
  },
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
    async marcarCicloActivo(ciclo) {
      try {
        await api.post('/ciclos/activo', { codigo: ciclo.codigo })
        this.mensajeNotificacion = 'Ciclo marcado como activo exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al marcar el ciclo como activo: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
    mostrarFormulario() {
      this.cicloSeleccionado = { codigo: '', anio: 0, numero: 0 }
      this.dialog = true
    },
    editarCiclo(ciclo) {
      this.cicloSeleccionado = { ...ciclo }
      this.dialog = true
    },
    async guardarCiclo(datos) {
      try {
        if (this.cicloSeleccionado && this.cicloSeleccionado.codigo) {
          await api.put(`/ciclos/${datos.codigo}`, datos)
        } else {
          await api.post('/ciclos', datos)
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
    async eliminarCiclo(ciclo) {
      try {
        await api.delete(`/ciclos/${ciclo.codigo}`)
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
  },
}
</script>
