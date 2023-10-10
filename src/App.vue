<script setup lang="ts">
import '@/styles/app.scss';
import { onBeforeMount, provide, ref } from 'vue';
import { isAccountConnectedToCoop } from './api/eth-governor';
import AppSnackbar from './components/common/AppSnackbar.vue';
import AppBar from './components/navbar/AppBar.vue';
import { useAuth } from './composables/auth';
import type { SnackbarParm } from './types/components/common';

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
      const exists = await isAccountConnectedToCoop();
      auth.setAccount({ isMember: exists });
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
      <div class="mb-4 mb-md-5 mb-lg-7"></div>
      <RouterView />
    </v-main>
  </v-app>
</template>
