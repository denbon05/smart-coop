<script setup lang="ts">
defineProps<{
  link: string;
}>();
</script>

<template>
  <RouterLink :to="link" class="text-decoration-none">
    <v-item v-slot="{ toggle }">
      <v-card
        color="light-green-accent-2"
        class="d-flex align-center my-2"
        dark
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
