<script setup lang="ts">
import { isAccountConnectedToCoop } from '@/api/eth-governor';
import { connectToWallet } from '@/api/eth-wallet';
import { useAuth } from '@/composables/auth';
import AppError from '@/errors/AppError';
import type { ShowSnackbar } from '@/types/components/common';
import { inject } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const props = defineProps<{
  isAccountFetching: boolean;
}>();

const router = useRouter();
const auth = useAuth();
console.log('AppBar auth', auth);

const connectWallet = async () => {
  try {
    await connectToWallet();
    const isAccountInCoop = await isAccountConnectedToCoop();
    if (isAccountInCoop) {
      // show main page
      router.push({
        name: 'home',
      });
    } else {
      // redirect to auth page
      router.push({
        name: 'auth',
      });
    }
  } catch (err) {
    const msg =
      err instanceof AppError ? err.message : 'Something went terribly wrong';
    showSnackbar({ msg });
    console.error(err);
  }
};
</script>

<template>
  <v-app-bar
    :elevation="2"
    color="teal-darken-4"
    image="https://picsum.photos/1920/1080?random"
    class="px-3 px-md-7 px-lg-10"
  >
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
      ></v-img>
    </template>

    <template v-slot:prepend>
      <RouterLink to="/">
        <v-app-bar-nav-icon>
          <img src="@/assets/top-smart-tree.png" width="50" height="45" />
        </v-app-bar-nav-icon>
      </RouterLink>
    </template>

    <v-app-bar-title
      ><RouterLink
        to="/"
        class="text-decoration-none text-white"
        id="logoTitle"
      >
        Smart Coop</RouterLink
      ></v-app-bar-title
    >

    <v-spacer></v-spacer>

    <template v-if="!props.isAccountFetching">
      <!-- show buttons after account fetched if there is one -->
      <template v-if="auth.account?.exists">
        <RouterLink to="/member">
          <v-btn variant="outlined" color="white" class="mx-2"> Account </v-btn>
        </RouterLink>
      </template>
      <v-btn v-else plain @click="connectWallet"> Connect </v-btn>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped>
#logoTitle {
  font-family: 'Jeju Hallasan';
  font-weight: 400;
}
</style>
