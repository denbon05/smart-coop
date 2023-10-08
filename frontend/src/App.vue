<script setup lang="ts">
import { provide, ref, onBeforeMount } from 'vue';
import AppSnackbar from './components/common/AppSnackbar.vue';
import AppBar from './components/navbar/AppBar.vue';
import type { SnackbarParm } from './types/components/common';
import { useAuth } from './composables/auth';
import { fetchAccountData } from './api/eth-governor';

const isAccountFetching = ref(false);

const auth = useAuth();

const appSnackbar = ref<InstanceType<typeof AppSnackbar>>();

provide('showSnack', (param: SnackbarParm) => {
  appSnackbar.value?.showSnackbar(param);
});

onBeforeMount(async () => {
  if (auth.selectedAddress) {
    isAccountFetching.value = true;
    try {
      // try to define the user
      const account = await fetchAccountData();
      auth.setAccount(account);
    } catch (err) {
      console.error(err);
      appSnackbar.value?.showSnackbar({ msg: "Can't fetch user account data" });
    }
    isAccountFetching.value = false;
  }
});
</script>

<template>
  <v-app>
    <AppBar :isAccountFetching="isAccountFetching" />
    <AppSnackbar ref="appSnackbar" />

    <v-main v-if="!isAccountFetching">
      <!-- render after account determined if there is one -->
      <div class="mb-5 mb-md-7 mb-lg-10"></div>
      <RouterView />
    </v-main>
  </v-app>
</template>
