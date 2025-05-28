<template>
  <v-dialog v-model="dialogLocal" max-width="500">
    <v-card>
      <v-card-title>{{ titulo }}</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="guardar">
          <template v-for="(field, index) in fields" :key="index">
            <!-- Textos y números -->
            <v-text-field
              v-if="field.type === 'text' || field.type === 'number'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              :type="field.type"
              :rules="field.rules || []"
              :required="field.required"
              class="mb-4"
            ></v-text-field>

             <!-- Email -->
            <v-text-field
              v-else-if="field.type === 'email'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              type="email"
              :rules="field.rules || []"
              :required="field.required"
              class="mb-4"
            ></v-text-field>

            <!-- Select simple -->
            <v-select
              v-else-if="field.type === 'select'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              :items="field.items || []"
              :item-title="field.itemTitle || 'label'"
              :item-value="field.itemValue || 'value'"
              class="mb-4"
            ></v-select>

            <!-- Select múltiple -->
            <v-select
              v-else-if="field.type === 'select-multiple'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              :items="field.items || []"
              :item-title="field.itemTitle || 'label'"
              :item-value="field.itemValue || 'value' "
              multiple
              chips
              class="mb-4"
            ></v-select>

            <!-- Área de texto -->
            <v-textarea
              v-else-if="field.type === 'textarea'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              :rules="field.rules || []"
              :required="field.required"
              class="mb-4"
            ></v-textarea>

            <!-- Fecha -->
            <v-text-field
              v-else-if="field.type === 'date'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              type="date"
              class="mb-4"
            ></v-text-field>

            <!-- Checkbox -->
            <v-checkbox
              v-else-if="field.type === 'checkbox'"
              v-model="datosLocal[field.key]"
              :label="field.label"
              class="mb-4"
            ></v-checkbox>
          </template>

          <v-btn color="primary" type="submit">Guardar</v-btn>
          <v-btn color="secondary" @click="cancelar">Cancelar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FormularioDialogo',
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
    }
  },
  watch: {
    dialog(newVal) {
      this.dialogLocal = newVal
    },
    datos(newVal) {
      this.datosLocal = { ...newVal }
    },
    dialogLocal(newVal) {
      this.$emit('update:dialog', newVal)
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
