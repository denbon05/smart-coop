<script setup lang="ts">
import { useAuth } from '@/composables/auth';
import { SnackbarColor, type ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuth();
const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const goToAuth = () => {
  if (!auth.selectedAddress) {
    // wallet is not connected
    showSnackbar({
      msg: 'You have to connect your wallet first',
      color: SnackbarColor.WARN,
    });
    return;
  }

  router.push({
    name: RouteNames.AUTH_COOP,
  });
};
</script>

<template>
  <v-btn
    @click="goToAuth"
    elevation="3"
    class="btn-sunset btn-big text-h5 text-white text-uppercase"
    >Create coop</v-btn
  >
</template>
