<template>
  <v-list>
    <v-list-item
      v-if="esAdministrador"
      prepend-icon="mdi-book"
      title="Cursos"
      to="/cursos"
    ></v-list-item>
    <v-list-item
      v-if="esAdministrador"
      prepend-icon="mdi-school"
      title="Carreras"
      to="/carreras"
    ></v-list-item>
    <v-list-item
      v-if="esAdministrador"
      prepend-icon="mdi-account-tie"
      title="Profesores"
      to="/profesores"
    ></v-list-item>
    <v-list-item
      v-if="esAdministrador"
      prepend-icon="mdi-account"
      title="Alumnos"
      to="/alumnos"
    ></v-list-item>
    <v-list-item
      v-if="esAdministrador"
      prepend-icon="mdi-calendar"
      title="Ciclos"
      to="/ciclos"
    ></v-list-item>
    <v-list-item
      v-if="esAdministrador"
      prepend-icon="mdi-book-open"
      title="Oferta Académica"
      to="/oferta-academica"
    ></v-list-item>
    <v-list-item
      v-if="esMatriculador"
      prepend-icon="mdi-clipboard-check"
      title="Matrícula"
      to="/matricula"
    ></v-list-item>
    <v-list-item v-if="esProfesor" prepend-icon="mdi-note" title="Notas" to="/notas"></v-list-item>
    <v-list-item
      v-if="esAlumno"
      prepend-icon="mdi-history"
      title="Historial"
      to="/historial"
    ></v-list-item>
  </v-list>
</template>

<script>
import { useUsuarioStore } from '@/stores/usuario'
import { computed } from 'vue'

export default {
  setup() {
    const usuarioStore = useUsuarioStore()

    return {
      esAdministrador: computed(() => usuarioStore.rol === 'administrador'),
      esMatriculador: computed(() => usuarioStore.rol === 'matriculador'),
      esProfesor: computed(() => usuarioStore.rol === 'profesor'),
      esAlumno: computed(() => usuarioStore.rol === 'alumno'),
    }
  },
}
</script>
