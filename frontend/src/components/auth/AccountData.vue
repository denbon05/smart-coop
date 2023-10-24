<script setup lang="ts">
import { useAuth } from '@/composables/auth';
import type { CoopAccount, MemberAccount } from '@/entities/Account';
import { useField, useForm } from 'vee-validate';

const emit = defineEmits<{
  next: [accountData: MemberAccount | CoopAccount];
}>();

const props = defineProps<{
  isCoop: boolean;
}>();

const { handleSubmit } = useForm<CoopAccount | MemberAccount>({
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
  emit('next', accountData);
});

const auth = useAuth();
const title = props.isCoop
  ? 'Creating a COOP'
  : `Creating member of COOP "${auth.user.coop.name}"`;
</script>

<template>
  <section id="accountFormContainer">
    <h3 class="text-h4 w-100 text-center mb-7">{{ title }}</h3>

    <v-sheet elevation="2" rounded="lg" class="pa-4">
      <form @submit.prevent="submit" class="px-10 py-4">
        <div class="d-flex flex-column w-50">
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="Name"
            class="mt-1"
            autofocus
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="location.value.value"
            :error-messages="location.errorMessage.value"
            label="Location"
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
            to the last step
          </v-btn>
        </div>
      </form>
    </v-sheet>
  </section>
</template>
