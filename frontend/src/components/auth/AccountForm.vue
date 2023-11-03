<script setup lang="ts">
import type { CoopAccount, MemberAccount } from '@/entities/Account';
import { useField, useForm } from 'vee-validate';

const emit = defineEmits<{
  save: [accountData: MemberAccount | CoopAccount];
}>();
const props = defineProps<{
  isCoop?: boolean;
}>();

const { handleSubmit } = useForm<CoopAccount | Omit<MemberAccount, 'coopId'>>({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 3) return true;

      return 'Name needs to be at least 3 characters.';
    },
    location(value: string) {
      if (value?.length > 5) return true;

      return 'Location needs to be at least 5 digits.';
    },
  },
});

const name = useField<string>('name');
const location = useField<string>('location');

const submit = handleSubmit((accountData) => {
  emit('save', accountData);
});
</script>

<template>
  <section class="account-form">
    <h3 class="text-h4 w-100 text-center mb-7">
      <slot name="title"> Creating a COOP </slot>
    </h3>

    <v-sheet elevation="2" rounded="lg" class="pa-4">
      <form @submit.prevent="submit" class="px-10 py-4">
        <div class="d-flex flex-column w-50">
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            :label="`${isCoop ? 'Coop' : 'Your'} name`"
            class="mt-1"
            autofocus
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="location.value.value"
            :error-messages="location.errorMessage.value"
            :label="`${isCoop ? 'Coop' : 'Your'} location`"
            class="mt-1"
            variant="underlined"
          ></v-text-field>
        </div>

        <div class="d-flex justify-end mb-1 mt-5">
          <v-btn
            @click="submit"
            variant="outlined"
            class="me-4 btn-long"
            type="submit"
            color="green"
          >
            <slot name="action-text"> to the last step </slot>
          </v-btn>
        </div>
      </form>
    </v-sheet>
  </section>
</template>
