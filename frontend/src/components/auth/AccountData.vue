<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import type { AccountData } from '@/types/entities/account';

const emit = defineEmits<{
  next: [accountData: AccountData];
}>();

const { handleSubmit } = useForm({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 3) return true;

      return 'Name needs to be at least 3 characters.';
    },
    location(value: string) {
      if (value?.length > 5) return true;

      return 'Location needs to be at least 5 digits.';
    },
    email(value: string) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

      return 'Must be a valid e-mail.';
    },
    // TODO select coop in case join to existing coop
    // select (value: string) {
    //     if (value) return true

    //     return 'Select an item.'
    //   },
  },
});

const name = useField('name');
const location = useField('location');
const email = useField('email');

const submit = handleSubmit((accountData) => {
  emit('next', accountData as AccountData);
});
</script>

<template>
  <form @submit.prevent="submit" class="px-10 py-4">
    <v-text-field
      v-model="name.value.value"
      :error-messages="name.errorMessage.value"
      label="Name"
      class="mt-1"
      autofocus
    ></v-text-field>

    <v-text-field
      v-model="location.value.value"
      :error-messages="location.errorMessage.value"
      label="Location"
      class="mt-1"
    ></v-text-field>

    <v-text-field
      v-model="email.value.value"
      :error-messages="email.errorMessage.value"
      label="E-mail"
      class="mt-1"
    ></v-text-field>

    <div class="d-flex justify-end ma-3">
      <v-btn class="me-4" type="submit" color="secondary-darken-1">
        to the last step >
      </v-btn>
    </div>
  </form>
</template>
