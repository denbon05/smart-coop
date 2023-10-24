<script setup lang="ts">
import type { CoopAccount, MemberAccount } from '@/entities/Account';

const props = defineProps<{
  account: CoopAccount | MemberAccount;
  isCoop: boolean;
}>();

const preTitle = props.isCoop ? 'Coop' : 'Member';

const emit = defineEmits(['next', 'cancel']);
</script>

<template>
  <div class="h-100 d-flex flex-column justify-space-around">
    <h4 class="text-h4">{{ `${preTitle} "${props.account.name}"` }}</h4>

    <div class="d-flex justify-space-between">
      <v-list elevation="0" class="bg-transparent">
        <v-list-item class="my-2">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-circle-outline"></v-icon>
          </template>

          <v-list-item-title>{{ account.name }}</v-list-item-title>
        </v-list-item>

        <v-list-item class="my-2">
          <template v-slot:prepend>
            <v-icon icon="mdi-map-marker-outline"></v-icon>
          </template>

          <v-list-item-title>{{ account.location }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <div class="h-100 d-flex flex-column justify-center align-center">
        <v-btn
          @click="emit('next')"
          class="my-2 btn-long font-weight-bold"
          variant="outlined"
          color="secondary-darken-1"
          >Submit</v-btn
        >
        <v-btn
          @click="emit('cancel')"
          class="my-2 btn-long font-weight-bold"
          variant="outlined"
          color="orange"
          >Cancel</v-btn
        >
      </div>
    </div>
  </div>
</template>
