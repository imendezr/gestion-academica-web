import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    idUsuario: null,
    cedula: null,
    clave: null,
    tipo: null,
  }),
  actions: {
    iniciarSesion(credenciales) {
      this.idUsuario = credenciales.idUsuario
      this.cedula = credenciales.cedula
      this.clave = credenciales.clave
      this.tipo = credenciales.tipo
      localStorage.setItem('usuario', JSON.stringify({idUsuario: this.idUsuario,
        cedula: this.cedula, clave: this.clave,  tipo: this.tipo}))
    },
    cargarUsuarioLocalStorage() {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (usuario) {
        this.idUsuario = usuario.idUsuario;
        this.cedula = usuario.cedula;
        this.clave = usuario.clave;
        this.tipo = usuario.tipo;
      }
    },
    cerrarSesion() {
      this.$reset()
      localStorage.removeItem('usuario')
    },
  },
})
