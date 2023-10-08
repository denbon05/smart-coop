<script setup lang="ts">
import { AccountType } from '@/types/entities/account';

const emit = defineEmits<{
  next: [accountType: AccountType];
}>();
</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center flex-column text-center mx-auto px-4"
    elevation="0"
    height="250"
    rounded
    max-width="800"
    width="100%"
  >
    <v-item-group selected-class="bg-primary" class="d-flex">
      <!-- TODO add associative background -->
      <v-item v-slot="{ selectedClass }">
        <v-card
          :class="['d-flex align-center mx-3', selectedClass]"
          height="200"
          @click="emit('next', AccountType.MEMBER)"
          variant="outlined"
          color="secondary-darken-1"
        >
          <div class="text-h4 flex-grow-1 text-center">
            Join existed cooperative
          </div>
        </v-card>
      </v-item>

      <v-item v-slot="{ selectedClass }">
        <v-card
          :class="['d-flex align-center mx-3', selectedClass]"
          height="200"
          @click="emit('next', AccountType.COOP)"
          variant="outlined"
          color="secondary-darken-1"
        >
          <div class="text-h4 flex-grow-1 text-center">
            Register new cooperative
          </div>
        </v-card>
      </v-item>
    </v-item-group>
  </v-sheet>
</template>
