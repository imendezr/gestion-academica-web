// stores/usuario.js
import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    idUsuario: null,
    cedula: '',
    clave: '',
    tipo: null,
  }),

  getters: {
    estaAutenticado: (state) => {
      return state.idUsuario !== null &&
             state.idUsuario !== undefined &&
             state.idUsuario !== ''
    }
  },

  actions: {
    iniciarSesion(datosUsuario) {
      this.idUsuario = datosUsuario.idUsuario
      this.cedula = datosUsuario.cedula
      this.clave = datosUsuario.clave
      this.tipo = datosUsuario.tipo

      // Guardar en localStorage
      this.guardarEnLocalStorage()
    },

    cerrarSesion() {
      // Limpiar completamente el estado
      this.idUsuario = null
      this.cedula = ''
      this.clave = ''
      this.tipo = null

      // Limpiar localStorage
      localStorage.removeItem('usuario')
    },

    cargarUsuarioLocalStorage() {
      const usuarioGuardado = localStorage.getItem('usuario')
      if (usuarioGuardado) {
        try {
          const datos = JSON.parse(usuarioGuardado)
          // Solo cargar si los datos son válidos
          if (datos.idUsuario) {
            this.idUsuario = datos.idUsuario
            this.cedula = datos.cedula || ''
            this.clave = datos.clave || ''
            this.tipo = datos.tipo || null
          }
        } catch (error) {
          console.error('Error al cargar usuario del localStorage:', error)
          // Si hay error, limpiar localStorage corrupto
          localStorage.removeItem('usuario')
        }
      }
    },

    guardarEnLocalStorage() {
      const datosUsuario = {
        idUsuario: this.idUsuario,
        cedula: this.cedula,
        clave: this.clave,
        tipo: this.tipo
      }
      localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    }
  }
})
