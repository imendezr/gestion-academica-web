<template>
  <v-container>
    <ComponenteNotificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <ComponenteTablaDatos
      :headers="headers"
      :items="usuarios"
      titulo="Usuarios"
      @crear="mostrarFormulario"
      @editar="editarUsuario"
      @eliminar="eliminarUsuario"
    />
    <ComponenteFormulario
      v-model:dialog="dialog"
      :datos="usuarioSeleccionado"
      titulo="Gestionar Usuario"
      @guardar="guardarUsuario"
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
    usuarios: [],
    dialog: false,
    usuarioSeleccionado: null,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    headers: [
      { text: 'Cédula', value: 'cedula' },
      { text: 'Rol', value: 'rol' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
  }),
  async created() {
    await this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      try {
        const response = await api.get('/usuarios')
        this.usuarios = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los usuarios: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    mostrarFormulario() {
      this.usuarioSeleccionado = { cedula: '', rol: '' }
      this.dialog = true
    },
    editarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario }
      this.dialog = true
    },
    async guardarUsuario(datos) {
      try {
        if (this.usuarioSeleccionado && this.usuarioSeleccionado.cedula) {
          await api.put(`/usuarios/${datos.cedula}`, datos)
        } else {
          await api.post('/usuarios', datos)
        }
        await this.cargarUsuarios()
        this.mensajeNotificacion = 'Usuario guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al guardar el usuario: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
      this.dialog = false
    },
    async eliminarUsuario(usuario) {
      try {
        await api.delete(`/usuarios/${usuario.cedula}`)
        await this.cargarUsuarios()
        this.mensajeNotificacion = 'Usuario eliminado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al eliminar el usuario: ${errorMessage}`
        this.colorNotificacion = 'error'
      }
      this.notificacionVisible = true
    },
  },
}
</script>
