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
  getCursosbyCiclo(idCiclo) {
    return api.get(`/cursos/buscarCursosPorCiclo/${idCiclo}`);
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
   getAlumnosByGrupo(grupoId) {
    return api.get(`/alumnos/buscarPorGrupo?grupo=${grupoId}`);
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
    return api.get('/ciclos/activo');
  },

  //Grupos
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
  getGruposByCursoCicloAndCarrera(idCurso, idCiclo, idCarrera) {
    return api.get(`/grupos/buscarGruposPorCursoCicloCarrera/${idCurso}/${idCiclo}/${idCarrera}`);
  },
  getGruposByProfesorAndCicloActivo(cedula) {
    return api.get(`/grupos/buscarGruposPorProfesorEnCicloActivo/${cedula}`);
  },

  // Matrícula
  matricular(data) {
    return api.post('/matricular/insertar', data);
  },
  deleteMatricula(idMatricula) {
    return api.delete(`/matricular/eliminar/${idMatricula}`);
  },
  getMatriculasPorAlumno(cedula) {
    return api.get(`/matricular/listarMatriculasPorAlumno/${cedula}`);
  },
  getMatriculasPorAlumnoYCiclo(idAlumno, idCiclo) {
    return api.get(`/matricular/listarMatriculasPorAlumnoYCiclo/${idAlumno}/${idCiclo}`);
  },
  actualizarNota(pkMatricula, pkAlumno, nota) {
  return api.put(`/matricular/actualizarNota/${pkMatricula}/${pkAlumno}/${nota}`);
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
