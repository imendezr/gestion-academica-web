<template>
  <v-dialog v-model="dialogLocal" max-width="500">
    <v-card>
      <v-card-title>{{ titulo }}</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="guardar">
          <v-text-field
            v-model="datosLocal.codigo"
            label="Código"
            :rules="[(v) => !!v || 'El código es requerido']"
            required
          ></v-text-field>
          <v-text-field
            v-model="datosLocal.nombre"
            label="Nombre"
            :rules="[(v) => !!v || 'El nombre es requerido']"
            required
          ></v-text-field>
          <v-text-field
            v-model="datosLocal.creditos"
            label="Créditos"
            type="number"
            :rules="[(v) => (v && v > 0) || 'Los créditos deben ser mayores a 0']"
            required
          ></v-text-field>
          <v-text-field
            v-model="datosLocal.horasSemanales"
            label="Horas Semanales"
            type="number"
            :rules="[(v) => (v && v > 0) || 'Las horas deben ser mayores a 0']"
            required
          ></v-text-field>
          <v-btn color="primary" type="submit">Guardar</v-btn>
          <v-btn color="secondary" @click="cancelar">Cancelar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean, // Prop recibida del padre (solo lectura)
    datos: Object, // Datos iniciales (por ejemplo, para edición)
    titulo: {
      type: String,
      default: 'Formulario',
    },
  },
  data() {
    return {
      dialogLocal: this.dialog, // Dato local para controlar el diálogo
      datosLocal: { ...this.datos }, // Copia local de los datos para evitar mutación directa
    }
  },
  watch: {
    dialog(newValue) {
      this.dialogLocal = newValue // Sincroniza el estado local con la prop cuando cambia
    },
    datos(newValue) {
      this.datosLocal = { ...newValue } // Actualiza los datos locales si la prop cambia
    },
  },
  methods: {
    guardar() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.$emit('guardar', { ...this.datosLocal }) // Emite los datos al padre
          this.cancelar() // Cierra el diálogo tras guardar
        }
      })
    },
    cancelar() {
      this.$emit('update:dialog', false) // Emite evento para cerrar el diálogo
      this.$emit('cancelar') // Opcional: notifica al padre del cancelamiento
    },
  },
}
</script>
