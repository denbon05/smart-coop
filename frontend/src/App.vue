<script setup lang="ts">
import '@/styles/app.scss';
import { provide, ref } from 'vue';
import AppSnackbar from './components/common/AppSnackbar.vue';
import AppBar from './components/navbar/AppBar.vue';
import { useAuth } from './composables/auth';
import type { SnackbarParm } from './types/components/common';

const appSnackbar = ref<InstanceType<typeof AppSnackbar>>();

provide('showSnack', (param: SnackbarParm) => {
  appSnackbar.value?.showSnackbar(param);
});

const auth = useAuth();
</script>

<template>
  <v-app>
    <AppBar :isAccountFetching="auth.isLoading" />
    <AppSnackbar ref="appSnackbar" />

    <v-main v-if="!auth.isLoading">
      <!-- render after account determined if there is one -->
      <div class="mb-4 mb-md-5 mb-lg-7"></div>
      <RouterView />
    </v-main>
  </v-app>
</template>
