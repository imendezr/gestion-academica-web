import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/VistaLogin.vue'),
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/VistaRegistro.vue'),
    },
    {
      path: '/',
      name: 'inicio',
      component: () => import('../views/VistaInicio.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/VistaUsuarios.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('../views/VistaCursos.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/carreras',
      name: 'carreras',
      component: () => import('../views/VistaCarreras.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/profesores',
      name: 'profesores',
      component: () => import('../views/VistaProfesores.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/alumnos',
      name: 'alumnos',
      component: () => import('../views/VistaAlumnos.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/ciclos',
      name: 'ciclos',
      component: () => import('../views/VistaCiclos.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/oferta-academica',
      name: 'oferta-academica',
      component: () => import('../views/VistaOfertaAcademica.vue'),
      meta: { requiresAuth: true, roles: ['administrador'] },
    },
    {
      path: '/matricula',
      name: 'matricula',
      component: () => import('../views/VistaMatricula.vue'),
      meta: { requiresAuth: true, roles: ['matriculador', 'administrador'] },
    },
    {
      path: '/notas',
      name: 'notas',
      component: () => import('../views/VistaNotas.vue'),
      meta: { requiresAuth: true, roles: ['profesor'] },
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('../views/VistaHistorial.vue'),
      meta: { requiresAuth: true, roles: ['alumno'] },
    },
  ],
})

// Guardia de navegación para autenticación y roles
router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}

  // Título dinámico
  const defaultTitle = 'Gestión Académica'
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle

  if (to.meta.requiresAuth && !usuario.cedula) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(usuario.rol)) {
    next('/inicio')
  } else {
    next()
  }
})

export default router
