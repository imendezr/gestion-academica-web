<template>
  <v-dialog v-model="dialogLocal" max-width="500">
    <v-card>
      <v-card-title>{{ titulo }}</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="guardar">
          <template v-for="(field, index) in fields" :key="index">
            <v-text-field
              v-if="field.type === 'text' || field.type === 'number'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              :type="field.type"
              :rules="field.rules || []"
              :required="field.required"
            ></v-text-field>
            <!-- Campo de selección múltiple (para cursos) -->
            <v-select
              v-if="field.type === 'select-multiple'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              :items="field.items || []"
              :item-title="field.itemTitle || 'nombre'"
              :item-value="field.itemValue || 'codigo'"
              multiple
              chips
              class="mb-4"
            ></v-select>
          </template>
          <v-btn color="primary" type="submit">Guardar</v-btn>
          <v-btn color="secondary" @click="cancelar">Cancelar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/services/api'

export default {
  props: {
    dialog: Boolean,
    datos: Object,
    titulo: {
      type: String,
      default: 'Formulario',
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogLocal: this.dialog,
      datosLocal: { ...this.datos },
      cursosDisponibles: [],
    }
  },
  async created() {
    // Cargar cursos solo si hay un campo que los necesita
    if (this.fields.some((field) => field.type === 'select-multiple' && field.key === 'cursos')) {
      try {
        const response = await api.get('/cursos')
        this.cursosDisponibles = response.data
      } catch (error) {
        console.error('Error al cargar cursos disponibles:', error.message)
      }
    }
  },
  watch: {
    dialog(newValue) {
      this.dialogLocal = newValue
    },
    datos(newValue) {
      this.datosLocal = { ...newValue }
    },
  },
  methods: {
    guardar() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.$emit('guardar', { ...this.datosLocal })
          this.cancelar()
        }
      })
    },
    cancelar() {
      this.$emit('update:dialog', false)
      this.$emit('cancelar')
    },
  },
}
</script>
