<template>
  <v-snackbar v-model="visibleLocal" :color="color" :timeout="timeout">
    {{ mensaje }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="cerrar">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    visible: Boolean, // Prop recibida del padre (solo lectura)
    mensaje: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'info',
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      visibleLocal: this.visible, // Dato local para controlar la visibilidad
    }
  },
  watch: {
    visible(newValue) {
      this.visibleLocal = newValue // Sincroniza el estado local con la prop
    },
  },
  methods: {
    cerrar() {
      this.$emit('update:visible', false) // Emite evento para cerrar la notificación
    },
  },
}
</script>
