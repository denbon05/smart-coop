<script setup lang="ts">
import BriefDescription from '@/components/welcome/BriefDescription.vue';
import CallToActionBtn from '@/components/welcome/CallToActionBtn.vue';
import CoopSearch from '@/components/welcome/CoopSearch.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isWelcomePage = computed(() => route.name === 'welcome');
</script>

<template>
  <section v-if="isWelcomePage" id="welcome" class="w-100 h-100">
    <v-container fluid class="px-5 px-md-15">
      <CoopSearch id="coopSearch" />
      <BriefDescription id="briefDescription" />
      <CallToActionBtn id="ctaBtn" />
    </v-container>
    <img src="@/assets/images/home-welcome-bg.png" id="welcomeBg" />
  </section>
  <v-container v-else>
    <RouterView />
  </v-container>
</template>

<style lang="scss">
#welcome {
  position: relative;
}

#coopSearch {
  z-index: 10;
}

#briefDescription {
  z-index: 2;
}

#welcome > #welcomeBg {
  // background-image: url('@/assets/home-welcome-bg.png');
  background-color: transparent;
  background-repeat: no-repeat;
  position: absolute;
  width: 100vw !important;
  height: 80vh !important;
  min-height: 600px !important;
  bottom: 0;
  z-index: 5;
}

#ctaBtn {
  // position: relative; // allows apply z-index
  position: absolute;
  bottom: 100px;
  right: 10vw;
  z-index: 10 !important;
}

:root {
  overflow: hidden;
}
</style>
