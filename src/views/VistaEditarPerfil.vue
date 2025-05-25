<template>
  <v-container>
    <componente-notificacion
      v-model:visible="notificacionVisible"
      :mensaje="mensajeNotificacion"
      :color="colorNotificacion"
    />
    <v-card max-width="500" class="mx-auto">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Editar Perfil</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="actualizarPerfil">
          <v-text-field
            v-model="cedula"
            label="Cédula"
            prepend-icon="mdi-account"
            disabled
          ></v-text-field>
          <v-text-field
            v-model="clave"
            label="Nueva Contraseña"
            prepend-icon="mdi-lock"
            type="password"
            :rules="claveRules"
            required
          ></v-text-field>
          <v-btn
            color="primary"
            type="submit"
            block
            :disabled="!valid || loading"
            :loading="loading"
          >
            Guardar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api'
import { useUsuarioStore } from '@/stores/usuario'
import ComponenteNotificacion from '@/components/ComponenteNotificacion.vue'

export default {
  components: { ComponenteNotificacion },
  data: () => ({
    cedula: '',
    clave: '',
    valid: false,
    loading: false,
    notificacionVisible: false,
    mensajeNotificacion: '',
    colorNotificacion: 'info',
    claveRules: [
      (v) => !!v || 'La contraseña es requerida',
      (v) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
    ],
  }),
  created() {
    const usuarioStore = useUsuarioStore()
    if (!usuarioStore.token) {
      this.$router.push('/login')
      return
    }
    this.cedula = usuarioStore.cedula
    if (!this.cedula) {
      this.mostrarNotificacion('Error: No se pudo obtener la cédula del usuario', 'error')
      this.$router.push('/login')
    }
  },
  methods: {
    async actualizarPerfil() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      try {
        await api.put(`/usuarios/${this.cedula}`, { clave: this.clave })
        this.mostrarNotificacion('Contraseña actualizada exitosamente', 'success')
        this.$router.push('/')
      } catch (error) {
        this.mostrarNotificacion(
          `Error al actualizar: ${error.response?.data?.message || error.message}`,
          'error',
        )
      } finally {
        this.loading = false
      }
    },
    mostrarNotificacion(mensaje, color) {
      this.mensajeNotificacion = mensaje
      this.colorNotificacion = color
      this.notificacionVisible = true
    },
  },
}
</script>
