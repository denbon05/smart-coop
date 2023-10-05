<script setup lang="ts">
import { connectToWallet, fetchAccountData } from '@/api/ethers';
import { useAuth } from '@/composables/auth';
import AppError from '@/errors/AppError';
import type { ShowSnackbar } from '@/types/components/common';
import { inject } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const router = useRouter();
const route = useRoute();
const auth = useAuth();
console.log('auth', auth);

const connectWallet = async () => {
  try {
    const signer = await connectToWallet();
    const account = await fetchAccountData(signer);
    console.log('!!!!!!', account.exists);
    if (account.exists) {
      // show main page
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
    class="px-3"
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
      ><RouterLink to="/" class="text-decoration-none text-white">
        Smart Coop</RouterLink
      ></v-app-bar-title
    >

    <v-spacer></v-spacer>

    <template v-if="auth.user.isLogged">
      <RouterLink to="/coop">
        <v-btn plain color="white"> Coop </v-btn>
      </RouterLink>
      <RouterLink to="/member">
        <v-btn plain color="white"> Account </v-btn>
      </RouterLink>
    </template>
    <v-btn v-else plain @click="connectWallet"> Connect </v-btn>
  </v-app-bar>
</template>
