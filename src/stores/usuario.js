import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    cedula: '',
    rol: '',
    token: '',
  }),
  actions: {
    iniciarSesion(credenciales) {
      // Lógica para llamar al API /auth/login y almacenar los datos
      this.cedula = credenciales.cedula
      this.rol = credenciales.rol
      this.token = credenciales.token
      localStorage.setItem('usuario', JSON.stringify({ cedula: this.cedula, rol: this.rol }))
    },
    cerrarSesion() {
      this.$reset()
      localStorage.removeItem('usuario')
    },
  },
})
