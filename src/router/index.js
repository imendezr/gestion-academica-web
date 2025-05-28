import { createRouter, createWebHistory } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/VistaInicio.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/VistaLogin.vue'),
  },
  {
    path: '/editar-perfil',
    name: 'EditarPerfil',
    component: () => import('../views/VistaEditarPerfil.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cursos',
    name: 'Cursos',
    component: () => import('../views/VistaCursos.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/carreras',
    name: 'Carreras',
    component: () => import('../views/VistaCarreras.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/profesores',
    name: 'Profesores',
    component: () => import('../views/VistaProfesores.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/alumnos',
    name: 'Alumnos',
    component: () => import('../views/VistaAlumnos.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/ciclos',
    name: 'Ciclos',
    component: () => import('../views/VistaCiclos.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/oferta-academica',
    name: 'OfertaAcademica',
    component: () => import('../views/VistaOfertaAcademica.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/VistaUsuarios.vue'),
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: '/matricula',
    name: 'Matricula',
    component: () => import('../views/VistaMatricula.vue'),
    meta: { requiresAuth: true, roles: ['Matriculador'] },
  },
  {
    path: '/notas',
    name: 'Notas',
    component: () => import('../views/VistaNotas.vue'),
    meta: { requiresAuth: true, roles: ['Profesor'] },
  },
  {
    path: '/historial',
    name: 'Historial',
    component: () => import('../views/VistaHistorial.vue'),
    meta: { requiresAuth: true, roles: ['Alumno'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const usuarioStore = useUsuarioStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredRoles = to.meta.roles || []

  // Título dinámico
  const defaultTitle = 'Gestión Académica'
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle

  if (requiresAuth && !usuarioStore.idUsuario) {
    next('/login')
  } else if (requiresAuth && requiredRoles.length && !requiredRoles.includes(usuarioStore.tipo)) {
    next('/') // Redirigir a home si el rol no coincide
  } else {
    next()
  }
})

export default router
