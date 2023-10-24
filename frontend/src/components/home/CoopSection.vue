<script setup lang="ts">
import type { RouteNames } from '@/types/entities/router';
import { useRoute } from 'vue-router';

defineProps<{
  linkName: RouteNames;
  disabled?: boolean;
}>();

const route = useRoute();
</script>

<template>
  <RouterLink
    :to="{
      name: disabled ? route.name! : linkName,
    }"
    class="text-decoration-none"
    :disabled="disabled"
  >
    <v-item :disabled="disabled" v-slot="{ toggle }">
      <v-card
        color="light-green-accent-2"
        class="d-flex align-center my-2"
        dark
        :disabled="disabled"
        elevation="2"
        height="230"
        width="400"
        variant="outlined"
        rounded="lg"
        border="5"
        @click="toggle"
      >
        <v-scroll-y-transition>
          <div class="text-h3 text-deep-orange flex-grow-1 text-center">
            <slot></slot>
          </div>
        </v-scroll-y-transition>
      </v-card>
    </v-item>
  </RouterLink>
</template>
