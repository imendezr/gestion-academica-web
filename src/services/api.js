import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajusta según tu backend
})

export default {
  // Cursos
  getCursos() {
    return api.get('/cursos')
  },
  createCurso(data) {
    return api.post('/cursos', data)
  },
  updateCurso(codigo, data) {
    return api.put(`/cursos/${codigo}`, data)
  },
  deleteCurso(codigo) {
    return api.delete(`/cursos/${codigo}`)
  },

  // Alumnos
  getAlumnos() {
    return api.get('/alumnos')
  },
  createAlumno(data) {
    return api.post('/alumnos', data)
  },
  updateAlumno(cedula, data) {
    return api.put(`/alumnos/${cedula}`, data)
  },
  deleteAlumno(cedula) {
    return api.delete(`/alumnos/${cedula}`)
  },

  // Carreras
  getCarreras() {
    return api.get('/carreras')
  },
  createCarrera(data) {
    return api.post('/carreras', data)
  },
  updateCarrera(codigo, data) {
    return api.put(`/carreras/${codigo}`, data)
  },
  deleteCarrera(codigo) {
    return api.delete(`/carreras/${codigo}`)
  },

  // Ciclos
  getCiclos() {
    return api.get('/ciclos')
  },
  createCiclo(data) {
    return api.post('/ciclos', data)
  },
  updateCiclo(codigo, data) {
    return api.put(`/ciclos/${codigo}`, data)
  },
  deleteCiclo(codigo) {
    return api.delete(`/ciclos/${codigo}`)
  },
  setCicloActivo(data) {
    return api.post('/ciclos/activo', data)
  },
  getCicloActivo() {
    return api.get('/ciclos/activo')
  },

  // Historial
  getHistorial(cedula) {
    return api.get(`/historial/${cedula}`)
  },

  // Oferta Académica
  getOfertaAcademica() {
    return api.get('/oferta-academica')
  },
  getOfertaAcademicaByCarrera(carrera) {
    return api.get(`/oferta-academica?carrera=${carrera}`)
  },
  createOfertaAcademica(data) {
    return api.post('/oferta-academica', data)
  },
  updateOfertaAcademica(ciclo, curso, data) {
    return api.put(`/oferta-academica/${ciclo}/${curso}`, data)
  },
  deleteOfertaAcademica(ciclo, curso) {
    return api.delete(`/oferta-academica/${ciclo}/${curso}`)
  },

  // Matrícula
  matricular(data) {
    return api.post('/matricula', data)
  },
  getMatriculas(ciclo, curso) {
    return api.get(`/matricula?ciclo=${ciclo}&curso=${curso}`)
  },
  updateNota(alumno, ciclo, curso, data) {
    return api.put(`/matricula/${alumno}/${ciclo}/${curso}`, data)
  },

  // Profesores
  getProfesores() {
    return api.get('/profesores')
  },
  createProfesor(data) {
    return api.post('/profesores', data)
  },
  updateProfesor(cedula, data) {
    return api.put(`/profesores/${cedula}`, data)
  },
  deleteProfesor(cedula) {
    return api.delete(`/profesores/${cedula}`)
  },

  // Usuarios (Administradores y Matriculadores)
  getUsuarios() {
    return api.get('/usuarios')
  },
  createUsuario(data) {
    return api.post('/usuarios', data)
  },
  updateUsuario(cedula, data) {
    return api.put(`/usuarios/${cedula}`, data)
  },
  deleteUsuario(cedula) {
    return api.delete(`/usuarios/${cedula}`)
  },
}
