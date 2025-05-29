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
      :fields="formFields"
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
      { text: 'Tipo', value: 'tipo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    formFields: [
      {
        key: 'cedula',
        label: 'Cédula',
        type: 'text',
        rules: [(v) => !!v || 'La cédula es requerida'],
        required: true,
      },
      {
        key: 'clave',
        label: 'Clave',
        type: 'text',
        rules: [(v) => !!v || 'La clave requerido'],
        required: true,
      },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        items: [
        {label: 'Alumno', value: 'Alumno' },
        {label: 'Profesor', value: 'Profesor'},
        {label: 'Matriculador', value: 'Matriculador'},
        {label: 'Administrador', value: 'Administrador'},
        ],
        rules: [(v) => !!v || 'El tipo es requerido'],
        required: true,
      },
    ],
  }),
  async created() {
    await this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      try {
        const response = await api.getUsuarios()
        this.usuarios = response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        this.mensajeNotificacion = `Error al cargar los usuarios: ${errorMessage}`
        this.colorNotificacion = 'error'
        this.notificacionVisible = true
      }
    },
    mostrarFormulario() {
      this.usuarioSeleccionado = { cedula: null, clave: null, tipo: null}
      this.dialog = true
    },
    editarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario }
      this.dialog = true
    },
    async guardarUsuario(datos) {
      try {
        if (this.usuarioSeleccionado && this.usuarioSeleccionado.idUsuario) {
          await api.updateUsuario(datos)
        } else {
          await api.createUsuario(datos)
        }
        await this.cargarUsuarios()
        this.mensajeNotificacion = 'Usuario guardado exitosamente'
        this.colorNotificacion = 'success'
      } catch (error) {
        this.mensajeNotificacion = `Error al guardar el usuario: ${error.message}`
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
