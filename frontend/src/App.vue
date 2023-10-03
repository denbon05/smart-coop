<script setup lang="ts">
import { provide, ref } from 'vue';
import AppSnackbar from './components/common/AppSnackbar.vue';
import AppBar from './components/navbar/AppBar.vue';
import type { SnackbarParm } from './types/components/common';

const appSnackbar = ref<InstanceType<typeof AppSnackbar>>();

provide('showSnack', (param: SnackbarParm) => {
  appSnackbar.value?.showSnackbar(param);
});
</script>

<template>
  <v-app>
    <AppBar />
    <AppSnackbar ref="appSnackbar" />

    <v-main>
      <div class="mb-5 mb-md-7 mb-lg-10"></div>
      <RouterView />
    </v-main>
  </v-app>
</template>
