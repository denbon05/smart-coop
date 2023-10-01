<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useUser } from '@/composables/user';
import { connectToWallet } from '@/api/ethers';

const user = useUser();
console.log('user', user);

const connectWallet = async () => {
  try {
    await connectToWallet();
  } catch (err) {
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

    <template v-if="user.selectedAddress">
      <RouterLink to="/member">
        <v-btn plain color="white"> Member </v-btn>
      </RouterLink>
      <RouterLink to="/coop">
        <v-btn plain color="white"> Coop </v-btn>
      </RouterLink>
    </template>
    <v-btn v-else plain @click="connectWallet"> Connect </v-btn>
  </v-app-bar>
</template>
