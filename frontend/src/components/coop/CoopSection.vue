<script setup lang="ts">
defineProps<{
  link: string;
}>();
</script>

<template>
  <RouterLink to="/coop/proposals" class="text-decoration-none">
    <v-item v-slot="{ isSelected, toggle }">
      <v-card
        :color="isSelected ? 'primary' : ''"
        class="d-flex align-center"
        dark
        height="200"
        @click="toggle"
      >
        <v-scroll-y-transition>
          <div class="text-h3 flex-grow-1 text-center">
            <slot></slot>
          </div>
        </v-scroll-y-transition>
      </v-card>
    </v-item>
  </RouterLink>
</template>
