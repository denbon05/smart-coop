<script setup lang="ts">
import AppError from '@/errors/AppError';
import { Account } from '@/utils/auth';
import { computed } from 'vue';

const props = defineProps({
  account: {
    required: true,
    type: Account,
  },
});

const emit = defineEmits(['next', 'cancel']);

const account = computed(() => {
  const {
    account: { memberData, getAccountType },
  } = props;
  if (!memberData) {
    throw new AppError('"memberData" should be specified!');
  }

  return {
    type: getAccountType(),
    ...memberData,
  };
});
</script>

<template>
  <div class="d-flex justify-space-around">
    <v-sheet>
      <v-list elevation="0">
        <v-list-subheader>{{ account.type }}</v-list-subheader>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon icon="mdi-account-circle"></v-icon>
          </template>

          <v-list-item-title>{{ account.name }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon icon="mdi-map-marker"></v-icon>
          </template>

          <v-list-item-title>{{ account.location }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-icon icon="mdi-at"></v-icon>
          </template>

          <v-list-item-title>{{ account.email }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-sheet>
    <div class="d-flex flex-column justify-center">
      <v-btn
        @click="emit('cancel')"
        class="my-2"
        variant="outlined"
        color="orange"
        >Cancel</v-btn
      >
      <v-btn
        @click="emit('next')"
        class="my-2"
        variant="outlined"
        color="secondary-darken-1"
        >Submit</v-btn
      >
    </div>
  </div>
</template>
