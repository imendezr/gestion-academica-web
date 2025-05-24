<template>
  <v-data-table :headers="headers" :items="items" :items-per-page="10" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ titulo }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('crear')">Nuevo</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="$emit('editar', item)">mdi-pencil</v-icon>
      <v-icon @click="$emit('eliminar', item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
    titulo: String,
  },
}
</script>
