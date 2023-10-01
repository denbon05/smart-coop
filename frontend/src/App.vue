<script setup lang="ts">
import AppBar from './components/navbar/AppBar.vue';
</script>

<template>
  <v-app>
    <AppBar />

    <v-main>
      <div class="mb-5 mb-md-7 mb-lg-10"></div>
      <RouterView />
    </v-main>
  </v-app>
</template>
