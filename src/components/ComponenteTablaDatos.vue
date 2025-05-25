<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="10"
    class="elevation-1"
    :show-select="selectable"
    v-model="selectedItems"
    @update:modelValue="emitSelection"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ titulo }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('crear')">Nuevo</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon v-if="showActions" @click="$emit('editar', item)">mdi-pencil</v-icon>
      <v-icon v-if="showActions" @click="$emit('eliminar', item)">mdi-delete</v-icon>
      <!-- Botón para acciones personalizadas -->
      <v-icon v-if="hasCustomAction('ver-historial')" @click="$emit('ver-historial', item)">
        mdi-history
      </v-icon>
      <v-icon v-if="hasCustomAction('marcar-activo')" @click="$emit('marcar-activo', item)">
        mdi-check-circle
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
    titulo: String,
    selectable: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    customActions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedItems: [],
    }
  },
  methods: {
    emitSelection() {
      this.$emit('update:selection', this.selectedItems)
    },
    hasCustomAction(action) {
      return this.customActions.includes(action)
    },
  },
}
</script>
