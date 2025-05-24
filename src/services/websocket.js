import { useUsuarioStore } from '@/stores/usuario'

class WebSocketService {
  constructor() {
    this.socket = null
    this.callbacks = new Map()
  }

  connect() {
    const usuarioStore = useUsuarioStore()
    const token = usuarioStore.token

    if (!token) {
      console.warn('No se puede conectar al WebSocket: usuario no autenticado')
      return
    }

    // Conectar al servidor WebSocket (ajusta la URL según tu backend)
    this.socket = new WebSocket(`ws://localhost:8080/ws/notificaciones?token=${token}`)

    this.socket.onopen = () => {
      console.log('Conectado al servidor WebSocket')
    }

    this.socket.onclose = () => {
      console.log('Desconectado del servidor WebSocket')
    }

    this.socket.onerror = (error) => {
      console.error('Error de conexión WebSocket:', error)
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('Notificación recibida:', data)
      this.emitCallback('notificacion', data)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      console.log('WebSocket desconectado manualmente')
    }
  }

  on(evento, callback) {
    if (!this.callbacks.has(evento)) {
      this.callbacks.set(evento, [])
    }
    this.callbacks.get(evento).push(callback)
  }

  emitCallback(evento, data) {
    const callbacks = this.callbacks.get(evento) || []
    callbacks.forEach((callback) => callback(data))
  }

  emit(evento, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ evento, data }))
    } else {
      console.warn(`No se puede emitir el evento '${evento}': WebSocket no está conectado`)
    }
  }
}

const webSocketService = new WebSocketService()
export default webSocketService
