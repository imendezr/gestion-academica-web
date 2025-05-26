import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajusta según tu backend
});

export default {
  // Cursos
  getCursos() {
    return api.get('/cursos/listar');
  },
  createCurso(data) {
    return api.post('/cursos/insertar', data);
  },
  updateCurso(codigo, data) {
    return api.put('/cursos/modificar', { ...data, codigo }); // Ajusta según el ID esperado por el backend
  },
  deleteCurso(codigo) {
    return api.delete(`/cursos/eliminar/${codigo}`);
  },
  getCursoByCodigo(codigo) {
    return api.get(`/cursos/buscarPorCodigo?codigo=${codigo}`);
  },
  getCursoByNombre(nombre) {
    return api.get(`/cursos/buscarPorNombre?nombre=${nombre}`);
  },

  // Alumnos
  getAlumnos() {
    return api.get('/alumnos/listar');
  },
  createAlumno(data) {
    return api.post('/alumnos/insertar', data);
  },
  updateAlumno(cedula, data) {
    return api.put('/alumnos/modificar', { ...data, cedula });
  },
  deleteAlumno(cedula) {
    return api.delete(`/alumnos/eliminar/${cedula}`);
  },
  getAlumnoByCedula(cedula) {
    return api.get(`/alumnos/buscarPorCedula?cedula=${cedula}`);
  },
  getAlumnoByNombre(nombre) {
    return api.get(`/alumnos/buscarPorNombre?nombre=${nombre}`);
  },
  getAlumnosByCarrera(carreraId) {
    return api.get(`/alumnos/buscarPorCarrera?carrera=${carreraId}`);
  },
  getHistorial(cedula) {
    return api.get(`/alumnos/historialAlumno/${cedula}`);
  },

  // Carreras
  getCarreras() {
    return api.get('/carreras/listar');
  },
  createCarrera(data) {
    return api.post('/carreras/insertar', data);
  },
  updateCarrera(codigo, data) {
    return api.put('/carreras/modificar', { ...data, codigo });
  },
  deleteCarrera(codigo) {
    return api.delete(`/carreras/eliminar/${codigo}`);
  },
  getCarreraByCodigo(codigo) {
    return api.get(`/carreras/buscarPorCodigo?codigo=${codigo}`);
  },
  getCarreraByNombre(nombre) {
    return api.get(`/carreras/buscarPorNombre?nombre=${nombre}`);
  },
  addCursoToCarrera(carreraId, cursoId, cicloId) {
    return api.post(`/carreras/insertarCursoACarrera/${carreraId}/${cursoId}/${cicloId}`);
  },
  removeCursoFromCarrera(carreraId, cursoId) {
    return api.delete(`/carreras/eliminarCursoDeCarrera/${carreraId}/${cursoId}`);
  },
  updateCursoOrder(carreraId, cursoId, nuevoCicloId) {
    return api.put(
      `/carreras/modificarOrdenCursoCarrera/${carreraId}/${cursoId}/${nuevoCicloId}`
    );
  },

  // Ciclos
  getCiclos() {
    return api.get('/ciclos/listar');
  },
  createCiclo(data) {
    return api.post('/ciclos/insertar', data);
  },
  updateCiclo(codigo, data) {
    return api.put('/ciclos/modificar', { ...data, codigo });
  },
  deleteCiclo(codigo) {
    return api.delete(`/ciclos/eliminar/${codigo}`);
  },
  getCicloByYear(anio) {
    return api.get(`/ciclos/buscarPorAnnio?annio=${anio}`);
  },
  setCicloActivo(cicloId) {
    return api.post(`/ciclos/activarCiclo/${cicloId}`);
  },
  getCicloActivo() {
    return api.get('/ciclos/activo'); // Suponiendo que existe un endpoint para obtener el ciclo activo
  },

  // Oferta Académica
  getOfertaAcademica() {
    return api.get('/grupos/listar'); // Ajuste según backend real
  },
  getOfertaAcademicaByCarrera(carreraId) {
    return api.get(`/grupos/buscarCursosPorCarreraYCiclo/${carreraId}`);
  },
  createOfertaAcademica(data) {
    return api.post('/grupos/insertar', data);
  },
  updateOfertaAcademica(cicloId, cursoId, data) {
    return api.put(`/grupos/modificar`, { ...data, ciclo: cicloId, curso: cursoId }); // Ajuste
  },
  deleteOfertaAcademica(cicloId, cursoId) {
    return api.delete(`/grupos/eliminar/${cicloId}/${cursoId}`); // Ajuste
  },

  // Matrícula
  matricular(data) {
    return api.post('/matricular/insertar', data);
  },
  getMatriculas(cicloId, cursoId) {
    return api.get(`/matricular/listar?ciclo=${cicloId}&curso=${cursoId}`); // Ajuste
  },
  updateNota(alumnoId, cicloId, cursoId, data) {
    return api.put(`/matricular/modificar`, {
      ...data,
      alumno: alumnoId,
      ciclo: cicloId,
      curso: cursoId,
    });
  },

  // Profesores
  getProfesores() {
    return api.get('/profesores/listar');
  },
  createProfesor(data) {
    return api.post('/profesores/insertar', data);
  },
  updateProfesor(cedula, data) {
    return api.put('/profesores/modificar', { ...data, cedula });
  },
  deleteProfesor(cedula) {
    return api.delete(`/profesores/eliminar/${cedula}`);
  },
  getProfesorByCedula(cedula) {
    return api.get(`/profesores/buscarPorCedula?cedula=${cedula}`);
  },
  getProfesorByNombre(nombre) {
    return api.get(`/profesores/buscarPorNombre?nombre=${nombre}`);
  },

  // Usuarios
  getUsuarios() {
    return api.get('/usuarios/listar');
  },
  createUsuario(data) {
    return api.post('/usuarios/insertar', data);
  },
  updateUsuario(cedula, data) {
    return api.put('/usuarios/modificar', { ...data, cedula });
  },
  deleteUsuario(cedula) {
    return api.delete(`/usuarios/eliminar/${cedula}`);
  },
  getUsuarioByCedula(cedula) {
    return api.get(`/usuarios/buscarPorCedula?cedula=${cedula}`);
  },
  login(cedula, clave) {
    return api.post(`/usuarios/login?cedula=${cedula}&clave=${clave}`);
  },
};
