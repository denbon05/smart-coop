<script setup lang="ts">
import { useField, useForm } from 'vee-validate';

const { handleSubmit } = useForm({
  validationSchema: {
    title(value: string) {
      if (value?.length >= 3) return true;

      return 'Title needs to be at least 3 characters.';
    },
    description(value: string) {
      if (value?.length > 5) return true;

      return 'Description needs to be at least 5 characters.';
    },
    cost(value: number) {
      if (value > 0) return true;

      return 'Insufficient amount.';
    },
  },
});

const title = useField<string>('title');
const description = useField<string>('description');
const cost = useField<number>('cost');

const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <v-row
    ><v-col cols="7">
      <form @submit.prevent="submit">
        <v-text-field
          v-model="title.value.value"
          :error-messages="title.errorMessage.value"
          label="Title of proposal"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        ></v-text-field>

        <v-textarea
          name="description"
          variant="outlined"
          label="Describe your proposal"
          :error-messages="description.errorMessage.value"
          v-model="description.value.value"
          density="comfortable"
          class="mb-3"
        ></v-textarea>

        <v-text-field
          v-model="cost.value.value"
          :error-messages="cost.errorMessage.value"
          label="Cost of proposal"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          :initial-value="0"
        ></v-text-field>
      </form>
    </v-col>

    <v-col cols="4">
      <section class="h-100 d-flex align-end justify-center">
        <v-btn
          size="large"
          rounded="lg"
          @click="submit"
          class="btn-sunset text-white btn-big"
        >
          create proposal
        </v-btn>
      </section>
    </v-col>
  </v-row>
</template>
