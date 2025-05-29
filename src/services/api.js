import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default {
  // Cursos
  getCursos() {
    return api.get('/cursos/listar');
  },
  createCurso(data) {
    return api.post('/cursos/insertar', data);
  },
  updateCurso(data) {
    return api.put('/cursos/modificar', data);
  },
  deleteCurso(idCurso) {
    return api.delete(`/cursos/eliminar/${idCurso}`);
  },
  getCursoByCodigo(codigo) {
    return api.get(`/cursos/buscarPorCodigo?codigo=${codigo}`);
  },
  getCursoByNombre(nombre) {
    return api.get(`/cursos/buscarPorNombre?nombre=${nombre}`);
  },
  getCursosbyCarrera(idCarrera) {
    return api.get(`/cursos/buscarCursosPorCarrera?idCarrera=${idCarrera}`);
  },
  getCursosbyCarreraAndCiclo(idCarrera, idCiclo) {
    return api.get(`/cursos/buscarCursosPorCarreraYCiclo/${idCarrera}/${idCiclo}`);
  },

  // Alumnos
  getAlumnos() {
    return api.get('/alumnos/listar');
  },
  createAlumno(data) {
    return api.post('/alumnos/insertar', data);
  },
  updateAlumno(data) {
    return api.put('/alumnos/modificar', data);
  },
  deleteAlumno(idAlumno) {
    return api.delete(`/alumnos/eliminar/${idAlumno}`);
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
  updateCarrera(data) {
    return api.put('/carreras/modificar', data);
  },
  deleteCarrera(idCarrera) {
    return api.delete(`/carreras/eliminar/${idCarrera}`);
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
  updateCiclo(data) {
    return api.put('/ciclos/modificar',data);
  },
  deleteCiclo(idCiclo) {
    return api.delete(`/ciclos/eliminar/${idCiclo}`);
  },
  getCicloByYear(anio) {
    return api.get(`/ciclos/buscarPorAnnio?annio=${anio}`);
  },
  setCicloActivo(idCiclo) {
    return api.post(`/ciclos/activarCiclo/${idCiclo}`);
  },
  getCicloActivo() {
    return api.get('/ciclos/activo'); // Suponiendo que existe un endpoint para obtener el ciclo activo
  },

  // Oferta Académica
  getGrupos() {
    return api.get('/grupos/listar');
  },
  createGrupo(data) {
    return api.post('/grupos/insertar', data);
  },
  updateGrupo(data) {
    return api.put(`/grupos/modificar`, data);
  },
  deleteGrupo(idGrupo) {
    return api.delete(`/grupos/eliminar/${idGrupo}`);
  },
  getGruposByCarreraAndCurso(idCarrera, idCurso) {
      return api.get(`/grupos/buscarGruposPorCarreraCurso/${idCarrera}/${idCurso}`);
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
  updateProfesor(data) {
    return api.put('/profesores/modificar', data);
  },
  deleteProfesor(idProfesor) {
    return api.delete(`/profesores/eliminar/${idProfesor}`);
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
  updateUsuario(data) {
    return api.put('/usuarios/modificar', data);
  },
  deleteUsuario(idUsuario) {
    return api.delete(`/usuarios/eliminar/${idUsuario}`);
  },
  getUsuarioByCedula(cedula) {
    return api.get(`/usuarios/buscarPorCedula?cedula=${cedula}`);
  },
  login(cedula, clave) {
    return api.post(`/usuarios/login?cedula=${cedula}&clave=${clave}`);
  },
};
