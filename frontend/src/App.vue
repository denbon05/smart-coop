<script setup lang="ts">
import '@/styles/app.scss';
import { computed, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppSnackbar from './components/common/AppSnackbar.vue';
import AppBar from './components/navbar/AppBar.vue';
import { useAuth } from './composables/auth';
import type { SnackbarParm } from './types/components/common';
import { RouteNames } from './types/entities/router';

const appSnackbar = ref<InstanceType<typeof AppSnackbar>>();

provide('showSnack', (param: SnackbarParm) => {
  appSnackbar.value?.showSnackbar(param);
});

const auth = useAuth();
const route = useRoute();

const shouldTechBgBeVisible = computed(
  () =>
    ![RouteNames.WELCOME, RouteNames.COOP].some(
      (routeTag) => routeTag === route.name
    )
);
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

    <section
      v-if="!auth.isLoading && shouldTechBgBeVisible"
      class="bg-tech"
    ></section>
  </v-app>
</template>

<style lang="scss">
:root {
  position: relative;
  .bg-tech {
    position: absolute;
    width: 100%;
    height: 200px;
    background-image: url('@/assets/images/bg-electro.svg');
    background-size: cover;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
