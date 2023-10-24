<script setup lang="ts">
const items = [
  { text: 'Real-Time', icon: 'mdi-clock' },
  { text: 'Audience', icon: 'mdi-account' },
  { text: 'Conversions', icon: 'mdi-flag' },
];
</script>

<template>
  <v-card class="mx-auto" max-width="300">
    <v-list disabled>
      <v-list-subheader>Workers</v-list-subheader>

      <v-list-item v-for="(item, i) in items" :key="i">
        <template v-slot:prepend>
          <v-icon icon="mdi-account"></v-icon>
        </template>

        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>
