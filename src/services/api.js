import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajusta según tu backend
})

export default {
  getCursos() {
    return api.get('/cursos')
  },
  // Agrega otros endpoints según sea necesario
}
